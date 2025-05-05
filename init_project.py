#!/usr/bin/env python3
"""
Initialization script for the Medical Imaging Application.
This script creates necessary directories and placeholder files.
"""

import os
import sys
from pathlib import Path

def create_directory(directory):
    """Create a directory if it doesn't exist."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")
    else:
        print(f"Directory already exists: {directory}")

def create_empty_file(filepath):
    """Create an empty file if it doesn't exist."""
    if not os.path.exists(filepath):
        with open(filepath, 'w') as f:
            pass
        print(f"Created empty file: {filepath}")
    else:
        print(f"File already exists: {filepath}")

def create_gitkeep(directory):
    """Create a .gitkeep file in the specified directory."""
    gitkeep_path = os.path.join(directory, '.gitkeep')
    create_empty_file(gitkeep_path)

def main():
    """Main initialization function."""
    print("Initializing Medical Imaging Application...")
    
    # Create necessary directories
    directories = [
        "static/uploads",
        "static/gradcam",
        "model",
    ]
    
    for directory in directories:
        create_directory(directory)
        create_gitkeep(directory)
    
    print("\nProject initialization complete!")
    print("\nNext steps:")
    print("1. Set up your PostgreSQL database")
    print("2. Create a .env file with necessary environment variables")
    print("3. Add your ML model file to the 'model/' directory")
    print("4. Run 'python main.py' to start the application")

if __name__ == "__main__":
    main()
