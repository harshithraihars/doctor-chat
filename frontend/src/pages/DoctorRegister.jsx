import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios"; // Axios for backend connection

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  specialization: yup.string().required("Specialization is required"),
});

const DoctorRegister = () => {
  const navigate = useNavigate();
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
      // Backend request for doctor registration
      const response=await axios.post("http://localhost:5000/api/doctor/register", {
        name: data.fullName,
        email: data.email,
        password: data.password,
        specialization: data.specialization,
      });
      const docId=response.data.docId
      console.log(docId)
      navigate("/DocLogin"); // Redirect to login page on successful registration
    } catch (error) {
      console.error("Registration error:", error.message);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center">
        <img
          src="src/assets/images/login.png"
          alt="Healthcare"
          width="300"
          height="300"
        />
      </div>
      <div className="max-w-md mx-auto bg-gray-300 rounded-[40px] shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
            Register as a Doctor
          </h2>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                {...register("fullName")}
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs italic">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.password && (
                <p className="text-red-500 text-xs italic">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs italic">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="specialization"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Specialization
              </label>
              <select
                id="specialization"
                {...register("specialization")}
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Specialization</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermotologist">Dermotologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Oncologist">Oncologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                <option value="Psycatrist">Psycatrist</option>
                <option value="EndoCrinologist">EndoCrinologist</option>
              </select>
              {errors.specialization && (
                <p className="text-red-500 text-xs italic">
                  {errors.specialization.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Register"}
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/DocLogin"
                  className="font-bold text-blue-500 hover:text-blue-800"
                >
                  Login
                </Link>
              </p>
              <p className="text-center text-gray-600 text-sm">
                not a Doctor?{" "}
                <Link
                  to="/DocLogin"
                  className="font-bold text-blue-500 hover:text-blue-800"
                >
                  click here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
