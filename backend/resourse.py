# learning_resources.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
# Load environment variables
load_dotenv()

app = FastAPI(title="Learning Resources API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Models
class Book(BaseModel):
    title: str
    author: str
    description: str

class OnlineCourse(BaseModel):
    platform: str
    course_name: str
    url: str
    description: str

class Website(BaseModel):
    name: str
    url: str
    description: str

class YoutubeChannel(BaseModel):
    channel_name: str
    url: str
    description: str

class Resources(BaseModel):
    books: List[Book]
    online_courses: List[OnlineCourse]
    websites: List[Website]
    youtube_channels: List[YoutubeChannel]

class TopicRequest(BaseModel):
    topic: str

# Get API key from environment variable
GROQ_API_KEY = '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'
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY must be set in environment variables")

# Initialize prompt template
PROMPT_TEMPLATE = ChatPromptTemplate.from_template("""
Generate a comprehensive list of learning resources for the topic: {topic}

Provide the response as a JSON with the following structure:
{{
    "books": [
        {{
            "title": "Book Title",
            "author": "Author Name",
            "description": "Brief book description"
        }}
    ],
    "online_courses": [
        {{
            "platform": "Course Platform",
            "course_name": "Course Title",
            "url": "Course URL",
            "description": "Course overview"
        }}
    ],
    "websites": [
        {{
            "name": "Website Name",
            "url": "Website URL",
            "description": "What makes this resource valuable"
        }}
    ],
    "youtube_channels": [
        {{
            "channel_name": "Channel Name",
            "url": "Channel URL",
            "description": "Why this channel is helpful"
        }}
    ]
}}
""")


async def generate_resources(topic: str) -> Resources:
    """Generate learning resources using Groq LLM."""
    try:
        llm = ChatGroq(
            temperature=0.7,
            model_name="gemma2-9b-it",
            groq_api_key=GROQ_API_KEY
        )
        
        output_parser = JsonOutputParser()
        chain = PROMPT_TEMPLATE | llm | output_parser
        
        resources = chain.invoke({"topic": topic})
        return Resources(**resources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating resources: {str(e)}")

@app.post("/generate-resources/", response_model=Resources)
async def create_resources(request: TopicRequest):
    """Generate learning resources for a given topic."""
    if not request.topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    return await generate_resources(request.topic)

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Learning Resources Generator API",
        "version": "1.0",
        "endpoints": {
            "/generate-resources/": "POST - Generate learning resources for a topic"
        }
    }