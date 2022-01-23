const express = require("express");

const router = express.Router();

// Controller
const { register, login } = require("../controllers/auth");
const {
  getUsers,
  editUser,
  deleteUser,
  followers,
  followings,
} = require("../controllers/user");
const {
  addFeed,
  followingFeeds,
  feeds,
  likeFeed,
} = require("../controllers/feed");

// Middleware
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Route
router.post("/register", register);
router.post("/login", login);
router.get("/users", auth, getUsers);
router.patch("/user/:id", auth, uploadFile("image"), editUser);
router.delete("/user/:id", deleteUser);
router.get("/followers/:id", followers);
router.get("/followings/:id", followings);
router.post("/feed", auth, uploadFile("fileName"), addFeed);
router.get("/feed/:id", auth, followingFeeds);
router.get("/feeds", auth, uploadFile("fileName"), feeds);
router.post("/like", auth, likeFeed);

module.exports = router;
