const userService = require("../services/userServices");
const { successResponse, errorResponse } = require("../utils/apiResponce");

// ✅ GET PROFILE (FIXED → uses service)
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userService.getUserProfile(userId);

    return successResponse(res, "Profile fetched", user);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to fetch profile",
      null,
      err.statusCode || 500,
    );
  }
};

// ✅ GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const data = await userService.getAllUsers();
    return successResponse(res, "Users fetched successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to fetch users",
      null,
      err.statusCode || 500,
    );
  }
};

// ✅ GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const data = await userService.getUserById(req.params.id);

    return successResponse(res, "User fetched successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to fetch user",
      null,
      err.statusCode || 500,
    );
  }
};

// ✅ CREATE USER
exports.createNewUser = async (req, res) => {
  try {
    const response = await userService.createUser(req.body);
    return successResponse(res, "User created successfully", response, 201);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to create user",
      null,
      err.statusCode || 500,
    );
  }
};

// ✅ PATCH USER
exports.patchUser = async (req, res) => {
  try {
    const data = await userService.patchUser(req.params.id, req.body);

    return successResponse(res, "User updated successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to update user",
      null,
      err.statusCode || 500,
    );
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const data = await userService.deleteUser(req.params.id);

    return successResponse(res, "User deleted successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to delete user",
      null,
      err.statusCode || 500,
    );
  }
};

// ✅ PATCH CURRENT USER PROFILE
exports.patchCurrentUser = async (req, res) => {
  try {
    const data = await userService.patchCurrentUser(req.user.id, req.body);

    return successResponse(res, "Profile updated successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to update profile",
      null,
      err.statusCode || 500,
    );
  }
};

// ✅ DELETE CURRENT USER
exports.deleteCurrentUser = async (req, res) => {
  try {
    const data = await userService.deleteCurrentUser(req.user.id);

    res.clearCookie("token");
    return successResponse(res, "Account deleted successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to delete account",
      null,
      err.statusCode || 500,
    );
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const data = await userService.deleteUser(req.params.id);

    return successResponse(res, "User deleted successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to delete user",
      null,
      err.statusCode || 500,
    );
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ better than req.body
    const { avatar } = req.body;

    const data = await userService.updateAvatar(userId, avatar);

    return successResponse(res, "Avatar updated successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to update avatar",
      null,
      err.statusCode || 500,
    );
  }
};
