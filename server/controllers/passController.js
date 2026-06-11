const Pass = require('../models/Pass');

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/passes
// @desc    Student applies for a new gate pass
// @access  Private (student only)
// ─────────────────────────────────────────────────────────────────────────────
const applyForPass = async (req, res) => {
  try {
    const { reason, date, returnDate, notes } = req.body;

    if (!reason || !date || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reason, date, and return date.',
      });
    }

    // Ensure return date is not before departure date
    if (new Date(returnDate) < new Date(date)) {
      return res.status(400).json({
        success: false,
        message: 'Return date cannot be before departure date.',
      });
    }

    const pass = await Pass.create({
      student: req.user._id, // Comes from protect middleware
      reason,
      date,
      returnDate,
      notes: notes || '',
      status: 'pending',
    });

    // Populate student info before returning
    await pass.populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Pass application submitted successfully!',
      pass,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('Apply pass error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/passes
// @desc    Student gets their own pass history
// @access  Private (student only)
// ─────────────────────────────────────────────────────────────────────────────
const getMyPasses = async (req, res) => {
  try {
    const passes = await Pass.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name');

    res.status(200).json({
      success: true,
      count: passes.length,
      passes: passes.map(p => p.toObject({ virtuals: true })), // ✅ FIX
    });

  } catch (error) {
    console.error('Get my passes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/passes/all
// @desc    Admin gets ALL pass requests (with optional status filter)
// @access  Private (admin only)
// ─────────────────────────────────────────────────────────────────────────────
const getAllPasses = async (req, res) => {
  try {
    // Allow filtering by status: /api/passes/all?status=pending
    const filter = {};
    if (req.query.status && ['pending', 'approved', 'rejected'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const passes = await Pass.find(filter)
      .sort({ createdAt: -1 })
      .populate('student', 'name email') // Full student details
      .populate('reviewedBy', 'name');   // Warden who acted on it

    res.status(200).json({
      success: true,
      count: passes.length,
      passes,
    });
  } catch (error) {
    console.error('Get all passes error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PATCH /api/passes/:id/approve
// @desc    Admin approves a pass request
// @access  Private (admin only)
// ─────────────────────────────────────────────────────────────────────────────
const approvePass = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({ success: false, message: 'Pass not found.' });
    }

    if (pass.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This pass has already been ${pass.status}. Only pending passes can be approved.`,
      });
    }

    pass.status = 'approved';
    pass.reviewedBy = req.user._id; // Track which admin approved
    pass.reviewedAt = new Date();
    await pass.save();

    await pass.populate('student', 'name email');
    await pass.populate('reviewedBy', 'name');

    res.status(200).json({
      success: true,
      message: `Pass approved for ${pass.student.name}.`,
      pass,
    });
  } catch (error) {
    console.error('Approve pass error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PATCH /api/passes/:id/reject
// @desc    Admin rejects a pass request
// @access  Private (admin only)
// ─────────────────────────────────────────────────────────────────────────────
const rejectPass = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({ success: false, message: 'Pass not found.' });
    }

    if (pass.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This pass has already been ${pass.status}. Only pending passes can be rejected.`,
      });
    }

    pass.status = 'rejected';
    pass.reviewedBy = req.user._id;
    pass.reviewedAt = new Date();
    await pass.save();

    await pass.populate('student', 'name email');
    await pass.populate('reviewedBy', 'name');

    res.status(200).json({
      success: true,
      message: `Pass rejected for ${pass.student.name}.`,
      pass,
    });
  } catch (error) {
    console.error('Reject pass error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

module.exports = {
  applyForPass,
  getMyPasses,
  getAllPasses,
  approvePass,
  rejectPass,
};
