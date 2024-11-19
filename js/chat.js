import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// References
const chatMessages = document.getElementById("chat-messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const addMemberBtn = document.getElementById("add-member");

// Circle ID - dynamically set based on current circle
const circleId = "your_circle_id"; // Replace with dynamic ID

// Real-time message listener
const messagesRef = collection(db, `circles/${circleId}/messages`);
const messagesQuery = query(messagesRef, orderBy("timestamp"));
onSnapshot(messagesQuery, (snapshot) => {
  chatMessages.innerHTML = "";
  snapshot.forEach((doc) => {
    const message = doc.data();
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";
    messageElement.innerHTML = `<span class="user">${message.user}:</span> ${message.text}`;
    chatMessages.appendChild(messageElement);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Send message
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (messageInput.value.trim() === "") return;

  await addDoc(messagesRef, {
    user: "User Name", // dynamically fetch the username
    text: messageInput.value,
    timestamp: serverTimestamp()
  });

  messageInput.value = "";
});

// Add Member functionality
addMemberBtn.addEventListener("click", () => {
  // Placeholder for adding a member logic
  alert("Add member functionality to be implemented!");
});


