import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  FaMoneyBillWave,
  FaBook,
  FaStar,
  FaUserGraduate,
} from "react-icons/fa";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const AdminDashboardStatistics = () => {
  const [subjects, setSubjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    fetch("http://localhost:5000/subjects")
      .then((res) => res.json())
      .then(setSubjects);
    fetch("http://localhost:5000/reviews")
      .then((res) => res.json())
      .then(setReviews);
    fetch("http://localhost:5000/enrollments")
      .then((res) => res.json())
      .then(setEnrollments);
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const totalCourses = subjects.length;
  const totalReviews = reviews.length;
  const totalRevenue = enrollments.reduce((sum, e) => sum + (e.price || 0), 0);
  const totalEnrollments = enrollments.length;
  const freeCourses = subjects.filter((s) => s.price === 0).length;

  const highRatedCourses = subjects.filter((s) => {
    const subjectReviews = reviews.filter((r) => r.subjectId === s.id);
    const avg =
      subjectReviews.length > 0
        ? subjectReviews.reduce((sum, r) => sum + r.rating, 0) /
          subjectReviews.length
        : 0;
    return avg > 4.5;
  }).length;

  const avgStudentsPerCourse =
    totalCourses > 0 ? (enrollments.length / totalCourses).toFixed(1) : 0;

  const topRevenueCourses = [...subjects]
    .sort((a, b) => b.price * b.students - a.price * a.students)
    .slice(0, 5)
    .map((s) => ({ name: s.title, revenue: s.price * (s.students || 0) }));

  const courseRatings = subjects.map((subject) => {
    const subjectReviews = reviews.filter((r) => r.subjectId === subject.id);
    const avg =
      subjectReviews.length > 0
        ? (
            subjectReviews.reduce((sum, r) => sum + r.rating, 0) /
            subjectReviews.length
          ).toFixed(1)
        : 0;
    return { title: subject.title, avgRating: Number(avg) };
  });

  const monthlyStudents = {};
  enrollments.forEach((e) => {
    const month = new Date(e.date).toISOString().slice(0, 7);
    monthlyStudents[month] = (monthlyStudents[month] || 0) + 1;
  });
  const monthlyStudentsChart = Object.entries(monthlyStudents).map(
    ([month, value]) => ({ month, value })
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .slice(0, 7);
  const currentMonthRevenue = enrollments
    .filter((e) => new Date(e.date).toISOString().slice(0, 7) === currentMonth)
    .reduce((sum, e) => sum + (e.price || 0), 0);
  const lastMonthRevenue = enrollments
    .filter((e) => new Date(e.date).toISOString().slice(0, 7) === lastMonth)
    .reduce((sum, e) => sum + (e.price || 0), 0);
  const revenueComparison = [
    { name: "Last Month", value: lastMonthRevenue },
    { name: "This Month", value: currentMonthRevenue },
  ];

  const latestEnrollments = enrollments
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map((e) => {
      const user = users.find((u) => u.id?.toString() === e.userId?.toString());
      const subject = subjects.find(
        (s) => s.id?.toString() === e.subjectId?.toString()
      );
      return {
        student: user?.name || "Unknown",
        course: subject?.title || "Unknown",
        date: new Date(e.date).toLocaleDateString("vi-VN"),
        price: e.price.toLocaleString("vi-VN"),
      };
    });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(latestEnrollments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "enrollments.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Latest Enrollments", 20, 20);
    autoTable(doc, {
      head: [["Student", "Course", "Date", "Price"]],
      body: latestEnrollments.map((e) => [
        e.student,
        e.course,
        e.date,
        e.price,
      ]),
      startY: 30,
    });
    doc.save("enrollments.pdf");
  };

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-10 pb-20">
      <button
        onClick={handleBackToHome}
        className="mb-10 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Dashboard{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Statistics
          </span>
        </h2>
      </div>

      <div className="flex justify-end items-center mb-4">
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition"
        >
          Export Excel
        </button>
        <button
          onClick={exportToPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          icon={<FaBook />}
          label="Total Courses"
          value={totalCourses}
          color="text-blue-600"
        />
        <StatCard
          icon={<FaStar />}
          label="Total Reviews"
          value={totalReviews}
          color="text-yellow-600"
        />
        <StatCard
          icon={<FaMoneyBillWave />}
          label="Total Revenue"
          value={`${totalRevenue.toLocaleString("vi-VN")}đ`}
          color="text-red-600"
        />
        <StatCard
          icon={<FaUserGraduate />}
          label="Total Enrollments"
          value={totalEnrollments}
          color="text-indigo-600"
        />
        <StatCard
          icon={<FaBook />}
          label="Free Courses"
          value={freeCourses}
          color="text-purple-600"
        />
        <StatCard
          icon={<FaStar />}
          label="High Rated Courses (>4.5)"
          value={highRatedCourses}
          color="text-yellow-600"
        />
        <StatCard
          icon={<FaUserGraduate />}
          label="Avg Students/Course"
          value={avgStudentsPerCourse}
          color="text-green-600"
        />
      </div>

      <ChartCard title="Top 5 Courses by Revenue">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRevenueCourses}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => `${v.toLocaleString("vi-VN")}đ`} />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Average Rating per Course">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={courseRatings}>
            <PolarGrid />
            <PolarAngleAxis dataKey="title" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar
              dataKey="avgRating"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Students Growth Over Time">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyStudentsChart}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00C49F" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Revenue: This Month vs Last Month">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={revenueComparison}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {revenueComparison.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(v) => `${v.toLocaleString("vi-VN")}đ`} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Enrollments Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Latest Enrollments</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Student</th>
              <th className="p-2">Course</th>
              <th className="p-2">Date</th>
              <th className="p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {latestEnrollments.map((e, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium text-gray-800">{e.student}</td>
                <td className="p-2">{e.course}</td>
                <td className="p-2">{e.date}</td>
                <td className="p-2">{e.price}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-xl shadow flex items-center space-x-4 transform hover:scale-105 transition">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow transform hover:scale-105 transition">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default AdminDashboardStatistics;
