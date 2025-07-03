import { X, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const SpecialistUnavailable = ({ specialistName, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center flex flex-col items-center gap-6 border border-gray-100 relative animate-fade-in">
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-100 via-blue-100 to-transparent rounded-full blur-2xl opacity-50 -z-10 -translate-x-1/2 -translate-y-1/2"></div>

          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#5CF7F8] to-[#3BE8E9] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
            <Clock className="w-10 h-10 text-white drop-shadow-md" />
          </div>

          {/* Text + Dot animation */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-1">
              Checking for availability
              <span className="dot-typing ml-1" />
            </h3>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full relative border border-gray-100">
          {/* Background decoration */}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#5CF7F8] to-[#3BE8E9] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
              <Clock className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4 relative z-10">
            Doctor Not Available
          </h2>

          {/* Message */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 relative z-10">
            <p className="text-red-800 text-center font-medium">
              {specialistName} is currently not available or is Busy
            </p>
            <p className="text-red-600 text-center text-sm mt-1">
              Please try again later or choose another specialist for immediate
              consultation.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 relative z-10">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all duration-300 border border-gray-200"
            >
              OK
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-[#5CF7F8] to-[#3BE8E9] text-white font-medium py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Choose Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialistUnavailable;
