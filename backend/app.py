import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_jwt_extended import JWTManager
from werkzeug.middleware.proxy_fix import ProxyFix
from backend.config import Config

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Setup database
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create Flask app
app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = app.config["SECRET_KEY"]
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Create upload directories if they don't exist
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
os.makedirs(app.config["GRADCAM_FOLDER"], exist_ok=True)

# Initialize database
with app.app_context():
    import backend.models
    db.create_all()

# Import routes after app and db initialization to avoid circular imports
from backend.routes import init_app
from backend.routes import *

# Initialize the app with model loading and other startup tasks
init_app(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
