const { getDb } = require("../config/mongo");
const { ObjectId } = require("mongodb");

class Post {
  static postCollection() {
    return getDb().collection("posts");
  }

  static async findAll(UserId) {
    const postCollection = this.postCollection();
    return await postCollection
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

  static async findByPk(postId) {
    const postCollection = this.postCollection();
    return await postCollection.aggregate([
      {
        $match: {
          _id: new ObjectId(postId),
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
    ]).toArray();
  }

  static async create({ title, description, BookmarkId, UserId }) {
    try {
      const postCollection = this.postCollection();
      const newPost = await postCollection.insertOne({
        title,
        description,
        BookmarkId,
        UserId,
      });
      return postCollection.findOne({
        _id: new ObjectId(newPost.insertedId),
      });
    } catch (error) {
      throw error;
    }
  }

  static async destroy(postId) {
    try {
      const postCollection = this.postCollection();
      return await postCollection.deleteOne({
        _id: new ObjectId(postId),
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;
