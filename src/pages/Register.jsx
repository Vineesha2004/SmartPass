import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../api/smartpassAPI";
import "../css/Register.css";

const roles = [
  { id: "student", label: "Student 🎓" },
  { id: "admin", label: "Warden 👨‍💼" },
  { id: "security", label: "Security 🛂" },
];

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";

    if (form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the form errors");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: role,
      });

      toast.success("Account created successfully 🎉");

      // ✅ Smooth redirect
      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (error) {
      console.error("REGISTER ERROR:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-card-header">
          <Link to="/" className="register-logo">
            <div className="register-logo-icon">🛂</div>
            <span className="register-logo-text">SmartPass</span>
          </Link>

          <h2>Create your account</h2>
          <p>Select your role and fill details</p>
        </div>

        {/* ROLE SELECTOR */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                border:
                  role === r.id
                    ? "2px solid var(--primary)"
                    : "1px solid var(--border)",
                background: role === r.id ? "#ede9fe" : "#fff",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              name="name"
              className="form-input"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="form-hint">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              name="email"
              className="form-input"
              placeholder="you@college.edu.in"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="form-hint">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="form-hint">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="form-hint">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account →"}
          </button>
        </form>

        <div className="register-login">
          Already have an account? <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;