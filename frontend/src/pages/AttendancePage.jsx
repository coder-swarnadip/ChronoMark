import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStudentsByClass } from "../api/studentApi";
import { markAttendance } from "../api/attendanceApi";
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";

export default function AttendancePage() {
  const location = useLocation();
  const { selectedClass } = location.state;

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudentsByClass(selectedClass._id);
        setStudents(res.data);
        
        // default: everyone absent
        const initialAttendance = {};
        res.data.forEach((s) => {
          initialAttendance[s._id] = "Absent";
        });
        setAttendance(initialAttendance);
      } catch (err) {
        console.troll("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedClass) fetchStudents();
  }, [selectedClass]);

  // Handle a click on a student row to toggle attendance
  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSaveAttendance = async () => {
    const records = students.map((s) => ({
      studentId: s._id,
      status: attendance[s._id],
    }));

    try {
      setSaving(true);
      await markAttendance({ classId: selectedClass._id, records });
      setMessage({ type: "success", text: "Attendance saved successfully!" });
      // Redirect after a short delay to allow the user to see the message
      setTimeout(() => navigate(`/class/${selectedClass._id}`), 500);
    } catch (err) {
      console.error("Error saving attendance:", err);
      setMessage({ type: "error", text: "Failed to save attendance." });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading students...</p>;

  return (
    <div className="flex items-start justify-center h-screen p-6 mt-5font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        
        {/* Header and Back Button */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition"
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Attendance – {selectedClass.name}
          </h1>
          <div></div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`flex items-center gap-2 p-4 mb-6 rounded-lg font-semibold ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            {message.text}
          </div>
        )}

        {/* Student list */}
        <ul className="divide-y divide-gray-200">
          {students.map((s) => (
            <li
              key={s._id}
              className="py-3 px-2 rounded-lg transition cursor-pointer hover:bg-gray-50"
              onClick={() => toggleAttendance(s._id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  {s.name}{" "}
                  <span className="text-gray-500 text-sm">({s.rollNo})</span>
                </span>
                <span
                  className={`text-sm font-bold w-20 text-center rounded-full py-1 transition-all ${
                    attendance[s._id] === "Present"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {attendance[s._id]}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Save button */}
        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="mt-6 w-full py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Saving...
            </>
          ) : (
            "Save Attendance"
          )}
        </button>
      </div>
    </div>
  );
}
