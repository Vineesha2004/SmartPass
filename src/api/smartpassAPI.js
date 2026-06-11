// src/api/smartpassAPI.js

const BASE_URL = 'https://smartpass-backend-ttd4.onrender.com/api';

// ─── Helper: get saved JWT token ───────────────────────────
const getToken = () => localStorage.getItem('smartpass_token');

// ─── Helper: headers ───────────────────────────────────────
const headers = (auth = true) => ({
  'Content-Type': 'application/json',
  ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ─── Helper: safe response handler ─────────────────────────
const handleResponse = async (res) => {
  let data;

  try {
    data = await res.json();
  } catch (err) {
    throw new Error("⚠️ No response from server. Is backend running?");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

// ═══════════════════════════════════════════════════════════
// AUTH APIs
// ═══════════════════════════════════════════════════════════

// ✅ FIXED: Now accepts role dynamically
export const registerUser = async ({ name, email, password, role }) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify({ name, email, password, role }), // ✅ IMPORTANT FIX
    });

    return await handleResponse(res);

  } catch (err) {
    throw new Error(err.message || "Registration failed");
  }
};

export const loginUser = async ({ email, password, role }) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: headers(false),
      body: JSON.stringify({ email, password, role }),
    });

    const data = await handleResponse(res);

    if (data.token) {
      localStorage.setItem('smartpass_token', data.token);
    }

    if (data.user) {
      localStorage.setItem('smartpass_user', JSON.stringify(data.user));
    }

    return data;

  } catch (err) {
    throw new Error(err.message || "Login failed");
  }
};

export const logoutUser = () => {
  localStorage.removeItem('smartpass_token');
  localStorage.removeItem('smartpass_user');
};

// ═══════════════════════════════════════════════════════════
// STUDENT APIs
// ═══════════════════════════════════════════════════════════

export const applyForPass = async ({ reason, date, returnDate, notes }) => {
  const res = await fetch(`${BASE_URL}/passes`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ reason, date, returnDate, notes }),
  });

  return handleResponse(res);
};

export const getMyPasses = async () => {
  const res = await fetch(`${BASE_URL}/passes`, {
    method: 'GET',
    headers: headers(),
  });

  return handleResponse(res);
};

// ═══════════════════════════════════════════════════════════
// ADMIN APIs
// ═══════════════════════════════════════════════════════════

export const getAllPasses = async (status = '') => {
  const query = status ? `?status=${status}` : '';

  const res = await fetch(`${BASE_URL}/passes/all${query}`, {
    method: 'GET',
    headers: headers(),
  });

  return handleResponse(res);
};

export const approvePass = async (passId) => {
  const res = await fetch(`${BASE_URL}/passes/${passId}/approve`, {
    method: 'PATCH',
    headers: headers(),
  });

  return handleResponse(res);
};

export const rejectPass = async (passId) => {
  const res = await fetch(`${BASE_URL}/passes/${passId}/reject`, {
    method: 'PATCH',
    headers: headers(),
  });

  return handleResponse(res);
};

// ═══════════════════════════════════════════════════════════
// SECURITY APIs
// ═══════════════════════════════════════════════════════════

export const verifyPass = async (passId) => {
  const res = await fetch(`${BASE_URL}/security/verify`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ passId }),
  });

  return handleResponse(res);
};

export const logMovement = async (passId, event) => {
  const res = await fetch(`${BASE_URL}/security/log`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ passId, event }),
  });

  return handleResponse(res);
};

export const getCurrentlyOut = async () => {
  const res = await fetch(`${BASE_URL}/security/status`, {
    method: 'GET',
    headers: headers(),
  });

  return handleResponse(res);
};


export const getApprovedPasses = async () => {
  const res = await fetch(`${BASE_URL}/security/approved`, {
    method: 'GET',
    headers: headers(),
  });

  return handleResponse(res);
};