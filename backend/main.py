from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from experiments.word_analysis.routes import router as word_analysis_router
from experiments.morphology.routes import router as morphology_router



app = FastAPI(title="NLP Virtual Lab")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(word_analysis_router, prefix="/word-analysis")
app.include_router(morphology_router, prefix="/morphology")

@app.get("/")
def home():
    return {"message": "NLP Virtual Lab Backend Running"}