import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";
import courseRouter from "./api/routes/course.router";
import enrollmentRouter from "./api/routes/enrollment.router";
import sessionRouter from "./api/routes/session.router";
import userRouter from "./api/routes/user.router";
import authRouter from "./api/routes/auth.router";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    error: false,
    statusCode: 200,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use("/api/auth", authRouter);

// Resources routes
app.use("/api/courses", courseRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);

// 404 handler for undefined routes
app.use((_req, res) => {
  res.status(404).json({
    error: true,
    statusCode: 404,
    message: "Endpoint not found",
  });
});

// Centralized error handling
app.use(errorMiddleware);

export default app;