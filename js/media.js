import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from './firebaseConfig.js'; // Ensure you have the correct import for your Firestore setup

let videos = []; // Array to store filtered videos

// Function to fetch videos from the 'media' subcollection based on the search query
async function fetchVideos(titleQuery = '') {
    const videosCollection = collection(db, 'media'); // Assuming 'media' is the subcollection under your main collection
    let videoQuery;

    if (titleQuery) {
        // Filter by title if a search query exists
        videoQuery = query(videosCollection, where("title", "==", titleQuery));
    } else {
        // Fetch all videos if no search query
        videoQuery = query(videosCollection);
    }

    const querySnapshot = await getDocs(videoQuery);
    const fetchedVideos = [];
    
    querySnapshot.forEach((doc) => {
        const videoData = doc.data();
        fetchedVideos.push(videoData); // Push the video data
    });
    
    videos = fetchedVideos; // Assign to the global videos array
    renderVideos(videos); // Render videos
}

// Function to render videos in the post container
function renderVideos(videoArray) {
    const postContainer = document.getElementById('postContainer');
    postContainer.innerHTML = ''; // Clear previous content
    videoArray.forEach((video) => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        
        // Assuming video has a title, URL, and other details
        videoElement.innerHTML = `
            <video src="${video.videoURL}" autoplay loop muted></video>
            <p>${video.title}</p>
        `;
        postContainer.appendChild(videoElement);
    });
}

// Function to search videos
function searchVideos() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    
    if (searchQuery.trim() === '') {
        // If search bar is empty, show all videos
        fetchVideos();
    } else {
        // Fetch videos based on the title search
        fetchVideos(searchQuery);
    }
}

// Initialize fetching of videos (first load with no search query)
fetchVideos();

// Set up the event listener for the search bar
document.getElementById('search-bar').addEventListener('input', searchVideos);
