const mongoose = require('mongoose');

const passSchema = new mongoose.Schema(
  {
    // ── Who applied ──────────────────────────────────────────────────────────
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',       // Links to the User model
      required: true,
    },

    // ── Pass Details ─────────────────────────────────────────────────────────
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Status ───────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',       // Which admin approved/rejected
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },

    // ── Security Tracking ────────────────────────────────────────────────────
    outTime: {
      type: Date,
      default: null,     // Set when security marks OUT
    },
    inTime: {
      type: Date,
      default: null,     // Set when security marks IN
    },
    isCurrentlyOut: {
      type: Boolean,
      default: false,    // Tracks whether student is currently outside
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ── Virtual: Generate a readable Pass ID ─────────────────────────────────────

passSchema.virtual('passId').get(function () {
  const short = this._id.toString().slice(-4).toUpperCase();
  return `SP-${short}`;
});



// Make virtuals appear in JSON output
passSchema.set('toJSON', { virtuals: true });
passSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Pass', passSchema);
