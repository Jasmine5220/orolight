#!/bin/bash

# This script creates a zip file of the project for downloading and uploading to GitHub

echo "Creating project zip file for GitHub..."

# Remove any existing zip file
rm -f medical_imaging_app.zip

# Create a list of files and directories to include
cat > include_list.txt << EOL
backend/
mobile/
model/
static/
main.py
README.md
CONTRIBUTING.md
.gitignore
.env.example
init_project.py
GITHUB_SETUP.md
download_project.sh
EOL

# Create the zip file
zip -r medical_imaging_app.zip . -i@include_list.txt

# Clean up
rm include_list.txt

echo "\nDone! Download the medical_imaging_app.zip file and extract it."
echo "Then follow the instructions in GITHUB_SETUP.md to push it to GitHub."
