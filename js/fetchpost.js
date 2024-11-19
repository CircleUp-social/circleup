// Fetch all posts from Firebase
async function fetchPosts() {
    const postsQuery = query(collectionGroup(db, "media"));
    onSnapshot(postsQuery, async (querySnapshot) => {
        postContainer.innerHTML = ''; // Clear previous posts

        querySnapshot.forEach(async (postDoc) => {
            const postId = postDoc.id;
            const postData = postDoc.data();
            const userId = postDoc.ref.parent.parent.id;

            // Fetch user profile data (username, profile picture)
            const userDoc = await getDoc(doc(db, "users", userId));
            const username = userDoc.exists() ? userDoc.data().username : "Unknown User";
            const profilePicURL = userDoc.exists() ? userDoc.data().profilePicURL : "images/defaultProfilePic.png";
            const verified = userDoc.exists() && userDoc.data().verified;

            // Check if the user has liked this post
            const userLikeDoc = await getDoc(doc(db, "postlikes", postId, "likes", loggedInUserId));
            const userLiked = userLikeDoc.exists();

            // Fetch like count
            const likeSnapshot = await getDocs(collection(db, "postlikes", postId, "likes"));
            const likeCount = likeSnapshot.size;

            // Render the post with all data
            renderPost(postId, postData, username, userLiked, likeCount, profilePicURL, verified);
        });
    });
}
