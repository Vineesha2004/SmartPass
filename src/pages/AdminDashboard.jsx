import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllPasses, approvePass, rejectPass } from '../api/smartpassAPI';
import '../css/AdminDashboard.css';

const navItems = [
  { icon: '📊', label: 'Dashboard', active: true },
  { icon: '📋', label: 'All Requests', active: false },
  { icon: '👥', label: 'Students', active: false },
  { icon: '📈', label: 'Reports', active: false },
  { icon: '⚙️', label: 'Settings', active: false },
];

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ FETCH
  const fetchPasses = async () => {
    try {
      const res = await getAllPasses();
      setRequests(res.passes || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch passes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  // ✅ APPROVE
  const handleApprove = async (id) => {
    try {
      await approvePass(id);

      toast.success("Pass approved ✅");

      fetchPasses();
    } catch (err) {
      toast.error(err.message || "Approve failed");
    }
  };

  // ✅ REJECT
  const handleReject = async (id) => {
    try {
      await rejectPass(id);

      toast.success("Pass rejected ❌");

      fetchPasses();
    } catch (err) {
      toast.error(err.message || "Reject failed");
    }
  };

  const filtered = requests.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchSearch =
      r.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reason?.toLowerCase().includes(search.toLowerCase()) ||
      r.passId?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
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
          <div className="sidebar-avatar">W</div>
          <div>
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-role">Warden</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              toast.success("Logged out");
              window.location.href = '/login';
            }}
          >
            <span className="nav-item-icon">🚪</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">
        <div className="topbar">
          <div className="topbar-left">
            <h1>Admin Dashboard</h1>
            <p>Review and manage all student gate pass requests</p>
          </div>
          <div className="topbar-badge">👨‍💼 Warden Portal</div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">📋</div>
            <div className="stat-value">{counts.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">⏳</div>
            <div className="stat-value">{counts.pending}</div>
            <div className="stat-label">Awaiting Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-value">{counts.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">❌</div>
            <div className="stat-value">{counts.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="requests-toolbar">
          <div className="search-box">
            <span>🔍</span>
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
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

        {/* REQUESTS */}
        <div className="requests-list">
          {loading ? (
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
            <p>No requests found</p>
          ) : (
            filtered.map(req => (
              <div className="request-card" key={req._id}>
                <div className="request-avatar">
                  {req.student?.name?.charAt(0)}
                </div>

                <div className="request-info">
                  <div className="request-name">{req.student?.name}</div>

                  <div className="request-meta">
                    <span>📅 {new Date(req.date).toLocaleDateString()}</span>
                    <span>↩️ {new Date(req.returnDate).toLocaleDateString()}</span>
                    <span>{req.passId}</span>
                  </div>

                  <div className="request-reason">{req.reason}</div>
                </div>

                <div className="request-status">
                  <span className={`status-badge ${req.status}`}>
                    {req.status}
                  </span>
                </div>

                {req.status === 'pending' && (
                  <div className="request-actions">
                    <button onClick={() => handleApprove(req._id)}>✓</button>
                    <button onClick={() => handleReject(req._id)}>✕</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;