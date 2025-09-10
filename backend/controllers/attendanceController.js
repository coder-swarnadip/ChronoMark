const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const { getDateKey } = require("../utils/dateHelper");


// 1. Mark / Update Attendance (Teacher)
exports.markAttendance = async (req, res) => {
  try {
    const { classId, records } = req.body; // records = [{ studentId, status }]
    const date = getDateKey(); // Today in IST

    const results = [];
    for (const rec of records) {
      const updated = await Attendance.findOneAndUpdate(
        { studentId: rec.studentId, classId, date },
        { status: rec.status },
        { upsert: true, new: true }
      );
      results.push(updated);
    }

    res.json({ message: "Attendance marked", data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 2. Get Attendance by Class & Date (Teacher)

exports.getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.params; // date = "YYYY-MM-DD"
    const attendance = await Attendance.find({ classId, date })
      .populate("studentId", "name rollNo"); // show student details

    res.json(attendance);
  } catch (err) {
    console.error("Get Class Attendance Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 3. Get Student Attendance History (Student)
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({ studentId })
      .populate("classId", "name subject"); // show class details

    res.json(records);
  } catch (err) {
    console.error("Get Student Attendance Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
