const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTER STUDENT
 */
exports.registerStudent = async (req, res) => {
  try {
    const { name, rollNo, email, password } = req.body;
    if (!name || !rollNo || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email or rollNo exists
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });

    const existingRoll = await Student.findOne({ rollNo });
    if (existingRoll) return res.status(400).json({ message: "Roll number already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({ name, rollNo, email, password: hashedPassword });
    await student.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * LOGIN STUDENT
 */
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProd = process.env.NODE_ENV === "production";

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: isProd, // HTTPS only in prod
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      _id: student._id,
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET STUDENT PROFILE
 */
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id)
      .select("-password")
      .populate("classes", "name subject");

    if (!student) return res.status(404).json({ message: "Student not found" });

    const attendanceRecords = await Attendance.find({ studentId: student._id });

    const attendanceMap = {};
    student.classes.forEach(cls => {
      attendanceMap[cls._id] = { totalClasses: 0, attendedClasses: 0 };
    });

    attendanceRecords.forEach(rec => {
      if (attendanceMap[rec.classId]) {
        attendanceMap[rec.classId].totalClasses += 1;
        if (rec.status === "Present") attendanceMap[rec.classId].attendedClasses += 1;
      }
    });

    const classesWithAttendance = student.classes.map(cls => ({
      _id: cls._id,
      name: cls.name,
      subject: cls.subject,
      attendance: attendanceMap[cls._id] || { totalClasses: 0, attendedClasses: 0 },
    }));

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      classes: classesWithAttendance,
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * LOGOUT STUDENT
 */
exports.logoutStudent = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};

/**
 * GET ALL STUDENTS
 */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error("Get all students error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET STUDENTS BY CLASS
 */
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await Student.find({ classes: classId });
    res.json(students);
  } catch (err) {
    console.error("Get students by class error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
