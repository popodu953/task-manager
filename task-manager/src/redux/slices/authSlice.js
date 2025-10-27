import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: (() => {
        try {
          const userInfo = localStorage.getItem('userInfo');
          if (!userInfo || userInfo === 'undefined' || userInfo === 'null') {
            localStorage.removeItem('userInfo');
            return null;
          }
          return JSON.parse(userInfo);
        } catch (error) {
          console.error('Error parsing user info:', error);
          localStorage.removeItem('userInfo');
          return null;
        }
      })(),
    isSidebarOpen: false,
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