// socketEvents.js
import toast from "react-hot-toast";
import { setActiveChat } from "../redux/appSlice";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../redux/loadingSlice";
export const registerSocketEvents = (socket, dispatch,navigate) => {
  if (!socket) return;

  // Avoid multiple registrations
  socket.off("receiveMessage");
  socket.off("roomJoined");
  socket.off("patientJoined");

  socket.on("chatRequestReceived", ({ clientId, clientName }) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-gradient-to-r from-[#5CF7F8] to-[#4EECF1] text-gray-600 shadow-xl rounded-lg pointer-events-auto flex flex-col p-4`}
      >
        <p className="text-base font-semibold">{clientName} wants to chat</p>
        <p className="text-xs text-green-100 mt-1">
          Accept or reject the request
        </p>

        <div className="flex gap-2 mt-3 justify-end">
          <button
            onClick={() => {
              socket.emit("chatResponse", { clientId,accepted: true });
              toast.dismiss(t.id);
            }}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-green-700 hover:bg-green-700 transition hover:text-white"
          >
            Accept
          </button>
          <button
            onClick={() => {
              socket.emit("chatResponse", { clientId,accepted: false });
              toast.dismiss(t.id);
            }}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-500 text-white transition hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    ));
  });

  socket.on("chatAccepted", ({ roomId, doctorId, clientId,clientName,doctorName, role }) => {
  if (role === "client") {
    toast.success(doctorName+" has Accepted the request");
    
    dispatch(setActiveChat({ roomId,receiver:{name:doctorName,id:doctorId,role:"doctor"}}));
    // navigate(`/chat/${roomId}`);
  } else if (role === "doctor") {
    toast.success("joined the chat with "+clientName);
    
    dispatch(setActiveChat({ roomId,receiver:{name:clientName,id:clientId,role:"client"}}));
    // navigate(`/chat/${roomId}`);
  }

  dispatch(setLoading({isLoading:false,loadingMsg:""}))
});

  socket.on("chatRejected", () => {
    toast.error("Doctor is Busy now please try again later");

    dispatch(setLoading({isLoading:false,loadingMsg:""}))

  });
  socket.on("chatRequestFailed",({msg})=>{
    toast.error(msg)
  })
  
  socket.on("error",({msg})=>{
    toast.error(msg)
  })
};
