import { useState } from "react";
import api from "../api/api.js";
import { useNavigate, Link } from "react-router-dom";

export default function TeacherRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/teachers/register", form, { withCredentials: true });
      alert("Registration successful!");
      navigate("/login"); 
    } catch (err) {
      console.error(err.response?.data);
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-sm mx-auto mt-12 border">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Teacher Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-200 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-200 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-200 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Register
        </button>
      </form>

      {/* Already have account link */}
      <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>


        <p className="text-sm text-center text-gray-600 mt-4"><Link to="/home" className="hover:underline">Go back to Home</Link></p>

    </div>

  );
}
