import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ isAuthenticated, isAuthenticatedStudent }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-0">
      <div className="w-full max-w-2xl text-center bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-300">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex items-end gap-1">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-5xl md:text-6xl font-extrabold tracking-tight">
              Chrono
            </span>
            <span className="text-5xl md:text-6xl font-medium text-gray-800">
              Mark
            </span>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 max-w-md mx-auto mt-4">
            Welcome to ChronoMark, your all-in-one platform for seamless
            attendance tracking and student management.
          </p>

          <div className="w-full h-px bg-gray-300 my-4"></div>

          <h2 className="text-2xl font-semibold text-gray-700">Get Started</h2>

          {isAuthenticated || isAuthenticatedStudent ? (
            isAuthenticated ? (
              <button
                onClick={() => navigate("/profile")}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/studentProfile")}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
              >
                Go to Student Dashboard
              </button>
            )
          ) : (
            <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
              <button
                onClick={() => navigate("/studentLogin")}
                className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
              >
                Log in as Student
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-full md:w-auto px-8 py-4 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:bg-pink-700 transition duration-300 transform hover:scale-105"
              >
                Log in as Teacher
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
