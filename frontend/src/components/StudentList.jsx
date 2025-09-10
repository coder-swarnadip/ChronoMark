import React, { useEffect, useState } from "react";
import { addStudent } from "../api/classApi";
import { getAllStudents } from "../api/studentApi";

export default function StudentList({ classId, onClose, onStudentAdded }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents();
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleAdd = async (studentId) => {
    try {
      const res = await addStudent(classId, studentId);

      if (onStudentAdded) {
        onStudentAdded(res.data.student); // send new student data
      }

      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  if (loading) return <div className="text-center p-6">Loading students...</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-[420px] max-h-[500px] overflow-y-auto p-6 relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          All Students
        </h2>

        {students.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {students.map((s) => (
              <li
                key={s._id}
                className="py-3 flex justify-between items-center hover:bg-gray-100/60 px-2 rounded-lg transition"
              >
                <span className="font-medium text-gray-800">
                  {s.name} <span className="text-gray-500 text-sm">({s.rollNo})</span>
                </span>
                <button
                  onClick={() => handleAdd(s._id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold hover:opacity-90 transition"
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
