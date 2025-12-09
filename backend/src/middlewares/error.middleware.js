// src/middlewares/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
};
