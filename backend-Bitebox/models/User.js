const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
    },
    passwordLastChanged: { type: Date, default: Date.now },
    passwordHistory: { type: [String], default: [] },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    token: {
        type: String,
        default: ''
    },
  
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],

    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    phone: {
        type: String,
        trim: true
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String },
    emailVerificationExpires: { type: Date },
    loginStats: {
      totalLogins: { type: Number, default: 0 },
      totalFailedLogins: { type: Number, default: 0 },
      totalSuccessfulLogins: { type: Number, default: 0 },
      lastLoginAt: { type: Date, default: null },
      lastFailedLoginAt: { type: Date, default: null },
      lastLoginIP: { type: String, default: null },
      lastFailedLoginIP: { type: String, default: null },
      consecutiveFailedLogins: { type: Number, default: 0 },
      accountLockedCount: { type: Number, default: 0 },
      lastLockedAt: { type: Date, default: null },
      totalLockTime: { type: Number, default: 0 },
    },
    securityEvents: {
      passwordChanges: { type: Number, default: 0 },
      lastPasswordChangeAt: { type: Date, default: null },
      emailVerifications: { type: Number, default: 0 },
      lastEmailVerificationAt: { type: Date, default: null },
      passwordResetRequests: { type: Number, default: 0 },
      lastPasswordResetRequestAt: { type: Date, default: null },
      suspiciousActivities: { type: Number, default: 0 },
      lastSuspiciousActivityAt: { type: Date, default: null },
    },
    sessionStats: {
      totalSessions: { type: Number, default: 0 },
      activeSessions: { type: Number, default: 0 },
      lastSessionAt: { type: Date, default: null },
      averageSessionDuration: { type: Number, default: 0 },
    },
    activityStats: {
      profileUpdates: { type: Number, default: 0 },
      lastProfileUpdateAt: { type: Date, default: null },
      roomsCreated: { type: Number, default: 0 },
      roommatesCreated: { type: Number, default: 0 },
      paymentsMade: { type: Number, default: 0 },
      totalAmountSpent: { type: Number, default: 0 },
      lastActivityAt: { type: Date, default: null },
    },
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;