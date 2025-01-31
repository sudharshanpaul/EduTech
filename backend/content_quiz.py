from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
import re
import difflib
from typing import Dict, List, Optional

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Context(BaseModel):
    context: str
    groq_api_key: str

class QuizAnswers(BaseModel):
    answers: Dict[str, str]

class QuestionGenerator:
    def __init__(self, groq_api_key):
        self.llm = ChatGroq(
            groq_api_key=groq_api_key, 
            model_name="llama3-8b-8192"
        )

    def _fuzzy_match(self, user_answer: str, correct_answer: str) -> bool:
        user_answer = user_answer.lower().strip()
        correct_answer = correct_answer.lower().strip()
        
        if user_answer == correct_answer:
            return True
        
        if user_answer in correct_answer or correct_answer in user_answer:
            return True
        
        similarity = difflib.SequenceMatcher(None, user_answer, correct_answer).ratio()
        return similarity > 0.8

    def generate_multiple_choice(self, context: str) -> List[dict]:
        prompt = PromptTemplate(
            input_variables=["context"],
            template="""Generate 5 multiple choice questions from the following context. 
            For each question, provide:
            1. The question text
            2. 4 unique answer options (A, B, C, D)
            3. The correct answer with a detailed explanation

            Context: {context}

            Output Format:
            Question 1: [Question Text]
            Options:
            A) [Option 1]
            B) [Option 2]
            C) [Option 3]
            D) [Option 4]
            Correct Answer: [Letter]
            Explanation: [Detailed explanation]

            [Repeat Format for remaining questions]
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        response = chain.invoke({"context": context})
        return self._parse_multiple_choice(response["text"])

    def generate_fill_blanks(self, context: str) -> List[dict]:
        prompt = PromptTemplate(
            input_variables=["context"],
            template="""Generate 5 fill-in-the-blank questions from the following context. 
            Replace key terms with blanks, ensuring the questions test comprehension.
            Provide a detailed explanation for each answer.

            Context: {context}

            Output Format:
            Question 1: [Sentence with key term replaced by ________]
            Correct Answer: [Removed Term]
            Explanation: [Detailed explanation]

            [Repeat Format for remaining questions]
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        response = chain.invoke({"context": context})
        return self._parse_fill_blanks(response["text"])

    def _parse_multiple_choice(self, response: str) -> List[dict]:
        questions = []
        question_blocks = re.split(r'Question \d+:', response)[1:]
        
        for block in question_blocks:
            question_match = re.search(r'^(.*?)\nOptions:', block, re.DOTALL)
            question = question_match.group(1).strip() if question_match else "Unknown Question"
            
            options = {}
            option_matches = re.findall(r'([A-D])\) (.+?)(?=[A-D]\)|\n|$)', block)
            for letter, option in option_matches:
                options[letter] = option.strip()
            
            correct_match = re.search(r'Correct Answer: ([A-D])', block)
            correct_answer = correct_match.group(1) if correct_match else None
            
            explanation_match = re.search(r'Explanation: (.+?)(?=Question|\Z)', block, re.DOTALL)
            explanation = explanation_match.group(1).strip() if explanation_match else "No explanation provided."
            
            if question and options and correct_answer:
                questions.append({
                    'question': question,
                    'options': options,
                    'correct_answer': correct_answer,
                    'explanation': explanation
                })
        
        return questions

    def _parse_fill_blanks(self, response: str) -> List[dict]:
        questions = []
        question_blocks = re.split(r'Question \d+:', response)[1:]
        
        for block in question_blocks:
            question_match = re.search(r'^(.*?)\nCorrect Answer:', block, re.DOTALL)
            question = question_match.group(1).strip() if question_match else "Unknown Question"
            
            answer_match = re.search(r'Correct Answer: (.+?)(?=\n|$)', block)
            correct_answer = answer_match.group(1).strip() if answer_match else None
            
            explanation_match = re.search(r'Explanation: (.+?)(?=Question|\Z)', block, re.DOTALL)
            explanation = explanation_match.group(1).strip() if explanation_match else "No explanation provided."
            
            if question and correct_answer:
                questions.append({
                    'question': question,
                    'correct_answer': correct_answer,
                    'explanation': explanation
                })
        
        return questions

@app.post("/generate-quiz")
async def generate_quiz(request: Context):
    try:
        generator = QuestionGenerator(request.groq_api_key)
        mc_questions = generator.generate_multiple_choice(request.context)
        fitb_questions = generator.generate_fill_blanks(request.context)
        
        return {
            "mcq": mc_questions,
            "fillBlanks": fitb_questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate-quiz")
async def evaluate_quiz(request: QuizAnswers):
    # This endpoint would need access to the original questions and answers
    # You might want to store them in a database or session
    # For now, we'll return a mock response
    try:
        return [
            {
                "question": "Sample question",
                "correct": True,
                "correct_answer": "Sample answer",
                "explanation": "Sample explanation"
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8002)