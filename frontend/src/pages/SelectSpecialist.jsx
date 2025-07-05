import specialists from "../components/SpecialistList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { socket } from "../Socket/Socket";
import DoctorConnectStatus from "./DoctorConnectStatus";
import { useEffect, useState } from "react";
const SelectSpecialist = () => {
  const [showUnavailable, setShowUnavailable] = useState(false);
  const { setSpecialist, user, availableDoctors, specialist } = useAuth();
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const navigate = useNavigate();
  const [isFindingDoctor, setisFindingDoctor] = useState(false);

  useEffect(() => {
    const handleDoctorAssigned = ({ role, name, sockId, error }) => {
      
      if (error) {
        console.log(error);
        setisFindingDoctor(false);
        setShowUnavailable(true);
        return;
      }

      const assigned = { role, name, sockId };
      localStorage.setItem("assignedDoctor", JSON.stringify(assigned));

      setisFindingDoctor(false);
      navigate("/chat");
    };

    socket.on("doctor-id", handleDoctorAssigned);

    return () => {
      socket.off("doctor-id", handleDoctorAssigned);
    };
  }, [navigate]);

  const handleClick = (specialist) => {
    setisFindingDoctor(true);
    setSelectedSpecialist(specialist);
    setTimeout(() => {
      socket.emit("specialization", {
        specialization: specialist,
        userId: user?.id || user?._id,
      });
    }, 1000);
  };

  // show the doctors status wheather he is available or not
  if (showUnavailable || isFindingDoctor) {
    return (
      <DoctorConnectStatus
        isFindingDoctor={isFindingDoctor}
        specialistName={specialist}
        showUnavailable={showUnavailable}
        onClose={() => setShowUnavailable(false)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E0FBFC] via-[#C2F0F2] to-[#A0E3F0] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Choose Your Specialist
          </h1>
          <p className="text-gray-600 text-lg">
            Select a healthcare specialist to get personalized advice
          </p>
        </div>

        {/* Specialist Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {specialists.map((item, index) => {
            return (
              <div
                className="bg-gradient-to-br from-[#5CF7F8] to-[#3BE8E9] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border border-white/20 backdrop-blur-sm w-full max-w-xs min-h-[380px] sm:min-h-[400px] flex flex-col relative overflow-hidden"
                key={index}
                onClick={() => handleClick(item.name)}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

                {/* Status Badge */}
                {availableDoctors?.has(item.name) && (
                  <div className="absolute top-4 right-4 bg-green-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Available
                  </div>
                )}

                {/* Specialist Name */}
                <h2 className="font-bold text-gray-800 text-xl mb-2 text-center z-10 relative">
                  {item.name}
                </h2>

                {/* Specialty Tag */}
                <div className="flex justify-center mb-4">
                  <span className="bg-white/30 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                    Medical Expert
                  </span>
                </div>

                {/* Image Container */}
                <div className="flex justify-center mb-4 flex-grow flex items-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white/30 flex items-center justify-center ring-4 ring-white/20">
                    <img
                      src={item.imgsrc}
                      alt={`${item.name} specialist`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed text-center mb-4 flex-grow">
                  {item.desc}
                </p>

                {/* Rating Stars */}
                <div className="flex justify-center mb-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <div className="bg-white/40 hover:bg-white/60 transition-colors duration-200 px-4 py-2 rounded-full">
                    <span className="text-gray-800 text-sm font-medium">
                      Consult Now
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            Tap on any specialist card to begin your consultation
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectSpecialist;
