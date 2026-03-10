from fastapi import APIRouter
from .logic import get_words, get_features

router = APIRouter()

@router.get("/words")
def words():
    return {"words": get_words()}


@router.get("/features/{word}")
def features(word: str):

    result = get_features(word)

    if result:
        return {"features": result}

    return {"error": "Word not found"}