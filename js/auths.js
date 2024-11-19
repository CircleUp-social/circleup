// Handle user authentication and get user ID
const postContainer = document.getElementById('postContainer');
let loggedInUserId = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        loggedInUserId = user.uid;
        fetchPosts(); // Fetch posts once the user is logged in
    } else {
        console.log("No user is logged in");
    }
});
