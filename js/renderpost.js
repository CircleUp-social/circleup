// Render posts with user details and media
function renderPost(postId, postData, username, userLiked, likeCount, profilePicURL, verified) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.id = postId;

    const likeIcon = userLiked ? "images/likefill.png" : "images/like.png";

    // Handle media content (image or video)
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
        ${mediaContent}
        <h3>${postData.title}</h3>
        <p>${postData.description}</p>
        <p><strong>Posted on:</strong> ${postData.date}</p>
        <img src="${likeIcon}" alt="Like" onclick="likePost('${postId}')" class="like-icon">
        <span id="likeCount-${postId}">(${likeCount})</span>
        <img src="/images/comment.png" alt="Comment" onclick="toggleComments('${postId}')" class="comment-icon">
        <img src="images/share.png" alt="Share" onclick="sharePost('${postId}')" class="share-icon">
        <div id="commentsSection-${postId}" class="comments-section" style="display:none;">
            <div id="comments-${postId}" class="comments"></div>
            <input type="text" id="commentInput-${postId}" placeholder="Add a comment..." />
            <button onclick="addComment('${postId}')">Post Comment</button>
        </div>
    `;

    postContainer.appendChild(postElement);
    fetchComments(postId); // Fetch comments for this post
}
