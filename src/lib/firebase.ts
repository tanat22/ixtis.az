// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5fvgSYurEbEyYDK74TuHujqXdGk5PTlU",
  authDomain: "ixtis-az.firebaseapp.com",
  projectId: "ixtis-az",
  storageBucket: "ixtis-az.appspot.com",
  messagingSenderId: "448828876165",
  appId: "1:448828876165:web:48ed6324ae43179ea010ec",
  measurementId: "G-SCD0PZ4DTR"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
