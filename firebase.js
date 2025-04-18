import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDVs_lAXKJBYBh1oMlYUeV8CJ9kljGYc70",
    authDomain: "restaurant-management-sy-defff.firebaseapp.com",
    projectId: "restaurant-management-sy-defff",
    storageBucket: "restaurant-management-sy-defff.firebasestorage.app",
    messagingSenderId: "31864343635",
    appId: "1:31864343635:web:e7cd7c89662f7e145a8aa6",
    measurementId: "G-WV7ZLMF3D9"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };