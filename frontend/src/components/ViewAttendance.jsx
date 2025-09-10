import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAttendanceByClassAndDate } from "../api/attendanceApi";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function ViewAttendance() {
  
   
  const { state } = useLocation();
  const { selectedClass } = state;

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // today
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedClass) return;
      setLoading(true);
      try {
        const res = await getAttendanceByClassAndDate(selectedClass._id, date);
        setAttendanceRecords(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedClass, date]);
 const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200">

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition"
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-semibold">Back</span>
          </button>
          {/* Header */}
          <h1 className="text-2xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Attendance – {selectedClass?.name}
          </h1>
          <div></div> 
        </div>



        {/* Date Picker */}
        <div className="flex justify-center mb-6">
          <label className="mr-3 font-semibold text-gray-700">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-600">Loading attendance...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : attendanceRecords.length === 0 ? (
          <p className="text-center text-gray-600">No attendance records found for this date.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden shadow-md">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-center">Roll No</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((rec, index) => (
                  <tr
                    key={rec._id}
                    className={`transition hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                  >
                    <td className="px-4 py-3 border-b">{rec.studentId?.name}</td>
                    <td className="px-4 py-3 border-b text-center">
                      {rec.studentId?.rollNo}
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${rec.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
