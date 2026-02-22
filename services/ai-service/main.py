import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.video import router as video_router
from app.api.code import router as code_router
from app.api.matching import router as matching_router
from app.api.fraud import router as fraud_router

load_dotenv()

app = FastAPI(
    title="Proof AI Service",
    description="AI Analysis and Matching Engine for Proof Platform",
    version="1.0.0"
)

app.include_router(video_router)
app.include_router(code_router)
app.include_router(matching_router)
app.include_router(fraud_router)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-service",
        "openai_key_configured": bool(os.getenv("OPENAI_API_KEY"))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
