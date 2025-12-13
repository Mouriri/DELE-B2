
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBiVjcFmpmDx6Iev4CFTqZK5bjI7JPWfAU",
    authDomain: "camino-de-santiago-77eab.firebaseapp.com",
    databaseURL: "https://camino-de-santiago-77eab-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "camino-de-santiago-77eab",
    storageBucket: "camino-de-santiago-77eab.firebasestorage.app",
    messagingSenderId: "903671756289",
    appId: "1:903671756289:web:4753aba066b5861da53200",
    measurementId: "G-LG473NF8HX"
};

// Initialize Firebase
// Usamos getApps().length para evitar errores de doble inicialización en Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Inicializar Analytics solo en el cliente (navegador)
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((yes) => {
        if (yes) {
            analytics = getAnalytics(app);
        }
    });
}

export { analytics };
