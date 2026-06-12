import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getMyPasses,
  applyForPass,
  logoutUser
} from '../api/smartpassAPI';
import '../css/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [passes, setPasses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    reason: '',
    date: '',
    returnDate: '',
    notes: ''
  });

  const user = JSON.parse(localStorage.getItem("smartpass_user"));

  const fetchPasses = async () => {
    try {
      const data = await getMyPasses();
      setPasses(data.passes || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load passes");
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  // ✅ UPDATED FUNCTION (NO ALERTS)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await applyForPass(form);

      // ✅ Toast instead of alert
      toast.success("Pass applied successfully 🎉");

      // smooth modal close
      setTimeout(() => {
        setShowModal(false);
      }, 500);

      // reset form
      setForm({
        reason: '',
        date: '',
        returnDate: '',
        notes: ''
      });

      // refresh passes
      fetchPasses();

    } catch (err) {
      toast.error(err.message || "Failed to apply pass");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const filtered =
    filter === 'all'
      ? passes
      : passes.filter(p => p.status === filter);

  const stats = {
    total: passes.length,
    approved: passes.filter(p => p.status === 'approved').length,
    pending: passes.filter(p => p.status === 'pending').length,
    rejected: passes.filter(p => p.status === 'rejected').length,
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">🛂</div>
          <span className="sidebar-logo-text">SmartPass</span>
        </Link>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <h1>Hello, {user?.name} 👋</h1>
            <p>Your gate pass activity</p>
          </div>
          <div className="topbar-badge">🎓 Student Portal</div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">🎫</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">⏳</div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">❌</div>
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        {/* APPLY BANNER */}
        <div className="apply-banner">
          <div>
            <h3>Apply for Gate Pass</h3>
            <p>Submit your request and wait for approval</p>
          </div>
          <button className="btn-apply" onClick={() => setShowModal(true)}>
            + Apply
          </button>
        </div>

        {/* FILTER */}
        <div className="section-header">
          <h2>My Passes</h2>
          <div className="filter-tabs">
            {['all', 'approved', 'pending', 'rejected'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="passes-table-wrap">
          <table className="passes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td className="pass-id">{p.passId}</td>
                  <td>{p.reason}</td>
                  <td>
                    <span className={`status-badge ${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>

      {/* MODAL */}  
      {showModal && (
        <div className="modal-overlay">
  <div className="modal">

    {/* ✅ CLOSE BUTTON */}
    <button
      className="modal-close"
      onClick={() => setShowModal(false)}
    >
      ✕
    </button>

    <h3>Apply for Pass</h3>

    <form onSubmit={handleSubmit}>
      <input
        className="form-input"
        placeholder="Reason"
        value={form.reason}
        onChange={e => setForm({ ...form, reason: e.target.value })}
        required
      />

      <input
        className="form-input"
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
        required
      />

      <input
        className="form-input"
        type="date"
        value={form.returnDate}
        onChange={e => setForm({ ...form, returnDate: e.target.value })}
        required
      />

      <textarea
        className="form-textarea"
        placeholder="Notes"
        value={form.notes}
        onChange={e => setForm({ ...form, notes: e.target.value })}
      />

      <button className="btn-modal-primary" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>

  </div>
</div>
      )}

    </div>
  );
};

export default StudentDashboard;