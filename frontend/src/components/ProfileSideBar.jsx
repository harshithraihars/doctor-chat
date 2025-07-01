// ProfileSidebar.js
import React from "react";

const ProfileSidebar = ({ user,handleLogout }) => {
  return (
    <div className="hidden md:block w-4/5 lg:w-1/5 h-[500px] border-2 border-black border-solid mt-10 mx-auto lg:ml-20 rounded-[30px] bg-[#64F9FA]">
      <div className="mt-12 w-full flex items-center justify-center">
        <div>
          <img
            src="src/assets/images/profile.png"
            alt="profile"
            className="w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
          />
        </div>
      </div>
      <div className="font-bold flex justify-center w-full mt-4">
        {user?.Name || user?.fullName}
      </div>
      <div className="w-full flex justify-center mt-4">
        <button
          onClick={handleLogout}
          className="font-bold px-4 py-1 bg-green-500 border-none text-white rounded-xl"
        >
          Log Out
        </button>
      </div>
      <div className="bg-gray-100 w-52 p-2 rounded-2xl mx-auto lg:ml-12 mt-6 lg:mr-10">
        Hii {user?.Name || "User"}!, Welcome back
      </div>
      <div className="w-full flex flex-col items-center mt-10">
        <p className="text-gray-400">Yesterday</p>
        <div>Greeting Exchange...</div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
