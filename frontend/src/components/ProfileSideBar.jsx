// ProfileSidebar.js
import React from "react";

const ProfileSidebar = ({ user, onLogout }) => {
  return (
    <div className="h-auto xl:h-[500px] border-2 border-black border-solid rounded-[30px] bg-[#64F9FA] p-4 mx-auto max-w-sm xl:max-w-none">
      
      {/* Profile Image */}
      <div className="mt-8 xl:mt-12 w-full flex items-center justify-center">
        <img
          src="src/assets/images/profile.png"
          alt="profile"
          className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 rounded-full border-2 border-white shadow-lg"
        />
      </div>
      
      {/* User Name */}
      <div className="font-bold flex justify-center w-full mt-4 text-lg xl:text-xl text-gray-800">
        {user?.Name || user?.fullName || "User"}
      </div>
      
      {/* User Role Badge */}
      <div className="flex justify-center mt-2">
        <span className="px-3 py-1 bg-white bg-opacity-50 rounded-full text-sm font-medium text-gray-700">
          {user?.Role || "User"}
        </span>
      </div>
      
      {/* Logout Button */}
      <div className="w-full flex justify-center mt-4">
        <button 
          onClick={onLogout}
          className="font-bold px-6 py-2 bg-green-500 border-none text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Log Out
        </button>
      </div>
      
      {/* Welcome Message */}
      <div className="bg-white bg-opacity-70 backdrop-blur-sm p-3 rounded-2xl mx-auto mt-6 max-w-xs text-center shadow-sm">
        <p className="text-gray-700 text-sm">
          Hi {user?.Name || "User"}! Welcome back
        </p>
      </div>
      
      {/* Recent Activity */}
      <div className="w-full flex flex-col items-center mt-6 xl:mt-10">
        <p className="text-gray-500 text-sm">Yesterday</p>
        <div className="text-gray-700 text-sm mt-1 text-center">
          Greeting Exchange...
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;