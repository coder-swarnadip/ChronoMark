const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }] 
}, { timestamps: true });



module.exports = mongoose.model("Student", studentSchema);
