const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");


// Middleware to authenticate teacher using JWT
const authTeacher = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt; 

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const teacher = await Teacher.findById(decoded.id).select("-password");
    if (!teacher) {
      return res.status(401).json({ message: "Teacher not found" });
    }

    req.teacher = teacher;
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authTeacher;
