import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Layout = ({
  teacherName,
  studentName,
  isAuthenticated,
  isAuthenticatedStudent,
  setIsAuthenticated,
  setIsAuthenticatedStudent,
}) => {
  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden">
      {/* Navbar */}
       <Navbar
        teacherName={teacherName}
        studentName={studentName}
        isAuthenticated={isAuthenticated}
        isAuthenticatedStudent={isAuthenticatedStudent}
        setIsAuthenticated={setIsAuthenticated}
        setIsAuthenticatedStudent={setIsAuthenticatedStudent}
      />

      {/* background layer */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-green-400 -z-10"></div>

      {/* Main content */}
      <main className="flex-grow w-full px-3 sm:px-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
