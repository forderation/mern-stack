const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.JWT_KEY;

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    // required adjustment to ensure that our options request is not blocked.
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer ...'
    if (!token) {
      const error = new HttpError("Authentication failed !", 401);
      throw error;
    }
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(err);
  }
};
