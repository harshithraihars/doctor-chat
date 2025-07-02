import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-full flex justify-center items-center mt-40 flex-col gap-6 animate-fadeIn">
      <p className="text-3xl font-semibold text-gray-800 tracking-wider animate-pulse">
        Finding clients...
      </p>
      <ClipLoader
        color="#4ade80"
        loading={true}
        size={80}
        cssOverride={{
          borderWidth: "6px",
          filter: "drop-shadow(0 0 6px #4ade80)",
        }}
      />
    </div>
  );
};

export default Loading;
