#file for loading the model
import os
import joblib

def load_model():
    model_path = os.path.join("ml_models", "my_model.pkl")
    model = joblib.load(model_path)
    return model

model = load_model()

