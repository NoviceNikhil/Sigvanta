const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendotp");

// 🔥 temporary OTP store (global)
const adminOtpStore = new Map();
const forgotOtpStore = new Map();

// ✅ helper to remove password
const sanitizeUser = (user) => {
  const userData = user.toJSON();
  delete userData.password;
  return userData;
};

exports.loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  email = email.toLowerCase();

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 🔥 ADMIN CASE → OTP FLOW
  if (user.role === "admin") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;

    adminOtpStore.set(email, { otp, expiry });

    await sendOtpEmail(email, otp);

    return {
      isAdmin: true,
      userId: user.id,
      email,
      message: "OTP sent to email",
    };
  }

  // 👤 NORMAL USER → DIRECT LOGIN
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: sanitizeUser(user), // ✅ password removed
  };
};

// 🔥 export otpStore
exports.adminOtpStore = adminOtpStore;


// 🔹 RESET PASSWORD
exports.resetPassword = async (email, newPassword, token) => {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }

  if (decoded.email !== email) {
    throw new Error("Invalid token");
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({ password: hashedPassword });

  return {
    message: "Password updated successfully",
  };
};


// 🔹 FORGOT PASSWORD
exports.forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000;

  forgotOtpStore.set(email, {
    otp,
    expiry,
    type: "forgot",
  });

  await sendOtpEmail(email, otp);

  return { email };
};

exports.forgotOtpStore = forgotOtpStore;