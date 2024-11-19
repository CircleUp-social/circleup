// Like a post
async function likePost(postId) {
    const likeRef = doc(db, "postlikes", postId, "likes", loggedInUserId);

    const userLikeDoc = await getDoc(likeRef);
    if (userLikeDoc.exists()) {
        await deleteDoc(likeRef); // Remove like
    } else {
        await setDoc(likeRef, {
            userId: loggedInUserId,
            timestamp: new Date(),
        }); // Add like
    }

    // Update like count
    const likeSnapshot = await getDocs(collection(db, "postlikes", postId, "likes"));
    const likeCount = likeSnapshot.size;
    document.getElementById(`likeCount-${postId}`).innerText = `(${likeCount})`;

    // Toggle like icon
    const postElement = document.getElementById(postId);
    const likeIcon = userLikeDoc.exists() ? "images/like.png" : "images/likefill.png";
    postElement.querySelector(".like-icon").src = likeIcon;
}

// Toggle comments visibility
function toggleComments(postId) {
    const commentsSection = document.getElementById(`commentsSection-${postId}`);
    commentsSection.style.display = commentsSection.style.display === "none" ? "block" : "none";
}

// Add a comment to the post
async function addComment(postId) {
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const commentText = commentInput.value.trim();

    if (commentText) {
        const commentsRef = collection(db, "postcomments", postId, "comments");
        await setDoc(doc(commentsRef), {
            userId: loggedInUserId,
            text: commentText,
            timestamp: new Date(),
        });

        commentInput.value = '';
        fetchComments(postId);
    }
}

// Fetch and display comments for a post
async function fetchComments(postId) {
    const commentsRef = collection(db, "postcomments", postId, "comments");
    const querySnapshot = await getDocs(commentsRef);
    const commentsElement = document.getElementById(`comments-${postId}`);
    commentsElement.innerHTML = '';

    for (const commentDoc of querySnapshot.docs) {
        const commentData = commentDoc.data();
        const userDoc = await getDoc(doc(db, "users", commentData.userId));
        const username = userDoc.exists() ? userDoc.data().username : "Anonymous";

        const commentElement = document.createElement('div');
        commentElement.innerHTML = `
            <p><strong>${username}</strong>: ${commentData.text}</p>
            <p><small>Posted on: ${commentData.timestamp.toDate()}</small></p>
        `;
        commentsElement.appendChild(commentElement);
    }
}

// Share a post's URL
function sharePost(postId) {
    const postUrl = window.location.href + "#" + postId; // Generate URL
    if (navigator.share) {
        navigator.share({
            title: 'Check out this post!',
            url: postUrl,
        })
        .then(() => console.log('Post shared successfully'))
        .catch(error => console.error('Error sharing post:', error));
    } else {
        alert("Sharing is not supported on this device.");
    }
}
