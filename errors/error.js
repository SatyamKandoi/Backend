const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Oops an Error Occured";

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
