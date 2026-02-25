from fastapi import FastAPI

app = FastAPI(title="NLP Virtual Lab")

@app.get("/")
def home():
    return {"message": "NLP Virtual Lab Backend Running"}
