from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/match", tags=["matching"])

class MatchRequest(BaseModel):
    candidate_skills: List[str]
    challenge_skills: List[str]

class MatchResponse(BaseModel):
    score: float
    explanation: str
    missing_skills: List[str]

@router.post("/calculate", response_model=MatchResponse)
async def calculate_match(request: MatchRequest):
    # Simplified Cosine Similarity / Jaccard for now
    c_set = set(request.candidate_skills)
    ch_set = set(request.challenge_skills)

    intersection = c_set.intersection(ch_set)
    union = c_set.union(ch_set)

    score = (len(intersection) / len(union)) * 100 if union else 0
    missing = list(ch_set - c_set)

    explanation = f"Calculated match based on {len(intersection)} matching skills."

    return MatchResponse(
        score=score,
        explanation=explanation,
        missing_skills=missing
    )
