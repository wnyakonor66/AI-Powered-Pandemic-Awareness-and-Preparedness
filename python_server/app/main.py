from fastapi import FastAPI
from app.routes import auth, predicted_routes, symptoms_routes, location_routes,outbreak_routes, trends_routes, disease_pie_routes, disease_history_routes




app = FastAPI()

@app.get("/")
def index():
    return {"Welcome to the pandemic awareness API endpoints"}

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(predicted_routes.router, tags=["Prediction"])
app.include_router(symptoms_routes.router, prefix="/symptoms", tags=["Symptoms"])
app.include_router(location_routes.router, tags=["Location"])
app.include_router(outbreak_routes.router, tags=["Outbreak"])
app.include_router(trends_routes.router, tags=["DailyTrends"])
app.include_router(disease_pie_routes.router, tags=["TOP 5 Diseases"])
app.include_router(disease_history_routes.router, tags=["Disease History"])