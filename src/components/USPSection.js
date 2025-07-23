import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

const colorMap = {
  blue: {
    bg: "bg-blue-100",
    icon: "text-blue-500/60",
    border: "border-blue-200",
    hoverBg: "group-hover:bg-blue-500",
    hoverIcon: "group-hover:text-white",
  },
  green: {
    bg: "bg-green-100",
    icon: "text-green-500/60",
    border: "border-green-200",
    hoverBg: "group-hover:bg-green-500",
    hoverIcon: "group-hover:text-white",
  },
  purple: {
    bg: "bg-purple-100",
    icon: "text-purple-500/60",
    border: "border-purple-200",
    hoverBg: "group-hover:bg-purple-500",
    hoverIcon: "group-hover:text-white",
  },
  orange: {
    bg: "bg-orange-100",
    icon: "text-orange-500/60",
    border: "border-orange-200",
    hoverBg: "group-hover:bg-orange-500",
    hoverIcon: "group-hover:text-white",
  },
  teal: {
    bg: "bg-teal-100",
    icon: "text-teal-500/60",
    border: "border-teal-200",
    hoverBg: "group-hover:bg-teal-500",
    hoverIcon: "group-hover:text-white",
  },
  red: {
    bg: "bg-red-100",
    icon: "text-red-500/60",
    border: "border-red-200",
    hoverBg: "group-hover:bg-red-500",
    hoverIcon: "group-hover:text-white",
  },
};

const USPSection = () => {
  const [usps, setUsps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/usps")
      .then((res) => res.json())
      .then((data) => setUsps(data))
      .catch((err) => {
        console.error("Failed to fetch usps:", err);
      });
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our unique blend of personalized
            attention, cutting-edge technology, and proven teaching
            methodologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usps.map((usp, index) => {
            const Icon = LucideIcons[usp.icon] || LucideIcons.Users;
            const color = colorMap[usp.color] || colorMap.blue;

            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${color.border}`}
              >
                <div
                  className={`w-16 h-16 ${color.bg} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${color.hoverBg}`}
                >
                  <Icon
                    className={`w-8 h-8 ${color.icon} ${color.hoverIcon} transition-colors duration-300`}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {usp.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {usp.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Learning Experience?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of successful students who have already accelerated
              their learning with our platform.
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">4.9/5</div>
                <div className="text-sm text-gray-600">Student Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSection;
