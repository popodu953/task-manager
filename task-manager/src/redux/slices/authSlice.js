import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    user: (() => {
        try {
          const userInfo = localStorage.getItem('userInfo');
          return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
          console.error('Error parsing user info:', error);
          return null;
        }
      })(),
};

const authSlice = createSlice ({
    name: "auth",
    initialState,
    reducers :{
        setCredentials : (state, action)=> {
            console.log("setCredentials called with:", action.payload); // Debug log
            state.user = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
            console.log("User state updated:", state.user); // Debug log
        },
        logout: (state, action)=> {
            state.user = null;
            localStorage.removeItem("userInfo");
        },
        setOpenSidebar: (state, action)=> {
            state.isSidebarOpen= action.payload;
        },
    }
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;