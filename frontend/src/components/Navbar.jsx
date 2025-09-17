import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutTeacher } from "../api/teacherApi";
import { logoutStudent } from "../api/studentApi";
import { FiLogIn } from "react-icons/fi";
import Logo from "../assets/Logo1.png";

const Navbar = ({
  teacherName,
  studentName,
  isAuthenticated,
  isAuthenticatedStudent,
  setIsAuthenticated,
  setIsAuthenticatedStudent,
}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        await logoutTeacher();
        setIsAuthenticated(false);
      }
      if (isAuthenticatedStudent) {
        await logoutStudent();
        setIsAuthenticatedStudent(false);
      }

      setMessage({
        type: "success",
        text: "You have been logged out successfully.",
      });
      setTimeout(() => {
        setMessage(null);
        navigate("/home");
      });
    } catch (err) {
      console.error("Logout failed", err);
      setMessage({ type: "error", text: "Logout failed. Please try again." });
    }
  };

  const goToProfile = () => {
    navigate("/home");
  };

  return (
    <nav className="relative bg-white/90 backdrop-blur-md flex justify-between items-center px-6 py-4 shadow-md border-b border-gray-100 z-50">
      {/* Logo */}
      <div
        onClick={goToProfile}
        className="cursor-pointer transition-all duration-300 transform focus:outline-none"
      >
        <div className="flex items-end gap-1">
          <img src={Logo} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl md:text-3xl font-extrabold tracking-tight">
            Chrono
          </span>
          <span className="text-2xl md:text-3xl font-medium text-gray-700">
            Mark
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 md:gap-4 relative">
        {!isAuthenticated && !isAuthenticatedStudent ? (
          <>
          
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 font-medium transition-all duration-300 hover:bg-indigo-500 hover:text-white shadow-sm"
            >
              Teacher Login
            </button>
            <button
              onClick={() => navigate("/studentLogin")}
              className="hidden sm:block px-4 py-2 rounded-full bg-indigo-500 text-white font-medium shadow-md transition-all duration-300 hover:scale-105"
            >
              Student Login
            </button>

            {/* Mobile dropdown */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 rounded-full bg-indigo-500 text-white shadow-md hover:bg-indigo-600 transition"
              >
                <FiLogIn size={22} />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/login");
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100"
                  >
                    Teacher Login
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/studentLogin");
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100"
                  >
                    Student Login
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {isAuthenticated && (
              <span className="hidden sm:block text-gray-700 font-semibold">
                Welcome, {teacherName}
              </span>
            )}
            {isAuthenticatedStudent && (
              <span className="hidden sm:block text-gray-700 font-semibold">
                Welcome, {studentName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-red-500 text-white font-medium shadow-sm transition-all duration-300 hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Toast */}
      {message && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white font-semibold ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } transition-all duration-300 z-[9999]`}
        >
          {message.text}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
