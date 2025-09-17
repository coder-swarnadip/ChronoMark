const mongoose = require("mongoose");

const AttendanceSessionSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    status: { type: String, enum: ["OPEN", "CLOSED"], required: true, default: "OPEN" },
    startedAt: { type: Date, required: true, default: Date.now },
    closedAt: { type: Date }
});

module.exports = mongoose.model("AttendanceSession", AttendanceSessionSchema);
