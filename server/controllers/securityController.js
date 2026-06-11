const Pass = require('../models/Pass');

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/security/approved
// @desc    Get all approved passes (for security dashboard list)
// @access  Private (security only)
// ─────────────────────────────────────────────────────────────────────────────
const getApprovedPasses = async (req, res) => {
  try {
    const passes = await Pass.find({ status: 'approved' })
      .populate('student', 'name email');

    res.status(200).json({
      success: true,
      count: passes.length,
      passes: passes.map(p => p.toObject({ virtuals: true })), 
    });

  } catch (error) {
    console.error('Error fetching approved passes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/security/verify
// ─────────────────────────────────────────────────────────────────────────────
const verifyPass = async (req, res) => {
  try {
    const { passId } = req.body;

    if (!passId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a Pass ID.',
      });
    }

    let pass = null;

    if (passId.startsWith('SP-')) {
      const hexSuffix = passId.replace('SP-', '').toLowerCase();

      const allPasses = await Pass.find({ status: 'approved' })
        .populate('student', 'name email');

      pass = allPasses.find(
        (p) => p._id.toString().slice(-4).toUpperCase() === hexSuffix.toUpperCase()
      );
    } else {
      pass = await Pass.findById(passId).populate('student', 'name email');
    }

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'No approved pass found with this ID.',
      });
    }

    if (pass.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: `This pass is ${pass.status}.`,
      });
    }

    res.status(200).json({
      success: true,
      pass: {
        id: pass._id,
        passId: pass.passId,
        student: pass.student,
        reason: pass.reason,
        date: pass.date,
        returnDate: pass.returnDate,
        status: pass.status,
        isCurrentlyOut: pass.isCurrentlyOut,
        outTime: pass.outTime,
        inTime: pass.inTime,
      },
    });
  } catch (error) {
    console.error('Verify pass error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/security/log
// ─────────────────────────────────────────────────────────────────────────────
const logMovement = async (req, res) => {
  try {
    const { passId, event } = req.body;

    if (!passId || !event) {
      return res.status(400).json({
        success: false,
        message: 'Provide passId and event',
      });
    }

    let pass = null;

    if (passId.startsWith('SP-')) {
      const hexSuffix = passId.replace('SP-', '').toLowerCase();

      const allPasses = await Pass.find({ status: 'approved' })
        .populate('student', 'name email');

      pass = allPasses.find(
        (p) => p._id.toString().slice(-4).toUpperCase() === hexSuffix.toUpperCase()
      );
    } else {
      pass = await Pass.findById(passId).populate('student', 'name email');
    }

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Pass not found',
      });
    }

    const now = new Date();

    if (event === 'out') {
      pass.outTime = now;
      pass.isCurrentlyOut = true;
      await pass.save();

      return res.status(200).json({
        success: true,
        message: 'Marked OUT',
        pass,
      });
    }

    if (event === 'in') {
      pass.inTime = now;
      pass.isCurrentlyOut = false;
      await pass.save();

      return res.status(200).json({
        success: true,
        message: 'Marked IN',
        pass,
      });
    }

  } catch (error) {
    console.error('Log movement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/security/status
// ──────────────────────────────────────────────────────────────────────────
const getCurrentlyOut = async (req, res) => {
  try {
    const passes = await Pass.find({
      status: 'approved',
      isCurrentlyOut: true,
    }).populate('student', 'name email');

    res.status(200).json({
      success: true,
      count: passes.length,
      passes,
    });
  } catch (error) {
    console.error('Get currently out error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  verifyPass,
  logMovement,
  getCurrentlyOut,
  getApprovedPasses, 
};