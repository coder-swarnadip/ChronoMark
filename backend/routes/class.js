const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { 
  createClass, 
  getMyClasses, 
  addStudentToClass,
  removeStudentFromClass, 
  editClass, 
  deleteClass, 
  getClassById,
  getClassforStudents
} = require("../controllers/classController.js");
const authTeacher = require("../middleware/teacherAuth.js");
const authStudent = require("../middleware/studentAuth.js");


//Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const paramIds = req.params ? Object.values(req.params) : [];
  const bodyIds = req.body ? Object.values(req.body) : [];
  const ids = paramIds.concat(bodyIds);

  for (let id of ids) {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
  }
  next();
};




// for Only logged-in teacher can create a class
router.post("/", authTeacher, createClass);

//for Teacher can see all their own classes
router.get("/my-classes", authTeacher, getMyClasses);

router.get("/:id", authTeacher, getClassById);




//for Teacher can edit a class
router.put("/:id", authTeacher,  editClass);



//for Teacher can delete a class
router.delete("/:id", authTeacher, validateObjectId, deleteClass);

//for Add a student to a class
router.patch("/:classId/students/:studentId/add", authTeacher, validateObjectId, addStudentToClass);

//for Remove a student from a class
router.patch("/:classId/students/:studentId/remove", authTeacher, validateObjectId, removeStudentFromClass);

router.get("/student/:id", authStudent, getClassforStudents);

module.exports = router;
