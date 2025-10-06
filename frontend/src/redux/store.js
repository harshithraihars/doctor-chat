import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import socketReducer from "./socketSlice"
import loadingReducer from "./loadingSlice"
export const store = configureStore({
  reducer: {
    auth: appReducer,
    socket:socketReducer,
    loading:loadingReducer,
  },
});

export default store;
