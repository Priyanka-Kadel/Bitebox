const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const User = require('../models/User');
const config = require('../config/config');
const { isPasswordStrong, isPasswordReused } = require('../utils/passwordUtils');
const { sendVerificationEmail } = require('../utils/email');

const PASSWORD_HISTORY_LIMIT = 3;
const PASSWORD_EXPIRY_DAYS = 90;

const registerUser = async (req, res) => {
    try {
      const { name, email, password, confirm_password, role } = req.body;
      let image = req.file ? req.file.path : null;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      const user = new User({
        name,
        email,
        password,
        confirm_password,
        role,
        image,
        isEmailVerified: false,
        emailVerificationCode: verificationCode,
        emailVerificationExpires: verificationExpires,
      });
  
      const tokenExpiration = role === 'admin' ? '7d' : '24h';
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "SECRETHO",
        { expiresIn: tokenExpiration }
      );
  
      user.token = token;
      await user.save();

      try {
        await sendVerificationEmail(email, verificationCode);
        res.status(201).json({ success: true, message: "Check your email for the verification code.", userData: { email: user.email } });
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        await User.findByIdAndDelete(user._id); // Optional: clean up
        res.status(500).json({ message: "Error sending verification email. Please try again.", error: emailError.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error registering user", error });
    }
  };

const uploadImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
        success: true,
        data: req.file.filename,
    });
};

const loginUser = async (req, res) => {
    if (req.loginLimiter && req.loginLimiter.blocked) {
        return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }
    const { email, password } = req.body;

    if (!email || !password) {
        if (req.loginLimiter) req.loginLimiter.increment();
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            if (req.loginLimiter) req.loginLimiter.increment();
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            if (req.loginLimiter) req.loginLimiter.increment();
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const now = new Date();
        const lastChanged = user.passwordLastChanged || user.createdAt;
        const diffDays = (now - lastChanged) / (1000 * 60 * 60 * 24);
        if (diffDays > PASSWORD_EXPIRY_DAYS) {
            return res.status(403).json({ message: 'Password expired. Please change your password.' });
        }

        const tokenExpiration = user.role === 'admin' ? '7d' : '24h';
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'SECRETHO',
            { expiresIn: tokenExpiration }
        );

        user.token = token;
        await user.save();

        if (req.loginLimiter) req.loginLimiter.reset();

        res.status(200).json({ 
            success: true, 
            message: 'Login successful', 
            token, 
            role: user.role, 
            name: user.name,
            _id: user._id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error logging in', error });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRETHO');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const tokenExpiration = user.role === 'admin' ? '7d' : '24h';
        const newToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'SECRETHO',
            { expiresIn: tokenExpiration }
        );

        user.token = newToken;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            token: newToken,
            role: user.role,
            name: user.name,
            _id: user._id
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRETHO');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Token is valid',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const forgotPassword = async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).send({ success: false, msg: "Email is required" });
    }

    try {
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(404).send({ success: false, msg: "This email does not exist." });
        }

        const randomString = randomstring.generate();
        await User.updateOne({ email }, { $set: { token: randomString } });

        console.log("Recipient Email:", userData.email);

        if (userData.email) {
            sendResetPasswordMail(userData.name, userData.email, randomString);
            return res.status(200).send({ success: true, msg: "Please check your inbox to reset your password." });
        } else {
            console.error("User email is missing.");
            return res.status(400).send({ success: false, msg: "Invalid email address." });
        }
    } catch (error) {
        console.error("Error in forgotPassword:", error.message);
        return res.status(500).send({ success: false, msg: error.message });
    }
};

const sendResetPasswordMail = (name, email, token) => {
    console.log("Attempting to send email to:", email);

    if (!email) {
        console.error("Recipient email is missing.");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword,
        },
    });

    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>Hi ${name},</p>
            <p>From Bitebox </p>
            <p> Please click the link below to reset your password:</p>
            <p><a href="https://localhost:5173/reset-password?token=${token}">Reset Password</a></p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error.message);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ success: false, msg: "Token and new password are required." });
    }

    try {
        const userData = await User.findOne({ token });

        if (!userData) {
            return res.status(404).send({ success: false, msg: "Invalid or expired token." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.updateOne(
            { _id: userData._id },
            { $set: { password: hashedPassword, token: null } }
        );

        res.status(200).send({ success: true, msg: "Password reset successfully." });
    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        res.status(500).send({ success: false, msg: error.message });
    }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({ message: 'New password does not meet complexity requirements.' });
    }

    if (await isPasswordReused(newPassword, user.passwordHistory)) {
      return res.status(400).json({ message: 'You cannot reuse your previous passwords.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHistory.unshift(hashedNewPassword);
    user.passwordHistory = user.passwordHistory.slice(0, PASSWORD_HISTORY_LIMIT);

    user.password = hashedNewPassword;
    user.passwordLastChanged = new Date();

    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Password change failed.', error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.emailVerificationCode !== verificationToken || user.emailVerificationExpires < new Date()) {
    return res.status(400).json({ success: false, message: "Invalid or expired code" });
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Email verified!" });
};

const resendVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.emailVerificationCode = code;
  user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendVerificationEmail(email, code);

  res.json({ success: true, message: "Verification code resent." });
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    sendResetPasswordMail,
    resetPassword,
    uploadImage,
    refreshToken,
    verifyToken,
    changePassword,
    verifyEmail,
    resendVerification
};