const { getDb } = require("../config/config");
const { ObjectId } = require("mongodb");

class Bookmark {
  static bookmarkCollection() {
    return getDb().collection("bookmarks");
  }

  static async findAll(userId) {
    const bookmarkCollection = this.bookmarkCollection();
    return await bookmarkCollection.find({
        userId: new ObjectId(userId)
    }).toArray();
  }

  static async findByPk(bookmarkId) {
    const bookmarkCollection = this.bookmarkCollection();
    return await bookmarkCollection.findOne({
      _id: new ObjectId(bookmarkId),
    });
  }

  static async create({ userId, jobId, customTitle }) {
    try {
      const bookmarkCollection = this.bookmarkCollection();
      const newBookmark = await bookmarkCollection.insertOne({
        userId,
        jobId,
        customTitle,
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

  static async destroy(bookmarkId){
    try {
      const bookmarkCollection = this.bookmarkCollection();
      return await bookmarkCollection.deleteOne({
        _id: new ObjectId(bookmarkId),
      });
    } catch (error) {
        throw error
    }
  }
}

module.exports = Bookmark;
