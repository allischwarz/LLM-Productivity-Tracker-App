# backend/populate_sample_data.py

from langchain.schema import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from uuid import uuid4

# Set up the embedding function and vector store
embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(
    embedding_function=embedding_function,
    persist_directory="./chroma_db"
)

# Sample summaries
summaries = [
    {
        "label": "Mon 01 Jan 2024 – Sun 07 Jan 2024",
        "summary": "This week you completed several medium-focus tasks and made solid progress. Focus was generally consistent. Try adding high-focus deep work sessions next week."
    },
    {
        "label": "Mon 08 Jan 2024 – Sun 14 Jan 2024",
        "summary": "You had fewer tasks this week and focus was a bit low. To improve, set clear goals at the start of the week and limit distractions during work time."
    },
    {
        "label": "Mon 15 Jan 2024 – Sun 21 Jan 2024",
        "summary": "Strong productivity across the board this week. High-focus work was prioritized well. Maintain momentum by planning your top 3 weekly priorities ahead of time."
    }
]

# Convert summaries to Documents and store in vectorstore
docs = [
    Document(
        page_content=s["summary"],
        metadata={"label": s["label"], "uid": str(uuid4())}
    )
    for s in summaries
]

vectorstore.add_documents(docs)
vectorstore.persist()

print("✅ Sample summaries have been embedded and stored.")
