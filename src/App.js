import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Curriculum from "./components/Curriculum";
import USPSection from "./components/USPSection";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import PricingPlans from "./components/PricingPlans";
import SubjectsGrid from "./components/SubjectsGrid";
import SubjectDetail from "./components/SubjectDetail";
import Footer from "./components/Footer";
import ModalForm from "./components/ModalForm";
import AdminSubjects from "./components/AdminSubjects";
import AdminUsers from "./components/AdminUsers";
import AdminRatings from "./components/AdminRatings";
import Dashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import AdminCalendar from "./components/AdminCalendar";
import AdminReviews from "./components/AdminReviews";
import MyCourses from "./components/MyCourses";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [isCounsellorOpen, setIsCounsellorOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  const RequireAdmin = ({ children }) => {
    const navigate = useNavigate();

    if (isAdmin) return children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page. Admins only.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center animate-fade-in">
        <div className="relative flex flex-col items-center justify-center text-center px-6 py-12 space-y-6">
          <div className="absolute w-64 h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-full blur-[100px] opacity-30 animate-pulse" />

          <div className="z-10 w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center rounded-full shadow-xl animate-bounce-slow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
              <path d="M22 10v6"></path>
              <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
            </svg>
          </div>

          <h1 className="z-10 text-2xl md:text-4xl font-bold text-gray-900 tracking-tight animate-fade-in-slow delay-200">
            Welcome to <span className="text-blue-600">Group 5</span>'s Space
          </h1>

          <p className="z-10 text-gray-500 text-base md:text-lg animate-fade-in-slow delay-400">
            Initializing your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {!isAdminRoute && (
        <Navbar
          onOpenTrialModal={() => setIsTrialOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <section id="home">
                <HeroSection onOpenTrialModal={() => setIsTrialOpen(true)} />
              </section>
              <section id="curriculum">
                <Curriculum />
              </section>
              <section id="uspsection">
                <USPSection />
              </section>
              <section id="how-it-works">
                <HowItWorks />
              </section>
              <section id="testimonials">
                <Testimonials />
              </section>
              <section id="courses">
                <SubjectsGrid />
              </section>
              <section id="pricing">
                <PricingPlans
                  onTrialClick={() => setIsTrialOpen(true)}
                  onCounsellorClick={() => setIsCounsellorOpen(true)}
                />
              </section>
            </>
          }
        />

        <Route
          path="/subjects/:id"
          element={
            <SubjectDetail
              onOpenTrialModal={() => setIsTrialOpen(true)}
              onOpenCounsellorModal={() => setIsCounsellorOpen(true)}
            />
          }
        />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <Dashboard user={user} onLogout={handleLogout} />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <RequireAdmin>
              <AdminSubjects />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <AdminUsers />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/ratings"
          element={
            <RequireAdmin>
              <AdminRatings />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <RequireAdmin>
              <AdminCalendar />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <RequireAdmin>
              <AdminReviews />
            </RequireAdmin>
          }
        />
        <Route path="/my-courses" element={<MyCourses />} />
      </Routes>

      <Footer />

      <ModalForm
        isOpen={isTrialOpen}
        onClose={() => setIsTrialOpen(false)}
        title="Book Your Free Trial"
        type="trial"
      />
      <ModalForm
        isOpen={isCounsellorOpen}
        onClose={() => setIsCounsellorOpen(false)}
        title="Talk to Our Counsellor"
        type="counsellor"
      />
    </div>
  );
}

export default App;
