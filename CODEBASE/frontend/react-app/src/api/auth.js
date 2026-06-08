import API from "./axios";

// LOGIN
export const loginUser = (data) => API.post("/auth/login", data);

// ADMIN OTP
export const verifyAdminOtp = (data) =>
  API.post("/auth/login/admin/verify_otp", data);

// USER OTP
export const verifyUserOtp = (data) =>
  API.post("/auth/login/user/verify_otp", data);

// FORGOT PASSWORD
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);

// RESET PASSWORD
export const resetPassword = (data) => API.post("/auth/reset-password", data);

// SIGNUP
export const signupUser = (data) => API.post("/auth/signup", data);

// LOGOUT
export const logoutUser = () => API.post("/auth/logout");

// DELETE CURRENT ACCOUNT
export const deleteCurrentUser = () => API.delete("/users/profile");

// 🔹 Update Avatar
export const updateAvatar = (data) => API.patch("/users/update-avatar", data);

// 🔹 Update Current User Profile
export const updateCurrentUserProfile = (data) =>
  API.patch("/users/profile", data);

// ================= NEW =================

// 🔹 Get logged-in user
export const getProfile = () => API.get("/auth/profile");

// 🔹 Request admin access
export const requestAdminAccess = (data) =>
  API.post("/api/request-admin", data);

// 🔹 Get all admin requests
export const getAdminRequests = () => API.get("/api/admin/requests");

// 🔹 Handle request (approve/reject)
export const handleAdminRequest = (id, data) =>
  API.patch(`/api/admin/request/${id}`, data);
