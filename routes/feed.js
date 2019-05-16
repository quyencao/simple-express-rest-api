const express = require("express");
const { body } = require("express-validator/check");

const feedController = require("../controllers/feed");

const router = express.Router();

router
  .route("/posts")
  .get(feedController.getPosts)
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

module.exports = router;
