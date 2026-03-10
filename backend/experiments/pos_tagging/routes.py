from fastapi import APIRouter
from .logic import get_corpus_by_id, calculate_hmm_matrices
from .data import CORPORA

router = APIRouter()

@router.get("/corpora")
def get_corpora():
    return [{"id": i, "name": c["name"]} for i, c in enumerate(CORPORA)]

@router.get("/matrices/{corpus_id}")
def get_matrices(corpus_id: int):
    corpus = get_corpus_by_id(corpus_id)
    return calculate_hmm_matrices(corpus)
