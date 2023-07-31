const express = require("express");
const BookmarkController = require("../controllers/bookmark");
const router = express.Router()

router.get("/bookmarks", BookmarkController.readBookmark)
router.post("/bookmarks", BookmarkController.createBookmark)
//perlu authorization cek controller
router.delete("/bookmarks", BookmarkController.deleteBookmark)
router.update("/bookmarks", BookmarkController.updateBookmark)


module.exports = router