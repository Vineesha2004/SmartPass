const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Protect: Verifies JWT token ───────────────────────────────────────────
// Add this middleware to any route that requires login
const protect = async (req, res, next) => {
  try {
    let token;

    // Token is sent in the Authorization header as: "Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please log in.',
      });
    }

    // Verify the token using our JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user object to the request (without password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists. Please log in again.',
      });
    }

    next(); // Token is valid — proceed to the actual route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

// ─── Authorize: Restricts route to specific roles ──────────────────────────
// Usage: authorize('admin', 'security')
// Returns a middleware function that checks req.user.role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route is restricted to: ${roles.join(', ')}.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
