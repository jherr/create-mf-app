# React 19 with Zephyr Template

A modern React 19 application template configured with Module Federation and Zephyr for scalable micro-frontend architecture.

## Important: First Steps

⚠️ **Before running the application, you must publish your project to GitHub!**

This is a required step due to Zephyr's dependency resolution system. Don't worry - you can use a private repository if needed.

You will also need to create your Zephyr account. Once created the build will trigger authentication. 

### Publishing to GitHub

1. Create a new repository on GitHub (can be private)
2. Initialize and publish your repository. Here's how to do it using GitHub CLI:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit"

# Create a new repository on GitHub (private)
gh repo create your-repo-name --private

# Push to GitHub
git push -u origin main
```
### Getting Started
After publishing to GitHub, you can run the application:

1. Install dependencies: 
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm start
```

You will see the application build and deploy

## Available Scripts
- npm start - Starts the development server
- npm run build - Creates a production build
- npm run build:dev - Creates a development build
- npm run build:start - Serves the built application