import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminReviews = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  const [reviews, setReviews] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [reviewsRes, subjectsRes] = await Promise.all([
      axios.get("http://localhost:5000/reviews"),
      axios.get("http://localhost:5000/subjects"),
    ]);
    setReviews(reviewsRes.data);
    setSubjects(subjectsRes.data);
  };

  const updateSubjectRating = async (subjectId) => {
    const res = await axios.get(
      `http://localhost:5000/reviews?subjectId=${subjectId}`
    );
    const subjectReviews = res.data;
    const avg =
      subjectReviews.reduce((sum, r) => sum + r.rating, 0) /
      subjectReviews.length;

    const subject = await axios.get(
      `http://localhost:5000/subjects/${subjectId}`
    );
    await axios.put(`http://localhost:5000/subjects/${subjectId}`, {
      ...subject.data,
      rating: parseFloat(avg.toFixed(1)) || 0,
      reviews: subjectReviews.length,
    });
  };

  const handleDelete = async (id, subjectId) => {
    await axios.delete(`http://localhost:5000/reviews/${id}`);
    toast.success("Deleted!");
    fetchData();
    updateSubjectRating(subjectId);
  };

  const handleEdit = (review) => {
    setEditingReview({ ...review });
  };

  const handleSave = async () => {
    const { id, subjectId, name, comment, rating } = editingReview;
    await axios.put(`http://localhost:5000/reviews/${id}`, {
      id,
      subjectId,
      name,
      comment,
      rating,
      createdAt: new Date().toISOString(),
    });
    toast.success("Updated!");
    setEditingReview(null);
    fetchData();
    updateSubjectRating(subjectId);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
          Comments{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            & Reviews
          </span>
        </h2>
      </div>

      <div className="space-y-6">
        {currentItems.map((review) => (
          <div
            key={review.id}
            className="p-4 border rounded-lg bg-white shadow flex justify-between"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <strong>{review.name}</strong> |{" "}
                {subjects.find((s) => s.id === review.subjectId)?.title ||
                  `Course ID: ${review.subjectId}`}
              </p>

              {editingReview?.id === review.id ? (
                <>
                  <textarea
                    className="w-full mt-2 p-2 border rounded"
                    value={editingReview.comment}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        comment: e.target.value,
                      })
                    }
                  />
                  <div className="flex mt-2 space-x-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setEditingReview({
                            ...editingReview,
                            rating: value,
                          })
                        }
                      >
                        <FaStar
                          className={`text-xl ${
                            value <= editingReview.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1">{review.comment}</p>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="ml-4 flex flex-col justify-center space-y-2">
              {editingReview?.id === review.id ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(review)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  <FaEdit />
                </button>
              )}

              <button
                onClick={() => handleDelete(review.id, review.subjectId)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-10">
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

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`w-10 h-10 p-2 rounded-lg ${
                currentPage === pageNumber
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {pageNumber}
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
      )}

      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminReviews;
