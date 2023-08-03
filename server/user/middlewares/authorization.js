const Bookmark = require("../mongo-models/bookmark")
const {Profile} = require("")
const authorizationBookmark = async (req, res, next) => {
  try {
    const bookmark = Bookmark.findByPk(req.body.bookmarkId)
    if (!bookmark) {
        throw {name: "CustomError", status: 404, message: "Bookmark not found"}
    }
    req.bookmark = bookmark
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
    const { id: UserId } = req.user
    const { id } = req.params
    const profile = await Profile
    
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authorizationBookmark;
