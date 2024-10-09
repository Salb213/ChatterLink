const startBtn = document.getElementById('start-btn');
const cameraSection = document.getElementById('camera-section');
const captureBtn = document.getElementById('capture-btn');
let videoStream = null;
let photos = [];

startBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your username.');
        return;
    }

    // Show camera section and request camera access
    cameraSection.style.display = 'block';
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('camera-stream').srcObject = videoStream;
});

captureBtn.addEventListener('click', async () => {
    const video = document.getElementById('camera-stream');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < 10; i++) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photos.push(canvas.toDataURL('image/png'));
    }

    videoStream.getTracks().forEach(track => track.stop()); // Stop the camera

    // Get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            // Here we'll send data via email (I'll explain this in a later step)
            alert(`Data captured:\nUsername: ${document.getElementById('username').value}\nLocation: ${locationData.latitude}, ${locationData.longitude}`);
        }, error => {
            alert('Unable to fetch location');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});
