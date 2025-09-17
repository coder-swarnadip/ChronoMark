import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/students",
  withCredentials: true, // 👈 send cookies
});

// API calls
export const getStudentProfile = () => API.get("/profile");
export const loginStudent = (formData) => API.post("/login", formData);
export const registerStudent = (formData) => API.post("/register", formData);
export const logoutStudent  = () => API.post("/logout");
export const getAllStudents = () => API.get("/");
export const getStudentsByClass = (classId) => API.get(`/by-class/${classId}`);