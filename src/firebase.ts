import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuIzaGH_zFUGOyvg_Gt_bB1yBger-1IcQ",
  authDomain: "schedule-806c9.firebaseapp.com",
  projectId: "schedule-806c9",
  storageBucket: "schedule-806c9.firebasestorage.app",
  messagingSenderId: "223251388130",
  appId: "1:223251388130:web:23c4b2299a90b18daa70bb",
  measurementId: "G-JTXE30GS9X"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
