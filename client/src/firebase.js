import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuYCYPAJnSZVgf-atudi-L1540EcvJCeY",
  authDomain: "instragram-clone-37c0b.firebaseapp.com",
  projectId: "instragram-clone-37c0b",
  storageBucket: "instragram-clone-37c0b.appspot.com",
  messagingSenderId: "884121487063",
  appId: "1:884121487063:web:2c37caabe2a7be6fca1292",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth();
const storage = getStorage(firebaseApp);
export { db, auth, storage };
