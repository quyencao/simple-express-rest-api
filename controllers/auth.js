const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  return bcrypt
    .hash(password, 12)
    .then(hashPassword => {
      const newUser = new User({
        email,
        name,
        password: hashPassword
      });

      return newUser.save();
    })
    .then(user => {
      res.status(201).json({ userId: user.id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  let fetchUser;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        const err = new Error("Email is not exist");
        err.statusCode = 404;
        throw err;
      }
      fetchUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isMatch => {
      if (!isMatch) {
        const err = new Error("Password is incorrect");
        err.statusCode = 400;
        throw err;
      }
      const payload = {
        userId: fetchUser.id,
        email: fetchUser.email
      };
      return jwt.sign(payload, config.get("JWT_SECRET"), { expiresIn: "1h" });
    })
    .then(token => {
      res.status(200).json({ token });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
