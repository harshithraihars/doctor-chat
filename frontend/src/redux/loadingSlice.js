import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: false,
    loadingMsg:"",
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMsg = action.payload.loadingMsg;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
