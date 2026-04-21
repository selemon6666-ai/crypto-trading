// firebase-config.js
const firebaseConfig = {
   apiKey: "AIzaSyB7lAc7M-K7YByQvjd8-Jx6Q_ddJE1dFC8",
  authDomain: "luno-trading.firebaseapp.com",
  projectId: "luno-trading",
  storageBucket: "luno-trading.firebasestorage.app",
  messagingSenderId: "124120101873",
  appId: "1:124120101873:web:4f9e47a6a198f13683ca50",
  measurementId: "G-B3H52HPSSG"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
