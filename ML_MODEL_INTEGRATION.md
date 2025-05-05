# ML Model Integration Guide

This guide explains how to integrate your machine learning model with the Medical Imaging Application for cancer detection.

## Pre-requisites

1. A trained TensorFlow model for cancer detection (`.h5` format)
2. Python with TensorFlow, OpenCV, and related libraries installed

## Step 1: Install Required Libraries

```bash
pip install tensorflow opencv-python matplotlib
```

## Step 2: Place Your Model File

Place your trained model file in the `model/` directory as `best_model.h5`. If your model has a different filename or format, you'll need to update the `MODEL_PATH` in `backend/config.py`.

## Step 3: Update Utils.py

The `backend/utils.py` file contains commented code that you need to uncomment and possibly modify for your specific model. The key functions are:

### 1. Load Prediction Model

Uncomment the model loading code in the `load_prediction_model()` function:

```python
def load_prediction_model():
    """Load the prediction model."""
    global model
    
    MODEL_PATH = current_app.config["MODEL_PATH"]
    model = load_model(MODEL_PATH)
    return model
```

### 2. Preprocess Image

Uncomment and modify the preprocessing code in the `preprocess_image()` function to match your model's requirements:

```python
def preprocess_image(img_path):
    """Preprocess input image for model prediction."""
    img = image.load_img(img_path, target_size=(299, 299))  # Adjust size if needed
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)  # Use appropriate preprocessing
    return img_array
```

### 3. Make Prediction

Uncomment and modify the prediction code in the `make_prediction()` function:

```python
def make_prediction(img_path):
    """Predict cancer or non-cancer."""
    CLASS_LABELS = current_app.config["CLASS_LABELS"]
    img_array = preprocess_image(img_path)
    prediction = model.predict(img_array)[0][0]
    
    class_label = CLASS_LABELS[int(prediction <= 0.5)]  # Adjust logic as needed
    confidence = 100 - (prediction * 100) if class_label == "Non-Cancer" else prediction * 100
    
    return class_label, float(confidence)
```

### 4. Generate Grad-CAM

Uncomment and modify the Grad-CAM code in the `generate_gradcam()` function. You may need to adjust the `last_conv_layer_name` parameter to match your model architecture.

```python
def generate_gradcam(image_path, model, last_conv_layer_name="conv_7b"):
    # Uncomment the existing code for Grad-CAM generation
```

## Step 4: Update Imports

Uncomment the import statements at the top of `utils.py`:

```python
import tensorflow as tf
import cv2
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_resnet_v2 import preprocess_input
from tensorflow.keras import backend as K
```

## Step 5: Test Your Integration

After making these changes, restart the application and test the model:

1. Upload an image through the web interface or mobile app
2. Verify that the prediction and Grad-CAM visualization are working
3. Check the confidence score and prediction label

## Troubleshooting

### Model Loading Issues

If your model fails to load, check:
- File path is correct
- Model format is compatible
- Required TensorFlow version is installed

### Prediction Errors

If predictions seem incorrect:
- Ensure preprocessing matches what was used during training
- Check input image dimensions
- Verify the classification threshold

### Grad-CAM Errors

If Grad-CAM visualization fails:
- Verify the last convolutional layer name
- Check if your model architecture is compatible with Grad-CAM
- Ensure OpenCV is properly installed

## Advanced Customization

### Multi-class Classification

If your model supports multiple cancer types (beyond binary classification), modify:

1. `CLASS_LABELS` in `config.py` to include all classes
2. The prediction logic in `make_prediction()` to handle multiple classes
3. The UI templates to display multiple class options

### Custom Preprocessing

If your model requires specialized preprocessing beyond what's included:

1. Add your custom preprocessing function to `utils.py`
2. Call it from `preprocess_image()` or replace the function entirely

### Alternative Visualization Methods

If you want to use methods other than Grad-CAM:

1. Add your custom visualization function to `utils.py`
2. Update the routes to use your function instead of `generate_gradcam()`
