import React, { useEffect, useState } from "react";
import { FaBookOpen, FaMoneyBillWave, FaQrcode } from "react-icons/fa";

const StudentProfileCard = () => {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchEnrollments(parsed.id);
    }
  }, []);

  const fetchEnrollments = async (userId) => {
    const res = await fetch(
      `http://localhost:5000/enrollments?userId=${userId}`
    );
    const data = await res.json();
    setEnrollments(data);
    const total = data.reduce((acc, item) => acc + (item.price || 0), 0);
    setTotalPaid(total);
  };

  if (!user) return null;

  const qrCodeBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAIQAAACEAQAAAAB5P74KAAABFklEQVR4nL2WMa7DMAxDn4ru1A16/2PlBvQJ+Ad3adGhXwaqKRGQ";

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto mt-10 relative z-10">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src="/images/avatar-default.jpg"
          alt="Avatar"
          className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <p className="flex items-center gap-2 text-gray-700">
          <FaBookOpen className="text-blue-500" /> Courses enrolled:{" "}
          <span className="font-semibold">{enrollments.length}</span>
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <FaMoneyBillWave className="text-green-500" /> Total paid:{" "}
          <span className="text-red-600 font-bold">
            {totalPaid.toLocaleString()}₫
          </span>
        </p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <FaQrcode className="text-gray-600" />
          <span className="text-sm text-gray-600">Your QR Code</span>
        </div>
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR Code"
          className="w-20 h-20"
        />
      </div>

      <div className="mt-6 text-center">
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg text-sm font-semibold shadow hover:opacity-90">
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default StudentProfileCard;
