import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Activity, Users, DollarSign } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { FaArrowRight } from "react-icons/fa";
import { socket } from "../Socket/Socket";
import homeimg from "../assets/images/home.png"
const Home = () => {
  const navigate = useNavigate();
  const { user, setUser, setAvailableDoctors } = useAuth();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("auth")));
    // if (user.Role == "Doctor") navigate("/health-bot");
  }, []);

  socket.on("available-doctors", (availabeSpecializiation) => {
    setAvailableDoctors(new Set(availabeSpecializiation));
  });

  const content = {
    Client: {
      header: {
        title: "Welcome to HealthCare App",
        subtitle: "Your Health, Our Priority",
      },
      hero: {
        title: "Get Health Advice Instantly",
        subtitle: "Check symptoms, get remedies, and stay informed.",
        description:
          "Expert health advice is just a step away. Choose your medical area connect with an active doctor, and receive quick advice or first-aid solutions tailored to your issue. Simple, fast, and reliable care—right when you need it.",
        ctaTitle: "Transforming Healthcare with Our Doctor Consultation Bot",
        ctaButton: "🩺 Connect with Experts",
        ctaAction: "/selectspecialist",
      },
    },
    Doctor: {
      header: {
        title: "Welcome to HealthCare Platform",
        subtitle: "Empowering Healthcare Professionals",
      },
      hero: {
        title: "Connect with Patients Instantly",
        subtitle:
          "Provide expert care and make a difference.",
        description:
          "Join our network of healthcare professionals and help patients get the care they need. Manage consultations, share your expertise, and build meaningful connections with those seeking medical guidance. Professional, efficient, and impactful care—whenever patients need you.",
        ctaTitle: "Empowering Doctors to Deliver Excellence in Patient Care",
        ctaButton: "🏥 Connect with Clients",
        ctaAction: "/chat",
      },
    },
  };
  
  const currentContent = content[user?.Role];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-[#E0FBFC] via-[#C2F0F2] to-[#A0E3F0] min-h-screen">
      {/* Hero Section */}
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 lg:mb-2 px-2">
          {currentContent?.header.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 px-2">
          {currentContent?.header.subtitle}
        </p>
      </header>

      <section className="mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left md:pl-8 order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 px-2">
              {currentContent?.hero.title}
            </h2>
            <h4 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 px-2">
              "{currentContent?.hero.subtitle}"
            </h4>
            <p className="text-gray-600 mb-4 sm:mb-6 px-2 text-sm sm:text-base leading-relaxed">
              {currentContent?.hero.description}
            </p>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 mb-6 sm:mb-8 md:mb-0 order-1 md:order-2">
            <img
              src={homeimg}
              alt="Healthcare"
              className="w-full h-auto max-w-sm mx-auto md:max-w-xs lg:max-w-md"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 sm:mt-12">
          <h3 className="text-center text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 px-2">
            {currentContent?.hero.ctaTitle}
          </h3>
          <div className="flex justify-center px-4">
            <button
              onClick={() => navigate(`${currentContent?.hero.ctaAction}`)}
              className="relative bg-gradient-to-r from-[#5CF7F8] to-[#4EECF1] text-black px-5 sm:px-7 py-3 sm:py-4 font-bold text-sm sm:text-base rounded-xl w-full sm:w-auto max-w-xs sm:max-w-none overflow-hidden group transition-all duration-300 hover:scale-108 shadow-lg hover:shadow-2xl border-2 border-[#4DD5D6] hover:border-white hover:shadow-[#5CF7F8]/50 transform hover:-translate-y-1 animate-pulse hover:animate-none"
            >
              <div className="flex justify-center items-center gap-2 relative z-10">
                <span className="tracking-wide">
                  {currentContent?.hero.ctaButton}
                </span>
                <FaArrowRight className="text-black transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125" />
              </div>

              {/* Shimmer + Border Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>

              {/* Rotating Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#5CF7F8] via-[#4DD5D6] to-[#5CF7F8] rounded-xl opacity-75 group-hover:opacity-100 blur-sm animate-spin-slow group-hover:animate-pulse -z-10"></div>
            </button>
          </div>
        </div>
      </section>

      {user.Role == "Client" && (
        <div>
          {/* Features Section */}
          <section className="mb-12 sm:mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-3">
              <FeatureCard
                icon={
                  <MessageCircle
                    size={40}
                    className="text-blue-500 mb-3 sm:mb-4 mx-auto"
                  />
                }
                title="24/7 AI Support"
                description="Get instant answers to your health queries anytime, anywhere."
              />
              <FeatureCard
                icon={
                  <Activity
                    size={40}
                    className="text-blue-500 mb-3 sm:mb-4 mx-auto"
                  />
                }
                title="Health Tracking"
                description="Monitor your vital signs and health progress over time."
              />
              <FeatureCard
                icon={
                  <Users
                    size={40}
                    className="text-blue-500 mb-3 sm:mb-4 mx-auto"
                  />
                }
                title="Expert Consultations"
                description="Connect with healthcare professionals for personalized advice."
              />
              <FeatureCard
                icon={
                  <DollarSign
                    size={40}
                    className="text-blue-500 mb-3 sm:mb-4 mx-auto"
                  />
                }
                title="Affordable Plans"
                description="Access quality healthcare services at competitive prices."
              />
            </div>
          </section>

          {/* Key Features Section */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8 px-2">
              Discover Our Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <ReasonCard
                title="Personalized Remedies"
                description="Get instant, customized treatment options based on your specific symptoms."
              />
              <ReasonCard
                title="Health Knowledge"
                description="Stay informed with tips and updates on health topics that matter to you."
              />
              <ReasonCard
                title="Symptom Checker"
                description="Enter your health symptoms to receive immediate insights tailored to you."
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[#A7E6F5] p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="text-center">
      {icon}
      <h3 className="text-lg sm:text-xl font-semibold mb-2 px-1">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-1">
        {description}
      </p>
    </div>
  </div>
);

const ReasonCard = ({ title, description }) => (
  <div className="bg-[#A7E6F5] p-4 sm:p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
    <h4 className="text-lg sm:text-xl font-semibold mb-2 px-1">{title}</h4>
    <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-1">
      {description}
    </p>
  </div>
);

export default Home;
