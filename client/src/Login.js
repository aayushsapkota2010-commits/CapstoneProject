import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "./lib/api";
import AuthLayout from "./components/AuthLayout";
import FormField from "./components/FormField";
import StatusBanner from "./components/StatusBanner";

function Login({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const [status, setStatus] = useState({ tone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setStatus({
        tone: "error",
        message: "Enter both email and password"
      });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ tone: "", message: "" });

      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      // ✅ save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setStatus({
        tone: "success",
        message: res.data.message
      });

      // ✅ redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (err) {
      console.log(err);

    console.log("FULL ERROR:", err.response?.data);

setStatus({
  tone: "error",
  message:
    err.response?.data?.debug || 
    err.response?.data?.message || 
    "Login failed"
});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      eyebrow="Welcome back"
      title="Sign in to your polling workspace"
      description="Access analytics, polls, and admin tools in one place."
      asideTitle="Smarter polling starts here"
      asideCopy="Track votes, analyze results, and manage roles with clarity and speed."
    >
      <div className="space-y-5">

        <StatusBanner tone={status.tone} message={status.message} />

        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="you@campus.edu"
          value={form.email}
          onChange={handleChange}
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          disabled={submitting}
          className="primary-button w-full disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Need an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600"
          >
            Create one here
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}

export default Login;