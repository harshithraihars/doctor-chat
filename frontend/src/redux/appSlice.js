import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {}, // will store { name, email, role, ... }
  token: null, // JWT token
  isAuthenticated: false, // quick check
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = {
        name: action.payload.user.name,
        role: action.payload.user.role,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("auth", JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.user = {};
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = appSlice.actions;
export default appSlice.reducer;
