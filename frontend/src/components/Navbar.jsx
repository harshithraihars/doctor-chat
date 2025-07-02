import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  LogOut,
  Menu,
  X,
  Home,
  Bot,
  UserCircle,
  Shield,
  Activity,
  Bell,
  Settings,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, doctor, setDoctor } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Role=JSON.parse(localStorage.getItem("auth"))?.Role
  // console.log(localStorage.getItem());
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDoctorLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    navigate("/DocLogin");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#B2EBF2] shadow-2xl backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img
                  className="bg-transparent w-16 h-16"
                  src="src/assets/images/logo.png"
                  alt="Healthcare"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-1">
                <span className="font-bold text-gray-800 text-xl tracking-wide">
                  HealthCare
                </span>
                <div className="text-gray-600 text-xs font-medium">
                  Your Health Partner
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {Role=="Client" ? (
              // Patient Navigation
              <>
                <Link
                  to="/"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-cyan-200/50 rounded-lg transition-all duration-300 group"
                >
                  <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  to="/health-bot"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-cyan-200/50 rounded-lg transition-all duration-300 group"
                >
                  <Bot className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Health Bot</span>
                </Link>

                {/* Notifications */}
                <button className="relative p-2 text-gray-800 hover:bg-cyan-200/50 rounded-lg transition-all duration-300">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-400">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-8 w-8 text-gray-600" />
                    <div className="text-left">
                      <div className="text-gray-800 text-sm font-medium">
                        Welcome back!
                      </div>
                      <div className="text-gray-600 text-xs">Patient</div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 group"
                  >
                    <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : Role=="Doctor" ? (
              // Doctor Navigation
              <>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800/10 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <div className="text-gray-800 text-sm font-medium">
                      Dr. Portal
                    </div>
                    <div className="text-green-600 text-xs">
                      Medical Professional
                    </div>
                  </div>
                </div>

                <button className="relative p-2 text-gray-800 hover:bg-cyan-200/50 rounded-lg transition-all duration-300">
                  <Activity className="h-5 w-5" />
                </button>

                <button
                  onClick={handleDoctorLogout}
                  className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 group"
                >
                  <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              // Guest Navigation
              <>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">Secure & Private</span>
                  </div>

                  <Link
                    to="/"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-cyan-200/50 rounded-lg transition-all duration-300 group"
                  >
                    <UserCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Login</span>
                  </Link>

                  <Link
                    to="/register"
                    className="flex items-center px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-all duration-300 font-medium group"
                  >
                    <Heart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Get Started</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-800 hover:bg-cyan-200/50 rounded-lg transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="bg-gradient-to-b from-cyan-300 to-cyan-400 border-t border-gray-400/20">
          {user ? (
            // Mobile Patient Menu
            <div className="px-4 py-2">
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg mb-3">
                <UserCircle className="h-8 w-8 text-blue-200" />
                <div>
                  <div className="text-white font-medium">Patient Portal</div>
                  <div className="text-blue-200 text-sm">Welcome back!</div>
                </div>
              </div>

              <Link
                to="/home"
                className="flex items-center px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300 mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5 mr-3" />
                <span>Home</span>
              </Link>

              <Link
                to="/health-bot"
                className="flex items-center px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300 mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bot className="h-5 w-5 mr-3" />
                <span>Health Bot</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-white hover:bg-red-500/20 rounded-lg transition-all duration-300"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : doctor ? (
            // Mobile Doctor Menu
            <div className="px-4 py-2">
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg mb-3">
                <Stethoscope className="h-8 w-8 text-green-400" />
                <div>
                  <div className="text-white font-medium">Doctor Portal</div>
                  <div className="text-green-200 text-sm">
                    Medical Professional
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  handleDoctorLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-white hover:bg-red-500/20 rounded-lg transition-all duration-300"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            // Mobile Guest Menu
            <div className="px-4 py-2">
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300 mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCircle className="h-5 w-5 mr-3" />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5 mr-3" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
