import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Landing.css';

const Landing = () => {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">🛂</div>
          SmartPass
        </a>
        <ul className="nav-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#features">Features</a></li>
        </ul>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-outline">Log In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Gate Pass Management — Reimagined
        </div>
        <h1>
          Smarter Gate Passes for <span>Modern Campuses</span>
        </h1>
        <p>
          SmartPass streamlines hostel gate pass requests — from student applications
          to admin approvals and real-time security verification, all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">Apply for a Pass →</Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          Scroll to explore
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="text-center">
          <div className="section-label">⚡ Workflow</div>
          <h2 className="section-title">How SmartPass Works</h2>
          <p className="section-sub">
            A simple, transparent three-step process designed to save time for everyone.
          </p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Student Applies</h3>
            <p>Students submit a gate pass request with reason, date, and expected return time — all in under a minute.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Admin Reviews</h3>
            <p>The warden receives the request instantly and can approve or reject it with a single click from the dashboard.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Security Verifies</h3>
            <p>At the gate, security scans the Pass ID to log entry/exit and track student movement in real time.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="text-center">
          <div className="section-label">✦ Features</div>
          <h2 className="section-title">Built for Every Role</h2>
          <p className="section-sub">
            Purpose-built dashboards ensure each user only sees what matters to them.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon purple">🎓</div>
            <h3>Student Portal</h3>
            <p>Apply for passes, track approval status, and view your full pass history in a clean, intuitive dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">👨‍💼</div>
            <h3>Admin Control</h3>
            <p>Wardens get a unified inbox of pending requests with one-click approval, rejection, and request history.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">🛂</div>
            <h3>Security Desk</h3>
            <p>Security personnel verify pass IDs instantly and log real-time entry and exit events effortlessly.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ padding: '0 0 80px' }}>
        <div className="cta-section">
          <h2>Ready to Modernize Your Campus Gate System?</h2>
          <p>Join thousands of students and wardens already using SmartPass.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }}>
              Get Started 
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">🛂 SmartPass</div>
        <p>© {new Date().getFullYear()} SmartPass. Designed for modern campuses.</p>
      </footer>
    </>
  );
};

export default Landing;
