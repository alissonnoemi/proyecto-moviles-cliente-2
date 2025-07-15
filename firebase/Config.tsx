// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABr9XRCaKqLGMDPHCOUCAiiJc6OVWWaQM",
    authDomain: "proyecto-final-moviles-c43d9.firebaseapp.com",
    databaseURL: "https://proyecto-final-moviles-c43d9-default-rtdb.firebaseio.com/", // AGREGAR ESTA LÍNEA
    projectId: "proyecto-final-moviles-c43d9",
    storageBucket: "proyecto-final-moviles-c43d9.firebasestorage.app",
    messagingSenderId: "630248165000",
    appId: "1:630248165000:web:c4a6834749de566620d93d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export default app;