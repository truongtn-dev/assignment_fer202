import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";

const colorMap = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-100",
    icon: "text-blue-500/60",
    hoverIcon: "group-hover:text-white",
    hoverBg: "group-hover:bg-blue-500",
  },
  green: {
    gradient: "from-green-500 to-green-600",
    bg: "bg-green-100",
    icon: "text-green-500/60",
    hoverIcon: "group-hover:text-white",
    hoverBg: "group-hover:bg-green-500",
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-100",
    icon: "text-purple-500/60",
    hoverIcon: "group-hover:text-white",
    hoverBg: "group-hover:bg-purple-500",
  },
  orange: {
    gradient: "from-orange-500 to-orange-600",
    bg: "bg-orange-100",
    icon: "text-orange-500/60",
    hoverIcon: "group-hover:text-white",
    hoverBg: "group-hover:bg-orange-500",
  },
  teal: {
    gradient: "from-teal-500 to-teal-600",
    bg: "bg-teal-100",
    icon: "text-teal-500/60",
    hoverIcon: "group-hover:text-white",
    hoverBg: "group-hover:bg-teal-500",
  },
};

const HowItWorks = () => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/howSteps")
      .then((res) => res.json())
      .then((data) => setSteps(data))
      .catch((err) => {
        console.error("Failed to fetch howSteps:", err);
      });
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process ensures you get the most out of your
            learning journey. From your first trial class to achieving your
            goals, we guide you every step of the way.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-16">
              {steps.map((step, index) => {
                const Icon = LucideIcons[step.icon] || LucideIcons.Calendar;
                const color = colorMap[step.color] || colorMap.blue;
                return (
                  <div key={index} className="flex items-center group">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${color.gradient} rounded-full flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                        <span className="text-sm font-bold text-gray-700">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-8 h-8 text-gray-300 mx-8" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = LucideIcons[step.icon] || LucideIcons.Calendar;
              const color = colorMap[step.color] || colorMap.blue;

              return (
                <div key={index} className="flex items-start space-x-6 group">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${color.hoverBg}`}
                    >
                      <Icon
                        className={`w-8 h-8 ${color.icon} ${color.hoverIcon} transition-colors duration-300`}
                      />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                      <span className="text-sm font-bold text-gray-700">
                        {index + 1}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-20 left-8 w-0.5 h-16 bg-gray-200"></div>
                    )}
                  </div>

                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Your Journey Today
            </h3>
            <p className="text-gray-600 mb-6">
              Experience the power of personalized learning with our proven
              methodology.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
