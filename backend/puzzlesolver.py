from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
from PIL import Image
import io

app = FastAPI(title="AI Puzzle Solver API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API key
GEMINI_API_KEY = "AIzaSyB2CSaU-1T6i6EcJylA7u3Dkfd_flrsRKc"  # Replace with your actual API key
genai.configure(api_key=GEMINI_API_KEY)

class SolutionResponse(BaseModel):
    solution: str

async def get_gemini_response(problem_prompt: str, image_data: bytes) -> str:
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Generate response
        response = model.generate_content([problem_prompt, image])
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating solution: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to AI Puzzle Solver API"}

@app.post("/solve-puzzle", response_model=SolutionResponse)
async def solve_puzzle(
    image: UploadFile = File(...),
    problem_description: str = Form(...)
):
    """
    Solve a puzzle using the uploaded image and problem description.
    
    Parameters:
    - image: Image file (jpg, jpeg, or png)
    - problem_description: Text description of the problem to solve
    
    Returns:
    - solution: Generated solution text
    """
    try:
        # Validate image format
        if not image.content_type in ["image/jpeg", "image/jpg", "image/png"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid image format. Please upload JPG or PNG files only."
            )
        
        # Read image content
        image_data = await image.read()
        
        # Get solution from Gemini
        solution = await get_gemini_response(problem_description, image_data)
        
        return SolutionResponse(solution=solution)
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)