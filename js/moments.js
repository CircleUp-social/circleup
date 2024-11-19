// Initialize Firebase
const db = firebase.firestore();
const storage = firebase.storage();
const momentsRef = db.collection('users').doc(firebase.auth().currentUser.uid).collection('moments');

// Upload Moment
function uploadMoment() {
    const fileInput = document.getElementById('momentUpload');
    const file = fileInput.files[0];
    
    if (!file) return alert("Please select a file to upload");

    // Store file in Firebase Storage
    const storageRef = storage.ref('moments/' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', (snapshot) => {
        // Progress monitoring
    }, (error) => {
        console.error(error);
    }, () => {
        // File uploaded successfully
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            const timestamp = new Date();
            const expirationTime = timestamp.getTime() + 24 * 60 * 60 * 1000; // 24 hours

            // Save moment in Firestore
            momentsRef.add({
                mediaURL: url,
                timestamp: timestamp.toISOString(),
                expirationTime: new Date(expirationTime).toISOString(),
                viewCount: 0
            });

            alert("Moment uploaded successfully!");
            fileInput.value = ''; // Clear input field
            loadMoments(); // Reload moments
        });
    });
}

// Display Moments
function loadMoments() {
    momentsRef.get().then((querySnapshot) => {
        const momentsList = document.getElementById('momentsList');
        momentsList.innerHTML = ''; // Clear existing moments

        querySnapshot.forEach(doc => {
            const momentData = doc.data();
            const currentTime = new Date();
            const expirationTime = new Date(momentData.expirationTime);

            // If the moment has expired, don't display it
            if (currentTime > expirationTime) {
                doc.ref.delete(); // Delete expired moment
                return;
            }

            const momentElement = document.createElement('div');
            momentElement.classList.add('moment');
            momentElement.innerHTML = `
                <div class="view-count">Views: ${momentData.viewCount}</div>
                <div class="delete-btn" onclick="deleteMoment('${doc.id}')">X</div>
                ${momentData.mediaURL.endsWith('.mp4') || momentData.mediaURL.endsWith('.mov') ?
                    `<video autoplay loop muted><source src="${momentData.mediaURL}" type="video/mp4"></video>` :
                    `<img src="${momentData.mediaURL}" alt="Moment Image">`
                }
            `;
            momentsList.appendChild(momentElement);
        });
    });
}

// Delete Moment
function deleteMoment(momentId) {
    momentsRef.doc(momentId).delete()
        .then(() => {
            alert('Moment deleted!');
            loadMoments(); // Reload moments
        })
        .catch((error) => {
            console.error("Error deleting moment: ", error);
        });
}

// Load moments when the page is loaded
window.onload = loadMoments;
