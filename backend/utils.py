import os
import uuid
import numpy as np
from flask import current_app

model = None

def load_prediction_model():
    """Load the prediction model."""
    # Placeholder for when the model is added later
    print("Model loading is temporarily disabled - will be added by user later")
    return None

def preprocess_image(img_path):
    """Preprocess input image for model prediction."""
    # Placeholder for preprocessing
    print(f"Image preprocessing for {img_path} - functionality will be added later")
    return None

def make_prediction(img_path):
    """Predict cancer or non-cancer."""
    # Return placeholder prediction
    print(f"Making prediction for {img_path} - functionality will be added later")
    return "Placeholder Result", 85.0

def generate_gradcam(image_path, model=None, last_conv_layer_name=None):
    """Generate Grad-CAM visualization for the image."""
    # Return placeholder gradcam path
    print(f"Generating Grad-CAM for {image_path} - functionality will be added later")
    # Create a placeholder image path
    filename = os.path.basename(image_path)
    base_filename, ext = os.path.splitext(filename)
    gradcam_filename = f"{base_filename}_gradcam_placeholder{ext}"
    gradcam_path = os.path.join(current_app.config["GRADCAM_FOLDER"], gradcam_filename)
    
    # Instead of writing a real file, just return the path
    # File will be created when the real model is added
    return gradcam_path

def save_uploaded_file(file, user_id):
    """Save uploaded file with a unique name."""
    unique_filename = str(uuid.uuid4())
    original_filename = file.filename
    ext = os.path.splitext(original_filename)[1]
    filename = f"{unique_filename}{ext}"
    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)
    return filepath, filename, original_filename
