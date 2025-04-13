from fastapi import FastAPI, APIRouter, HTTPException,Depends
from app.config.database import location_collection,outbreak_collection
from datetime import datetime, timezone
from app.models.location import Location
from app.utils.hash import get_current_user

router = APIRouter()

@router.post("/store-location")
async def store_location(data: Location, current_user: dict = Depends(get_current_user)):
    print(f"Decoded Token Data: {current_user}")
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID missing in token")
    try:   
        location_data = {
            "user_id": user_id,
            "longitude": data.longitude,
            "latitude": data.latitude,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "predicted_disease": data.predicted_disease
            
        }
        print("Data to be inserted:", location_data)
        result = await location_collection.insert_one(location_data)
        outbreak_collection.insert_one(location_data)

        print("Inserted ID:", result.inserted_id)
        return {"message": "Location stored successfully", "inserted_id": str(result.inserted_id)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))