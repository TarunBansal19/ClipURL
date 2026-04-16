import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }
    try {
      const { data } = await api.post("/api/auth/login", form);
      login(data.token, data.user);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="mb-5 text-2xl font-bold">Login</h1>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border p-3 dark:bg-slate-800"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border p-3 dark:bg-slate-800"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="mt-4 w-full rounded bg-indigo-600 py-2 text-white">Login</button>
        <p className="mt-4 text-sm">
          No account? <Link to="/register" className="text-indigo-600">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
