const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Class", 
    required: true 
  },
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AttendanceSession" // NEW: link to the QR session
  },
  date: { 
    type: String, 
    required: true // format: "YYYY-MM-DD"
  },
  status: { 
    type: String, 
    enum: ["Present", "Absent"], 
    required: true 
  }
}, { timestamps: true });

// ✅ Unique: student can have only one attendance per class + date
attendanceSchema.index(
  { studentId: 1, classId: 1, date: 1 }, 
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
