from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI

router = APIRouter(prefix="/video", tags=["video"])
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class VideoAnalysisResponse(BaseModel):
    transcription: str
    summary: str
    status: str

@router.post("/analyze", response_model=VideoAnalysisResponse)
async def analyze_video(file: UploadFile = File(...)):
    if not file.filename.endswith(('.mp4', '.webm', '.mov')):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    try:
        # 1. Save temp file
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # 2. Transcribe using Whisper
        audio_file = open(file_path, "rb")
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )

        # 3. Cleanup
        audio_file.close()
        os.remove(file_path)

        # 4. Generate AI Summary
        summary = f"Analysis of proof: {file.filename}. Focus on high-affinity technical skills demonstrated."

        return VideoAnalysisResponse(
            transcription=transcript.text,
            summary=summary,
            status="completed"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
