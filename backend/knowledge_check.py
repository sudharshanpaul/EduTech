from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import re
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(title="Quiz API")

# Use environment variable for API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# System instructions with strict formatting
SYSTEM_INSTRUCTION = """
You are an expert quiz generator. Follow these RULES:
1. Generate MCQs in this EXACT format:
**QuestionX**
{
    'Question': '...',
    'Options': {
        'A': '...',
        'B': '...', 
        'C': '...',
        'D': '...'
    },
    'Answer': '...'
}
2. Use SINGLE quotes for keys/values
3. No extra text before/after questions
4. Answers must be the actual answer text, not the option letter
5. Ensure UNIQUE, age-appropriate questions
6. Maintain consistent option casing
7. Avoid special characters
8. Ensure proper JSON formatting
"""

# Pydantic models for request/response validation
class QuizParameters(BaseModel):
    grade: int
    subject: str
    topic: str
    difficulty: str
    num_questions: int

class QuizQuestion(BaseModel):
    Question: str
    Options: Dict[str, str]
    Answer: str

class QuizAnswer(BaseModel):
    question_index: int
    answer: str

class QuizSubmission(BaseModel):
    answers: List[QuizAnswer]
    questions: List[QuizQuestion]

class QuizResult(BaseModel):
    score: int
    total_questions: int
    results: List[Dict]

def extract_questions(response: str) -> List[dict]:
    """Extract and parse questions from API response"""
    question_blocks = re.findall(r'\*\*Question\d+\*\*\s*({.*?})\s*(?=\*\*Question\d+\*\*|$)', response, re.DOTALL)
    
    questions = []
    parsing_errors = []
    
    for block in question_blocks:
        try:
            json_str = block.replace("'", '"')
            json_str = re.sub(r'(\w+)(\s*:\s*)', r'"\1"\2', json_str)
            question_data = json.loads(json_str)
            questions.append(question_data)
        except json.JSONDecodeError as e:
            parsing_errors.append({
                'error_type': 'JSON Decode',
                'message': str(e),
                'block': block
            })
    
    if parsing_errors:
        raise HTTPException(status_code=500, detail={"message": "Failed to parse questions", "errors": parsing_errors})
    
    return questions

@app.post("/generate-quiz", response_model=List[QuizQuestion])
async def generate_quiz(params: QuizParameters):
    """Generate quiz questions based on provided parameters"""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")
    
    if not (1 <= params.grade <= 12):
        raise HTTPException(status_code=400, detail="Grade must be between 1 and 12")
    
    if not (5 <= params.num_questions <= 20):
        raise HTTPException(status_code=400, detail="Number of questions must be between 5 and 20")
    
    prompt = f"""
    Generate {params.num_questions} {params.subject} questions about {params.topic}
    for a {params.grade}th grade student at {params.difficulty} level.
    """
    
    try:
        response = groq_client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=4000
        )
        
        questions = extract_questions(response.choices[0].message.content)
        return questions
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submit-quiz", response_model=QuizResult)
async def submit_quiz(submission: QuizSubmission):
    """Submit quiz answers and get results"""
    if len(submission.answers) != len(submission.questions):
        raise HTTPException(status_code=400, detail="Number of answers must match number of questions")
    
    score = 0
    results = []
    
    for answer in submission.answers:
        if not (0 <= answer.question_index < len(submission.questions)):
            raise HTTPException(status_code=400, detail=f"Invalid question index: {answer.question_index}")
        
        question = submission.questions[answer.question_index]
        is_correct = answer.answer == question.Answer
        
        if is_correct:
            score += 1
            
        results.append({
            "question": question.Question,
            "user_answer": answer.answer,
            "correct_answer": question.Answer,
            "is_correct": is_correct
        })
    
    return QuizResult(
        score=score,
        total_questions=len(submission.questions),
        results=results
    )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}