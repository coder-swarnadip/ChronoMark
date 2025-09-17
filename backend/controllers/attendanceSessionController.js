const AttendanceSession = require("../models/AttendanceSession");

// 1️⃣ Start Session (Teacher)
exports.startSession = async (req, res) => {
  try {
    const { classId } = req.params;

    // check if there’s already an OPEN session
    const activeSession = await AttendanceSession.findOne({ classId, status: "OPEN" });
    if (activeSession) {
      return res.status(400).json({ message: "An active session already exists" });
    }

    const session = await AttendanceSession.create({
      classId,
      status: "OPEN",
      startedAt: new Date(),
    });

    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 2️⃣ Close Session (Teacher)
exports.closeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await AttendanceSession.findByIdAndUpdate(
      sessionId,
      { status: "CLOSED", closedAt: new Date() },
      { new: true }
    );

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.json({ message: "Session closed", session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 3️⃣ Get Active Session for Class
exports.getActiveSession = async (req, res) => {
  try {
    const { classId } = req.params;

    const session = await AttendanceSession.findOne({ classId, status: "OPEN" });

    if (!session) return res.status(404).json({ message: "No active session" });

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};




// Student requests QR for active session
exports.getSessionForQR = async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    // check if there is an active session
    const session = await AttendanceSession.findOne({ classId, status: "OPEN" });
    if (!session) return res.status(404).json({ message: "No active session" });

    // return the data needed for QR
    res.json({
      studentId,
      classId,
      sessionId: session._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
