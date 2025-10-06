import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  user: {}, // will store { name, email, role, ... }
  token: null, // JWT token
  isAuthenticated: false, // quick check
  activeChat: {
    roomId: null,
    receiver: {
      id: null,
      name: null,
      role: null,
    },
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = {
        name: action.payload.user.name,
        role: action.payload.user.role,
        userId: action.payload.user.userId,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("auth", JSON.stringify(action.payload.user));
      toast.success("Logged In successfully");
    },

    logout: (state) => {
      state.user = {};
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
    },
    setActiveChat: (state, action) => {
      state.activeChat = {
        roomId: action.payload.roomId,
        receiver: action.payload.receiver,
      };
    },
  },
});

export const { loginSuccess, logout, setActiveChat } = appSlice.actions;
export default appSlice.reducer;
