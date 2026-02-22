from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.fraud_service import FraudService

router = APIRouter(prefix="/fraud", tags=["fraud"])

class FraudCheckRequest(BaseModel):
    code: str
    language: str

class FraudCheckResponse(BaseModel):
    is_suspicious: bool
    confidence_score: float
    analysis: str
    signature: str

@router.post("/check", response_model=FraudCheckResponse)
async def check_fraud(request: FraudCheckRequest):
    try:
        # Placeholder for real database lookup
        known_signatures: list[str] = []

        score, analysis = FraudService.check_plagiarism(request.code, known_signatures)
        signature = FraudService.generate_ast_signature(request.code)

        return FraudCheckResponse(
            is_suspicious=score > 80,
            confidence_score=score,
            analysis=analysis,
            signature=signature
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
