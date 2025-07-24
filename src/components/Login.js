import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:5000/users", {
        params: {
          email,
          password,
          status: "active",
        },
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
      console.error("Login failed:", err);
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-8 w-full max-w-lg transition-all duration-500"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 drop-shadow">
          Login
        </h2>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
};

export default Login;
