import { useEffect, useState } from "react";
import { getStudentProfile } from "../api/studentApi";
import { FaUser, FaIdCard, FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import StudentQr from "../components/StudentQr";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeQrClassId, setActiveQrClassId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getStudentProfile();
        setStudent(data);
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-white shadow-md rounded-lg">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto my-12 bg-white shadow-xl rounded-3xl border border-gray-200">
      {/* Profile Card */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <FaUser className="h-8 w-8" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{student?.name}</p>
            <p className="text-sm text-gray-500">{student?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center gap-2">
            <FaIdCard className="text-gray-500" />
            <span className="font-semibold">Roll No:</span> {student?.rollNo}
          </div>
          {student?.classes?.length > 0 && (
            <div className="flex items-center gap-2">
              <FaGraduationCap className="text-gray-500" />
              <span className="font-semibold">Classes Enrolled:</span> {student.classes.length}
            </div>
          )}
        </div>
      </div>

      {/* Enrolled Classes */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Enrolled Classes & Attendance</h2>
        {student?.classes?.length > 0 ? (
          <ul className="space-y-4">
            {student.classes.map((cls) => {
              const percentage =
                cls.attendance.totalClasses === 0
                  ? 0
                  : ((cls.attendance.attendedClasses / cls.attendance.totalClasses) * 100).toFixed(2);
              const attendanceColorClass = getAttendanceColor(percentage);

              return (
                <li key={cls._id} className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-lg text-gray-800">
                      <FaChalkboardTeacher className="inline-block mr-2 text-gray-500" />
                      {cls.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition"
                        onClick={() => setActiveQrClassId(activeQrClassId === cls._id ? null : cls._id)}
                      >
                        Show QR
                      </button>
                      <span className={`text-sm font-bold ${attendanceColorClass.replace('bg', 'text')}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Subject: {cls.subject}</p>

                  {activeQrClassId === cls._id && (
                    <StudentQr classId={cls._id} studentId={student._id} />
                  )}

                  {/* Attendance Progress Bar */}
                  <div className="relative pt-1 mt-4">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-600">
                          Attendance
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-gray-600">
                          {cls.attendance.attendedClasses} / {cls.attendance.totalClasses}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${attendanceColorClass}`}
                      ></div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500 italic">You are not enrolled in any classes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
