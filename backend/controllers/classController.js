const Class = require("../models/Class");
const Student = require("../models/Student");

// ✅ Create a new class (teacher only)
exports.createClass = async (req, res) => {
  try {
    const { name, subject} = req.body;
    const newClass = new Class({
      name,
      subject,
      teacher: req.teacher._id,
    });
    await newClass.save();
    res.status(201).json({ message: "Class created successfully", newClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Edit a class (teacher only)
exports.editClass = async (req, res) => {
  try {
    const { id } = req.params; // class ID from URL
    const { name, subject } = req.body;

    const classData = await Class.findOne({ _id: id, teacher: req.teacher._id });
    if (!classData) return res.status(404).json({ message: "Class not found or not yours" });

    classData.name = name;
    classData.subject = subject;
    await classData.save();

    res.json({ message: "Class updated successfully", class: classData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete a class (teacher only) and remove from students
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params; // class ID from URL

    const classData = await Class.findOne({ _id: id, teacher: req.teacher._id });
    if (!classData) return res.status(404).json({ message: "Class not found or not yours" });

    // 1️⃣ Remove the class reference from all students
    await Student.updateMany(
      { classes: id },
      { $pull: { classes: id } }
    );

    // 2️⃣ Delete the class itself
    await Class.deleteOne({ _id: id });

    res.json({ message: "Class deleted successfully, removed from students" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Get all classes created by logged-in teacher
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.teacher._id });
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classId = req.params.id;
    const classData = await Class.findById(classId);

    if (!classData) return res.status(404).json({ message: "Class not found" });

    res.json(classData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// ✅ Add a student to a class
exports.addStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params; // make sure your route matches

    // check if teacher owns this class
    const classData = await Class.findOne({ _id: classId, teacher: req.teacher._id });
    if (!classData) return res.status(404).json({ message: "Class not found or not yours" });

    // check student exists
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // update student's classes array
    if (!student.classes.includes(classId)) {
      student.classes.push(classId);
      await student.save();
    }
    // return student object so frontend can update immediately
    res.json({ message: "Student added to class successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Remove a student from a class
exports.removeStudentFromClass = async (req, res) => {
  try {
    const { classId ,studentId } = req.params; // class ID from URL

    const classData = await Class.findOne({ _id: classId, teacher: req.teacher._id });
    if (!classData) return res.status(404).json({ message: "Class not found or not yours" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.classes = student.classes.filter((cId) => cId.toString() !== classId);
    await student.save();

    res.json({ message: "Student removed from class successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
