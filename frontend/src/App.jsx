import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeacherRegister from './pages/TeacherRegister.jsx';
import TeacherLogin from './pages/TeacherLogin.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import Home from "./pages/Home.jsx";
import { useEffect, useState } from "react";
import { getTeacherProfile } from "./api/teacherApi";
import { getStudentProfile } from "./api/studentApi.js";
import Layout from "./context/Layout.jsx";
import StudentRegister from "./pages/StudentRegister.jsx";
import StudentLogin from "./pages/StudentLogin.jsx";
import StudentProfile from "./pages/StudentDashboard.jsx";
import Class from "./pages/Class.jsx";
import Attendance from "./pages/AttendancePage.jsx";
import ViewAttendance from "./components/ViewAttendance.jsx";
import AttendanceScanner from "./pages/AttendanceScanner.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAuthenticatedStudent, setIsAuthenticatedStudent] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getTeacherProfile();
        setIsAuthenticated(true);
        setTeacherName(data.name);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getStudentProfile();
        setIsAuthenticatedStudent(true);
        setStudentName(data.name);
      } catch {
        setIsAuthenticatedStudent(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <BrowserRouter>

      <Routes>
        <Route
          element={
            <Layout
              teacherName={teacherName}
              studentName={studentName}
              isAuthenticated={isAuthenticated}
              isAuthenticatedStudent={isAuthenticatedStudent}
              setIsAuthenticated={setIsAuthenticated}
              setIsAuthenticatedStudent={setIsAuthenticatedStudent}
            />
          }
        >

          <Route path="/" element={<Home isAuthenticated={isAuthenticated}
            isAuthenticatedStudent={isAuthenticatedStudent} />} />
          <Route path="/register" element={<TeacherRegister />} />
          <Route
            path="/login"
            element={
              <TeacherLogin
                setIsAuthenticated={setIsAuthenticated}
                setTeacherName={setTeacherName}
              />
            }
          />
          <Route path="/profile" element={<TeacherDashboard />} />
          <Route path="/studentRegister" element={<StudentRegister />} />
          <Route
            path="/studentLogin"
            element={
              <StudentLogin
                setIsAuthenticatedStudent={setIsAuthenticatedStudent}
                setStudentName={setStudentName}
              />
            }
          />
          <Route path="/StudentProfile" element={<StudentProfile />} />
          <Route path="/class/:id" element={<Class />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/auto-attendance" element={<AttendanceScanner />} />
          <Route path="/view-attendance" element={<ViewAttendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
