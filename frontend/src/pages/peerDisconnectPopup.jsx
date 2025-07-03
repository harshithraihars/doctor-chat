import React, { useEffect } from "react";
import { XOctagon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";

const PeerDisconnectedModal = ({
  isOpen,
  setPeerDisconnected,
  peerName = "The other user",
  autoCloseMs = 8000,
}) => {
  const navigate = useNavigate("");
  const { setSpecialist } = useAuth();

  const onClose = () => {
    setPeerDisconnected(false);
    localStorage.removeItem("assignedDoctor");
    setSpecialist(null);
    navigate("/");
  };

  useEffect(() => {
    if (!isOpen || !autoCloseMs) return;
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/90 backdrop-blur-sm"
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-sm rounded-2xl p-8 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center text-center text-white">
              <XOctagon size={56} className="mb-4 text-red-400" />
              <h2 className="text-2xl font-semibold mb-2">
                {peerName} disconnected
              </h2>
              <p className="text-sm text-gray-200 mb-8">
                Looks like your peer went offline. You can wait or try
                reconnecting later.
              </p>

              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 
                  text-white font-medium px-6 py-2 rounded-xl shadow-lg transition-all duration-300"
              >
                OK
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PeerDisconnectedModal;
