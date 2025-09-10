const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
// Middleware to authenticate student using JWT
const authStudent = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt; 

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.id).select("-password");
    if (!student) {
      return res.status(401).json({ message: "Student not found" });
    }

    req.student = student;
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authStudent;
