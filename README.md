# Professor Portfolio Application

A comprehensive portfolio application for professors featuring an interactive professional profile, experience, publications, projects, and a RAG (Retrieval-Augmented Generation) AI-powered Q&A system.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Software Requirements](#software-requirements)
- [Installation & Setup](#installation--setup)
- [Configuring Your Details](#configuring-your-details)
- [Running the Application](#running-the-application)
- [Features](#features)

---

## Overview

This portfolio application consists of two main parts:

1. **Portfolio Website** - A modern React/TypeScript application showcasing:
   - Professional profile and bio
   - Experience and background
   - Publications and research
   - Projects and patents
   - Workshops and STTP information
   - Committee memberships
   - Courses taught

2. **RAG Backend Application** - An AI-powered system for document Q&A:
   - Document ingestion and processing
   - Semantic search using FAISS
   - Language model integration using Llama
   - REST API built with FastAPI

---

## Project Structure

```
Professor_Portfolio/
├── src/                          # Main portfolio frontend (React/TypeScript)
│   ├── components/              # React components
│   ├── pages/                   # Portfolio pages
│   ├── context/                 # React context for theming
│   ├── data/                    # Portfolio data
│   └── App.tsx                  # Main application file
├── RAG/                         # RAG application (AI Q&A system)
│   ├── backend/                 # FastAPI backend
│   │   ├── main.py             # FastAPI server
│   │   ├── ingest.py           # Document ingestion
│   │   └── qa.py               # Q&A functionality
│   ├── frontend/               # React frontend for RAG
│   ├── requirements.txt         # Python dependencies
│   └── setup.bat               # Setup batch file
├── package.json                # Main project dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

---

## Software Requirements

### For Portfolio Website

- **Node.js** - v16 or higher ([Download](https://nodejs.org/))
- **npm** - v7 or higher (comes with Node.js)
- **Git** - For cloning the repository ([Download](https://git-scm.com/))

### For RAG Backend

- **Python** - v3.8 or higher ([Download](https://www.python.org/))
- **pip** - Python package manager (comes with Python)
- **Git** - For cloning the repository

### Optional Requirements

- **CUDA** - For GPU acceleration with Llama models (optional)
- **VS Code** - Recommended code editor ([Download](https://code.visualstudio.com/))

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/Professor_Portfolio.git
cd Professor_Portfolio
```

### Step 2: Setup Portfolio Frontend

```bash
# Install Node.js dependencies
npm install

# Build the project (optional, for production)
npm run build

# Start development server
npm run dev
```

The portfolio will be available at `http://localhost:5173`

### Step 3: Setup RAG Backend (Optional)

#### For Windows Users:

```bash
# Navigate to RAG directory
cd RAG

# Run the setup batch file
setup.bat

# This will:
# 1. Create a Python virtual environment
# 2. Install Python dependencies
# 3. Download the required AI model
```

#### For Manual Setup (Windows/Linux/Mac):

```bash
# Navigate to RAG directory
cd RAG

# Create a Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download the model (first time setup)
python download_model.py
```

#### Step 4: Run RAG Backend

```bash
# Make sure you're in the RAG directory and virtual environment is activated
python backend/main.py

# The API will be available at http://localhost:8000
```

#### Step 5: Run RAG Frontend (Optional)

In a new terminal:

```bash
cd RAG/frontend

npm install

npm run dev
```

---

## Configuring Your Details

### Portfolio Data (Main Website)

Edit the portfolio information in `src/data/portfolioData.ts`:

```typescript
// Replace with your actual details
export const portfolioData = {
  name: "Your Full Name",
  title: "Your Title/Position",
  department: "Your Department",
  email: "your.email@university.edu",
  phone: "+1-XXX-XXX-XXXX",
  bio: "Your professional bio...",
  experience: [
    {
      position: "Your Position",
      company: "Your Organization",
      duration: "Start Year - End Year",
      description: "Your job description..."
    },
    // Add more experiences
  ],
  // ... Update other sections similarly
};
```

### Profile Page

Edit `src/pages/Profile.tsx` to customize:
- Profile photo/avatar
- Contact information
- Social media links
- Additional biographical information

### Other Pages

Update the respective files in `src/pages/`:
- `Experience.tsx` - Work experience
- `Publications.tsx` - Research publications
- `Projects.tsx` - Project descriptions
- `Patents.tsx` - Patent information
- `Courses.tsx` - Course listings
- `Workshops.tsx` - Workshop information
- `Committees.tsx` - Committee memberships
- `STTP.tsx` - STTP program details

### Environment Variables (if needed)

Create a `.env` file in the root directory for any API keys or sensitive configuration:

```env
VITE_API_URL=http://localhost:8000
# Add other environment variables as needed
```

### RAG Document Upload

Place your documents (PDF, TXT files) in the `RAG/db/` directory for processing:

```bash
# To ingest documents
cd RAG
python direct_process.py
```

---

## Running the Application

### Development Mode

#### Terminal 1 - Portfolio Frontend:
```bash
npm run dev
# Runs on http://localhost:5173
```

#### Terminal 2 - RAG Backend (optional):
```bash
cd RAG
source venv/bin/activate  # or venv\Scripts\activate on Windows
python backend/main.py
# Runs on http://localhost:8000
```

#### Terminal 3 - RAG Frontend (optional):
```bash
cd RAG/frontend
npm run dev
# Runs on http://localhost:5174
```

### Production Build

```bash
# Build the portfolio
npm run build

# Build RAG frontend
cd RAG/frontend
npm run build

# The built files will be in dist/ directories
```

### Using Batch Files (Windows)

```bash
# Run both frontend and backend
cd RAG
run_frontend.bat      # Opens portfolio frontend
run_backend.bat       # Starts RAG backend
```

---

## Features

### Portfolio Website
- ✨ Responsive design with Tailwind CSS
- 🎨 Dark/Light theme support
- 📱 Mobile-friendly interface
- 🔍 Easy navigation between sections
- 🎯 Professional layout

### RAG Application
- 📄 Document upload and processing
- 🤖 AI-powered Q&A system
- 🔐 User authentication
- 💬 Chat interface
- 📊 Document management

---

## Available Scripts

### Main Portfolio

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### RAG Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## Troubleshooting

### Port Already in Use
If port 5173 or 8000 is already in use, you can specify a different port:

```bash
# For Vite frontend
npm run dev -- --port 3000

# For FastAPI backend
python backend/main.py --port 8001
```

### Python Virtual Environment Issues

```bash
# Remove and recreate virtual environment
cd RAG
rmdir /s /q venv          # Windows
rm -rf venv               # Linux/Mac
python -m venv venv
venv\Scripts\activate     # Windows or source venv/bin/activate
pip install -r requirements.txt
```

### Module Not Found

Ensure all dependencies are installed:

```bash
# For Node.js
npm install

# For Python
pip install -r requirements.txt
```

---

## Support & Contribution

For issues, questions, or contributions, please contact the repository maintainer or open an issue on GitHub.

---

## License

This project is provided as-is for educational and professional use.

---

**Last Updated:** May 2026
