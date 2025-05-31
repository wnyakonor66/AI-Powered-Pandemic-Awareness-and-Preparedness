from fastapi import APIRouter, Depends, HTTPException
from app.config.database import location_collection
from app.utils.hash import get_current_user


router = APIRouter()

@router.get("/disease-history")
async def get_disease_history(current_user: dict = Depends(get_current_user)):
    
    user_id = current_user.get("id")
    
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is missing from token")
    print(f"Fetching disease history for user ID: {user_id}")
    
    # Fetch outbreaks related to the user
    history = await location_collection.find({"user_id": user_id}).to_list(None)
    
    if not history:
        return {"message": "No disease history found for this user."}
    
    result = []
    for record in history:
        result.append({
            "disease": record.get("predicted_disease"),
            "date": record.get("timestamp").isoformat() if record.get("timestamp") else None,
            "latitude": record.get("latitude"),
            "longitude": record.get("longitude"),
        })
    return {"disease_history": result}