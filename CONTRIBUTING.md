# Contributing Guide

Thank you for your interest in contributing to the Medical Imaging Application! This document provides guidelines and instructions for contributing to this project.

## Code Structure

- **`backend/`**: Flask backend code
  - `app.py`: Main Flask app configuration
  - `models.py`: Database models
  - `routes.py`: API endpoints
  - `utils.py`: Helper functions, including ML model integration

- **`mobile/`**: React Native mobile app
  - `App.js`: Main app component
  - `screens/`: Screen components
  - `components/`: Reusable UI components
  - `utils/`: Helper utilities

## Development Workflow

1. **Fork and Clone**: Fork this repository and clone it to your local machine
2. **Create Branch**: Create a new branch for your feature or bugfix
   ```
   git checkout -b feature/your-feature-name
   ```
3. **Implement Changes**: Make your changes, following the style guidelines
4. **Test**: Ensure your changes work correctly
5. **Commit**: Commit your changes with a descriptive message
   ```
   git commit -m "Add feature: your feature description"
   ```
6. **Push**: Push your branch to your fork
   ```
   git push origin feature/your-feature-name
   ```
7. **Pull Request**: Submit a pull request to the main repository

## Style Guidelines

### Python (Backend)

- Follow PEP 8 style guide
- Use meaningful variable and function names
- Document functions and classes with docstrings
- Add type hints when possible

### JavaScript/React Native (Mobile)

- Use ESLint rules defined in the project
- Follow React Native best practices
- Use functional components with hooks
- Document complex logic with comments

## Adding ML Model Features

When contributing ML model improvements:

1. Place model files in the `model/` directory
2. Update `utils.py` to use your model
3. Document model format and expected inputs/outputs
4. If adding new prediction classes, update the UI to handle them

## Testing

- Write unit tests for backend functions
- Test the mobile app on both iOS and Android if possible
- Include test instructions in your pull request

## Pull Request Process

1. Ensure your code passes all tests
2. Update documentation as needed
3. Link any related issues in your pull request description
4. Request a review from at least one maintainer
5. Address any review comments

## Questions?

If you have questions about contributing, open an issue or contact the project maintainers.
