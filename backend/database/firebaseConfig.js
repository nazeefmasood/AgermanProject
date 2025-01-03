// Import the functions you need from the SDKs you need
// import { getApp, getApps, initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const { getApp, getApps, initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");
const { getDatabase } = require("firebase/database");
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYeGNKtmSfCfM3g_ierecr8Yefjq8YvQI",
  authDomain: "pack-n-go-814f3.firebaseapp.com",
  projectId: "pack-n-go-814f3",
  storageBucket: "pack-n-go-814f3.appspot.com",
  messagingSenderId: "184545041836",
  appId: "1:184545041836:web:fbccb5cfaf1aac4c94ee09",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const DB =getFirestore(app);

module.exports={DB}
