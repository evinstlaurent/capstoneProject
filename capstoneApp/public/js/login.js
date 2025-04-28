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
const user = null;
const provider = new GoogleAuthProvider();
const db = getFirestore();

// Add event listener for the Google Sign-In button
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("SignIn");
  if (btn) {
    btn.addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          console.log('User signed in:', user);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            window.location.href = '/';
          } else {
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              allergies: null,
              preferences: null,
              recipes: null
            });
            window.location.href = '/';
          }
        })
    });
  }
  else {
    console.warn("Buttonn not found");
  }
});

export { user, app };