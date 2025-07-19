import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAzkjNy9Tjcz6b7VVBBI3z5Jmqd2GwC4O8",
  authDomain: "test-69ef0.firebaseapp.com",
  projectId: "test-69ef0",
  storageBucket: "test-69ef0.firebasestorage.app",
  messagingSenderId: "464632148031",
  appId: "1:464632148031:android:691bf02a6471332052c88a"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);





export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
export const db = getFirestore(app);