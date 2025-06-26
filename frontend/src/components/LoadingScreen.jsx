// LoadingScreen.js
import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E0FBFC] via-[#C2F0F2] to-[#A0E3F0]">
      <div className="text-center">
        <ClipLoader color="#36d7b7" size={60} />
        <p className="mt-4 text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;