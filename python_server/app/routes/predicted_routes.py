from fastapi import APIRouter,HTTPException
import joblib
import numpy as np
from app.schemas.predicts_schema import SymptomsInput
from app.utils.model_loader import load_model
from app.routes.symptoms_routes import symptoms_list
from app.utils.precautions import precautions


router = APIRouter()

model = load_model()


print("Model type:", type(model))

@router.post("/predict")
async def predict(data: SymptomsInput):
    try:
        print("Model type:", type(model))

        #mapping the selected id symtoms to the names
        selected_symptoms_names = []
        for s in symptoms_list:
            if s["id"] in data.symptoms:
                selected_symptoms_names.append(s["name"])
            
        #a binary vector for the selected symptom
        input_data = []
        for symptom in symptoms_list:
            if symptom["name"] in selected_symptoms_names:
                input_data.append(1)
            else:
                input_data.append(0)
              
        
        symptoms_array = np.array(input_data).reshape(1,-1)
        prediction = model.predict(symptoms_array)[0]
        disease_precautions = precautions.get(prediction.strip(), ["No Precautions found for this disease"])
        print("Prediction:", prediction)
        print("Precautions returned:", disease_precautions)

        return {"prediction": prediction, "disease_precautions": disease_precautions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    