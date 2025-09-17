const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher.js");
const generateToken = require("../utils/generateToken");

// ✅ Register Teacher



exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if teacher already exists
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
    });

    await teacher.save();

    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error); // ✅ backend logs full error
    // send only message to frontend
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//for Login Teacher

exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create JWT valid for 7 days
    const token = jwt.sign(
      { id: teacher._id, email: teacher.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

    // Set cookie
  res.cookie("jwt", token, {
  httpOnly: true,
  secure: true, // must be HTTPS in production
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    // send teacher data (without password)
    res.json({
      message: "Login successful",
      token,
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Teacher Profile
exports.getTeacherProfile = async (req, res) => {
  try {
    // req.teacher is set by authTeacher middleware
    const teacher = await Teacher.findById(req.teacher.id).select("-password");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



exports.logoutTeacher = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), //  cookie expires 
  });
  res.json({ message: "Logged out successfully" });
};

