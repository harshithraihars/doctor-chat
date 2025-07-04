import { X, Clock } from "lucide-react";
const DoctorConnectStatus = ({
  specialistName,
  onClose,
  isFindingDoctor,
  showUnavailable,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {isFindingDoctor && (
        <div className="bg-white rounded-3xl px-10 py-12 shadow-2xl max-w-sm w-full text-center flex flex-col items-center gap-6 border border-gray-100 relative overflow-hidden animate-fade-in">
          {/* Blurred Glow */}
          <div className="absolute top-[-80px] left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-cyan-300/40 via-teal-200/30 to-transparent rounded-full blur-3xl z-0" />

          {/* Animated Icon */}
          <div className="relative z-10 animate-spin-slow">
            <div className="w-20 h-20 bg-gradient-to-br from-[#5CF7F8] to-[#3BE8E9] rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4v6h6M20 20v-6h-6" />
                <path d="M4 10a9 9 0 0114.6-5.6L20 4M20 14a9 9 0 01-14.6 5.6L4 20" />
              </svg>
            </div>
          </div>

          {/* Status Text with dots */}
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
              Finding Your Doctor
            </h3>
            <p className="text-sm text-gray-600">
              Matching you with an available specialist
            </p>
            <div className="mt-4 flex justify-center">
              <span className="dot-typing" />
            </div>
          </div>

          {/* Animated slide bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden pointer-events-none">
            <div className="w-full h-full bg-gradient-to-r from-[#5CF7F8] via-teal-400 to-[#3BE8E9] animate-slide" />
          </div>
        </div>
      )}
      {showUnavailable && (
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

export default DoctorConnectStatus;
