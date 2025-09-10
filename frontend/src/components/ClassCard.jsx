import React from "react";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const ClassCard = ({ classData, onEdit, onDelete, onView }) => {
  return (
    <div
      className="flex flex-col justify-between p-4 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
    >
      {/* Card Content */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 capitalize">
          {classData.name}
        </h3>
        <p className="text-gray-500 text-sm">
          {classData.subject}
        </p>
      </div>

      {/* Card Actions */}
      <div className="flex justify-end gap-2 border-t pt-4 border-gray-100">
        <button
          onClick={() => onView(classData)}
          className="p-3 bg-indigo-600 text-white rounded-full font-semibold shadow-sm hover:bg-indigo-700 transition"
          aria-label="View Class"
        >
          <FaEye />
        </button>
        <button
          onClick={() => onEdit(classData)}
          className="p-3 bg-white text-gray-700 rounded-full font-semibold border border-gray-300 shadow-sm hover:bg-gray-100 transition"
          aria-label="Edit Class"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(classData._id)}
          className="p-3 bg-red-500 text-white rounded-full font-semibold shadow-sm hover:bg-red-600 transition"
          aria-label="Delete Class"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
