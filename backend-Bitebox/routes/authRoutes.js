const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  uploadImage,
  refreshToken,
  verifyToken,
  verifyEmail,
  resendVerification
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { loginAttemptLimiter } = require("../middleware/rateLimiter");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginAttemptLimiter, loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.post("/refresh-token", refreshToken);
router.post("/verify-token", verifyToken);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

module.exports = router;