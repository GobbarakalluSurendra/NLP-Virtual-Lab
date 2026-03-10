# ngrams - routes.py
# experiments/ngrams/routes.py

from fastapi import APIRouter
from .logic import tokenize, ngram_probabilities
from .data import CORPUS

router = APIRouter()


@router.get("/corpus")
def get_corpus():

    return {
        "corpus": CORPUS,
        "vocab": tokenize()
    }


@router.get("/probabilities/{n}")
def get_probabilities(n: int = 2, smooth: bool = False):

    probs, histories = ngram_probabilities(n, smooth)

    return {
        "histories": histories,
        "probabilities": probs
    }