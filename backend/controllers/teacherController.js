const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher.js");

// ✅ Register Teacher
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: "Teacher already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const teacher = new Teacher({ name, email, password: hashedPassword });
    await teacher.save();

    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login Teacher
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT valid for 7 days
    const token = jwt.sign(
      { id: teacher._id, email: teacher.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Handle secure cookies for prod vs local
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: isProd,             // only HTTPS in production
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Teacher Profile
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout Teacher
exports.logoutTeacher = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};
