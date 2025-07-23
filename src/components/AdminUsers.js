import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import {
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaKey,
  FaTrash,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name || "",
      email: user.email,
      password: user.password || "",
      phone: user.phone || "",
      role: user.role,
      status: user.status || "active",
    });
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-popup">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg mr-4"
                onClick={async () => {
                  await axios.delete(`http://localhost:5000/users/${id}`);
                  fetchUsers();
                  toast.success("User deleted successfully!");
                  onClose();
                }}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios
        .put(`http://localhost:5000/users/${editId}`, form)
        .then(() => {
          toast.success("User updated successfully!");
          setEditId(null);
          setForm({
            name: "",
            email: "",
            password: "",
            phone: "",
            role: "",
            status: "active",
          });
          fetchUsers();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to update user!");
        });
    } else {
      const newId = users.length + 1;
      form.id = newId;
      await axios
        .post("http://localhost:5000/users", form)
        .then(() => {
          toast.success("User added successfully!");
          fetchUsers();
          setForm({
            name: "",
            email: "",
            password: "",
            phone: "",
            role: "",
            status: "active",
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to add user!");
        });
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <button
        onClick={handleBackToHome}
        className="mb-10 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Account{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Management
          </span>
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 bg-white rounded-2xl shadow-lg p-6"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          type="text"
          className="border p-2 rounded"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="border p-2 rounded"
          required
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="text"
          className="border p-2 rounded"
          required={!editId}
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          type="tel"
          className="border p-2 rounded"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          type="submit"
          className="col-span-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-2 rounded mt-4"
        >
          {editId ? "Update User" : "Add New User"}
        </button>
      </form>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          User{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            List
          </span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.map((user) => (
          <div
            key={user.email}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-transform hover:scale-[1.015]"
          >
            {/* Avatar chữ cái đầu */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mr-3 shadow">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-blue-700 flex items-center">
                {user.name}
              </h3>
            </div>

            {/* Thông tin người dùng */}
            <div className="space-y-2">
              <p className="text-sm text-gray-700 flex items-center">
                <FaEnvelope className="mr-2 text-gray-500" />
                {user.email}
              </p>

              <p className="text-sm text-gray-700 flex items-center">
                <FaPhone className="mr-2 text-pink-500" />
                {user.phone}
              </p>

              <p className="text-sm text-gray-700 flex items-center">
                <FaKey className="mr-2 text-yellow-500" />
                {user.password}
              </p>

              <p className="text-sm text-gray-700 flex items-center capitalize">
                <FaUserShield className="mr-2 text-green-600" />
                Role: {user.role}
              </p>

              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-5 flex space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="flex-1 flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 px-3 rounded-lg space-x-2 transition"
              >
                <FaEdit />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDelete(user.id)}
                className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg space-x-2 transition"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center justify-center"
        >
          {"<<"}
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center justify-center"
        >
          {"<"}
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`w-10 h-10 p-2 rounded-lg ${
              currentPage === pageNumber
                ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                : "bg-gray-200 text-gray-600"
            } flex items-center justify-center`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center justify-center"
        >
          {">"}
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center justify-center"
        >
          {">>"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default AdminUsers;
