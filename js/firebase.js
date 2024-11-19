// Firebase setup and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collectionGroup, doc, getDoc, query, onSnapshot, setDoc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnR7U8nnWWOjMalysup_IMknnr0pG9KQI",
    authDomain: "voxaabykaif.firebaseapp.com",
    databaseURL: "https://voxaabykaif-default-rtdb.firebaseio.com",
    projectId: "voxaabykaif",
    storageBucket: "voxaabykaif.appspot.com",
    messagingSenderId: "1038648133788",
    appId: "1:1038648133788:web:a320cbed283c7e4d664559"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
