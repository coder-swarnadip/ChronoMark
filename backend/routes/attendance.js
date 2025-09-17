const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendanceByClassAndDate,
  getStudentAttendance,
  markAttendanceAuto
} = require("../controllers/attendanceController");

const authTeacher = require("../middleware/teacherAuth");
const authStudent = require("../middleware/studentAuth");

// Teacher marks attendance for a class
router.post("/mark", authTeacher, markAttendance);

router.post("/auto", authTeacher, markAttendanceAuto);

// Teacher views attendance of a class on a specific date
router.get("/class/:classId/:date", authTeacher, getAttendanceByClassAndDate);

// Student views their own attendance history
router.get("/student/:studentId", authStudent, getStudentAttendance);

module.exports = router;