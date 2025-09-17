// src/pages/AutoAttendanceScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStudentsByClass } from "../api/studentApi";
import { markAttendanceAuto } from "../api/attendanceApi";
import { startSession, closeSession, getActiveSession } from "../api/attendanceSessionApi";
import { FaArrowLeft, FaCamera, FaUsers, FaStop, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import jsQR from "jsqr";



export default function AutoAttendanceScanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedClass } = location.state;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [students, setStudents] = useState([]);
  const [markedStudents, setMarkedStudents] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Initialize session
  useEffect(() => {
    if (!selectedClass) return navigate("/");

    const initSession = async () => {
      try {
        let session;
        try {
          const res = await getActiveSession(selectedClass._id);
          session = res.data;
        } catch {
          const res = await startSession(selectedClass._id);
          session = res.data;
        }
        setActiveSession(session);
      } catch (err) {
        console.error("Failed to initialize session:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [selectedClass, navigate]);

  // Fetch student list
  useEffect(() => {
    if (!selectedClass) return;

    const fetchStudents = async () => {
      try {
        const res = await getStudentsByClass(selectedClass._id);
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // Camera + QR scan
  useEffect(() => {
    if (!activeSession) return;
    let animationFrame;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          scan();
        };

        const scan = () => {
          if (!videoRef.current) return;

          if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
              try {
                const qrData = JSON.parse(code.data); // { studentId, classId, sessionId }
                if (
                  qrData.classId === selectedClass._id &&
                  qrData.sessionId === activeSession._id &&
                  !markedStudents.has(qrData.studentId)
                ) {
                  // Auto mark attendance
                  markAttendanceAuto({
                    classId: qrData.classId,
                    records: [{ studentId: qrData.studentId, status: "Present", sessionId: activeSession._id }],
                  }).catch(err => console.error("Auto mark failed:", err));

                  setMarkedStudents(prev => new Set(prev).add(qrData.studentId));
                }
              } catch (err) {
                console.warn("Invalid QR data", err);
              }
            }
          }
          animationFrame = requestAnimationFrame(scan);
        };
      } catch (err) {
        console.error("Camera permission error:", err);
        alert("Cannot access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      cancelAnimationFrame(animationFrame);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeSession, markedStudents, selectedClass]);

  const handleCloseSession = async () => {
    if (!activeSession) return;
    try {
      await closeSession(activeSession._id);
      navigate(-1);
     setMessage({ type: "success", text: "session closed successfully" });
      
    } catch (err) {
      console.error(err);
      setMessage({type:"error", text:"failed to close the session"});
    }
  };

  const handleSaveAttendance = async () => {
  if (!activeSession) return;

  const records = students.map((s) => ({
    studentId: s._id,
    status: markedStudents.has(s._id) ? "Present" : "Absent",
  }));

  try {
    setSaving(true);
    await markAttendanceAuto({
      classId: selectedClass._id,
      sessionId: activeSession._id,
      records,
    });
    await closeSession(activeSession._id);
    setMessage({ type: "success", text: "session closed successfully" });
    setMessage({ type: "success", text: "Attendance saved successfully!" });
    setTimeout(() => navigate(`/class/${selectedClass._id}`), 500);
  } catch (err) {
    console.error("Error saving attendance:", err);
    setMessage({ type: "error", text: "Failed to save attendance." });
  } finally {
    setSaving(false);
  }
};

  if (loading) return <p className="p-6 text-center text-gray-600">Loading...</p>;

  return (
    <div className="flex flex-col items-center p-6">
      {/* Header */}
      <div className="flex justify-between w-full max-w-3xl mb-6">
       
        <h1 className="text-2xl font-bold text-gray-800">Auto Attendance – {selectedClass.name}</h1>
        <button
          onClick={handleCloseSession}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <FaStop /> Close Session
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 mb-6 rounded-lg font-semibold ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
          {message.text}
        </div>
      )}

      {/* Camera Preview */}
      <div className="mb-6 w-full max-w-2xl relative">
        <h2 className="flex items-center gap-2 font-semibold mb-2">
          <FaCamera /> Scan Student QR
        </h2>
        <video ref={videoRef} style={{ width: "100%", borderRadius: "12px" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {/* Student List */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow-md">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <FaUsers /> Students Present ({markedStudents.size})
        </h2>
        <ul className="divide-y divide-gray-200">
          {students.map(s => (
            <li
              key={s._id}
              className={`py-2 px-2 rounded-lg ${markedStudents.has(s._id) ? "bg-green-100" : "bg-red-100"}`}
            >
              {s.name} ({s.rollNo}) – {markedStudents.has(s._id) ? "Present" : "Absent"}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="mt-4 w-full py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
}