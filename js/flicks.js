// Import Firebase and Firestore modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collectionGroup, doc, getDoc, query, onSnapshot, setDoc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM element for post container
const postContainer = document.getElementById('postContainer');
let loggedInUserId = null;

// Function to render a single post with user information
function renderPost(postId, postData, username, userLiked, likeCount, profilePicURL, verified) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.id = postId;

    const likeIcon = userLiked ? "images/likefill.png" : "images/like.png";

    // Check for media type and generate the appropriate HTML
    let mediaContent = '';
    if (postData.mediaUrl) {
        if (postData.mediaType === "image") {
            mediaContent = `<img src="${postData.mediaUrl}" alt="${postData.title}" class="post-media">`;
        } else if (postData.mediaType === "video") {
            mediaContent = `<video src="${postData.mediaUrl}" controls class="post-media"></video>`;
        }
    }

    postElement.innerHTML = `
        <div class="post-header">
            <img src="${profilePicURL}" alt="Profile Picture" class="profile-pic">
            <h3>${username} ${verified ? '<img src="images/tick.png" alt="" class="verified-icon">' : ''}</h3>
        </div>
        ${mediaContent} <!-- Render media (image/video) -->
        <h3>${postData.title}</h3>
        <p>${postData.description}</p>
        <p><strong>Posted on:</strong> ${postData.date}</p>
        <img src="${likeIcon}" alt="Like" onclick="likePost('${postId}')" class="like-icon"> <!-- Like icon button -->
        <span id="likeCount-${postId}">(${likeCount})</span> <!-- Display like count -->
        <img src="/images/comment.png" alt="Comment" onclick="toggleComments('${postId}')" class="comment-icon"> <!-- Comment icon -->
        <img src="images/share.png" alt="Share" onclick="sharePost('${postId}')" class="share-icon"> <!-- Share icon -->
        <div id="commentsSection-${postId}" class="comments-section" style="display:none;">
            <div id="comments-${postId}" class="comments"></div>
            <input type="text" id="commentInput-${postId}" placeholder="Add a comment..." />
            <button onclick="addComment('${postId}')">Post Comment</button>
        </div>
    `;

    postContainer.appendChild(postElement);
    fetchComments(postId); // Fetch comments when post is rendered
}

// Function to fetch posts from all users
async function fetchPosts() {
    const postsQuery = query(collectionGroup(db, "media"));
    onSnapshot(postsQuery, async (querySnapshot) => {
        postContainer.innerHTML = ''; // Clear previous posts

        querySnapshot.forEach(async (postDoc) => {
            const postId = postDoc.id;
            const postData = postDoc.data();
            const userId = postDoc.ref.parent.parent.id;

            // Fetch user's profile data to get the username and profile picture
            const userDoc = await getDoc(doc(db, "users", userId));
            const username = userDoc.exists() ? userDoc.data().username : "Unknown User";
            const profilePicURL = userDoc.exists() ? userDoc.data().profilePicURL : "images/defaultProfilePic.png";
            const verified = userDoc.exists() && userDoc.data().verified;

            // Check if the logged-in user has liked this post
            const userLikeDoc = await getDoc(doc(db, "postlikes", postId, "likes", loggedInUserId));
            const userLiked = userLikeDoc.exists();

            // Fetch the like count for this post
            const likeSnapshot = await getDocs(collection(db, "postlikes", postId, "likes"));
            const likeCount = likeSnapshot.size;

            // Render the post with the username, like status, like count, profile picture, and verified status
            renderPost(postId, postData, username, userLiked, likeCount, profilePicURL, verified);
        });
    });
}

// Function to handle likes
async function likePost(postId) {
    const likeRef = doc(db, "postlikes", postId, "likes", loggedInUserId);

    const userLikeDoc = await getDoc(likeRef);
    if (userLikeDoc.exists()) {
        // User has already liked, so remove like
        await deleteDoc(likeRef);
    } else {
        // User has not liked, so add like
        await setDoc(likeRef, {
            userId: loggedInUserId,
            timestamp: new Date(),
        });
    }

    // Re-fetch and update like count in UI
    const likeSnapshot = await getDocs(collection(db, "postlikes", postId, "likes"));
    const likeCount = likeSnapshot.size;

    document.getElementById(`likeCount-${postId}`).innerText = `(${likeCount})`;

    // Change like icon based on like status
    const postElement = document.getElementById(postId);
    const likeIcon = userLikeDoc.exists() ? "images/like.png" : "images/likefill.png";
    postElement.querySelector(".like-icon").src = likeIcon;
}

// Toggle comments section visibility
function toggleComments(postId) {
    const commentsSection = document.getElementById(`commentsSection-${postId}`);
    commentsSection.style.display = commentsSection.style.display === "none" ? "block" : "none";
}

// Function to add a comment
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

// Function to fetch and display comments
async function fetchComments(postId) {
    const commentsRef = collection(db, "postcomments", postId, "comments");
    const querySnapshot = await getDocs(commentsRef);
    const commentsElement = document.getElementById(`comments-${postId}`);
    commentsElement.innerHTML = '';

    for (const commentDoc of querySnapshot.docs) {
        const commentData = commentDoc.data();
        // Fetch username of the user who posted the comment
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

// Function to share a post's URL
function sharePost(postId) {
    const postUrl = window.location.href + "#" + postId; // Get the post URL
    if (navigator.share) {
        navigator.share({
            title: 'Check out this post!',
            url: postUrl,
        })
        .then(() => console.log('Post shared successfully'))
        .catch((error) => console.log('Error sharing post:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        prompt("Copy this link to share:", postUrl);
    }
}

// Fetch the current user's data and initialize the logged-in user ID
onAuthStateChanged(auth, async (user) => {
    if (user) {
        loggedInUserId = user.uid;
        fetchPosts(); // Initialize post fetching when the user is logged in
    } else {
        console.log("No user is logged in");
    }
});

// Make likePost and sharePost accessible globally
window.likePost = likePost;
window.toggleComments = toggleComments;
window.addComment = addComment;
window.sharePost = sharePost;
