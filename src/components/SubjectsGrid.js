import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillStar } from "react-icons/ai";

const SubjectsGrid = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage] = useState(8);
  const [filters, setFilters] = useState({
    priceRange: "all",
    lessonCount: "all",
    rating: "all",
    studentCount: "all",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/subjects")
      .then((res) => {
        setSubjects(res.data);
        setFilteredSubjects(res.data);
      })
      .catch(() => toast.error("Failed to load subjects"));
  }, []);

  useEffect(() => {
    let result = [...subjects];

    if (filters.priceRange !== "all") {
      result = result.filter((subject) => {
        const price = subject.price || 0;
        if (filters.priceRange === "under-2m") return price < 2_000_000;
        if (filters.priceRange === "2m-5m")
          return price >= 2_000_000 && price <= 5_000_000;
        if (filters.priceRange === "above-5m") return price > 5_000_000;
        return true;
      });
    }

    if (filters.lessonCount !== "all") {
      result = result.filter((subject) => {
        const lessons = subject.lessons || 0;
        if (filters.lessonCount === "under-50") return lessons < 50;
        if (filters.lessonCount === "50-100")
          return lessons >= 50 && lessons <= 100;
        if (filters.lessonCount === "above-100") return lessons > 100;
        return true;
      });
    }

    if (filters.rating !== "all") {
      result = result.filter((subject) => {
        const rating = subject.rating || 0;
        if (filters.rating === "4.5-up") return rating >= 4.5;
        if (filters.rating === "4-4.5") return rating >= 4 && rating < 4.5;
        if (filters.rating === "below-4") return rating < 4;
        return true;
      });
    }

    if (filters.studentCount !== "all") {
      result = result.filter((subject) => {
        const students = subject.students || 0;
        if (filters.studentCount === "under-20") return students < 20;
        if (filters.studentCount === "20-50")
          return students >= 20 && students <= 50;
        if (filters.studentCount === "above-50") return students > 50;
        return true;
      });
    }

    setFilteredSubjects(result);
    setCurrentPage(1);
  }, [filters, subjects]);

  const handleClick = (id) => {
    navigate(`/subjects/${id}`);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: "all",
      lessonCount: "all",
      rating: "all",
      studentCount: "all",
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );
  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Featured{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Courses
          </span>
        </h2>
      </div>

      <div className="mb-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <i className="bi bi-funnel-fill text-blue-600 text-lg" />
            Filter Courses
          </h4>
          <button
            onClick={resetFilters}
            className="text-sm px-4 py-1.5 bg-gray-100 hover:bg-gray-200 transition rounded-full"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tuition Fee
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange("priceRange", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="under-2m">Under 2M</option>
              <option value="2m-5m">2M - 5M</option>
              <option value="above-5m">Above 5M</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Number of Lessons
            </label>
            <select
              value={filters.lessonCount}
              onChange={(e) =>
                handleFilterChange("lessonCount", e.target.value)
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="under-50">Under 50</option>
              <option value="50-100">50 - 100</option>
              <option value="above-100">Above 100</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange("rating", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="4.5-up">From 4.5 stars</option>
              <option value="4-4.5">4.0 - 4.5 stars</option>
              <option value="below-4">Below 4.0 stars</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Student Count
            </label>
            <select
              value={filters.studentCount}
              onChange={(e) =>
                handleFilterChange("studentCount", e.target.value)
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="under-20">Under 20 students</option>
              <option value="20-50">20 - 50 students</option>
              <option value="above-50">Above 50 students</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-500 italic">
        {filteredSubjects.length} result
        {filteredSubjects.length !== 1 ? "s" : ""} found
      </div>

      {currentSubjects.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No courses found for the selected filters.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {currentSubjects.map((subject) => (
          <div
            key={subject.id}
            className="cursor-pointer rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition"
            onClick={() => handleClick(subject.id)}
          >
            <img
              src={`/images/${subject.image}`}
              alt={subject.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-3 space-y-1">
              <h3 className="text-sm font-semibold line-clamp-2 h-[3rem]">
                {subject.title}
              </h3>
              <div className="flex items-center text-xs text-gray-500">
                <span>{subject.lessons || 0} lessons</span>
                <span className="mx-2">•</span>
                <span>{subject.students || 0} students</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 gap-2">
                <span className="font-semibold">Rating:</span>
                <span className="flex items-center text-yellow-500 font-semibold gap-1">
                  {subject.rating || 0}
                  <AiFillStar size={16} />
                </span>
                <span>({subject.reviews || 0} ratings)</span>
              </div>
              <div className="text-xs text-gray-400">
                Start: {subject.startDate}
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="text-sm text-red-600 font-semibold">
                  {subject.price.toLocaleString()}đ
                  <span className="line-through ml-1 text-gray-400 text-xs">
                    {subject.oldPrice?.toLocaleString()}đ
                  </span>
                </div>
                <span className="text-[10px] px-2 py-[2px] bg-red-100 text-red-600 rounded-full">
                  {subject.discount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length > 0 && (
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
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
            )
          )}
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
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </section>
  );
};

export default SubjectsGrid;
