import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    visible: false,
    message: "",
    title: "",
    image: "",
  },
  reducers: {
    showNotification: (state, action) => {
      state.visible = true;
      state.message = action.payload.message;
      state.title = action.payload.title;
      state.image = action.payload.image;
    },
    hideNotification: (state) => {
      state.visible = false;
      state.message = "";
      state.title = "";
      state.image = "";
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
