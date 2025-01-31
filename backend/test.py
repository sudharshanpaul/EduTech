from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Create the FastAPI app
app = FastAPI()

# Configure CORS before any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)

const handleFileUpload = async () => {
    if (!selectedFile || !validateFile(selectedFile)) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        setAnalyzing(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/upload_bos', {
            method: 'POST',
            mode: 'cors', // Explicitly set CORS mode
            body: formData,
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Upload successful:', data);
        await getUnits();
    } catch (err) {
        console.error('Detailed error:', err);
        const errorState = handleApiError(err, 'Failed to upload file');
        setError(errorState);
    } finally {
        setAnalyzing(false);
    }
};

@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS is working"}