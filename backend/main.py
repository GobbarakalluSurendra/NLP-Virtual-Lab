from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from experiments.morphology.routes import router as morphology_router
from experiments.word_analysis.routes import router as word_analysis_router
from experiments.word_generation.routes import router as word_generation_router
from experiments.ngrams.routes import router as ngram_router
from experiments.pos_tagging.routes import router as pos_tagging_router

app = FastAPI(title="NLP Virtual Lab Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(morphology_router, prefix="/morphology")
app.include_router(word_analysis_router, prefix="/word-analysis")
app.include_router(word_generation_router, prefix="/word-generation")
app.include_router(ngram_router, prefix="/ngrams")
app.include_router(pos_tagging_router, prefix="/pos-tagging")


@app.get("/")
def home():
    return {"message": "NLP Virtual Lab Backend Running"}