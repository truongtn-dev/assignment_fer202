import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaStar } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminRatings = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    id: "",
    rating: 0,
    reviews: 0,
  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const navigate = useNavigate();

  const fetchSubjects = async () => {
    const res = await axios.get("http://localhost:5000/subjects");
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleEdit = (subject) => {
    setForm({
      id: subject.id,
      rating: subject.rating || 0,
      reviews: subject.reviews || 0,
    });
    setEditId(subject.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const subject = subjects.find((s) => s.id === editId);
      const updatedSubject = {
        ...subject,
        rating: form.rating,
        reviews: form.reviews,
      };

      await axios
        .put(`http://localhost:5000/subjects/${editId}`, updatedSubject)
        .then(() => {
          toast.success("Rating updated successfully!");
          setEditId(null);
          setForm({ id: "", rating: 0, reviews: 0 });
          fetchSubjects();
        })
        .catch(() => toast.error("Failed to update rating!"));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subjects.length / itemsPerPage);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));

  const handlePageChange = (page) => setCurrentPage(page);

  const handleBackToHome = () => navigate("/");

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <button
        onClick={handleBackToHome}
        className="mb-10 text-sm text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Ratings{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Management
          </span>
        </h2>
      </div>

      {editId && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 p-6 bg-white rounded-lg shadow-md"
        >
          <div className="col-span-2 mb-4">
            {subjects.map((s) =>
              s.id === editId ? (
                <div key={s.id} className="flex items-center space-x-4">
                  <img
                    src={`/images/${s.image}`}
                    alt={s.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{s.title}</p>
                  </div>
                </div>
              ) : null
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, rating: value })}
                  className={`text-2xl transition transform hover:scale-110 ${
                    value <= form.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Reviews
            </label>
            <input
              type="number"
              name="reviews"
              value={form.reviews}
              onChange={handleChange}
              min="0"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="col-span-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-2 rounded mt-4"
          >
            Update Rating
          </button>
        </form>
      )}
      <div className="overflow-x-auto shadow-xl rounded-2xl">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100 rounded-t-2xl">
            <tr>
              <th className="p-4 text-left rounded-tl-2xl">Course</th>
              <th className="p-4 text-left">Rating</th>
              <th className="p-4 text-left">Reviews</th>
              <th className="p-4 text-left rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentItems.map((item, index) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 transition ${
                  index === currentItems.length - 1 ? "rounded-b-2xl" : ""
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`/images/${item.image}`}
                      alt={item.title}
                      className="w-12 h-8 object-cover rounded"
                    />
                    <span className="font-medium">{item.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(item.rating || 0)}
                    <span className="ml-2">{item.rating || 0}</span>
                  </div>
                </td>
                <td className="p-4">{item.reviews || 0}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 px-3 py-1 rounded-lg flex items-center space-x-2 hover:bg-yellow-500 transition"
                  >
                    <FaEdit className="w-5 h-5" />
                    <span className="hidden sm:block">Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {"<<"}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 p-2 rounded-lg ${
              currentPage === page
                ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {">"}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {">>"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AdminRatings;
