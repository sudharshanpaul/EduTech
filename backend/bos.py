from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from pydantic import BaseModel
from typing import List, Optional
import os
from helper import (
    save_bos_to_db,
    load_db_n_get_retriever,
    model_setup,
    GetUnits,
    GetTopics,
    getContent,
    GetRevisionNotes,
    HuggingFaceEmbeddings
)

# Initialize FastAPI app
app = FastAPI(title="Learning Assistant API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Global configurations
MODEL_NAME = "llama-3.3-70b-versatile"
API_KEY = "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"
UPLOAD_FOLDER = "uploads"
# Create uploads folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Pydantic models for request/response validation
class SubjectRequest(BaseModel):
    subject: str

class TopicRequest(BaseModel):
    subject: str
    unit: str

class ContentRequest(BaseModel):
    subject: str
    topic: str
    student_level: str

class ContentResponse(BaseModel):
    content: str
    revision_notes: List[str]

@app.post("/upload_bos", response_class=JSONResponse)
async def upload_bos(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are accepted.")
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        embeddings = save_bos_to_db(file_path)
        return {"message": "File processed successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get_units", response_model=dict)
async def get_units(request: SubjectRequest):
    try:
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        retriever = load_db_n_get_retriever("faiss_index", embeddings)
        llm = model_setup(MODEL_NAME, API_KEY)
        units = GetUnits(llm, retriever, request.subject)
        return {"units": units}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get_topics", response_model=dict)
async def get_topics(request: TopicRequest):
    try:
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        retriever = load_db_n_get_retriever("faiss_index", embeddings)
        llm = model_setup(MODEL_NAME, API_KEY)
        topics = GetTopics(llm, retriever, request.subject, request.unit)
        return {"topics": topics}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get_content", response_model=ContentResponse)
async def get_content(request: ContentRequest):
    if request.student_level not in ['beginner', 'intermediate', 'advanced']:
        raise HTTPException(status_code=400, detail="Invalid student level")
    
    try:
        llm = model_setup(MODEL_NAME, API_KEY)
        content = getContent(MODEL_NAME, API_KEY, request.subject, request.topic, request.student_level)
        revision_notes = GetRevisionNotes(llm, content, request.topic)
        
        return ContentResponse(
            content=content,
            revision_notes=revision_notes
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)