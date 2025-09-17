const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Attendance = require("./models/Attendance");
const { getDateKey } = require("./utils/dateHelper");
const cookieParser = require("cookie-parser");
const errorHandler = require("./errorHandelar.js");


// routes imports
const teacherRoutes = require("./routes/teacher.js");
const studentRoutes = require("./routes/student.js");
const classRoutes = require("./routes/class.js");
const attendanceRoutes = require("./routes/attendance");
const attendanceSessionRoutes = require("./routes/attendanceSession");



require("dotenv").config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // my frontend origin
    credentials: true, //  allow cookies & credentials
  })
);












// app.get("/test-attendance", async (req, res) => {
//   try {
//     const record = await Attendance.create({
//       studentId: "64xxxxxx", // replace with actual student _id
//       classId: "64yyyyyy",   // replace with actual class _id
//       date: getDateKey(),
//       status: "Present"
//     });

//     res.json(record);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });




//routes
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance", attendanceSessionRoutes);

// app.get("/health", (req, res) => {
//   res.json({ status: "ok", message: "Backend running fine" });
// });




//connect mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));
const PORT = 5000;



app.use((req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
