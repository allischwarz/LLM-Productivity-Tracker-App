# Productivity Tracker with AI-Powered Weekly Summaries Overview
This is a full-stack productivity tracker that helps users log tasks, visualize time spent, and generate weekly summaries using generative AI. Built with a React frontend and a FastAPI backend, the app allows users to:
- Record daily tasks with time spent and focus level.
- View productivity trends over time using interactive charts.
- Automatically generate weekly summaries using a GenAI API.
- Store and semantically search past summaries with a local vector store (Chroma + SentenceTransformers).

Designed to be lightweight and modular, this project demonstrates how AI-enhanced feedback and vector-based memory can support personal productivity.

# Getting Started
To get this project running locally, first start the FastAPI backend, then launch the React frontend in the frontend/ folder.

# Running the FastAPI Backend
Directory: backend/

Prerequisites:
- Python 3.9+
- Conda (recommended for managing environments)
- An Anthropic Claude API key stored in a .env file

Create a .env file in the backend directory with the following content:
ANTHROPIC_API_KEY=[your_api_key_here]

In the main project root, run:
```
cd backend #navigate to backend directory

pip install -r requirements.txt #install python dependencies

uvicorn main:app --reload --port 8000 #start FastAPI server
```

The backend will start on http://localhost:8000

Ensure this is running before launching the React frontend

# Running the React Frontend
Directory: main/src

Prerequisites:
- Node.js v16 or higher installed

In the main project root, run:
```
npm install       # Install dependencies
npm run dev       # Start the React development server
```

Open your browser and go to http://localhost:3000

The React app should now be running and connected to the backend at http://localhost:8000

Make sure the FastAPI backend is running at port 8000 so the React frontend can fetch data from it.

# Advanced Feature: Vector Store & AI Agent Integration
This project uses LangChain with a local Chroma vector store and HuggingFace sentence embeddings to store and search past productivity summaries. Summaries are generated using the Anthropic Claude API.

## Dependencies (already in requirements.txt)
Make sure you install all required backend dependencies:
```
pip install -r requirements.txt
```

These include:
- langchain
- langchain-community
- langchain-chroma
- langchain-huggingface
- httpx
- python-dotenv
- fastapi
- uvicorn

## Vector Store Setup
By default, the vector store is persisted locally using Chroma in the backend directory: ./chroma_db/

This folder will be automatically created and populated with summaries the first time you generate one. You don't need to manually set anything up. However, to reset your vector store (e.g. during testing), delete the chroma_db/ folder and restart the backend:
```
rm -rf chroma_db
```

## Claude API Key Configuration
You must set your Claude API key in a .env file in the FastAPI root directory:
```
ANTHROPIC_API_KEY=your-api-key-here
```

This key is required for generating summaries via the /weekly-summary endpoint.

## Verifying Setup
After generating a summary, your chroma_db/ folder will contain your vector index. You can now use the Search feature in the app to semantically query past summaries.


# Docker Setup (Optional Advanced Feature)

To run the full app using Docker:

1. Create a `.env` file in the root of the project with your Anthropic API key: ANTHROPIC_API_KEY = your-api-key-here

2. Run both backend and frontend:
```
docker-compose up --build
```

React will run at: http://localhost:3000
FastAPI will run at: http://localhost:8000

# Populate Vector Store with Sample Summaries
To test the productivity summary search feature with example data:

1. Activate your backend environment
2. Navigate to the backend folder
3. Run:
```
python populate_sample_data.py
```

# Technical Decisions
See [technical-decisions.md](./technical-decisions.md) for architecture rationale and library/model justifications.



