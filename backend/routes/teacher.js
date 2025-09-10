const express = require("express");
const router = express.Router();
const { loginTeacher,registerTeacher,getTeacherProfile,logoutTeacher } = require("../controllers/teacherController.js");
const authTeacher = require("../middleware/teacherAuth.js");


//for register a teacher
router.post("/register", registerTeacher);
//for login a teacher
router.post("/login", loginTeacher);
//for get teacher profile
router.get("/profile", authTeacher, getTeacherProfile);
//for logout a teacher
router.post("/logout", authTeacher, logoutTeacher);


module.exports = router;
