# Technical Decision-Making Rationale

## Overview

This document explains the reasoning behind the technical architecture and component choices made for the productivity tracker project. It complements the main README.md and serves as a guide to why particular libraries, APIs, and frameworks were selected.

🔧 Stack Summary

User ⇄ React App (Frontend) ⇄ FastAPI Backend ⇄ GenAI, Chroma

Frontend: React + TypeScript

Why React?

React is a modern, component-based frontend framework with strong community support and seamless integration with TypeScript.

Why TypeScript?

Feature

JavaScript

TypeScript

Type Safety

❌

✅

IDE Support

Good

✅ Better

Runtime Bugs

✅ Likely

✅ Fewer

TypeScript was chosen for its robust static typing, better error prevention, and improved developer experience—especially for structured data like Task objects.

Backend: FastAPI

Why FastAPI?

Fast, asynchronous, modern Python web framework

Excellent for serving ML/AI APIs

Automatic OpenAPI docs (Swagger)

Direct integration with LangChain, Pydantic, Chroma

Why not Node.js/Express?

Using Python allows seamless integration with GenAI libraries (e.g., sentence-transformers) and avoids bridging between JavaScript and Python-based AI tools.

Vector Store: Chroma

Why Chroma?

Feature

Chroma

FAISS

LangChain Support

✅ Native

✅ Supported

Ease of Use

✅ Easy

⚠️ Advanced

Persistence

✅ Built-in

❌ Needs custom

Setup

✅ Simple

⚠️ Complex

Chroma was selected for its built-in persistence, ease of use with LangChain, and fast setup.

Embedding Model: all-MiniLM-L6-v2

Fast, lightweight model from SentenceTransformers

Works well with ChromaDB

No GPU required

Adequate semantic understanding for summarization and search

GenAI API: OpenAI (stubbed or replaceable)

The backend includes support for calling a GenAI endpoint (OpenAI, Claude, Together.ai, etc.) for weekly summaries.

Stub: Used initially for development without needing an API key.

OpenAI gpt-3.5-turbo: Chosen for its quality, speed, and affordability.

Replaceable with any provider that supports prompt/response format.

Data Storage

LocalStorage (Frontend)

Used for:

Persisting tasks in the browser

Storing last summary date

Vector Store (Backend)

Used for:

Saving weekly summaries as vector embeddings

Enabling semantic search on summaries

Middleware: CORS

FastAPI includes CORS middleware to allow frontend access:

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Unique Identifiers

Each stored summary includes a uuid generated via uuid4() to ensure Chroma can index and retrieve summaries without conflicts.

Docker Support

Dockerfiles and optional Docker Compose configuration are included to:

Run the FastAPI backend with all dependencies

Allow containerized testing of APIs and vector search

Development Strategy

Stub endpoints were created first to enable testing the frontend before integrating GenAI APIs

Backend and frontend were kept separate for modularity

Real GenAI API integration followed once UI and vector storage logic was stable

Summary of Trade-Offs

Decision

Reasoning

React + TS

Safer development, component reusability

FastAPI

Python-native AI support, async, simplicity

ChromaDB

Easy persistence, good for small projects

MiniLM Embeddings

Fast, free, good semantic quality

Stubbed GenAI first

Faster UI testing, avoids API dependency

Docker for backend

Reproducibility, easy deployment