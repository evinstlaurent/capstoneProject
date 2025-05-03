import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyDeKSRfPoXJKOg-Cbp6uzvcfPPRwyFkvG4",
  authDomain: "capstone-spring2025.firebaseapp.com",
  projectId: "capstone-spring2025",
  storageBucket: "capstone-spring2025.firebasestorage.app",
  messagingSenderId: "417329932634",
  appId: "1:417329932634:web:0d04b73f6850d6e4df2b63",
  measurementId: "G-CXEY4F9GJQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore();

// Add event listener for the Google Sign-In button
var btn = document.getElementById("SignIn");
if (btn){
document.getElementById("SignIn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    var user = result.user;
    const idToken = await user.getIdToken();
    // Send the token to your backend
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({ idToken })
    });
    
    if (response.ok) {
      alert("Login successful!");
      window.location.href = "/load";
    } else {
      alert("Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    alert("Sign-in error: " + error.message);
  }
});
}
