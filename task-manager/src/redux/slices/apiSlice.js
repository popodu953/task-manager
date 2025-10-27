import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use the correct property name and add fallback
const API_URI = import.meta.env.VITE_APP_BASE_URL || "https://task-manager-kmy6.onrender.com";

console.log("API_URI:", API_URI); // Debug log
console.log("Environment variables:", import.meta.env); // Debug log

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI + "/api", // Changed from baseQuery to baseUrl
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
