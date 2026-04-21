// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyBzv4J3mPaaMTCeFyGy6ZWUGuRjFwAfCRY",
    authDomain: "luno-trading2.firebaseapp.com",
    projectId: "luno-trading2",
    storageBucket: "luno-trading2.firebasestorage.app",
    messagingSenderId: "1043110713188",
    appId: "1:1043110713188:web:80f5d6f08633f96928cc71",
    measurementId: "G-XLTYY59YMX"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
