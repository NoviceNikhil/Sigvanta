const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const { signupOtpStore } = require("./userServices");
const { adminOtpStore, forgotOtpStore } = require("./authServices");

// ✅ helper to remove password
const sanitizeUser = (user) => {
  const userData = user.toJSON();
  delete userData.password;
  return userData;
};

// 🔥 COMMON TOKEN FUNCTION
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }

  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};


// 🔥 ADMIN VERIFY OTP
exports.verifyAdminOTP = async (email, otp) => {
  email = email.toLowerCase();

  const user = await User.findOne({ where: { email } });

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const data = adminOtpStore.get(email);

  if (!data) {
    throw new Error("OTP not found or expired");
  }

  if (Date.now() > data.expiry) {
    adminOtpStore.delete(email);
    throw new Error("OTP expired");
  }

  if (String(data.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  adminOtpStore.delete(email);

  const token = generateToken(user);

  return {
    token,
    user: sanitizeUser(user), // ✅ password removed
  };
};




// 🔥 USER OTP (signup + forgot)
exports.verifyUserOTP = async (email, otp) => {
  email = email.toLowerCase();

  let data = signupOtpStore.get(email);
  let type = "signup";

  if (!data) {
    data = forgotOtpStore.get(email);
    type = "forgot";
  }

  if (!data) {
    throw new Error("OTP not found or expired");
  }

  if (Date.now() > data.expiry) {
    if (type === "signup") signupOtpStore.delete(email);
    else forgotOtpStore.delete(email);

    throw new Error("OTP expired");
  }

  if (String(data.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  // 🔥 SIGNUP FLOW
  if (type === "signup") {
    const user = await User.create({
      name: data.name,
      email: email,
      password: data.password,
      role: "user",
    });

    signupOtpStore.delete(email);

    const token = generateToken(user);

    return {
      token,
      user: sanitizeUser(user), // ✅ password removed
    };
  }

  // 🔥 FORGOT PASSWORD FLOW
  else {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    forgotOtpStore.delete(email);

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return {
      resetToken,
      message: "OTP verified, proceed to reset password",
    };
  }
};