import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LearningPath = () => {
  const [subjects, setSubjects] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [subRes, enrollRes] = await Promise.all([
        axios.get("http://localhost:5000/subjects"),
        axios.get(`http://localhost:5000/enrollments?userId=${user.id}`),
      ]);
      setSubjects(subRes.data);
      const latestEnrollments = Object.values(
        enrollRes.data.reduce((acc, cur) => {
          acc[cur.subjectId] = cur; // override duplicates by subjectId
          return acc;
        }, {})
      );
      setEnrollments(latestEnrollments);
    };
    fetchData();
  }, [user]);

  const getLearnedSubjectIds = () => {
    return enrollments.map((e) => parseInt(e.subjectId));
  };

  const getRecommendedSubjects = () => {
    const learnedIds = getLearnedSubjectIds();
    return subjects
      .filter((s) => !learnedIds.includes(s.id))
      .sort(
        (a, b) => b.rating - a.rating || a.startDate.localeCompare(b.startDate)
      )
      .slice(0, 4);
  };

  const handleLearnNow = (id) => {
    navigate(`/subjects/${id}`);
  };

  const getProgressPercent = (subjectId) => {
    const enrollment = enrollments.find(
      (e) => parseInt(e.subjectId) === parseInt(subjectId)
    );
    const subject = subjects.find((s) => s.id === parseInt(subjectId));
    const completed = enrollment?.completedLessons?.length || 0;
    const total = subject?.modules?.length || 1;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Your Personalized Learning Path
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Based on your progress, here are the next recommended courses for you.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getRecommendedSubjects().map((course) => {
          const enrolled = enrollments.find(
            (e) => parseInt(e.subjectId) === course.id
          );
          const progress = getProgressPercent(course.id);

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              <img
                src={`/images/${course.image}`}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {course.schedule} – {course.time}
                </p>
                <p className="text-sm text-gray-400 mb-3">
                  Level: {course.level || "-"}
                </p>

                {enrolled ? (
                  <>
                    <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Progress: {progress}%
                    </p>
                    <button
                      onClick={() => handleLearnNow(course.id)}
                      className="w-full py-2 px-4 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleLearnNow(course.id)}
                    className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    Learn Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;
