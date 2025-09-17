const express = require("express");
const router = express.Router();
const {
  startSession,
  closeSession,
  getActiveSession,
  getSessionForQR
} = require("../controllers/attendanceSessionController");

// Teacher starts session
router.post("/session/start/:classId", startSession);

// Teacher closes session
router.post("/session/close/:sessionId", closeSession);

// Check active session
router.get("/session/active/:classId", getActiveSession);

// Student generates QR
router.get("/session/qr/:classId/:studentId", getSessionForQR);

module.exports = router;
