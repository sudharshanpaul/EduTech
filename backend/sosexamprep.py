from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from groq import Groq
from typing import Literal
import os

app = FastAPI(title="SOS Exam Rescue Kit API")

# Add CORS middleware with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add both common dev server ports
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS", "GET"],
    allow_headers=["Content-Type", "Authorization"],
)

# Configure your Groq API key here
GROQ_API_KEY = "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"  # Replace with your actual API key

class StudyRequest(BaseModel):
    topic: str
    aid_type: Literal['cheat_sheet', 'mnemonics', 'mistakes']

class StudyResponse(BaseModel):
    content: str

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )

def generate_study_aid(topic: str, aid_type: str) -> str:
    """Generate study material using Groq's API"""
    prompts = {
        'cheat_sheet': f"Create a concise cheat sheet for {topic} with key formulas/concepts in bullet points",
        'mnemonics': f"Create 5 memorable mnemonics for {topic} using simple language",
        'mistakes': f"List 10 common mistakes students make in {topic} with brief explanations"
    }

    client = Groq(api_key=GROQ_API_KEY)
    try:
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert exam-prep tutor. Help students avoid last-minute panic."
                },
                {
                    "role": "user",
                    "content": prompts[aid_type]
                }
            ],
            temperature=0.2
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating study aid: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to SOS Exam Rescue Kit API"}

@app.options("/generate-study-aid")
async def options_study_aid():
    return {"message": "Accepted"}

@app.post("/generate-study-aid", response_model=StudyResponse)
async def create_study_aid(request: StudyRequest):
    """
    Generate a study aid based on the provided topic and aid type.
    """
    print(f"Received request: {request}")  # Debug print
    try:
        content = generate_study_aid(request.topic, request.aid_type)
        return StudyResponse(content=content)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)