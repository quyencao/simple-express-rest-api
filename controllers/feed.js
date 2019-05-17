const { validationResult } = require("express-validator/check");
const fs = require("fs");
const path = require("path");
const ObjectId = require("mongoose").Types.ObjectId;
const Post = require("../models/Post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then(posts => {
      res.status(200).json({ posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  if (!ObjectId.isValid(postId)) {
    const err = new Error("Could not found post");
    err.statusCode = 404;
    throw err;
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Could not found post");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ post });
    })
    .catch(err => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      console.log("here");
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fail");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No file pick");
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  const imageUrl = req.file.path;

  const post = new Post({
    title,
    content,
    imageUrl,
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

exports.editPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fail");
    error.statusCode = 422;
    throw error;
  }
  const postId = req.params.postId;
  if (!ObjectId.isValid(postId)) {
    const err = new Error("Could not found post");
    err.statusCode = 404;
    throw err;
  }
  const { title, content } = req.body;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const err = new Error("No file pick");
    err.statusCode = 422;
    throw err;
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const err = new Error("Post not found");
        err.statusCode = 404;
        throw err;
      }

      if (imageUrl !== post.imageUrl) {
        fs.unlink(path.join(__dirname, "..", post.imageUrl), err =>
          console.log(err)
        );
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      return post.save();
    })
    .then(post => {
      res.status(200).json({ post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.satusCode = 500;
      }
      next(err);
    });
};
