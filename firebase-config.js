// firebase-config.js
// REPLACE WITH YOUR ACTUAL FIREBASE CONFIGURATION

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "luno-trading.firebaseapp.com",
    projectId: "luno-trading",
    storageBucket: "luno-trading.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Enable persistence (optional - keeps user logged in)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch(error => console.log("Persistence error:", error));
