import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api.js";

export default function TeacherLogin({ setIsAuthenticated, setTeacherName }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.post("/teachers/login", form, { withCredentials: true });

      setSuccess("Login successful! Redirecting...");
      setIsAuthenticated(true);
      setTeacherName(data.name);

      navigate("/profile");
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-sm mx-auto mt-12 border">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Teacher Login
      </h2>

      {error && <p className="mb-4 text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-600 bg-green-50 p-2 rounded">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-200 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-indigo-200 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Don’t have an account?{" "}
        <Link to="/Register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>

        <p className="text-sm text-center text-gray-600 mt-4"><Link to="/home" className="hover:underline">Go back to Home</Link></p>

    </div>
  );
}
