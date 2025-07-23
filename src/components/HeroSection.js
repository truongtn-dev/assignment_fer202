import React, { useEffect, useState } from "react";
import { Play, Star } from "lucide-react";

const HeroSection = ({ onOpenTrialModal }) => {
  const [stats, setStats] = useState({
    students: "",
    rating: "",
    mentors: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="flex items-center bg-orange-100 rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-orange-500 mr-2" />
                <span className="text-orange-700 text-sm font-medium">
                  Rated #1 Learning Platform
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Master Your Skills with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                1-on-1 Personalized
              </span>{" "}
              Classes
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Get tailored lessons, expert mentors, and 24/7 AI support to boost
              your learning journey. Transform your potential into expertise
              with our personalized approach.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onOpenTrialModal}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Book a Free Trial
              </button>

              <button className="flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.students}
                </div>
                <div className="text-sm text-gray-600">Students Taught</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.rating}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.mentors}
                </div>
                <div className="text-sm text-gray-600">Expert Mentors</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://dl.dropbox.com/scl/fi/969flx92bpjrg6sc9rznz/3892670.jpg?rlkey=sexydkb5htb9i15yxx3rtqwt4&st=33fei4bi&dl=0"
              alt="Hero Illustration"
              className="w-full h-auto max-w-lg mx-auto lg:mx-0"
              loading="lazy"
            />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-bounce delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
