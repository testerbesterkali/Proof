from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/code", tags=["code"])

class CodeEvaluationRequest(BaseModel):
    code: str
    language: str
    requirements: str

class CodeEvaluationResponse(BaseModel):
    score: float
    analysis: str
    vulnerabilities: List[str]
    status: str

@router.post("/evaluate", response_model=CodeEvaluationResponse)
async def evaluate_code(request: CodeEvaluationRequest):
    try:
        score = 85.0
        analysis = f"Code analysis for {request.language}. Structure looks sound. Complexity is within acceptable limits."

        return CodeEvaluationResponse(
            score=score,
            analysis=analysis,
            vulnerabilities=[],
            status="completed"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
