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
const isProd = process.env.NODE_ENV === "production";

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// ✅ CORS setup for cross-origin cookies
const allowedOrigins = ["https://chronomark-frontend.netlify.app"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // allow cookies
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
