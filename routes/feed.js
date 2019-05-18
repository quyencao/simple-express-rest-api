const express = require("express");
const path = require("path");
const { body } = require("express-validator/check");

const auth = require("../middleware/auth");
const feedController = require("../controllers/feed");

const router = express.Router();

router
  .route("/posts")
  .get(auth, feedController.getPosts)
  .post(
    [
      body("title", "title is invalid")
        .trim()
        .isLength({ min: 5 }),
      body("content", "content is invalid")
        .trim()
        .isLength({ min: 5 })
    ],
    feedController.createPost
  );

router
  .route("/posts/:postId")
  .get(feedController.getPost)
  .put(
    [
      body("title")
        .trim()
        .isLength({ min: 5 }),
      body("content")
        .trim()
        .isLength({ min: 5 })
    ],
    feedController.editPost
  )
  .delete(feedController.deletePost);

module.exports = router;
