// Importing Firebase and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

// Needed Firestore Tools
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

// MAIN DATABASE API CONFIGURATION
// const firebaseConfig = {
//   apiKey: "AIzaSyCZbXklUHfz5eJshWMQA_5IIGHW12ty3Q0",
//   authDomain: "lyrexist-63456.firebaseapp.com",
//   projectId: "lyrexist-63456",
//   storageBucket: "lyrexist-63456.appspot.com",
//   messagingSenderId: "179532500288",
//   appId: "1:179532500288:web:0d87f71f1364da087efea5",
//   measurementId: "G-FYVCMTCRJH"
// };

// BACKUP DATABASE API CONFIGURATION (FOR TESTING)
const firebaseConfig = {
  apiKey: "AIzaSyCJojeZlBL5accI_PomZfKhVAUJ561HZ4c",
  authDomain: "lyrexist-hanni-pham.firebaseapp.com",
  projectId: "lyrexist-hanni-pham",
  storageBucket: "lyrexist-hanni-pham.appspot.com",
  messagingSenderId: "314886013544",
  appId: "1:314886013544:web:8369805d26618f7be531dd",
  measurementId: "G-QZ2WLK5WZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, query, where };