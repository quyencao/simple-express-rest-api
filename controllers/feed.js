const { validationResult } = require("express-validator/check");
const Post = require("../models/Post");

exports.getPosts = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then(posts => {
      res.status(200).json({ posts });
    })
    .catch(err => console.log(err));
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fail");
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imageUrl: "images/duck.jpg",
    creator: {
      name: "Quyen"
    }
  });

  return post
    .save()
    .then(post => {
      return res.status(201).json({ post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
