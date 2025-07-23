import React, { useState, useEffect } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [navItems, setNavItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/navItems")
      .then((res) => setNavItems(res.data))
      .catch((err) => console.error("Error fetching navItems:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const current = navItems.find(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current.id);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">LearnWithUs</h1>
              <p className="text-xs text-gray-600">1-on-1 Learning Platform</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? "text-blue-600"
                    : isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-gray-800 hover:text-blue-600"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Hi, {user.name || user.email}
                </span>

                {user.role === "user" && (
                  <button
                    onClick={() => navigate("/my-courses")}
                    className="px-4 py-2 text-sm rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    My Courses
                  </button>
                )}

                {user.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  onClick={handleLogoutClick}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-md rounded-b-2xl border-t border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.href)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="px-4 pt-2 space-y-2">
              {user ? (
                <>
                  <div className="text-sm text-gray-700">
                    Hi, {user.name || user.email}
                  </div>

                  {user.role === "user" && (
                    <button
                      onClick={() => {
                        navigate("/my-courses");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      My Courses
                    </button>
                  )}

                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      Dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogoutClick}
                    className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 text-sm font-semibold rounded-md bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
