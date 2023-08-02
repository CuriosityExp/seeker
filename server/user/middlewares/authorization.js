const Bookmark = require("../mongo-models/bookmark")

const authorizationBookmark = async (req, res, next) => {
  try {
    const bookmark = Bookmark.findByPk(req.body.bookmarkId)
    if(bookmark.UserId !== req.user.id){
        throw {name: "CustomError", status: 403, message: "You are not allowed"}
    }
    next();
  } catch (err) {
    next(err);
  }
};

const authorizationProfile = async (req, res, next) => {
  try {
    const bookmark = Bookmark.findByPk(req.body.bookmarkId);
    if (bookmark.UserId !== req.user.id) {
      throw {
        name: "CustomError",
        status: 403,
        message: "You are not allowed",
      };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authorizationBookmark;
