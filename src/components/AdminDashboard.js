import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  MessageCircle,
  BarChart,
  Star,
  LogOut,
  Construction,
} from "lucide-react";
import AdminUsers from "./AdminUsers";
import AdminSubjects from "./AdminSubjects";
import AdminRatings from "./AdminRatings";
import AdminCalendar from "./AdminCalendar";
import AdminReviews from "./AdminReviews";
import AdminDashboardStatistics from "./AdminDashboardStatistics";

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("users");

  const menuItems = [
    { id: "users", label: "Account Management", icon: <Users size={18} /> },
    {
      id: "subjects",
      label: "Course Management",
      icon: <BookOpen size={18} />,
    },
    { id: "ratings", label: "Rating Management", icon: <Star size={18} /> },
    {
      id: "calendar",
      label: "Calendar View",
      icon: <Calendar size={18} />,
    },
    {
      id: "reviews",
      label: "Comments & Reviews",
      icon: <MessageCircle size={18} />,
    },
    {
      id: "analytics",
      label: "Dashboard Statistics",
      icon: <BarChart size={18} />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <AdminUsers />;
      case "subjects":
        return <AdminSubjects />;
      case "ratings":
        return <AdminRatings />;
      case "calendar":
        return <AdminCalendar />;
      case "reviews":
        return <AdminReviews />;
      case "analytics":
        return <AdminDashboardStatistics />;
      default:
        return (
          <div className="text-gray-600 p-6 text-lg flex items-center">
            <Construction size={24} className="text-yellow-500 mr-3" />
            Feature in development...
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-teal-600 text-white p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>

        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition ${
                activeTab === item.id
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 mt-8 text-sm bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
