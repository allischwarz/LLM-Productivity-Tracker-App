from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # imports middleware class that adds CORS headers to API responses
from models import Task, TaskBatch
import os
from typing import Dict
from uuid import uuid4
from dotenv import load_dotenv
from utils import get_week_range, format_range
from datetime import datetime
import httpx  #GenAI model = Claude
from langchain_chroma import Chroma
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.schema import Document
from langchain_huggingface import HuggingFaceEmbeddings

# Load environment variables (e.g., API keys)
load_dotenv()


#Create the FastAPI app
app = FastAPI()


#Add CORS middleware so frontend can make requests to backend
app.add_middleware(    # tells FastAPI to apply this middleware to every incoming request
    CORSMiddleware,    # class that modifies headers to allow CORS
    allow_origins=["http://localhost:3000"],   # frontend dev URL; only this origin is allowed to call the API (React app)
    allow_methods=["*"],    #allow all HTTP methods
    allow_headers=["*"],    #allow all headers
)

# Set up the sentence embedding model using HuggingFaces
embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Create and persist a Chroma vector store in the local directory
vectorstore = Chroma(
    embedding_function=embedding_function,
    persist_directory="./chroma_db"
)

#Health check endpoint for verifyig backend is running
@app.get("/")
def read_root():
    return {"message": "Backend is running"}

# Endpoint to generate a weekly productivity summary using Anthropic Claude
@app.post("/weekly-summary")
def weekly_summary_claude(batch: TaskBatch) -> Dict[str, str]:
    from datetime import datetime

    # Format the list of tasks into a prompt
    items = "\n".join(
        f"- {t.name} ({t.timeSpent} min, focus {t.focus})" for t in batch.tasks
    )

    # Create the user prompt to send to Claude
    prompt = (
        "You are a productivity coach.\n"
        f"Tasks for the week:\n{items}\n\n"
        "Write ONE paragraph summarizing overall productivity and give 2–3 actionable tips for next week."
    )

    # Define headers and payload for the Claude API request
    headers = {
        "x-api-key": os.getenv("ANTHROPIC_API_KEY"),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    payload = {
        "model": "claude-3-sonnet-20240229",
        "max_tokens": 300,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    # Make the request to Claude and parse the summary
    with httpx.Client(timeout=30.0) as client:
        response = client.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
        response.raise_for_status()

    summary = response.json()["content"][0]["text"].strip()

    # If label is not provided by frontend, generate it from the first task's date
    if not batch.label:
        first_task_date = batch.tasks[0].date
        if isinstance(first_task_date, str):
            first_task_date = datetime.fromisoformat(first_task_date)

        start, end = get_week_range(first_task_date)
        label = format_range(start, end)
    else:
        label = batch.label

    # Store the summary as a LangChain Document with metadata
    doc = Document(
        page_content=summary,
        metadata={
            "uid": str(uuid4()),
            "label": label
        }
    )

    # Add to Chroma vector store and persist to disk
    vectorstore.add_documents([doc])
    vectorstore.persist()

    # Return summary and label to frontend
    return {"summary": summary, "label": label}

# Endpoint to search for summaries similar to a user query
@app.post("/search-summary")
def search_similar_summaries(query: Dict[str, str]) -> Dict[str, list]:
    """
    Search for past summaries similar to the given query text.
    """
    user_query = query.get("query", "")
    if not user_query:
        return {"results": []}
    
    # Perform vector similarity search using Chroma (returns top 3 results)
    results = vectorstore.similarity_search_with_score(user_query, k=3)
    
    # Format results and return to frontend
    return {
        "results": [
            {
                "summary": doc.page_content,
                "similarity": round(1 - score, 3),
                "label": doc.metadata.get("label") or "Unknown week"

            }
            for doc, score in results
        ]

    }

    