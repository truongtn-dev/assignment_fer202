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

function App() {
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [isCounsellorOpen, setIsCounsellorOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
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
