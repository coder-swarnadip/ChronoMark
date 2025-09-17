const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const errorHandler = require("./errorHandelar.js");

// Routes
const teacherRoutes = require("./routes/teacher.js");
const studentRoutes = require("./routes/student.js");
const classRoutes = require("./routes/class.js");
const attendanceRoutes = require("./routes/attendance");
const attendanceSessionRoutes = require("./routes/attendanceSession");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// CORS config
app.use(
  cors({
    origin: "https://chronomark-frontend.netlify.app", // frontend URL
    credentials: true,
  })
);

// API Routes
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance", attendanceSessionRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend running fine" });
});

// 404 handler
app.use((req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// Global error handler
app.use(errorHandler);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
