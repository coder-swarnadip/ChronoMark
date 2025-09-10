  import { FaPlus, FaUserCircle, FaTimes, FaExclamationCircle, FaSpinner } from "react-icons/fa";

  
  const ConfirmDelete = ({ message, onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
        <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
          <div className="flex justify-between items-start mb-4">
            <FaExclamationCircle className="text-red-500 w-10 h-10 mr-4" />
            <h3 className="text-xl font-bold text-gray-800 flex-grow">Confirm Action</h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 text-center mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };


  export default ConfirmDelete;