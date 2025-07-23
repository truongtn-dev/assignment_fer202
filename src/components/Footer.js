import React from "react";
import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-gray-900 text-gray-300 pt-16 pb-10 px-6 md:px-12 relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255 255 255 / 0.05) 2px, transparent 3px),
        radial-gradient(circle at 80% 80%, rgba(255 255 255 / 0.05) 2px, transparent 3px),
        linear-gradient(rgba(255 255 255 / 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255 255 255 / 0.02) 1px, transparent 1px)`,
        backgroundSize: `50px 50px, 50px 50px, 10px 10px, 10px 10px`,
        backgroundRepeat: "repeat",
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">EdTech</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Empowering learners worldwide with personalized mentorship,
            expert-designed curriculum, and 24/7 support. Learn. Grow. Succeed.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/#home" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/#about" className="hover:text-white transition">
                Courses
              </a>
            </li>
            <li>
              <a href="/#pricing" className="hover:text-white transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="/#testimonials" className="hover:text-white transition">
                Testimonials
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/help-center" className="hover:text-white transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="/contact-us" className="hover:text-white transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-sm mb-4 text-gray-400">
            Subscribe to our newsletter for the latest insights and offers.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 relative z-10">
        <p className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} EdTech. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/edtech"
            className="hover:text-white transition"
            aria-label="Facebook"
          >
            <FaFacebook size={20} />
          </a>
          <a
            href="https://twitter.com/edtech"
            className="hover:text-white transition"
            aria-label="Twitter"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://www.youtube.com/channel/UC1234567890"
            className="hover:text-white transition"
            aria-label="YouTube"
          >
            <FaYoutube size={20} />
          </a>
          <a
            href="https://www.linkedin.com/company/edtech"
            className="hover:text-white transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
