const express = require("express");
const authStudent = require("../middleware/studentAuth");
const authTeacher = require("../middleware/teacherAuth");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  logoutStudent,
  getAllStudents
  , getStudentsByClass
} = require("../controllers/studentController");

//for register a student
router.post("/register", registerStudent);
//for login a student
router.post("/login", loginStudent);
//for get student profile
router.get("/profile", authStudent, getStudentProfile);
//for logout a student
router.post("/logout", authStudent, logoutStudent);
//for get all students
router.get("/", getAllStudents);
//for get students by class
router.get("/by-class/:classId", authTeacher, getStudentsByClass);

module.exports = router;
