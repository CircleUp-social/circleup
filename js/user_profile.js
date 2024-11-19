<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getFirestore, collection, doc, getDocs, query } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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
    const auth = getAuth();

    // DOM elements
    const userInfoContainer = document.getElementById("user-info");
    const postsGrid = document.getElementById("posts-grid");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Fetch user profile info and display
            await loadUserProfile(user.uid);

            // Load user posts (memories)
            await loadUserPosts(user.uid);
        } else {
            window.location.href = "login.html";
        }
    });

    // Fetch user profile (username) from Firestore
    async function loadUserProfile(userId) {
        try {
            const userDoc = await doc(db, "users", userId).get();
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const usernameElement = document.getElementById("username");
                usernameElement.textContent = `Username: ${userData.username || 'No username set'}`;
            } else {
                console.log("User profile does not exist.");
            }
        } catch (error) {
            console.error("Error fetching user profile: ", error);
        }
    }

    // Fetch user posts from the "dropping" collection
    async function loadUserPosts(userId) {
        postsGrid.innerHTML = "<p>Loading posts...</p>"; // Loading state

        try {
            const postsQuery = query(collection(db, "users", userId, "dropping"));
            const querySnapshot = await getDocs(postsQuery);

            if (querySnapshot.size === 0) {
                postsGrid.innerHTML = "<p>No posts available.</p>";
            } else {
                postsGrid.innerHTML = ""; // Clear loading state

                querySnapshot.forEach((doc) => {
                    const post = doc.data();
                    const postCard = document.createElement("div");
                    postCard.classList.add("post-card");

                    // Use textContent for title and description to prevent XSS
                    const postTitle = document.createElement("div");
                    postTitle.classList.add("post-title");
                    postTitle.textContent = post.title || 'Untitled Post';

                    const postDescription = document.createElement("div");
                    postDescription.classList.add("post-description");
                    postDescription.textContent = post.description || 'No description';

                    const postMedia = document.createElement("div");
                    postMedia.classList.add("post-media");

                    // Handle media (image/video) display
                    if (post.mediaUrl) {
                        if (post.mediaType === 'image') {
                            const img = document.createElement("img");
                            img.src = post.mediaUrl;
                            img.alt = "Post image";
                            postMedia.appendChild(img);
                        } else if (post.mediaType === 'video') {
                            const video = document.createElement("video");
                            video.src = post.mediaUrl;
                            video.controls = true;
                            postMedia.appendChild(video);
                        }
                    }

                    postCard.appendChild(postTitle);
                    postCard.appendChild(postDescription);
                    postCard.appendChild(postMedia);
                    postsGrid.appendChild(postCard);
                });
            }
        } catch (error) {
            console.error("Error fetching posts: ", error);
            postsGrid.innerHTML = "<p>Error loading posts.</p>";
        }
    }
</script>
