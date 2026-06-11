const express = require('express');
const router = express.Router();

const {
  applyForPass,
  getMyPasses,
  getAllPasses,
  approvePass,
  rejectPass,
} = require('../controllers/passController');

const { protect, authorize } = require('../middleware/authMiddleware');

// ─── Student Routes ───────────────────────────────────────────────────────────

// POST /api/passes         →  Apply for a new gate pass  (student only)
router.post('/', protect, authorize('student'), applyForPass);

// GET  /api/passes         →  View my own pass history   (student only)
router.get('/', protect, authorize('student'), getMyPasses);

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// GET  /api/passes/all     →  View ALL requests          (admin only)
// NOTE: "/all" must be defined BEFORE "/:id" routes to avoid conflict
router.get('/all', protect, authorize('admin'), getAllPasses);

// PATCH /api/passes/:id/approve  →  Approve a pass       (admin only)
router.patch('/:id/approve', protect, authorize('admin'), approvePass);

// PATCH /api/passes/:id/reject   →  Reject a pass        (admin only)
router.patch('/:id/reject', protect, authorize('admin'), rejectPass);

module.exports = router;
