from fastapi import APIRouter,HTTPException
import joblib
import numpy as np
from app.schemas.predicts_schema import SymptomsInput
from app.utils.model_loader import load_model

router = APIRouter()

model = load_model()

@router.post("/predict")
async def predict(data: SymptomsInput):
    try:
        symptoms_array = np.array(data.symptoms).reshape(1,-1)
        prediction = model.predict(symptoms_array)[0]
        return {"prediction:", prediction}
    except Exception as e:
        raise HTTPException(status_code=403, detail="failed to predict")
    
    