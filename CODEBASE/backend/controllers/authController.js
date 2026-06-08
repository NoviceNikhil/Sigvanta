const authService = require("../services/authServices");
const userService = require("../services/userServices")
const { successResponse, errorResponse } = require("../utils/apiResponce");
const { writeAuthLog } = require("../utils/mongoLogs");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await authService.loginUser(email, password);

    // 🔥 ADD THIS BLOCK
    if (data.token) {
      res.cookie("token", data.token, {
        httpOnly: true,
        secure: false,       // localhost
        sameSite: "lax",
        path: "/",
      });

      // Best-effort auth log for direct (non-admin) login
      writeAuthLog({
        user_id: data?.user?.id,
        provider: "local",
        status: "success",
      });
    } else if (data.isAdmin && data.userId) {
      // Admin login triggers OTP flow
      writeAuthLog({
        user_id: data.userId,
        provider: "local",
        status: "otp_sent",
      });
    }

    return successResponse(res, "Login successful", data);

  } catch (err) {
    return errorResponse(
      res,
      err.message || "Login failed",
      null,
      err.statusCode || 500
    );
  }
};




exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // optional basic validation
    if (!name || !email || !password) {
      return errorResponse(res, "All fields are required", null, 400);
    }

    // call SAME service used in userController
    const data = await userService.createUser({name,email,password});

    return successResponse(res, "Signup successful", data, 201);

  } catch (err) {
    return errorResponse(
      res,
      err.message || "Signup failed",
      null,
      err.statusCode || 500
    );
  }
};



// 🔹 FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email is required", null, 400);
    }

    const data = await authService.forgotPassword(email);

    return successResponse(res, "OTP sent successfully", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to send OTP",
      null,
      err.statusCode || 500
    );
  }
};


// 🔹 RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword , token} = req.body;

    if (!email || !newPassword ) {
      return errorResponse(res, "All fields required", null, 400);
    }

    const data = await authService.resetPassword(email, newPassword, token);

    return successResponse(res, "Password updated", data);
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Reset password failed",
      null,
      err.statusCode || 500
    );
  }
};
