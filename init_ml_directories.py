#!/usr/bin/env python3

"""
Initialization script for ML model directories in the Medical Imaging Application.
This script creates necessary directories for uploads and Grad-CAM visualizations.
"""

import os
import sys

def create_directory(directory):
    """
    Create a directory if it doesn't exist.
    """
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")
    else:
        print(f"Directory already exists: {directory}")

def create_placeholder_file(directory, filename, content="Placeholder file"):
    """
    Create a placeholder file in the specified directory.
    """
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        with open(filepath, "w") as f:
            f.write(content)
        print(f"Created placeholder file: {filepath}")
    else:
        print(f"File already exists: {filepath}")

def main():
    """
    Main initialization function for ML model directories.
    """
    # Create directories for uploads and Grad-CAM visualizations
    create_directory("static/uploads")
    create_directory("static/gradcam")
    create_directory("model")
    
    # Create placeholder model file
    model_readme = """# Model Directory

Place your trained model file here as 'best_model.h5'.

See ML_MODEL_INTEGRATION.md for detailed instructions on how to integrate your model.
"""
    create_placeholder_file("model", "README.md", model_readme)
    
    print("\nML directories initialized successfully.")
    print("Place your trained model in the 'model/' directory as 'best_model.h5'.")
    print("See ML_MODEL_INTEGRATION.md for more details.")

if __name__ == "__main__":
    main()
