import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import { toast } from "react-toastify";

const ReviewSection = ({ subjectId }) => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", comment: "", rating: 5 });
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/reviews?subjectId=${subjectId}`
      );
      setReviews(res.data);
    } catch (error) {
      toast.error("Failed to load reviews.");
    }
  }, [subjectId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const updateSubjectRating = async (newReview) => {
    try {
      const allReviews = (
        await axios.get(`http://localhost:5000/reviews?subjectId=${subjectId}`)
      ).data;

      const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = parseFloat((total / allReviews.length).toFixed(1));
      const reviewCount = allReviews.length;

      const subject = (
        await axios.get(`http://localhost:5000/subjects/${subjectId}`)
      ).data;

      await axios.put(`http://localhost:5000/subjects/${subjectId}`, {
        ...subject,
        rating: avgRating,
        reviews: reviewCount,
      });
    } catch (err) {
      toast.error("Failed to update subject rating.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      toast.warning("Please fill out all fields");
      return;
    }

    try {
      setLoading(true);
      const newReview = {
        ...form,
        subjectId,
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:5000/reviews", newReview);

      toast.success("Review submitted!");
      setForm({ name: "", comment: "", rating: 5 });

      await updateSubjectRating(newReview);

      fetchReviews();
    } catch (err) {
      toast.error("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 max-w-7xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Student Reviews</h3>

      {reviews.length === 0 ? (
        <p className="text-gray-500 italic mb-6">No reviews yet.</p>
      ) : (
        <ul className="space-y-6 mb-10">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="bg-gray-50 p-4 rounded-xl shadow-sm border"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-800">{review.name}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <AiFillStar key={i} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md border"
      >
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            rows={4}
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Rating</label>
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
                <AiFillStar />
              </button>
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewSection;
