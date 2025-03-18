from fastapi import FastAPI, APIRouter

router = APIRouter()

symptoms_list = [
    {"id": 1, "name": "Fever" },
    {"id": 2, "name": "Cough" },
    {"id": 3, "name": "Shortness of breath" },
    {"id": 4, "name": "Fatigue" },
    {"id": 5, "name": "Loss of taste or smell" },
]

@router.get("/")
async def get_symptoms():
    return {"symptoms": symptoms_list}