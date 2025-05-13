document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera-feed');
    const canvas = document.getElementById('capture-canvas');
    const captureBtn = document.getElementById('capture-btn');
    const fileInput = document.getElementById('file-input');
    const predictBtn = document.getElementById('predict-btn');
    const uploadForm = document.getElementById('uploadForm');
    let currentImageBlob = null;

    // Initialize Camera
    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            video.srcObject = stream;
        } catch (error) {
            console.error('Camera error:', error);
            document.getElementById('camera-section').style.display = 'none';
        }
    };

    // Capture Image Handler
    captureBtn.addEventListener('click', async () => {
        try {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            // Convert to Blob
            canvas.toBlob((blob) => {
                currentImageBlob = blob;
                predictBtn.disabled = false;
            }, 'image/jpeg', 0.85);
        } catch (error) {
            console.error('Capture error:', error);
        }
    });

    // File Input Handler
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            currentImageBlob = fileInput.files[0];
            predictBtn.disabled = false;
        }
    });

    // Form Submission Handler
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentImageBlob) {
            alert('Please capture or upload an image first');
            return;
        }

        const formData = new FormData();
        formData.append('file', currentImageBlob, 'capture.jpg');

        // Show loading state
        predictBtn.disabled = true;
        predictBtn.textContent = 'Analyzing...';

        try {
            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                window.location.reload(); // Refresh to show results
            } else {
                throw new Error('Analysis failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Analysis failed. Please try again.');
            predictBtn.disabled = false;
            predictBtn.textContent = 'Analyze Now';
        }
    });

    // Initialize camera on load
    initCamera();
});
