// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "taskmanager-rev.firebaseapp.com",
  projectId: "taskmanager-rev",
  storageBucket: "taskmanager-rev.firebasestorage.app",
  messagingSenderId: "1056397122385",
  appId: "1:1056397122385:web:f251b7ebc7d99e0b8c5170"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);