from fastapi import APIRouter
from .data import WORDS

router = APIRouter()


# Get all words
@router.get("/words")
def get_words():
    return {"words": WORDS}


# Get rule for a specific word
@router.get("/rule/{word}")
def get_rule(word: str):

    if word in WORDS:
        return {
            "word": word,
            "rule": WORDS[word]
        }

    return {
        "error": "Word not found"
    }