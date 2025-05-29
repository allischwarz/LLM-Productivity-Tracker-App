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


Run Locally:
___________________________________________________________________
cd backend
conda create -n productivity-tracker python=3.9
conda activate productivity-tracker

pip install -r requirements.txt

uvicorn main:app --reload --port 8000
___________________________________________________________________

The backend will start on http://localhost:8000

Ensure this is running before launching the React frontend

# Running the React Frontend
Directory: frontend/
Prerequisites:
- Node.js v16 or higher installed

Run Locally:
___________________________________________________________________
cd frontend
npm install       # Install dependencies
npm run dev       # Start the development server
___________________________________________________________________

Open your browser and go to http://localhost:3000

The React app should now be running and connected to the backend at http://localhost:8000

Make sure the FastAPI backend is running at port 8000 so the React frontend can fetch data from it.








## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
