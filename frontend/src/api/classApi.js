import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/classes",
  withCredentials: true, 
});

// API calls for classes
export const getMyClasses = () => API.get("/my-classes");
export const createClass = (data) => API.post("/", data);
export const editClass = (id, data) => API.put(`/${id}`, data);
export const deleteClass = (id) => API.delete(`/${id}`);



// Student management in a class
export const addStudent = (classId, studentId) =>
  API.patch(`/${classId}/students/${studentId}/add`);

export const removeStudent = (classId, studentId) =>
  API.patch(`/${classId}/students/${studentId}/remove`);

export const getClassById = (classId) => API.get(`/${classId}`);