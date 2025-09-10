module.exports = (err, req, res, next) => {
  console.error(err.stack); 

  const statusCode = err.statusCode || 500; // default to 500 if not set
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    // optional: only in dev mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
