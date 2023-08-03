const Post = require("../mongo-models/post");
const Bookmark = require("../mongo-models/bookmark");

class PostController {
  static async allPost(req, res, next) {
    try {
      const { id: UserId } = req.user;
      const posts = await Post.findAll(UserId);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req, res, next) {
    try {
      const { UserId } = req.user.id;

      const { title, description, bookmarkId } = req.body;
      if (!title) {
        throw {name: "CustomError", status: 400, message: "Post Title is required"}
      }
      if (!description) {
        throw {name: "CustomError", status: 400, message: "Post description is required"}
      }
      if (!bookmarkId) {
        throw {name: "CustomError", status: 400, message: "BookmarkId is required"}
      }
      const bookmark = await Bookmark.findByPk(bookmarkId);
      if (!bookmark) throw { name: "CustomError", status: 404, message: "Bookmark not found" };

      const post = await Post.create({
        title,
        description,
        BookmarkId: bookmarkId,
        UserId,
      });

      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req, res, next) {
    try {
      const { postId } = req.params;
      const post = await Post.findByPk(postId);
      if (!post) throw { name: "NotFound" };

      await Post.destroy(postId);
      res.status(200).json({ message: "Success delete post" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PostController;
