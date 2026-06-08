import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomInput from '../componentsUser/CustomInput';
import { resetPassword } from "../api/auth";

export default function ResetPassword({ showToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const token = location.state?.token;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔥 STORE IN SESSION (for refresh safety)
  useEffect(() => {
    if (email && token) {
      sessionStorage.setItem("resetEmail", email);
      sessionStorage.setItem("resetToken", token);
    }
  }, [email, token]);

  // 🔥 GET FINAL VALUES
  const finalEmail = email || sessionStorage.getItem("resetEmail");
  const finalToken = token || sessionStorage.getItem("resetToken");

  // 🔥 PROTECT ROUTE
  useEffect(() => {
    if (!finalEmail || !finalToken) {
      navigate("/login");
    }
  }, [finalEmail, finalToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirm) {
      return setError("All fields required");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await resetPassword({
        email: finalEmail,
        newPassword: password,
        token: finalToken,
      });

      showToast("Password updated successfully");

      // 🔥 CLEAR SESSION
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetToken");

      setPassword("");
      setConfirm("");

      navigate("/login");

    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔙 Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        ← Back
      </button>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Reset Password
      </h2>

      <p className="text-center text-gray-500 text-sm mb-6">
        Set your new password
      </p>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center mb-4 font-medium">
          {error}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <CustomInput
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <CustomInput
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full py-3 rounded-full bg-slate-700 hover:bg-slate-800 transition-colors text-white font-medium shadow-sm disabled:opacity-50"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}