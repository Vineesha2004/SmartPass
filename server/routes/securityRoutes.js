const express = require('express');
const router = express.Router();


const { verifyPass, logMovement, getCurrentlyOut , 
getApprovedPasses} = require('../controllers/securityController');


const { protect, authorize } = require('../middleware/authMiddleware');

// All security routes require login AND the 'security' role

// POST /api/security/verify  →  Check if a pass ID is valid
router.post('/verify', protect, authorize('security'), verifyPass);

// POST /api/security/log     →  Mark student as OUT or IN
router.post('/log', protect, authorize('security'), logMovement);

// GET  /api/security/status  →  See who is currently outside
router.get('/status', protect, authorize('security'), getCurrentlyOut);

router.get('/approved', protect, authorize('security'), getApprovedPasses);

module.exports = router;
