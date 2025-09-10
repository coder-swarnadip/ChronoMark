import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16 border-b border-gray-700 pb-8">

          {/* Logo */}
          <div className="flex flex-col space-y-4">
            <div
              onClick={() => navigate("/home")}
              className="cursor-pointer"
            >
              <div className="flex items-end gap-1">
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-3xl font-extrabold tracking-tight">
                  Chrono
                </span>
                <span className="text-3xl font-medium text-white">Mark</span>
              </div>
            </div>
            <p className="text-sm">
              Your comprehensive platform for tracking and managing student academic progress.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebook className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <FaTwitter className="h-6 w-6 text-gray-400 hover:text-blue-400 transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <FaInstagram className="h-6 w-6 text-gray-400 hover:text-pink-500 transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedin className="h-6 w-6 text-gray-400 hover:text-blue-600 transition-colors" />
              </a>
            </div>
          </div>

         
         

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate("/about")} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate("/team")} className="hover:text-white transition-colors">Our Team</button></li>
              <li><button onClick={() => navigate("/careers")} className="hover:text-white transition-colors">Careers</button></li>
              <li><button onClick={() => navigate("/blog")} className="hover:text-white transition-colors">Blog</button></li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate("/privacy")} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate("/terms")} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => navigate("/cookies")} className="hover:text-white transition-colors">Cookie Policy</button></li>
              <li><button onClick={() => navigate("/support")} className="hover:text-white transition-colors">Support</button></li>
            </ul>
          </div>
        </div>

     
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ChronoMark. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;