// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { collection, doc, getDoc, getDocs, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { query, orderBy, limit, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// ADDBASE CONFIG
// const firebase = require("firebase/app");
// const fireStore = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCZbXklUHfz5eJshWMQA_5IIGHW12ty3Q0",
  authDomain: "lyrexist-63456.firebaseapp.com",
  projectId: "lyrexist-63456",
  storageBucket: "lyrexist-63456.appspot.com",
  messagingSenderId: "179532500288",
  appId: "1:179532500288:web:0d87f71f1364da087efea5",
  measurementId: "G-FYVCMTCRJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db, doc, collection, getDoc, getDocs, Timestamp, addDoc, query, orderBy, limit, where, onSnapshot };

// const analytics = getAnalytics(app);

