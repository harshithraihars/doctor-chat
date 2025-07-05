import React from "react";
import loginImg from "../assets/images/login.png"
const LeftSideBar = () => {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-2xl opacity-30"></div>
      <img
        className="relative z-10 drop-shadow-2xl"
        src={loginImg}
        alt="Healthcare"
        width="400"
        height="400"
      />
    </div>
  );
};

export default LeftSideBar;
