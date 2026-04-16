// global error handler
// any error passed via next(err) will come here
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  // if status code already set, use it, else default to 500
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
  });
};

module.exports = errorHandler;
