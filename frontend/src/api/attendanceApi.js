import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/attendance", 
  withCredentials: true, // for sending cookies
});

//  Teacher marks attendance for a class
export const markAttendance = (data) => API.post("/mark", data);

export const markAttendanceAuto = (data) => API.post("/auto", data);

//  Teacher views attendance for a class on a specific date
export const getAttendanceByClassAndDate = (classId, date) =>
  API.get(`/class/${classId}/${date}`);

//  Student views their own attendance history
export const getStudentAttendance = (studentId) => API.get(`/student/${studentId}`);


