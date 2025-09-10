const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  date: { type: String, required: true }, // format: "YYYY-MM-DD"
  status: { type: String, enum: ["Present", "Absent"], required: true }
}, { timestamps: true });

// prevent duplicate records for same student + date + class
attendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
