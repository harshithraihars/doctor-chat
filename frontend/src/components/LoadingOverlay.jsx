import { useEffect, useState } from "react";
import "./Loading.css";
import { useSelector } from "react-redux";

const Loading = () => {

  const [dots, setDots] = useState("");
  const {isLoading,loadingMsg}=useSelector((state)=>state.loading)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);  
  if(!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
        <div className="earth relative w-40 h-40 flex items-center justify-center">
          <div className="earth-loader">
            {[...Array(4)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="absolute w-40 h-40 opacity-90"
              >
                <path
                  transform="translate(100 100)"
                  d="M39.4,-66C48.6,-62.9,51.9,-47.4,52.9,-34.3C53.8,-21.3,52.4,-10.6,54.4,1.1C56.3,12.9,61.7,25.8,57.5,33.2C53.2,40.5,39.3,42.3,28.2,46C17,49.6,8.5,55.1,1.3,52.8C-5.9,50.5,-11.7,40.5,-23.6,37.2C-35.4,34,-53.3,37.5,-62,32.4C-70.7,27.4,-70.4,13.7,-72.4,-1.1C-74.3,-15.9,-78.6,-31.9,-73.3,-43C-68.1,-54.2,-53.3,-60.5,-39.5,-60.9C-25.7,-61.4,-12.9,-56,1.1,-58C15.1,-59.9,30.2,-69.2,39.4,-66Z"
                  fill="#7CC133"
                ></path>
              </svg>
            ))}
          </div>
        </div>

        <p className="text-green-400 text-2xl font-semibold tracking-wide">
          {loadingMsg}{dots}
        </p>
      </div>
    </div>
  );
};

export default Loading;
