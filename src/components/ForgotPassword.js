import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.get(`http://localhost:5000/users?email=${email}`);
      const user = res.data[0];

      if (!user) {
        setError("Email not found. Please check again.");
        return;
      }

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        password: newPassword,
      });

      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background blur circles */}
      <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full top-10 left-10 blur-3xl animate-pulse dark:bg-blue-600/20"></div>
      <div className="absolute w-72 h-72 bg-teal-300/30 rounded-full bottom-10 right-10 blur-3xl animate-pulse dark:bg-teal-600/20"></div>

      {/* Form container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-800/70 shadow-2xl border border-white/40 dark:border-gray-700 rounded-2xl px-10 py-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Forgot Password
        </h2>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-white"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* New Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-white"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
