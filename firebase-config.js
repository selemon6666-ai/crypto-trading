// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyB7LAc7M-K7YByQvjd8-Jx6Q_ddJE1dfC8",
    authDomain: "Luno-trading.firebaseapp.com",
    projectId: "luno-trading",
    storageBucket: "luno-trading.firebasestorage.app",
    messagingSenderId: "124120101873",
    appId: "1:124120101873:web:3645b39fdc1fb0d83ca50",
    measurementId: "G-9K36K5MSHN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
