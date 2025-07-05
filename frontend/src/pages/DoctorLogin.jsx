import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LeftSideBar from "../components/LeftSideBar";
import { setupSocket } from "../Socket/useSocketInit";
import toast from "react-hot-toast";
import loginImg from "../assets/images/login.png"
const schema = yup.object().shape({
  doctorId: yup.string().required("Doctor ID is required"),
  password: yup.string().required("Password is required"),
});

const DoctorLogin = () => {
  const { setDoctorId } = useAuth();
  const navigate = useNavigate();
  const { user, setUser, doctor, setDoctor } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://doctor-chat-8184.onrender.com/api/doctor/login", // Backend API endpoint
        {
          docId: data.doctorId,
          password: data.password,
        }
      );

      // Navigate to the doctor's home page after successful login
      const { token, user } = response.data;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          Role: "Doctor",
          Name: user,
          Id: data.doctorId,
        })
      );
      setUser(user);

      setupSocket({ Id: data.doctorId });
      localStorage.setItem("token", token);
      setDoctorId(data.doctorId);
      toast.success("Logged in Successfully");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid Doctor ID or password. Please try again.");
      toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F0FDFF] via-[#E6FFFE] to-[#D1F5F7] py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image and Welcome Text */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
            <LeftSideBar />

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-800">
                Welcome Doctor!
              </h1>
              <p className="text-gray-600 text-lg max-w-md">
                Access your professional dashboard and manage patient care with
                our advanced healthcare platform
              </p>

              <div className="flex items-center justify-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Secure Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    Professional Tools
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <img
                className="mx-auto mb-4 drop-shadow-lg"
                src={loginImg}
                alt="Healthcare Professional"
                width="200"
                height="200"
              />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Doctor!
              </h1>
              <p className="text-gray-600">
                Sign in to your professional dashboard
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="px-8 py-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Doctor Sign In
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto"></div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Doctor ID Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="doctorId"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Doctor ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="doctorId"
                        {...register("doctorId")}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                        placeholder="Enter your Doctor ID"
                      />
                    </div>
                    {errors.doctorId && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.doctorId.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password"
                        {...register("password")}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                        placeholder="Enter your password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  {/* Forgot Password */}
                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </form>
              </div>

              {/* Footer Links */}
              <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
                <div className="space-y-4 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have a doctor account?{" "}
                    <Link
                      to="/DocRegister"
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      Register as Doctor
                    </Link>
                  </p>

                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <div className="px-4 text-sm text-gray-500">or</div>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Are you a Patient?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-cyan-600 hover:text-cyan-800 transition-colors duration-200 inline-flex items-center"
                    >
                      Register here
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
