const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'security'],
      default: 'student',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── MIDDLEWARE: Hash password before saving ───────────────────────────────
// This runs automatically before every .save() call
userSchema.pre('save', async function (next) {
  // Only hash if the password was actually modified (avoid re-hashing on other updates)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12); // 12 rounds = strong but not too slow
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── METHOD: Compare entered password with hashed one ─────────────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
