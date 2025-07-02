import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  const baseText = "Searching clients";
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full flex flex-col gap-6 animate-fadeIn items-center justify-center sm:mt-40 sm:justify-start sm:items-center md:h-auto overflow-hidden h-[500px]">
      {/* Soft Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br  animate-pulse blur-3xl opacity-20 pointer-events-none" />

      {/* Message with Dot Animation */}
      <p className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-wide">
        {baseText}
        <span className="inline-block w-4">{dots}</span>
      </p>

      {/* Loader with Subtle Glow */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <ClipLoader
          color="#4ade80"
          loading={true}
          size={80}
          cssOverride={{
            borderWidth: "6px",
            filter: "drop-shadow(0 0 6px #4ade80)",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
};

export default Loading;
