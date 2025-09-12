import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBhM-MoT6_ysseHdkvfFSm4D24UE_vnxYk",
  authDomain: "auth-415eb.firebaseapp.com",
  projectId: "auth-415eb",
  storageBucket: "auth-415eb.firebasestorage.app",
  messagingSenderId: "814848776676",
  appId: "1:814848776676:web:3c14c67998fe1fda4e4ff1",
  measurementId: "G-W0Z1BTB1WM"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);