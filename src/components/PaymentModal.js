import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentModal = ({ isOpen, onClose, subject, user, onSuccess }) => {
  const [card, setCard] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    if (card.length < 8) {
      toast.error("Invalid card number");
      return;
    }

    setLoading(true);
    try {
      const newEnrollment = {
        userId: user.id,
        subjectId: subject.id,
        price: subject.price,
        date: new Date().toISOString().slice(0, 10),
        progress: 0,
        completedLessons: [],
      };

      await axios.post("http://localhost:5000/enrollments", newEnrollment);
      toast.success("Payment successful!");
      onSuccess(); // update state from parent
      onClose();
    } catch (err) {
      toast.error("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Pay for "{subject.title}"
        </h2>
        <p className="mb-3 text-gray-600 dark:text-gray-300">
          Total: <strong>{subject.price.toLocaleString()}đ</strong>
        </p>
        <input
          type="text"
          placeholder="Enter fake card number"
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={card}
          onChange={(e) => setCard(e.target.value)}
        />
        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
