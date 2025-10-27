import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  UserCircle,
  MessageCircle,
  Stethoscope,
  Heart,
  Brain,
  Users,
  Baby,
  Bone,
  Activity,
  Microscope,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DoctorConnectStatus from "./DoctorConnectStatus";
import { setLoading } from "../redux/loadingSlice";

const AvailableDoctorsPage = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { specialist } = useParams();
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isFindingDoctor, setIsFindingDoctor] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);

  useEffect(() => {
    setIsFindingDoctor(true);
    const fetchDoctors = async () => {
      const res = await fetch(
        `http://localhost:5000/api/socket/specialist/${specialist}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (data.length == 0) setShowUnavailable(true);
      setAvailableDoctors(data);
      setIsFindingDoctor(false);
    };
    fetchDoctors();
  }, [specialist]);

  // Filter and sort doctors

  const handleConsultNow = (doctor) => {
    socket.emit("chatRequest", {
      doctorId: doctor._id,
      clientId: user.userId,
    });

    dispatch(setLoading({isLoading:true,loadingMsg:"Waiting for the Doctor's response"}))
  };

  const handleQuickConnect = () => {
    console.log("Quick connecting to any available doctor");
  };

  const getSpecializationIcon = (specialization) => {
    const iconMap = {
      Cardiologist: Heart,
      Neurologist: Brain,
      Dermatologist: Activity,
      Pediatrician: Baby,
      Gynecologist: Users,
      "Orthopedic Surgeon": Bone,
      Oncologist: Microscope,
      Endocrinologist: Stethoscope,
    };
    const IconComponent = iconMap[specialization] || Stethoscope;
    return <IconComponent className="w-6 h-6 text-white opacity-80" />;
  };

  if (isFindingDoctor || showUnavailable) {
    return (
      <DoctorConnectStatus
        isFindingDoctor={isFindingDoctor}
        specialistName={specialist}
        showUnavailable={showUnavailable}
        setShowUnavailable={setShowUnavailable}
      />
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0FBFC] via-[#C2F0F2] to-[#A0E3F0]">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Choose Your Specialist
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Connect instantly with an online doctor or message offline doctors.
          </p>
        </div>

        {/* Search Bar and Quick Connect Button - aligned with cards */}
        <div className="flex flex-col lg:flex-row items-start justify-start gap-4 mb-8">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by specialization"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-14 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 shadow-lg"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Filter className="text-gray-400 w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Connect Button */}
          <button
            onClick={handleQuickConnect}
            className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white px-6 py-3 rounded-md font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            Quick Connect
          </button>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
          {availableDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl px-4 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-white relative overflow-hidden hover:cursor-pointer"
            >
              {/* Background Icon */}
              <div className="absolute top-2 right-2 opacity-20">
                <div className="w-6 h-6">
                  {getSpecializationIcon(doctor.specialization)}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      doctor.isOnline ? "bg-green-300" : "bg-gray-300"
                    } shadow-sm`}
                  ></div>
                  <span
                    className={`text-xs font-bold ${
                      doctor.isOnline ? "text-green-100" : "text-gray-200"
                    }`}
                  >
                    {doctor.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <span className="bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  Medical Expert
                </span>
              </div>

              {/* Doctor Image */}
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-white rounded-full p-1 shadow-md">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-base mb-1">{doctor.name}</h3>
                <h4 className="font-medium text-sm text-teal-100">
                  {specialist}
                </h4>
              </div>

              {/* Action Button */}
              <div
                className="flex justify-center"
                onClick={() => handleConsultNow(doctor)}
              >
                {doctor.iOnline ? (
                  <button
                    onClick={() => handleConsultNow(doctor)}
                    className="bg-white text-teal-600 px-4 py-2 rounded-lg font-bold hover:bg-teal-50 transition-all duration-300 shadow-md hover:shadow-lg text-sm w-full"
                  >
                    Consult Now
                  </button>
                ) : (
                  <button
                    // onClick={() => handleMessageLater(doctor)}
                    className="bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white border-opacity-30 text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center space-x-1 text-sm w-full"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Consult Now</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default AvailableDoctorsPage;
