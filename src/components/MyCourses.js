import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBook, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-toastify";

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [totalPrice, setTotalPrice] = useState(0);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      return null;
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [enrollRes, subjectRes] = await Promise.all([
        axios.get(`http://localhost:5000/enrollments?userId=${user.id}`),
        axios.get("http://localhost:5000/subjects"),
      ]);
      setMyCourses(enrollRes.data);
      setAllSubjects(subjectRes.data);
    } catch (err) {
      toast.error("Failed to fetch data.");
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateTotalPrice = useCallback(() => {
    const now = new Date();
    let filtered = myCourses;

    if (filterType === "day") {
      filtered = myCourses.filter(
        (e) => e.date === now.toISOString().slice(0, 10)
      );
    } else if (filterType === "month") {
      const currentMonth = now.toISOString().slice(0, 7);
      filtered = myCourses.filter((e) => e.date.startsWith(currentMonth));
    } else if (filterType === "year") {
      const currentYear = now.getFullYear();
      filtered = myCourses.filter((e) =>
        e.date.startsWith(currentYear.toString())
      );
    }

    const total = filtered.reduce((acc, item) => acc + (item.price || 0), 0);
    setTotalPrice(total);
  }, [myCourses, filterType]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const getSubjectInfo = (subjectId) => {
    return allSubjects.find((s) => s.id.toString() === subjectId.toString());
  };

  const totalPages = Math.ceil(myCourses.length / itemsPerPage);
  const paginatedCourses = myCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getLatestDate = () => {
    if (myCourses.length === 0) return "-";
    const sorted = [...myCourses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sorted[0].date;
  };

  const handleClickSubject = (subjectId) => {
    navigate(`/subjects/${subjectId}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          My{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Courses
          </span>
        </h2>
      </div>
      {myCourses.length === 0 ? (
        <p className="text-center text-gray-500">
          You have not enrolled in any courses.
        </p>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Overview</h2>
              <p className="flex items-center gap-2 text-gray-700">
                <FaBook className="text-blue-500" /> Total courses:{" "}
                <span className="font-bold">{myCourses.length}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaCalendarAlt className="text-purple-500" /> Latest:{" "}
                <span className="font-semibold">{getLatestDate()}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaMoneyBillWave className="text-green-500" /> Total cost:
                <span className="text-red-600 font-bold">
                  {" "}
                  {totalPrice.toLocaleString()}₫
                </span>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <label className="text-gray-600 font-medium mb-2 block">
                Filter by time
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="day">Today</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </div>
          </div>

          <div className="col-span-3">
            <p className="mb-4 text-sm text-gray-500">
              Showing {paginatedCourses.length} / {myCourses.length} courses
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((enroll) => {
                const subject = getSubjectInfo(enroll.subjectId);
                if (!subject) return null;

                return (
                  <div
                    key={enroll.id}
                    onClick={() => handleClickSubject(subject.id)}
                    className="cursor-pointer bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
                  >
                    <img
                      src={`/images/${subject.image}`}
                      alt={subject.title}
                      className="rounded-xl h-40 w-full object-cover mb-4"
                    />
                    <h2 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                      {subject.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      {subject.schedule} – {subject.time}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Enrolled on: {enroll.date}
                    </p>
                    <p className="text-red-600 font-semibold">
                      Price: {subject.price.toLocaleString()}₫
                    </p>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
                )}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
