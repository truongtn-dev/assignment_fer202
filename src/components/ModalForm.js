import React, { useState } from "react";
import { X, Calendar, User, Mail, BookOpen, Clock, Phone } from "lucide-react";

const ModalForm = ({ isOpen, onClose, title, type }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    timeSlot: "",
    phone: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjects = [
    "Web Development",
    "Data Science",
    "Digital Marketing",
    "UI/UX Design",
    "Mobile Development",
    "Machine Learning",
    "Python Programming",
    "JavaScript",
    "Other",
  ];

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
  ];

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone) => /^[\d+\-\s]{7,15}$/.test(phone);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!isValidEmail(formData.email)) {
      errors.email = "Valid email is required";
    }

    if (!isValidPhone(formData.phone)) {
      errors.phone = "Valid phone number is required";
    }

    if (type === "trial") {
      if (!formData.subject) {
        errors.subject = "Please select a subject";
      }
      if (!formData.timeSlot) {
        errors.timeSlot = "Please select a time slot";
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/formSubmissions");
      const submissions = await res.json();
      const maxId = submissions.length
        ? Math.max(...submissions.map((s) => s.id || 0))
        : 0;
      const newId = maxId + 1;

      const payload = {
        id: newId,
        ...formData,
        type,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:5000/formSubmissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          timeSlot: "",
          phone: "",
          message: "",
        });
        setFormErrors({});
        onClose();
      }, 3000);
    } catch (error) {
      alert("There was a problem submitting the form. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Request Submitted!
            </h3>
            <p className="text-gray-600">
              {type === "trial"
                ? "We'll contact you within 24 hours to schedule your free trial class."
                : "Our counsellor will reach out to you within 2 hours."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
            noValidate
          >
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
                required
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email address"
                required
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  formErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your phone number"
                required
              />
              {formErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
              )}
            </div>

            {type === "trial" && (
              <>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Preferred Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.subject ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {formErrors.subject && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Preferred Time Slot
                  </label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      formErrors.timeSlot ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select a time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {formErrors.timeSlot && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.timeSlot}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell us about your learning goals or any specific questions..."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : type === "trial" ? (
                  "Book Free Trial"
                ) : (
                  "Request Callback"
                )}
              </button>
            </div>
          </form>
        )}
        {!isSubmitted && (
          <div className="mt-4 px-6 pb-6">
            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our terms of service and
              privacy policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalForm;
