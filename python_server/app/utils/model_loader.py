import os
import joblib

def load_model():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(BASE_DIR, "..", "ml_models", "Best_random_forest_model.pkl")
    model = joblib.load(model_path)
    return model


model = load_model()
print("✅ Model loaded successfully!")
