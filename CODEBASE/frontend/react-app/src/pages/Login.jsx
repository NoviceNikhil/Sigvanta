import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import CustomInput from "../componentsUser/CustomInput";
import ToggleSwitch from "../componentsUser/ToggleSwitch";
import { loginUser, logoutUser } from "../api/auth";
import GoogleIcon from "../componentsUser/GoogleIcon";
import { fetchAndStoreUser } from "../utils/fetchAndStoreUser"; // 🔥 ADD
import { setUser } from "../store/authSlice"; // 🔥 ADD THIS

export default function Login({ showToast }) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 🔥 ADD THIS

  const [role, setRole] = useState("user");
  const [data, setData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.email || !data.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const res = await loginUser(data);
      const responseData = res.data.data;

      if (role === "user" && responseData.isAdmin) {
        if (showToast) showToast("This is admin email. Go to admin and login there.");
        return;
      }

      if (role === "admin" && !responseData.isAdmin) {
        await logoutUser().catch(() => { });
        if (showToast) showToast("You are a user. Go to user login.");
        return;
      }

      // 🔥 ADMIN → OTP FLOW
      if (responseData.isAdmin) {
        if (showToast) showToast("OTP sent to email");

        navigate("/admin-otp", {
          state: {
            email: responseData.email,
            userId: responseData.userId, // 🔥 PASS THIS
          },
        });
      }

      // 👤 NORMAL USER
      else {
        if (showToast) showToast("Login successful");

        // ✅ CASE 1: full user available
        if (responseData.user) {

          dispatch(setUser(responseData.user));
        }

        // ✅ CASE 2: only userId available
        else if (responseData.userId) {
          await fetchAndStoreUser(responseData.userId, dispatch);
        }

        navigate("/");
      }

    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        {role === "admin" ? "Welcome Admin" : "Welcome User"}
      </h2>
      <p className="text-center text-gray-500 text-sm mb-12 ">
        {role === "admin"
          ? "Login with admin email and password"
          : "Login with your user account"}
      </p>

      <div className="flex mb-6 bg-gray-100 rounded-xl p-1 border border-gray-200">
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setRole("user");
            setError("");
          }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${role === "user"
            ? "bg-slate-700 shadow text-white"
            : "text-gray-500"
            }`}
        >
          User
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setRole("admin");
            setError("");
          }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${role === "admin"
            ? "bg-slate-700 shadow text-white"
            : "text-gray-500"
            }`}
        >
          Admin
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4 font-medium">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        <CustomInput
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        {/* <CustomInput
          label="Password"
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        /> */}
        {/* password */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              autoComplete="new-password"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                  <path d="M10.88 9.88a3 3 0 0 1 4.24 4.24" />
                  <path d="M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 mt-2">
          <Link
            to="/forget-pass"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

          {/* <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Remember me</span>
            <ToggleSwitch checked={remember} onChange={setRemember} />
          </div> */}
        </div>

        <button
          disabled={loading}
          className="w-full py-3 rounded-full bg-slate-700 hover:bg-slate-800 text-white font-medium disabled:opacity-50"
        >
          {loading
            ? role === "admin"
              ? "Sending OTP..."
              : "Logging in..."
            : "Log in"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-3">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="px-3 text-sm text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {role === "user" && (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-full border bg-white disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      )}

      <p className="text-center text-sm text-gray-600 my-3">
        Don't have an account?{" "}
        <span
          onClick={() => {
            if (role === "admin") {
              if (showToast) {
                showToast(
                  "Admins cannot signup. Register as user first, then request admin."
                );
              }
            } else {
              navigate("/signup");
            }
          }}
          className="text-slate-700 font-bold cursor-pointer"
        >
          Sign up
        </span>
      </p>
    </>
  );
}
