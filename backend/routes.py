import os
from flask import request, jsonify, render_template, redirect, url_for, flash, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from backend.app import app, db
from backend.models import User, ImageUpload
from backend.utils import load_prediction_model, make_prediction, generate_gradcam, save_uploaded_file
import logging

# Initialize model at app startup
from flask import Flask

# Create a function to be called after the app is created
def init_app(app):
    with app.app_context():
        load_prediction_model()

# Call this in app.py after app creation

# Web Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            # Create web session
            # In a real app, we'd use Flask-Login here
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Check if user exists
        if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
            flash('User already exists')
            return render_template('register.html')
        
        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please log in.')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    # In real app, we'd use Flask-Login to verify user is logged in
    # For now, just showing the template
    images = ImageUpload.query.order_by(ImageUpload.created_at.desc()).limit(10).all()
    return render_template('dashboard.html', images=images)

@app.route('/admin')
def admin():
    # In real app, we'd check if user is admin
    users = User.query.all()
    images = ImageUpload.query.order_by(ImageUpload.created_at.desc()).all()
    return render_template('admin.html', users=users, images=images)

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(url_for('dashboard'))
    
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('dashboard'))
    
    # For web app we'd get user id from session
    # Hardcoding a user_id for now
    user_id = 1
    
    filepath, filename, original_filename = save_uploaded_file(file, user_id)
    
    # Make prediction
    class_label, confidence = make_prediction(filepath)
    
    # Generate Grad-CAM
    model = load_prediction_model()
    gradcam_path = generate_gradcam(filepath, model)
    
    # Save prediction to database
    image_upload = ImageUpload(
        user_id=user_id,
        filename=filename,
        original_filename=original_filename,
        prediction=class_label,
        confidence=confidence,
        gradcam_path=os.path.basename(gradcam_path)
    )
    db.session.add(image_upload)
    db.session.commit()
    
    return redirect(url_for('dashboard'))

# API Routes for mobile app
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    
    return jsonify({"msg": "Invalid email or password"}), 401

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # Check if user exists
    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return jsonify({"msg": "User already exists"}), 400
    
    # Create new user
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, user=user.to_dict()), 201

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def api_upload():
    user_id = get_jwt_identity()
    
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400
    
    filepath, filename, original_filename = save_uploaded_file(file, user_id)
    
    # Make prediction
    class_label, confidence = make_prediction(filepath)
    
    # Generate Grad-CAM
    model = load_prediction_model()
    gradcam_path = generate_gradcam(filepath, model)
    
    # Save prediction to database
    image_upload = ImageUpload(
        user_id=user_id,
        filename=filename,
        original_filename=original_filename,
        prediction=class_label,
        confidence=confidence,
        gradcam_path=os.path.basename(gradcam_path)
    )
    db.session.add(image_upload)
    db.session.commit()
    
    return jsonify({
        "id": image_upload.id,
        "prediction": class_label,
        "confidence": confidence,
        "image_url": url_for('get_image', filename=filename, _external=True),
        "gradcam_url": url_for('get_gradcam', filename=os.path.basename(gradcam_path), _external=True)
    }), 201

@app.route('/api/history', methods=['GET'])
@jwt_required()
def api_history():
    user_id = get_jwt_identity()
    images = ImageUpload.query.filter_by(user_id=user_id).order_by(ImageUpload.created_at.desc()).all()
    
    return jsonify([{
        "id": img.id,
        "prediction": img.prediction,
        "confidence": img.confidence,
        "created_at": img.created_at.isoformat(),
        "image_url": url_for('get_image', filename=img.filename, _external=True),
        "gradcam_url": url_for('get_gradcam', filename=img.gradcam_path, _external=True)
    } for img in images]), 200

@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def api_admin_users():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.is_admin:
        return jsonify({"msg": "Unauthorized"}), 403
    
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/api/admin/images', methods=['GET'])
@jwt_required()
def api_admin_images():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.is_admin:
        return jsonify({"msg": "Unauthorized"}), 403
    
    images = ImageUpload.query.order_by(ImageUpload.created_at.desc()).all()
    
    return jsonify([{
        "id": img.id,
        "user_id": img.user_id,
        "username": User.query.get(img.user_id).username,
        "prediction": img.prediction,
        "confidence": img.confidence,
        "created_at": img.created_at.isoformat(),
        "image_url": url_for('get_image', filename=img.filename, _external=True),
        "gradcam_url": url_for('get_gradcam', filename=img.gradcam_path, _external=True)
    } for img in images]), 200

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/gradcam/<filename>')
def get_gradcam(filename):
    return send_from_directory(app.config['GRADCAM_FOLDER'], filename)
