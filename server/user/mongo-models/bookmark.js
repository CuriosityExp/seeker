const { getDb } = require("../config/mongo");
const { ObjectId } = require("mongodb");

class Bookmark {
  static bookmarkCollection() {
    return getDb().collection("bookmarks");
  }

  static async findAll(UserId) {
    const bookmarkCollection = this.bookmarkCollection();
    return await bookmarkCollection
      .aggregate([
        {
          $match: {
            UserId,
          },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "jobId",
            foreignField: "_id",
            as: "Job",
          },
        },
      ])
      .toArray();
  }

  static async findByPk(bookmarkId) {
    const bookmarkCollection = this.bookmarkCollection();
    return await bookmarkCollection.aggregate([
      {
        $match: {
          _id: new ObjectId(bookmarkId),
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "Job",
        },
      },
    ]);
  }

  static async create({ UserId, jobId, customTitle }) {
    try {
      const bookmarkCollection = this.bookmarkCollection();
      const newBookmark = await bookmarkCollection.insertOne({
        UserId,
        jobId,
        customTitle,
        isPost: false,
      });
      return bookmarkCollection.findOne({
        _id: new ObjectId(newBookmark.insertedId),
      });
    } catch (error) {
      throw error;
    }
  }

  static async update({ bookmarkId, customTitle }) {
    try {
      const bookmarkCollection = this.bookmarkCollection();
      const newBookmark = await bookmarkCollection.updateOne(
        {
          _id: new ObjectId(bookmarkId),
        },
        {
          $set: { customTitle },
        }
      );
      return bookmarkCollection.findOne({
        _id: new ObjectId(newBookmark.insertedId),
      });
    } catch (error) {
      throw error;
    }
  }

  static async destroy(bookmarkId) {
    try {
      const bookmarkCollection = this.bookmarkCollection();
      return await bookmarkCollection.deleteOne({
        _id: new ObjectId(bookmarkId),
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Bookmark;
