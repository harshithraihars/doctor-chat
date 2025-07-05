import React from "react";
import { motion } from "framer-motion";
import { LogOut, UserCircle } from "lucide-react";
import Avatar from "@mui/material/Avatar";

const ProfileSidebar = ({ user, handleLogout }) => {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        hidden md:flex w-4/5 lg:w-1/5 h-[500px] mt-10 mx-auto lg:ml-20
        flex-col items-center rounded-3xl 
        bg-gradient-to-br from-cyan-300 via-teal-200 to-emerald-200 
        shadow-xl border border-white/30 relative overflow-hidden mb-10
      "
    >
      {/* Decorative glow */}
      <div className="absolute -top-10 -left-10 w-56 h-56 bg-white/20 rounded-full blur-3xl opacity-30 z-0" />

      {/* Profile Icon */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mt-12 relative z-10"
      >
        <Avatar
          src="https://tse3.mm.bing.net/th?id=OIP.btgP01toqugcXjPwAF-k2AHaHa&pid=Api&P=0&h=180"
          alt="User Avatar"
          sx={{ width: 70, height: 70 }} // 160px = Tailwind's w-40/h-40
          className="rounded-full shadow-md ring-2 ring-white"
        />
      </motion.div>

      {/* Name */}
      <h2 className="mt-4 text-lg font-semibold text-emerald-900 drop-shadow relative z-10">
        {user?.Name || user?.fullName || "User"}
      </h2>

      {/* Logout Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="
          mt-4 px-6 py-2 rounded-md bg-emerald-600 text-white font-semibold
          shadow-md  transition duration-300
          relative z-10 hover:scale-105 hover:bg-red-400
        "
      >
        <div className="flex gap-2 items-center justify-center">
          <LogOut size={20} />
          <span>Log Out</span>
        </div>
      </motion.button>

      {/* Greeting Card */}

      {/* Greeting Card */}
      <motion.div
        className="
    mt-8 bg-white/60 shadow-inner rounded-xl px-4 py-3 text-center w-56
    text-sm text-emerald-900 backdrop-blur-xl border border-white/30 relative z-10
  "
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Hi {user?.Name || "there"}! Welcome back 👋
      </motion.div>
      <div className="relative z-0 mt-10 w-full flex justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2950/2950663.png"
          alt="idea"
          className="w-16 h-16 opacity-40 hover:opacity-60 transition duration-300"
        />
      </div>

      {/* Motivational Footer Text */}
      <div className="mt-auto mb-6 text-sm text-emerald-900 font-semibold relative z-10 text-center px-4 drop-shadow">
        Keep growing, keep glowing 💫
      </div>
    </motion.aside>
  );
};

export default ProfileSidebar;
