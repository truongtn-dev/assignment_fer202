import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:5000/users", {
        params: { email, password, status: "active" },
      });
      const user = res.data[0];
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        toast.success("Login successful!", { autoClose: 2000 });
        setTimeout(() => {
          navigate(user.role === "admin" ? "/admin/dashboard" : "/");
        }, 2000);
      } else {
        toast.error("Wrong email or password, or account is locked.");
      }
    } catch (err) {
      toast.error("An error occurred while logging in.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const check = await axios.get("http://localhost:5000/users", {
        params: { email },
      });
      if (check.data.length > 0) {
        toast.error("Email already exists.");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        phone,
        role: "user",
        status: "active",
      };

      const res = await axios.post("http://localhost:5000/users", newUser);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      toast.success("Account created! Logging in...", { autoClose: 2000 });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error("Failed to create account.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full top-10 left-10 blur-3xl animate-pulse dark:bg-blue-600/20"></div>
      <div className="absolute w-72 h-72 bg-teal-300/30 rounded-full bottom-10 right-10 blur-3xl animate-pulse dark:bg-teal-600/20"></div>

      <form
        onSubmit={mode === "login" ? handleLogin : handleSignUp}
        className="relative z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-800/70 shadow-2xl border border-white/40 dark:border-gray-700 rounded-2xl px-10 py-8 w-full max-w-md transition-all"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>

        <div className="space-y-5">
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition duration-300"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>

          <div className="text-center text-sm text-gray-700 dark:text-gray-300 mt-3">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {mode === "login" && (
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          )}
        </div>
      </form>

      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
};

export default Login;
