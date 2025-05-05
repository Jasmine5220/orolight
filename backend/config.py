import os

class Config:
    SECRET_KEY = os.environ.get("SESSION_SECRET", "dev-secret-key")
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }
    
    # JWT configuration
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    
    # Upload configuration
    UPLOAD_FOLDER = "static/uploads"
    GRADCAM_FOLDER = "static/gradcam"
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload
    
    # Model configuration
    MODEL_PATH = "model/best_model.h5"
    CLASS_LABELS = ["Non-Cancer", "Cancer"]
