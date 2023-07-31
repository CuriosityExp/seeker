const Bookmark = require("../models/bookmark");
const Job = require("../models/job");

class BookmarkController {
  static async createBookmark(req, res, next) {
    try {
      const { UserId } = req.body;
      const {
        url,
        logo,
        jobTitle,
        companyName,
        companyLocation,
        salary,
        workExperience,
      } = req.body
      const jobDetail = await Job.create({
        url,
        logo,
        jobTitle,
        companyName,
        companyLocation,
        salary,
        workExperience,
      });
      const jobId = jobDetail._id
      if (!UserId) {
        throw { name: "CustomError", status: 400, message: "UserId required" };
      }
      if (!jobId) {
        throw { name: "CustomError", status: 400, message: "JobId required" };
      }
      const job = await Job.findByPk(jobId);
      if (!job) {
        throw { name: "CustomError", status: 404, message: "Job not found" };
      }
      const bookmark = await Bookmark.create({
        UserId,
        jobId,
        customTitle: job.jobTitle,
      });
      res.status(201).json(bookmark);
    } catch (error) {
      next(error);
    }
  }

  static async updateBookmark(req, res, next) {
    try {
      const { bookmarkId, customTitle } = req.body;
      if (!bookmarkId) {
        throw {
          name: "CustomError",
          status: 400,
          message: "BookmarkId required",
        };
      }
      if (!customTitle) {
        throw {
          name: "CustomError",
          status: 400,
          message: "Custom Bookmark Title required",
        };
      }
      const bookmark = Bookmark.findByPk(bookmarkId);
      if (!bookmark) {
        throw {
          name: "CustomError",
          status: 404,
          message: "Bookmark not found",
        };
      }
      const newBookmark = Bookmark.update({ bookmarkId, customTitle });
      if (!newBookmark) {
        throw {
          name: "CustomError",
          status: 405,
          message: "Failed update Bookmark Title",
        };
      }
      res.status(200).json({ message: "Success update bookmark title" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBookmark(req, res, next) {
    try {
      const { bookmarkId } = req.body;
      if (!bookmarkId) {
        throw {
          name: "CustomError",
          status: 400,
          message: "Bookmark Id is required",
        };
      }
      const bookmark = await Bookmark.findByPk(bookmarkId);
      if (!bookmark) {
        throw {
          name: "CustomError",
          status: 404,
          message: "Bookmark not found",
        };
      }
      await Bookmark.destroy(bookmarkId);
      res.status(200).json({ message: "Success delete bookmark" });
    } catch (error) {
      next(error);
    }
  }

  static async readBookmark(req, res, next) {
    try {
      // nanti ganti pakai ini setelah ada auth
      // const {UserId} = req.user
      const { UserId } = req.body;
      const bookmarks = await Bookmark.findAll(UserId);
      res.status(200).json(bookmarks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookmarkController;
