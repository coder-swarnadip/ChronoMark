const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerStudent = async (req, res) => {
  try {
    const { name, rollNo, email, password } = req.body;

    // ✅ check required fields
    if (!name || !rollNo || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if student already exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: "Student already exists" });
    }

    let existingRoll = await Student.findOne({ rollNo });
if (existingRoll) {
  return res.status(400).json({ message: "Roll number already exists" });
}


    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = new Student({
      name,
      rollNo,
      email,
      password: hashedPassword,
    });
    await student.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error); // ✅ backend logs full error
    // send only message to frontend
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
 // create JWT valid for 7 days
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // ✅ 7 days
    );

    // store in httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure:true, 
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days in ms
    });
    

    res.status(200).json({ message: "Login successful", token,
      _id: student._id,
      name: student.name,
      email: student.email,
     });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




exports.getStudentProfile = async (req, res) => {
  try {
    // ✅ Use the student from middleware and populate classes
    const student = await req.student.populate("classes", "name subject");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Fetch all attendance records for this student
    const attendanceRecords = await Attendance.find({ studentId: student._id });

    // Build map: classId -> { totalClasses, attendedClasses }
    const attendanceMap = {};
    student.classes.forEach(cls => {
      attendanceMap[cls._id] = { totalClasses: 0, attendedClasses: 0 };
    });

    attendanceRecords.forEach(rec => {
      if (attendanceMap[rec.classId]) {
        attendanceMap[rec.classId].totalClasses += 1;
        if (rec.status === "Present") {
          attendanceMap[rec.classId].attendedClasses += 1;
        }
      }
    });

    // Attach attendance info to classes
    const classesWithAttendance = student.classes.map(cls => ({
      _id: cls._id,
      name: cls.name,
      subject: cls.subject,
      attendance: attendanceMap[cls._id] || { totalClasses: 0, attendedClasses: 0 },
    }));

    // ✅ Send profile response
    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      classes: classesWithAttendance,
    });

  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};






// ✅ Logout Student


exports.logoutStudent = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};



exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await Student.find({ classes: classId });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
