import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("API Error:", err.message || err);

  if (err.name === "CastError") {
    res.status(400).json({
      error: true,
      statusCode: 400,
      message: `Invalid ID format: ${err.value}`,
    });
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    res.status(409).json({
      error: true,
      statusCode: 409,
      message: `A record with this ${field} already exists.`,
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    statusCode,
    message: err.message || "Server Error",
  });
};

export default errorMiddleware;