// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeKSRfPoXJKOg-Cbp6uzvcfPPRwyFkvG4",
  authDomain: "capstone-spring2025.firebaseapp.com",
  projectId: "capstone-spring2025",
  storageBucket: "capstone-spring2025.firebasestorage.app",
  messagingSenderId: "417329932634",
  appId: "1:417329932634:web:0d04b73f6850d6e4df2b63",
  measurementId: "G-CXEY4F9GJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);