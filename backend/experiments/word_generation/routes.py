from fastapi import APIRouter
from .data import DATA
from .logic import check_transformations, get_correct_table

router = APIRouter()


@router.get("/roots")
def get_roots():
    return {"roots": list(DATA.keys())}


@router.post("/check")
def check_answer(data: dict):
    root = data["root"]
    rows = data["rows"]
    results = check_transformations(root, rows)
    return {"results": results}


@router.get("/answer/{root}")
def get_answer(root: str):
    table = get_correct_table(root)
    return {"table": table}