import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import { ArrowLeft } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReviewSection from "./ReviewSection";

const SubjectDetail = ({ onOpenTrialModal, onOpenCounsellorModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [relatedSubjects, setRelatedSubjects] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/subjects?id=${id}`)
      .then((res) => setSubject(res.data[0]))
      .catch((err) => console.error("Subject not found", err));

    axios
      .get(`http://localhost:5000/subjects`)
      .then((res) => {
        const related = res.data.filter((course) => course.id !== id);
        setRelatedSubjects(related.slice(0, 4));
      })
      .catch((err) => console.error("Error fetching related subjects", err));
  }, [id]);

  const handleEnroll = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "user") {
      alert("Vui lòng đăng nhập bằng tài khoản học viên để đăng ký.");
      return;
    }

    const newEnrollment = {
      userId: user.id,
      subjectId: subject.id,
      price: subject.price,
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      await axios.post("http://localhost:5000/enrollments", newEnrollment);
      alert("🎉 Đăng ký khóa học thành công!");
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err);
      alert("❌ Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  if (!subject)
    return (
      <div className="text-center py-32 text-lg text-gray-500">Loading...</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
      <button
        onClick={() => navigate("/")}
        className="mb-10 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      <div className="grid md:grid-cols-2 gap-14 items-start">
        {/* Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition duration-500 ease-in-out">
          <img
            src={`/images/${subject.image}`}
            alt={subject.title}
            className="w-full object-cover h-full max-h-[500px]"
          />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-snug">
            {subject.title}
          </h1>

          {subject.badge && (
            <div className="mb-4 inline-block px-4 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full shadow">
              {subject.badge}
            </div>
          )}

          <div className="space-y-3 text-[17px] text-gray-700 leading-relaxed">
            <p>
              <span className="font-semibold">Lessons:</span>{" "}
              {subject.lessons || 0} lessons
            </p>
            <p>
              <span className="font-semibold">Students:</span>{" "}
              {subject.students || 0} students
            </p>
            <p className="flex items-center gap-1">
              <span className="font-semibold">Rating:</span>
              <span className="text-yellow-500 font-semibold flex items-center gap-1">
                {subject.rating || 0}
                <AiFillStar size={16} />
              </span>
              <span className="text-gray-500">
                ({subject.reviews || 0} ratings)
              </span>
            </p>
            <p>
              <span className="font-semibold">Schedule:</span>{" "}
              {subject.schedule} – {subject.time}
            </p>
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {subject.startDate}
            </p>
            <p>
              <span className="font-semibold">Teaching Team:</span>{" "}
              {subject.team}
            </p>
          </div>

          <div className="mt-6 mb-8 flex items-center gap-4 flex-wrap">
            <p className="text-3xl font-extrabold text-red-600">
              {subject.price.toLocaleString()}đ
            </p>
            <p className="text-xl text-gray-400 line-through">
              {subject.oldPrice.toLocaleString()}đ
            </p>
            <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full shadow">
              {subject.discount}
            </span>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleEnroll}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              Register to study
            </button>
            <button
              onClick={onOpenCounsellorModal}
              className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition duration-300 shadow-sm hover:shadow-md"
            >
              Contact Counsellor
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ReviewSection subjectId={subject.id} />
      </div>

      <div className="mt-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Related{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Course
            </span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedSubjects.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl shadow-md hover:scale-[1.02] transition duration-300 ease-in-out"
            >
              <img
                src={`/images/${course.image}`}
                alt={course.title}
                className="w-full h-56 object-cover rounded-t-3xl"
              />
              <div className="p-4">
                <h3
                  onClick={() => navigate(`/subjects/${course.id}`)}
                  className="text-xl font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
                >
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {course.schedule} – {course.time}
                </p>
                <p className="text-lg font-bold text-red-600">
                  {course.price.toLocaleString()}đ
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default SubjectDetail;
