import os
import numpy as np
import tensorflow as tf
import cv2
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from flask import Flask, request, render_template, redirect, url_for, jsonify, flash
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from tensorflow.keras.applications.inception_resnet_v2 import preprocess_input
from tensorflow.keras import backend as K
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import send_from_directory
from PIL import Image
from base64 import b64decode
from werkzeug.utils import secure_filename
import os
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Set upload folder
UPLOAD_FOLDER = "static/uploads"
GRADCAM_FOLDER = "static/gradcam"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["GRADCAM_FOLDER"] = GRADCAM_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GRADCAM_FOLDER, exist_ok=True)

# Database config - Using SQLite instead of PostgreSQL for simplicity
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///orolight.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config["JWT_SECRET_KEY"] = "orolight-secret-key-change-in-production"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)
db = SQLAlchemy(app)

# Load trained model
MODEL_PATH = "model/best_model.h5"
model = load_model(MODEL_PATH)

# Class labels
CLASS_LABELS = ["Non-Cancer", "Cancer"]

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, username, password, email):
        self.username = username
        self.password = generate_password_hash(password)
        self.email = email
    
    def check_password(self, password):
        return check_password_hash(self.password, password)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with predictions
    predictions = db.relationship('Prediction', backref='patient', lazy=True)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    filename = db.Column(db.String(120))
    prediction = db.Column(db.String(20))
    confidence = db.Column(db.Float)
    gradcam_path = db.Column(db.String(120))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

def preprocess_image(img_path):
    """Preprocess input image for model prediction."""
    img = image.load_img(img_path, target_size=(299, 299))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

def make_prediction(img_path):
    """Predict cancer or non-cancer."""
    img_array = preprocess_image(img_path)
    prediction = model.predict(img_array)[0][0]
    
    class_label = CLASS_LABELS[int(prediction <= 0.5)]  # Flip classification
    confidence = prediction if class_label == "Non-Cancer" else prediction
    
    return class_label, float(confidence / 100)

def generate_gradcam(image_path, model, last_conv_layer_name="conv_7b"):
    # Load the image
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(299, 299))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    # Create a model for gradcam
    grad_model = tf.keras.models.Model(
        [model.input], [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, 0]  # Assuming binary classification

    # Compute gradients
    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]  # Remove batch dimension
    heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)

    # Normalize heatmap
    heatmap = np.maximum(heatmap, 0)  # ReLU operation
    heatmap /= np.max(heatmap)  # Normalize to 0-1 range

    # Load the original image
    img = cv2.imread(image_path)
    img = cv2.resize(img, (299, 299))

    # Apply heatmap
    heatmap = cv2.resize(heatmap, (299, 299))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Superimpose the heatmap on the image
    superimposed_img = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)

    # Save Grad-CAM output
    gradcam_filename = os.path.basename(image_path).split('.')[0] + "_gradcam.jpg"
    gradcam_path = os.path.join(app.config["GRADCAM_FOLDER"], gradcam_filename)
    cv2.imwrite(gradcam_path, superimposed_img)

    return gradcam_path

# Authentication routes

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(username=data["username"]).first()
    
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid username or password"}), 401
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "access_token": access_token,
        "user_id": user.id,
        "username": user.username
    }), 200

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
       password=data['password']  # Pass plain password to constructor
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "Registration successful"}), 201


@app.route("/api/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong"}), 200

# Patient routes
@app.route("/api/patients", methods=["POST"])
@jwt_required()
def create_patient():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    new_patient = Patient(
        name=data["name"],
        age=data["age"],
        gender=data["gender"],
        doctor_id=current_user_id
    )
    
    db.session.add(new_patient)
    db.session.commit()
    
    return jsonify({
        "id": new_patient.id,
        "name": new_patient.name
    }), 201

@app.route("/api/patients", methods=["GET"])
@jwt_required()
def get_patients():
    current_user_id = get_jwt_identity()
    
    patients = Patient.query.filter_by(doctor_id=current_user_id).all()
    
    result = []
    for patient in patients:
        result.append({
            "id": patient.id,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender
        })
    
    return jsonify(result), 200

# Prediction API for mobile app
@app.route("/api/predict", methods=["POST"])
@jwt_required()
def api_predict():
    current_user_id = get_jwt_identity()
    
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    patient_id = request.form.get("patient_id")
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    # Verify patient belongs to doctor
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user_id).first()
    if not patient:
        return jsonify({"error": "Patient not found or unauthorized"}), 404
    
    # Save the file
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)
    
    # Make prediction
    class_label, confidence = make_prediction(filepath)
    
    # Generate Grad-CAM
    gradcam_path = generate_gradcam(filepath, model)
    
    # Save prediction to database
    new_prediction = Prediction(
        patient_id=patient_id,
        filename=filename,
        prediction=class_label,
        confidence=confidence,
        gradcam_path=gradcam_path
    )
    
    db.session.add(new_prediction)
    db.session.commit()
    
    # Return prediction data
    return jsonify({
        "id": new_prediction.id,
        "prediction": class_label,
        "confidence": confidence,
        "image_url": url_for("static", filename=f"uploads/{filename}", _external=True),
        "gradcam_url": url_for("static", filename=f"gradcam/{os.path.basename(gradcam_path)}", _external=True)
    }), 200

# Get patient history
@app.route("/api/patients/<int:patient_id>/predictions", methods=["GET"])
@jwt_required()
def get_patient_predictions(patient_id):
    current_user_id = get_jwt_identity()
    
    # Verify patient belongs to doctor
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user_id).first()
    if not patient:
        return jsonify({"error": "Patient not found or unauthorized"}), 404
    
    predictions = Prediction.query.filter_by(patient_id=patient_id).order_by(Prediction.timestamp.desc()).all()
    
    result = []
    for pred in predictions:
        result.append({
            "id": pred.id,
            "prediction": pred.prediction,
            "confidence": pred.confidence,
            "date": pred.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "image_url": url_for("static", filename=f"uploads/{pred.filename}", _external=True),
            "gradcam_url": url_for("static", filename=f"gradcam/{os.path.basename(pred.gradcam_path)}", _external=True)
        })
    
    return jsonify(result), 200

@app.route("/", methods=["GET", "POST"])
def upload_and_predict():
    if request.method == "POST":
        # Case 1: Uploaded file
        if "file" in request.files and request.files["file"].filename != "":
            file = request.files["file"]
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)

        # Case 2: Base64 image from camera
        elif "captured_image" in request.form:
            img_data = request.form["captured_image"]
            if img_data:
                header, encoded = img_data.split(",", 1)
                image = Image.open(io.BytesIO(b64decode(encoded)))
                filename = "captured_image.jpg"
                filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                image.save(filepath)
            else:
                flash("Captured image data is empty.")
                return redirect(request.url)

        else:
            flash("No image provided.")
            return redirect(request.url)

        # Common prediction flow
        class_label, confidence = make_prediction(filepath)
        gradcam_path = generate_gradcam(filepath, model)

        return render_template(
            "index.html",
            filename=filename,
            prediction=class_label,
            confidence=confidence,
            gradcam=gradcam_path,
        )

    return render_template("index.html", filename=None)

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return url_for("static", filename="uploads/" + filename)



# Initialize database
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
