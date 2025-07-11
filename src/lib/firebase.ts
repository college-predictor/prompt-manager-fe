// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCs84miFEkwwoMhNms2c4v3AZSiOUabRVI",
  authDomain: "prompt-manager-84319.firebaseapp.com",
  projectId: "prompt-manager-84319",
  storageBucket: "prompt-manager-84319.firebasestorage.app",
  messagingSenderId: "948373713824",
  appId: "1:948373713824:web:2db03f8fe854f8ba7aeac5",
  measurementId: "G-NS1RVRMYPW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, provider);
