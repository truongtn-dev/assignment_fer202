import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const LessonList = ({ subject }) => {
  const [enrollment, setEnrollment] = useState(null);
  const [progress, setProgress] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEnrollment = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/enrollments?userId=${user.id}&subjectId=${subject.id}`
      );
      const data = res.data[0];
      setEnrollment(data);

      const total = subject.modules.length;
      const done = data.completedLessons?.length || 0;
      setProgress(total > 0 ? Math.round((done / total) * 100) : 0);
    } catch (err) {
      console.error("Error fetching enrollment:", err);
    }
  };

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/enrollments?userId=${user.id}&subjectId=${subject.id}`
        );
        const data = res.data[0];
        setEnrollment(data);

        const total = subject.modules.length;
        const done = data.completedLessons?.length || 0;
        setProgress(total > 0 ? Math.round((done / total) * 100) : 0);
      } catch (err) {
        console.error("Error fetching enrollment:", err);
      }
    };

    if (user) fetchEnrollment();
  }, [user, subject.id, subject.modules.length]);

  const markLessonComplete = async (lessonId) => {
    if (!enrollment) return;

    const completed = enrollment.completedLessons || [];
    if (completed.includes(lessonId)) return;

    const updated = [...completed, lessonId];

    try {
      await axios.put(`http://localhost:5000/enrollments/${enrollment.id}`, {
        ...enrollment,
        completedLessons: updated,
      });
      toast.success("Marked as completed!");
      fetchEnrollment(); // refresh
    } catch (err) {
      toast.error("Failed to update progress.");
    }
  };

  if (!enrollment) {
    return (
      <p className="text-gray-500">
        You need to register to access lesson progress.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-2">
          <div
            className="bg-green-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">{progress}% completed</p>
      </div>

      <ul className="space-y-3">
        {subject.modules.map((lesson, index) => {
          const isDone = enrollment.completedLessons?.includes(lesson.lessonId);
          return (
            <li
              key={lesson.lessonId}
              className={`flex items-center justify-between px-4 py-3 rounded-lg shadow transition-all duration-300 ${
                isDone
                  ? "bg-green-50 border border-green-200"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <span
                className={`font-medium ${
                  isDone ? "text-green-700" : "text-gray-800"
                }`}
              >
                {index + 1}. {lesson.title}
              </span>

              {!isDone ? (
                <button
                  onClick={() => markLessonComplete(lesson.lessonId)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark as done
                </button>
              ) : (
                <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Completed
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LessonList;
