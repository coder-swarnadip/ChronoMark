import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/teachers",
  withCredentials: true, // 👈 send cookies
});

// API calls
export const getTeacherProfile = () => API.get("/profile");
export const loginTeacher = (formData) => API.post("/login", formData);
export const registerTeacher = (formData) => API.post("/register", formData);
export const logoutTeacher = () => API.post("/logout");
