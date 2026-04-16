import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || form.password.length < 6) {
      toast.error("Use valid email and min 6-char password");
      return;
    }
    try {
      const { data } = await api.post("/api/auth/register", form);
      login(data.token, data.user);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="mb-5 text-2xl font-bold">Register</h1>
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
        <button className="mt-4 w-full rounded bg-indigo-600 py-2 text-white">Register</button>
        <p className="mt-4 text-sm">
          Have an account? <Link to="/login" className="text-indigo-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
