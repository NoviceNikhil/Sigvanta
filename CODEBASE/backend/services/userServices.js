const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const sendOtpEmail = require("../utils/sendotp");

const DEFAULT_AVATAR = "boy.png";
const AVATAR_BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";

// 🔥 GLOBAL OTP STORE (email-based)
const signupOtpStore = new Map();

// ✅ COMMON HELPER → REMOVE PASSWORD
const sanitizeUser = (user) => {
  const userData = user.toJSON();
  delete userData.password;
  return userData;
};

// 🔹 Helper (DRY)
const findUserOrThrow = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// 🔹 GET ALL USERS
exports.getAllUsers = async () => {
  const users = await User.findAll();

  if (!users || users.length === 0) {
    const error = new Error("No users found");
    error.statusCode = 404;
    throw error;
  }

  return users.map((user) => sanitizeUser(user)); // ✅ safe
};

// 🔹 GET PROFILE
exports.getUserProfile = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user); // ✅ safe
};

// 🔹 GET BY ID
exports.getUserById = async (id) => {
  const user = await findUserOrThrow(id);
  return sanitizeUser(user); // ✅ safe
};

// 🔹 CREATE USER (SIGNUP → SEND OTP)
exports.createUser = async (body) => {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000;

  signupOtpStore.set(normalizedEmail, {
    type: "signup",
    name,
    email: normalizedEmail,
    password: hashedPassword,
    otp,
    expiry,
    attempts: 0,
  });

  console.log("Signup OTP:", otp);

  await sendOtpEmail(normalizedEmail, otp);

  return {
    message: "OTP sent to registered email",
    email: normalizedEmail,
  };
};

// 🔥 export store
exports.signupOtpStore = signupOtpStore;

// 🔹 PUT (FULL UPDATE)
exports.updateUser = async (id, body) => {
  const user = await findUserOrThrow(id);

  const requiredFields = ["name", "email", "password"];
  const isValid = requiredFields.every((field) => body[field]);

  if (!isValid) {
    const error = new Error("All fields are required for PUT");
    error.statusCode = 400;
    throw error;
  }

  body.email = body.email.toLowerCase();

  const existingUser = await User.findOne({
    where: { email: body.email },
  });

  if (existingUser && existingUser.id !== user.id) {
    const error = new Error("Email already in use");
    error.statusCode = 400;
    throw error;
  }

  body.password = await bcrypt.hash(body.password, 10);

  await user.update(body);

  return sanitizeUser(user); // ✅ safe
};

// 🔹 PATCH (PARTIAL UPDATE)
exports.patchUser = async (id, body) => {
  const user = await findUserOrThrow(id);

  if (!body || Object.keys(body).length === 0) {
    const error = new Error("No data provided for update");
    error.statusCode = 400;
    throw error;
  }

  const restrictedFields = ["email", "role"];

  const isRestrictedUpdate = Object.keys(body).some((key) =>
    restrictedFields.includes(key),
  );

  if (isRestrictedUpdate) {
    const error = new Error("Access denied: Cannot update email or role");
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = ["name", "password"];
  const filteredBody = {};

  for (let key of Object.keys(body)) {
    if (allowedFields.includes(key)) {
      filteredBody[key] = body[key];
    }
  }

  if (Object.keys(filteredBody).length === 0) {
    const error = new Error("No valid fields to update");
    error.statusCode = 400;
    throw error;
  }

  if (filteredBody.password) {
    filteredBody.password = await bcrypt.hash(filteredBody.password, 10);
  }

  await user.update(filteredBody);

  return sanitizeUser(user); // ✅ safe
};

// 🔹 DELETE
exports.deleteUser = async (id) => {
  const user = await findUserOrThrow(id);

  await user.destroy();

  return {
    id,
    message: "User deleted successfully",
  };
};

// 🔹 PATCH CURRENT USER PROFILE
exports.patchCurrentUser = async (userId, body) => {
  const user = await findUserOrThrow(userId);

  if (!body || Object.keys(body).length === 0) {
    const error = new Error("No data provided for update");
    error.statusCode = 400;
    throw error;
  }

  const { name } = body;

  if (!name || !name.trim()) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }

  user.name = name.trim();
  await user.save();

  return sanitizeUser(user);
};

// 🔹 DELETE CURRENT USER
exports.deleteCurrentUser = async (userId) => {
  const user = await findUserOrThrow(userId);

  await user.destroy();

  return {
    id: userId,
    message: "Account deleted successfully",
  };
};

// 🔹 DELETE
exports.deleteUser = async (id) => {
  const user = await findUserOrThrow(id);

  await user.destroy();

  return {
    id,
    message: "User deleted successfully",
  };
};

exports.updateAvatar = async (userId, avatar) => {
  const allowedAvatars = [
    "boy.png",
    "cancan.png",
    "cat.png",
    "dog.png",
    "grandfather.png",
    "man.png",
    "old-woman.png",
    "programmer.png",
    "woman.png",
  ];

  if (!allowedAvatars.includes(avatar)) {
    const error = new Error("Invalid avatar");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.ProfileIcon = avatar;
  await user.save();

  const avatarUrl = `${AVATAR_BASE_URL}/avatars/${avatar}`;

  return {
    avatar,
    ProfileIcon: avatar,
    avatarUrl,
    profilePicture: avatarUrl,
  };
};
