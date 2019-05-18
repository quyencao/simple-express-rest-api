const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    const err = new Error("Unauthorize");
    err.statusCode = 401;
    throw err;
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    const err = new Error("Unauthorize");
    err.statusCode = 401;
    throw err;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("JWT_SECRET"));
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decoded) {
    const err = new Error("Unauthorize");
    err.statusCode = 401;
    throw err;
  }

  req.userId = decoded.userId;
  next();
};
