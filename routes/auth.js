const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/User");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(email => {
        return User.findOne({ email }).then(user => {
          if (user) {
            return Promise.reject("Email is adready exist.");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("Password must have between 6 and 25 chars")
  ],
  authController.signUp
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("Password must have between 6 and 25 chars")
  ],
  authController.login
);

module.exports = router;
