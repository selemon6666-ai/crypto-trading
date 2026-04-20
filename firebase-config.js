// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7lAc7M-K7YByQvjd8-Jx6Q_ddJE1dFC8",
  authDomain: "luno-trading.firebaseapp.com",
  projectId: "luno-trading",
  storageBucket: "luno-trading.firebasestorage.app",
  messagingSenderId: "124120101873",
  appId: "1:124120101873:web:3645b39fdb01fb0d83ca50",
  measurementId: "G-9K36K5MSHW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  doc, setDoc, getDoc, updateDoc, collection, getDocs
};
