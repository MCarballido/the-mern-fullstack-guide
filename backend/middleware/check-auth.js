const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>

    if (!token) throw new Error();

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };

    next();
  } catch (err) {
    return next(new HttpError("Authentication failed.", 403));
  }
};
