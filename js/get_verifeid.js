// Import Firebase modules
import { app } from './firebaseConfig.js'; // Your Firebase configuration file
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

document.getElementById("verificationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const pin = document.getElementById("pin").value.trim();
    const state = document.getElementById("state").value.trim();
    const country = document.getElementById("country").value.trim();

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;

            const verificationData = {
                fullName,
                email,
                phone,
                address,
                pin,
                state,
                country,
                timestamp: new Date().toISOString(),
            };

            try {
                // Save the data in Firestore under the "get-verified" collection
                await setDoc(doc(db, "get-verified", uid), verificationData);
                alert("Your verification details have been submitted successfully!");
                document.getElementById("verificationForm").reset();
            } catch (error) {
                console.error("Error saving verification data:", error);
                alert("Failed to submit your details. Please try again.");
            }
        } else {
            alert("You need to be logged in to submit verification details.");
        }
    });
});
