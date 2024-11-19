import { getDoc, doc, getDocs, collection, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase Configuration (if needed)
const db = getFirestore();

// Function to load circles the user is a member of
async function loadUserCircles(userId) {
  const circleList = document.getElementById("circle-list");

  // Reference to the 'circleMembers' collection
  const circleMembersRef = collection(db, "circleMembers");

  try {
    // Fetch all documents from 'circleMembers' collection
    const querySnapshot = await getDocs(circleMembersRef);
    querySnapshot.forEach(async (docSnapshot) => {
      const circleData = docSnapshot.data();

      // Check if the 'userId' inside the 'circleMembers' matches the logged-in userId
      if (circleData.userId === userId) {
        const circleId = circleData.circleId; // Assuming 'circleId' field stores the circle's ID

        // Now fetch the circle details from the 'circles' collection
        const circleRef = doc(db, "circles", circleId);
        const circleSnapshot = await getDoc(circleRef);

        if (circleSnapshot.exists()) {
          const circle = circleSnapshot.data();

          // Create and append the circle to the sidebar
          const listItem = document.createElement("li");
          listItem.className = "circle-item";
          listItem.innerHTML = `
            <img src="${circle.imageUrl || 'images/default.png'}" alt="${circle.name} Profile" class="circle-photo">
            <span class="circle-name">${circle.name}</span>
          `;
          listItem.onclick = () => {
            window.location.href = "circle_chat.html?circleId=" + circleId;
          };
          circleList.appendChild(listItem);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user circles:", error);
  }
}

// Check for authenticated user and load circles
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserCircles(user.uid);
  } else {
    window.location.href = "login.html";
  }
});
