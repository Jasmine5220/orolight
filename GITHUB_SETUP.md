# GitHub Setup Instructions

Follow these steps to set up and push this project to a new GitHub repository.

## 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" button in the top-right corner and select "New repository"
3. Enter a repository name (e.g., "medical-imaging-app")
4. Add an optional description: "A medical imaging application with React Native mobile app and Flask backend"
5. Choose to make the repository Public or Private
6. Do NOT initialize the repository with a README, .gitignore, or license (we already have these files)
7. Click "Create repository"

## 2. Initialize Git and Push to GitHub

After creating the repository, GitHub will show instructions for pushing an existing repository. Follow these commands in your terminal:

```bash
# Initialize the git repository (if not already initialized)
git init

# Add all files to the staging area
git add .

# Commit the files
git commit -m "Initial commit"

# Add the remote repository URL (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/medical-imaging-app.git

# Push to GitHub
git push -u origin main
```

Note: If your default branch is named "master" instead of "main", use:

```bash
git push -u origin master
```

## 3. Verify on GitHub

1. Refresh your GitHub repository page
2. You should see all your files and directories now in the repository
3. The README.md will be displayed on the main page

## 4. Cloning the Repository (For Future Use)

To clone this repository on another machine:

```bash
git clone https://github.com/yourusername/medical-imaging-app.git
cd medical-imaging-app
python init_project.py  # Set up the required directories
```

## 5. Adding Team Members (Optional)

If you want to collaborate with others:

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Select "Manage access" from the sidebar
4. Click "Invite a collaborator"
5. Enter the GitHub username or email of your team member
6. Choose their permission level
7. Click "Add"

## 6. Deploying Your Application

For deployment instructions, refer to the README.md file.
