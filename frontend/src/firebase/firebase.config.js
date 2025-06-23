import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDbqrOn1Cu2vL_GijR3Ln_-n9vE1ZNqxRk",
  authDomain: "login-78b80.firebaseapp.com",
  projectId: "login-78b80",
  storageBucket: "login-78b80.firebasestorage.app",
  messagingSenderId: "138495518786",
  appId: "1:138495518786:web:61be55a37f16b9f1b9e5db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);