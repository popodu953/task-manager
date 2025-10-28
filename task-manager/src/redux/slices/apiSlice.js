import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Force Render URL in production, localhost in development
const API_URI = import.meta.env.PROD 
  ? "https://task-manager-kmy6.onrender.com" 
  : (import.meta.env.VITE_APP_BASE_URL || "https://task-manager-kmy6.onrender.com");

console.log("API_URI:", API_URI); // Debug log
console.log("Environment variables:", import.meta.env); // Debug log
console.log("Is Production:", import.meta.env.PROD); // Debug log

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI + "/api",
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Task"],
  endpoints: (builder) => ({}),
});




// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // const API_URI = "http://localhost:8800/api";
// const API_URI = import.meta.env.VITE_APP_BASE_URL;

// const baseQuery = fetchBaseQuery({baseQuery: API_URI + "/api"});


// export const apiSlice = createApi ({
//     baseQuery,
//     tagTypes: [],
//     endpoints: (builder) => ({}),
// });
