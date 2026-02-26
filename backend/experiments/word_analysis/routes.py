# word_analysis - routes.py
from fastapi import APIRouter
from pydantic import BaseModel
from .data import analyze_text

router = APIRouter()

class TextInput(BaseModel):
    text: str

@router.post("/analyze")
def analyze(input: TextInput):
    return analyze_text(input.text)