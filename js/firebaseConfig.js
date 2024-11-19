// assets/js/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnR7U8nnWWOjMalysup_IMknnr0pG9KQI",
  authDomain: "voxaabykaif.firebaseapp.com",
  databaseURL: "https://voxaabykaif-default-rtdb.firebaseio.com",
  projectId: "voxaabykaif",
  storageBucket: "voxaabykaif.appspot.com",
  messagingSenderId: "1038648133788",
  appId: "1:1038648133788:web:a320cbed283c7e4d664559"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
