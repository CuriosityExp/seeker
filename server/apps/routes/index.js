const express = require("express");
const BookmarkController = require("../controllers/bookmark");
const JobController = require("../controllers/job");
const router = express.Router()


router.post("/fetchjobs",JobController.fetchJobs)
router.get("/bookmarks", BookmarkController.readBookmark)
router.post("/bookmarks", BookmarkController.createBookmark)
//perlu authorization cek controller
router.delete("/bookmarks", BookmarkController.deleteBookmark)
router.put("/bookmarks", BookmarkController.updateBookmark)


module.exports = router