import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "./components/AuthLayout";
import FormField from "./components/FormField";
import StatusBanner from "./components/StatusBanner";
import api from "./lib/api";

function Signup({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ tone: "", message: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setStatus({
        tone: "error",
        message: "Complete your name, email, and password before creating the account."
      });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ tone: "", message: "" });

      await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role.toLowerCase()
      });

      setStatus({
        tone: "success",
        message: "Account created successfully. Redirecting you to sign in."
      });

      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (error) {
      setStatus({
        tone: "error",
        message:
          error.response?.data?.debug ||
          error.response?.data?.message ||
          "Unable to create the account right now."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      eyebrow="Create account"
      title="Set up your PollWise workspace"
      description="Create an admin or student account and get into polls and surveys without the older disconnected signup flow."
      asideTitle="Create, collect, and understand feedback faster"
      asideCopy="The updated experience keeps signup consistent with the rest of the product so first-time users are not dropped into a completely different interface."
    >
      <div className="space-y-5">
        <StatusBanner tone={status.tone} message={status.message} />

        <FormField
          label="Full name"
          name="name"
          type="text"
          placeholder="Aayush Sharma"
          value={form.name}
          onChange={handleChange}
        />

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
          placeholder="Create a secure password"
          value={form.password}
          onChange={handleChange}
        />

        <FormField
          as="select"
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </FormField>

        <button
          type="button"
          onClick={handleSignup}
          disabled={submitting}
          className="primary-button w-full disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-brand-600 dark:text-brand-300">
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Signup;
