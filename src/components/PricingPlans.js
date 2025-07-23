import React, { useEffect, useState } from "react";
import { Check, Star, Zap, Crown } from "lucide-react";

const iconMap = {
  Zap: Zap,
  Star: Star,
  Crown: Crown,
};

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/pricingPlans")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) => {
        console.error("Failed to load pricing plans:", err);
      });
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Learning Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible pricing options designed to fit your learning journey. All
            plans include our core features with varying levels of support and
            resources.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = iconMap[plan.icon] || Zap;

            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  plan.popular
                    ? "border-green-200 ring-4 ring-green-100"
                    : "border-gray-100"
                } overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 font-semibold text-sm">
                    MOST POPULAR
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? "pt-12" : ""}`}>
                  <div className="text-center mb-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                      <span className="text-sm text-gray-500 line-through mr-2">
                        {plan.originalPrice}/month
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Save{" "}
                        {Math.round(
                          (1 -
                            parseInt(plan.price.slice(1)) /
                              parseInt(plan.originalPrice.slice(1))) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <div key={i} className="flex items-center opacity-50">
                        <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                          <div className="w-4 h-0.5 bg-gray-400" />
                        </div>
                        <span className="text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                      plan.popular
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Not sure which plan is right for you?
            </h3>
            <p className="text-gray-600 mb-6">
              Start with our free trial to experience our teaching methodology
              and find the perfect fit for your learning goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200">
                Start Free Trial
              </button>
              <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                Compare All Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
