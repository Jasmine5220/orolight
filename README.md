# Medical Imaging Application

A medical imaging application with a React Native mobile app and Flask backend that allows doctors to upload images for cancer detection and view results, with admin functionality to monitor all data.

## Project Structure

- `backend/`: Flask backend code
  - `app.py`: Main Flask app configuration
  - `models.py`: Database models for users and images
  - `routes.py`: API endpoints and web routes
  - `utils.py`: Helper functions for image processing and ML model
  - `config.py`: Configuration settings
  - `templates/`: HTML templates for web interface
  - `static/`: Static files (CSS, JS, images)

- `mobile/`: React Native mobile app
  - `App.js`: Main React Native app
  - `screens/`: Screen components
  - `components/`: Reusable components
  - `navigation/`: Navigation setup
  - `utils/`: Helper utilities

- `model/`: Directory for ML model files (to be added later)

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL database
- Node.js & npm (for mobile app)

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/medical-imaging-app.git
   cd medical-imaging-app
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up environment variables (create a `.env` file):
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/medical_imaging
   SESSION_SECRET=your_secure_session_secret
   JWT_SECRET_KEY=your_secure_jwt_secret
   ```

4. Create the database and run initial migrations:
   ```
   # Using PostgreSQL command line
   createdb medical_imaging
   ```

5. Run the Flask application:
   ```
   python main.py
   ```
   The API will be available at `http://localhost:5000`

### Mobile App Setup

1. Navigate to the mobile app directory:
   ```
   cd mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update API endpoint in `utils/api.js` to point to your backend server

4. Run the development server:
   ```
   npm start
   ```

## Adding Your ML Model

This application is designed to integrate with a custom machine learning model for cancer detection in medical images. To add your model:

1. Place your trained model file (`.h5` format) in the `model/` directory as `best_model.h5`
2. Install the required ML packages:
   ```
   pip install tensorflow opencv-python matplotlib
   ```
3. Update `backend/utils.py` by uncommenting and modifying the code sections marked with comments. The file already contains commented versions of:
   - Model loading with TensorFlow
   - Image preprocessing for Inception-ResNet-V2
   - Prediction function for binary classification
   - Grad-CAM visualization generation

4. The application already has the configuration set up in `backend/config.py`:
   - `MODEL_PATH = "model/best_model.h5"`
   - `CLASS_LABELS = ["Non-Cancer", "Cancer"]`

You can modify these settings as needed for your specific model.

## API Endpoints

### Authentication
- `POST /api/login`: Login with email and password
- `POST /api/register`: Register a new user

### Image Analysis
- `POST /api/upload`: Upload and analyze a medical image
- `GET /api/history`: Get user's upload history

### Admin
- `GET /api/admin/users`: Get all users (admin only)
- `GET /api/admin/images`: Get all uploaded images (admin only)

## Future Enhancements

- Add user session management with Flask-Login
- Implement more advanced image preprocessing
- Add multi-class classification for different cancer types
- Enhance the mobile app with offline capabilities
