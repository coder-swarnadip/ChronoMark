import React, { useEffect, useState } from "react";
import { getMyClasses, createClass, deleteClass } from "../api/classApi.js";
import ClassCard from "../components/ClassCard.jsx";
import EditClass from "../components/EditClass.jsx";
import { getTeacherProfile } from "../api/teacherApi.js";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUserCircle, FaTimes, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import ConfirmDelete from "../components/ConfirmDelete.jsx";

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: "", subject: "" });
  const navigate = useNavigate();



  const fetchClasses = async () => {
    try {
      const res = await getMyClasses();
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err.response?.data || err.message);
    }
  };

  const fetchTeacher = async () => {
    try {
      const res = await getTeacherProfile();
      setTeacher(res.data);
    } catch (err) {
      console.error("Failed to fetch teacher:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchClasses(), fetchTeacher()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createClass(formData);
      setFormData({ name: "", subject: "" });
      setShowCreateModal(false);
      fetchClasses();
    } catch (err) {
      console.error("Failed to create class:", err.response?.data || err.message);
    }
  };

  const handleDelete = (cls) => {
    setClassToDelete(cls);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteClass(classToDelete._id);
      fetchClasses();
      setShowDeleteModal(false);
      setClassToDelete(null);
    } catch (err) {
      console.error("Failed to delete class:", err.response?.data || err.message);
    }
  };

  const handleEdit = (classData) => {
    setEditingClass(classData);
  };

  const handleView = (cls) => {
    navigate(`/class/${cls._id}`, { state: { selectedClass: cls } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <p className="ml-4 text-xl font-semibold text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-300">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="p-3 bg-white rounded-full shadow-lg text-indigo-600">
              <FaUserCircle className="w-10 h-10" />
            </div>
            <div className="ml-4">
              <h1 className="text-4xl font-extrabold text-gray-800">
                Hello, {teacher?.name}
              </h1>
              {teacher?.subject && (
                <p className="text-gray-600 text-lg">
                  Subject: <span className="font-semibold">{teacher.subject}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <FaPlus className="inline mr-2" />
            Create New Class
          </button>
        </div>

        {/* Classes Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Classes</h2>
          {classes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-500 italic text-lg">No classes created yet. Click "Create New Class" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <ClassCard
                  key={cls._id}
                  classData={cls}
                  onEdit={() => handleEdit(cls)}
                  onDelete={() => handleDelete(cls)}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create a New Class</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Class Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g., Grade 10-A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="e.g., Mathematics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Create Class
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {showDeleteModal && (
        <ConfirmDelete
          message={`Are you sure you want to delete the class "${classToDelete?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Edit Class Modal */}
      {editingClass && (
        <EditClass
          classData={editingClass}
          onClose={() => setEditingClass(null)}
          onUpdated={fetchClasses}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
