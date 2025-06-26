import React, { useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setErrors({});

    try {
      if (currentStep === 1) {
        setIsLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/auth/forgot-password", // Backend API endpoint
          {
            email: formData.email,
          }
        );
        if (response.status == 200) {
          setSuccess("OTP sent succefully");
          setCurrentStep(2);
        } else {
          setError("Invalid Email");
        }
        setIsLoading(false);
      }

      if (currentStep === 2) {
        setIsLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/auth/verify-otp", // Backend API endpoint
          {
            email: formData.email,
            otp: formData.otp,
          }
        );
        if (response.status == 200) {
          setSuccess("OTP validation Succefull");
          setCurrentStep(3);
        } else {
          setError("Please enter the valid 4-digit OTP");
        }
        setIsLoading(false);
      }

      if (currentStep === 3) {
        if (
          formData.password != formData.confirmPassword ||
          formData.password.length < 6
        ) {
          setError("passwords do not match or minmum length required");
          return;
        }

        setIsLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/auth/reset-password", // Backend API endpoint
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (response.status == 200) {
          setSuccess("Password Updated Successfully");
          navigate("/login");
        } else {
          setError("Please enter a valid password");
        }
        setIsLoading(false);
      }
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      setError(serverMsg || error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepInfo = () => {
    const steps = {
      1: {
        title: "Reset Password",
        desc: "Enter your email address to receive a reset code",
      },
      2: {
        title: "Verify OTP",
        desc: `Enter the 6-digit code sent to ${formData.email}`,
      },
      3: { title: "New Password", desc: "Create your new password" },
    };
    return steps[currentStep];
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F0FDFF] via-[#E6FFFE] to-[#D1F5F7] py-4 px-4 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:flex flex-col justify-center items-center p-8">
            <div className="text-center mb-8">
              <LeftSideBar />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome Back!
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Your health journey continues here. Reset your password to
                regain access.
              </p>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <img
                className="mx-auto mb-4 drop-shadow-lg"
                src="src/assets/images/login.png"
                alt="Healthcare"
                width="200"
                height="200"
              />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600">Get back to your health journey</p>
            </div>

            {/* Forgot Password Card */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="px-6 py-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {stepInfo.title}
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">{stepInfo.desc}</p>
                </div>

                {/* Step Indicator */}
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          step <= currentStep
                            ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Messages */}
                {success && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Step 1: Email */}
                  {currentStep === 1 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address
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
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/50"
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>
                  )}

                  {/* Step 2: OTP */}
                  {currentStep === 2 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Verification Code
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={formData.otp}
                          onChange={(e) =>
                            handleInputChange("otp", e.target.value)
                          }
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/50"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                        />
                      </div>
                      {errors.otp && (
                        <p className="text-red-500 text-sm">{errors.otp}</p>
                      )}
                    </div>
                  )}

                  {/* Step 3: Password Fields */}
                  {currentStep === 3 && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          New Password
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
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/50"
                            placeholder="Enter new password"
                          />
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Confirm New Password
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/50"
                            placeholder="Confirm new password"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
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
                        {currentStep === 1
                          ? "Sending OTP..."
                          : currentStep === 2
                          ? "Verifying..."
                          : "Resetting..."}
                      </div>
                    ) : (
                      <>
                        {currentStep === 1
                          ? "Send Reset Code"
                          : currentStep === 2
                          ? "Verify Code"
                          : "Reset Password"}
                      </>
                    )}
                  </button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-sm font-medium text-cyan-600 hover:text-cyan-800 transition-colors duration-200 inline-flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
