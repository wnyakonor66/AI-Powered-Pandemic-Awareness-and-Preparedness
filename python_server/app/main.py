from fastapi import FastAPI
from app.routes import auth, predicted_routes, symptoms_routes, location_routes




app = FastAPI()

@app.get("/")
def index():
    return {"Welcome to the pandemic awareness API endpoints"}

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(predicted_routes.router, tags=["Prediction"])
app.include_router(symptoms_routes.router, prefix="/symptoms", tags=["Symptoms"])
app.include_router(location_routes.router, tags=["Location"])


