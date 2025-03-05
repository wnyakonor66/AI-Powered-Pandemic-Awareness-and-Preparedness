from fastapi import FastAPI
from app.routes import auth

app = FastAPI()

@app.get("/")
def index():
    return {"hello"}

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
