// src/firebase.js
// Initialize Firebase Auth and Firestore for Clipboard Team Sync

// Import only the modules we need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy
} from 'firebase/firestore';

// TODO: Replace the below config with your Firebase project's values
const firebaseConfig = {
 apiKey: "AIzaSyA0_Ma-nnX39FZXbIPuJksYkE3azq5ArLo",
  authDomain: "clipboard-team-sync.firebaseapp.com",
  projectId: "clipboard-team-sync",
  storageBucket: "clipboard-team-sync.firebasestorage.app",
  messagingSenderId: "682857956094",
  appId: "1:682857956094:web:2fa790ec43e85c3c87dbaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up Auth (we’ll use email-link sign-in)
const auth = getAuth(app);
auth.useDeviceLanguage();

// Set up Firestore
const db = getFirestore(app);

// Export what we need elsewhere
export {
  auth,
  db,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy
};
