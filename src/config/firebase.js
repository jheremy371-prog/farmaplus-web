// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBny32sr3EG6dvtYP2JmDSJri7-Aksp1ss",
  authDomain: "productos-c76e7.firebaseapp.com",
  databaseURL: "https://productos-c76e7-default-rtdb.firebaseio.com",
  projectId: "productos-c76e7",
  storageBucket: "productos-c76e7.firebasestorage.app",
  messagingSenderId: "501610443825",
  appId: "1:501610443825:web:5b2787d084f2ea85fa1110"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);