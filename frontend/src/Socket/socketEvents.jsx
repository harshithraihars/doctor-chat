// socketEvents.js
import toast from "react-hot-toast";
import { setActiveChat } from "../redux/appSlice";
import { setLoading } from "../redux/loadingSlice";
export const registerSocketEvents = (socket, dispatch, navigate) => {
  if (!socket) return;

  // Avoid multiple registrations
  socket.off("receiveMessage");
  socket.off("roomJoined");
  socket.off("patientJoined");

  socket.on("chatRequestReceived", ({ clientId, clientName }) => {
    const toastId = toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full 
    
    /* Vibrant Gradient Background */
    bg-gradient-to-r from-[#5CF7F8] to-[#4EECF1] 
    
    /* Changed to dark text for contrast */
    text-gray-900 shadow-2xl rounded-xl pointer-events-auto flex p-4 
    transform hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden`}
      >
        {/* Optional: Remove the overlay since we have dark text now */}
        {/* <div className="absolute inset-0 bg-white opacity-5 rounded-xl"></div> */}

        <div className="flex flex-col w-full z-10">
          {/* Content Area */}
          <div className="flex-1">
            <p className="text-xl font-bold leading-tight text-gray-900">
              {clientName} wants to chat!
            </p>
            <p className="text-sm font-medium text-gray-700 mt-1">
              A new chat request is waiting for your response.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 justify-end">
            <button
              onClick={() => {
                clearTimeout(autoRejectTimeout);
                socket.emit("chatResponse", { clientId, accepted: false });
                toast.dismiss(t.id);
              }}
              // Reject Button: Subtle dark text
              className="px-3 py-1.5 text-sm font-semibold rounded-lg text-gray-700 hover:text-red-700 transition"
            >
              Reject
            </button>
            <button
              onClick={() => {
                clearTimeout(autoRejectTimeout);
                socket.emit("chatResponse", { clientId, accepted: true });
                toast.dismiss(t.id);
              }}
              // Accept Button: White button provides the strongest contrast
              className="px-4 py-2 text-sm font-bold rounded-lg shadow-lg bg-white text-cyan-600 hover:bg-gray-100 transition transform hover:scale-105"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    ));

    // if doctor doesnt respond automatically reject the request when after 5 seconds
    const autoRejectTimeout = setTimeout(() => {
      toast.dismiss(toastId);
      socket.emit("chatResponse", { clientId, accepted: false });
    }, 5000);
  });

  socket.on(
    "chatAccepted",
    ({ roomId, doctorId, clientId, clientName, doctorName, role }) => {
      if (role === "client") {
        toast.success(doctorName + " has Accepted the request");

        dispatch(
          setActiveChat({
            roomId,
            receiver: { name: doctorName, id: doctorId, role: "doctor" },
          })
        );
        // navigate(`/chat/${roomId}`);
      } else if (role === "doctor") {
        toast.success("joined the chat with " + clientName);

        dispatch(
          setActiveChat({
            roomId,
            receiver: { name: clientName, id: clientId, role: "client" },
          })
        );
        // navigate(`/chat/${roomId}`);
      }

      dispatch(setLoading({ isLoading: false, loadingMsg: "" }));
    }
  );

  socket.on("chatRejected", () => {
    toast.error("Doctor is Busy now please try again later");

    dispatch(setLoading({ isLoading: false, loadingMsg: "" }));
  });

  socket.on("chatRequestFailed", ({ msg }) => {
    toast.error(msg);
  });

  socket.on("error", ({ msg }) => {
    toast.error(msg);
  });
};
