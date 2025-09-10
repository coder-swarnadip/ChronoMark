import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StudentList from "../components/StudentList";
import { getStudentsByClass } from "../api/studentApi";
import { removeStudent, getClassById } from "../api/classApi";
import { FaPlus, FaCheck, FaChartBar, FaArrowLeft } from "react-icons/fa";

export default function ClassPage() {
    const { id } = useParams();
    const location = useLocation();
    const [showStudentList, setShowStudentList] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState(location.state?.selectedClass || null);
    const navigate = useNavigate();

    const handleAddStudent = () => {
        if (!selectedClass) return alert("No class available!");
        setShowStudentList(true);
    };

    const handleTakeAttendance = () => {
        if (!selectedClass) return alert("No class selected!");
        navigate("/attendance", { state: { selectedClass } });
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await getStudentsByClass(selectedClass._id);
                setStudents(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (selectedClass) fetchStudents();
    }, [selectedClass]);

    useEffect(() => {
        if (!selectedClass && id) {
            const fetchClass = async () => {
                try {
                    const res = await getClassById(id);
                    setSelectedClass(res.data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchClass();
        }
    }, [id, selectedClass]);

    if (!selectedClass) return <p className="text-center mt-10">Loading class info...</p>;

    return (
        <div className="flex justify-center p-4 sm:p-6">
            <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">

                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-indigo-600 transition"
                    >
                        <FaArrowLeft className="mr-2" />
                        <span className="font-semibold">Back</span>
                    </button>
                    {/* Class Title */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 text-center">
                        {selectedClass.name}
                    </h1>
                    <div></div> 
                </div>



                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-6">
                    <button
                        onClick={handleAddStudent}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg shadow transition flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <FaPlus />
                        Add Student
                    </button>
                    <button
                        onClick={handleTakeAttendance}
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg shadow transition flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <FaCheck />
                        Take Attendance
                    </button>
                    <button
                        onClick={() => {
                            if (!selectedClass) return alert("No class selected!");
                            navigate("/view-attendance", { state: { selectedClass } });
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-lg shadow transition flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <FaChartBar />
                        View Attendance
                    </button>
                </div>

                {/* Students List */}
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-700">Students</h2>
                {students.length === 0 ? (
                    <p className="text-gray-600 text-center">No students enrolled yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow overflow-hidden">
                        {students.map((s) => (
                            <li
                                key={s._id}
                                className="py-3 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition"
                            >
                                <span className="font-medium text-gray-800 mb-2 sm:mb-0">
                                    {s.name} <span className="text-gray-500">({s.rollNo})</span>
                                </span>
                                <button
                                    onClick={async () => {
                                        const confirmDelete = window.confirm(
                                            `Are you sure you want to remove ${s.name}?`
                                        );
                                        if (!confirmDelete) return;

                                        try {
                                            await removeStudent(selectedClass._id, s._id);
                                            setStudents((prev) => prev.filter((stu) => stu._id !== s._id));
                                        } catch (err) {
                                            console.error(err);
                                            alert("Failed to remove student");
                                        }
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition w-full sm:w-auto"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Modal */}
                {showStudentList && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm px-3">
                        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xl w-full relative">
                            <button
                                onClick={() => setShowStudentList(false)}
                                className="absolute top-3 right-3 text-red-500 font-bold text-lg"
                            >
                                ✖
                            </button>
                            <StudentList
                                classId={selectedClass._id}
                                onClose={() => setShowStudentList(false)}
                                onStudentAdded={(newStudent) => {
                                    setStudents((prev) => {
                                        if (prev.some((s) => s._id === newStudent._id)) return prev;
                                        return [...prev, newStudent];
                                    });
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
