import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/attendance/session",
  withCredentials: true, // send cookies if needed
});

// ✅ Teacher: Start a session
export const startSession = (classId) => API.post(`/start/${classId}`);

// ✅ Teacher: Close a session
export const closeSession = (sessionId) => API.post(`/close/${sessionId}`);

// ✅ Teacher / Student: Get active session for a class
export const getActiveSession = (classId) => API.get(`/active/${classId}`);

// ✅ Student: Get data for QR code
export const getQRSession = (classId, studentId) => API.get(`/qr/${classId}/${studentId}`);
