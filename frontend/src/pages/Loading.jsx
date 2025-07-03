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
// import "./Loading.css"
// const Loading = () => {
//   return (
//     <div className="flex w-full items-center justify-center mt-40">
//       <div id="wifi-loader">
//       <svg className="circle-outer" viewBox="0 0 86 86">
//         <circle className="back" cx="43" cy="43" r="40"></circle>
//         <circle className="front" cx="43" cy="43" r="40"></circle>
//         <circle className="new" cx="43" cy="43" r="40"></circle>
//       </svg>
//       <svg className="circle-middle" viewBox="0 0 60 60">
//         <circle className="back" cx="30" cy="30" r="27"></circle>
//         <circle className="front" cx="30" cy="30" r="27"></circle>
//       </svg>
//       <svg className="circle-inner" viewBox="0 0 34 34">
//         <circle className="back" cx="17" cy="17" r="14"></circle>
//         <circle className="front" cx="17" cy="17" r="14"></circle>
//       </svg>
//       <div className="mt-32 font-bold text" data-text="Searching Clients"></div>
//     </div>
//     </div>
//   );
// };

// export default Loading;
