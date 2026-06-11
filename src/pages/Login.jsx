import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../api/smartpassAPI';
import '../css/Login.css';

const roles = [
  { id: 'student', label: 'Student', icon: '🎓' },
  { id: 'admin', label: 'Warden', icon: '👨‍💼' },
  { id: 'security', label: 'Security', icon: '🛂' },
];

const Login = () => {
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ UPDATED FUNCTION (CONNECTED TO BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser({
        email: form.email,
        password: form.password,
        role: activeRole,
      });

     console.log("LOGIN ROLE:", res.user.role);
     toast.success("Login successful 🎉");

      // ✅ Role-based redirect
      setTimeout(() => {
  if (res.user.role === 'student') {
    navigate('/student-dashboard');
  } else if (res.user.role === 'admin') {
    navigate('/admin-dashboard');
  } else if (res.user.role === 'security') {
    navigate('/security-dashboard');
  }
}, 800);

    } catch (err) {
  toast.error(err.message || "Login failed");
}  finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          <Link to="/" className="login-logo">
            <div className="login-logo-icon">🛂</div>
            <span className="login-logo-text">SmartPass</span>
          </Link>
          <h2>Welcome back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {/* Role Selector */}
        <div className="role-tabs">
          {roles.map((r) => (
            <button
              key={r.id}
              className={`role-tab ${activeRole === r.id ? 'active' : ''}`}
              onClick={() => setActiveRole(r.id)}
              type="button"
            >
              <span className="role-tab-icon">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        <div className="role-badge">
          {roles.find(r => r.id === activeRole)?.icon} Signing in as{" "}
          {roles.find(r => r.id === activeRole)?.label}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-footer">
            <a href="#" className="form-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="login-divider">
          <span>New to SmartPass?</span>
        </div>

        <div className="login-register">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;