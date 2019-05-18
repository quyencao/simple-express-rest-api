const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");
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

exports.login = (req, res, next) => {};
