const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },     // e.g. "ECE 3rd Year"
  subject: { type: String, required: true },   // e.g. "Physics"
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);
