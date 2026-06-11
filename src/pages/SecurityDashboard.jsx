import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  verifyPass,
  logMovement,
  getCurrentlyOut,
  getApprovedPasses
} from '../api/smartpassAPI';
import '../css/SecurityDashboard.css';

const navItems = [
  { icon: '📊', label: 'Dashboard', active: true },
  { icon: '🔍', label: 'Verify Pass', active: false },
  { icon: '📋', label: 'Movement Log', active: false },
  { icon: '⚙️', label: 'Settings', active: false },
];

const SecurityDashboard = () => {
  const [outPassId, setOutPassId] = useState('');
  const [inPassId, setInPassId] = useState('');
  const [outResult, setOutResult] = useState(null);
  const [inResult, setInResult] = useState(null);
  const [approvedPasses, setApprovedPasses] = useState([]);

  const [stats, setStats] = useState({
    totalChecked: 0,
    currentlyOut: 0,
    todayEvents: 0,
  });

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const statRes = await getCurrentlyOut();
      const approvedRes = await getApprovedPasses();

      setApprovedPasses(approvedRes.passes || []);

      // ✅ FIXED REAL STATS
      const currentlyOut = statRes.count || 0;
      const total = approvedRes.passes?.length || 0;

      setStats({
        totalChecked: total,
        currentlyOut: currentlyOut,
        todayEvents: currentlyOut, // simple for now
      });

    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🚶 MARK OUT
  const handleMarkOut = async () => {
    if (!outPassId) {
      toast.error("Enter Pass ID");
      return;
    }

    try {
      const verify = await verifyPass(outPassId);

      await logMovement(outPassId, 'out');

      toast.success(`${verify.pass.student?.name} marked OUT 🚶`);

      setOutResult({ type: 'found', ...verify.pass });
      fetchData();
      setOutPassId('');

      setTimeout(() => setOutResult(null), 3000);

    } catch (err) {
      toast.error(err.message || "Invalid Pass");
      setOutResult({ type: 'not-found', msg: err.message });
    }
  };

  // 🏠 MARK IN
  const handleMarkIn = async () => {
    if (!inPassId) {
      toast.error("Enter Pass ID");
      return;
    }

    try {
      const verify = await verifyPass(inPassId);

      await logMovement(inPassId, 'in');

      toast.success(`${verify.pass.student?.name} marked IN 🏠`);

      setInResult({ type: 'found', ...verify.pass });
      fetchData();
      setInPassId('');

      setTimeout(() => setInResult(null), 3000);

    } catch (err) {
      toast.error(err.message || "Invalid Pass");
      setInResult({ type: 'not-found', msg: err.message });
    }
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
          <div className="sidebar-avatar">S</div>
          <div>
            <div className="sidebar-user-name">Security</div>
            <div className="sidebar-user-role">Gate</div>
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

        {/* TOP */}
        <div className="topbar">
          <div className="topbar-left">
            <h1>Security Desk</h1>
            <p>Verify student passes</p>
          </div>
          <div className="topbar-badge">
            <span className="live-dot" /> Live
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">🎫</div>
            <div className="stat-value">{stats.totalChecked}</div>
            <div className="stat-label">Approved Passes</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">🚶</div>
            <div className="stat-value">{stats.currentlyOut}</div>
            <div className="stat-label">Currently Outside</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">📅</div>
            <div className="stat-value">{stats.todayEvents}</div>
            <div className="stat-label">Today's Activity</div>
          </div>
        </div>

        {/* ACTION CARDS */}
        <div className="verify-section">

          {/* OUT */}
          <div className="verify-card">
            <div className="verify-card-icon out">🚶‍♂️</div>
            <h3>Mark OUT</h3>

            <div className="pass-input-wrap">
              <input
                className="pass-input"
                value={outPassId}
                onChange={e => setOutPassId(e.target.value)}
                placeholder="Enter Pass ID"
              />
            </div>

            <button className="btn-out" onClick={handleMarkOut}>
              🚶 Mark OUT
            </button>
          </div>

          {/* IN */}
          <div className="verify-card">
            <div className="verify-card-icon in">🏠</div>
            <h3>Mark IN</h3>

            <div className="pass-input-wrap">
              <input
                className="pass-input"
                value={inPassId}
                onChange={e => setInPassId(e.target.value)}
                placeholder="Enter Pass ID"
              />
            </div>

            <button className="btn-in" onClick={handleMarkIn}>
              🏠 Mark IN
            </button>
          </div>

        </div>

        {/* APPROVED PASSES */}
        <div className="log-section">
          <div className="log-header">
            <h2>Approved Passes</h2>
          </div>

          <table className="log-table">
            <thead>
              <tr>
                <th>Pass ID</th>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {approvedPasses.length === 0 ? (
                <tr>
                  <td colSpan="3">No approved passes</td>
                </tr>
              ) : (
                approvedPasses.map((p) => (
                  <tr
                    key={p._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOutPassId(p.passId)}
                  >
                    <td>{p.passId}</td>
                    <td>{p.student?.name}</td>
                    <td>
                      <span className={`event-badge ${p.isCurrentlyOut ? 'out' : 'in'}`}>
                        {p.isCurrentlyOut ? 'OUT' : 'IN'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default SecurityDashboard;