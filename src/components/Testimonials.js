import React, { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/testimonials")
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch((err) => {
        console.error("Failed to fetch testimonials:", err);
      });
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Student{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our students who have transformed their careers and
            achieved their learning goals with our personalized approach.
          </p>
        </div>

        {current && (
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-blue-100" />

              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                  “{current.content}”
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="text-lg font-bold text-gray-900 mr-2">
                          {current.name}
                        </h4>
                        <span className="text-gray-600">{current.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={prevTestimonial}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600">Course Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
