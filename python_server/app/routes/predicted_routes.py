from fastapi import APIRouter,HTTPException, Depends
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
        
        # user_id = current_user.get("id")
        # if not user_id:
        #     raise HTTPException(status_code=400, detail="User ID missing in token")
        # print(f"User ID in the predicted routes: {user_id}")
        
        # age = current_user.get("age")
        # gender = current_user.get("gender")
        # if not age or gender is None:
        #     raise HTTPException(status_code=400, detail="Age and gender missing in token")
        # print(f"User Age: {age} and gender: {gender}")

        return {"prediction": prediction, "disease_precautions": disease_precautions}
    

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    