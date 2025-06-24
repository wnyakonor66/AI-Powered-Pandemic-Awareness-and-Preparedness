from fastapi import APIRouter, HTTPException
from app.config.database import outbreak_collection
from datetime import datetime, timezone
from bson import ObjectId
from typing import List
from app.models.location import Location

router = APIRouter()

# Helper function to serialize MongoDB documents
def serialize_outbreak(outbreak):
    return {
        "id": str(outbreak.get("_id", ObjectId())),  # Convert ObjectId to string # "id": str(outbreak["_id"]) 
        "longitude": outbreak["longitude"],
        "latitude": outbreak["latitude"],
        "timestamp": outbreak.get("timestamp").isoformat() if outbreak.get("timestamp") else None,
        "predicted_disease": outbreak["predicted_disease"],
        "case_count": outbreak.get("case_count", 1),
        "location_name": outbreak.get("location_name", "Unknown"),
        "age": outbreak.get("age", None),
        "gender": outbreak.get("gender", None)

    }

@router.get("/outbreaks", response_model=List[Location])
async def get_outbreaks():
    outbreaks = await outbreak_collection.find().to_list(None)
    print(outbreaks)
    serialized = [serialize_outbreak(outbreak) for outbreak in outbreaks] 
    print("final serialized:", serialized)
    return serialized

@router.post("/outbreaks")
async def report_outbreak(data: Location):
    try:
        # Check if the same location already exists (ignore disease for uniqueness)
        existing = await outbreak_collection.find_one({
            "latitude": data.latitude,
            "longitude": data.longitude
        })

        if existing:
            # Update with new disease and timestamp, but do not increment count blindly
            await outbreak_collection.update_one(
                {"_id": existing["_id"]},
                {
                    "$set": {
                        "predicted_disease": data.predicted_disease,
                        "timestamp": datetime.now(timezone.utc)
                    }
                }
            )
            return {"message": "Outbreak at this location updated with new disease"}

        else:
            new_outbreak = {
                "latitude": data.latitude,
                "longitude": data.longitude,
                "predicted_disease": data.predicted_disease,
                "timestamp": datetime.now(timezone.utc),
                "case_count": 1,
                # "location_name": data.location_name or "Unknown Location",
                "age": data.age,
                "gender": data.gender
                
            }
            await outbreak_collection.insert_one(new_outbreak)
            return {"message": "New outbreak reported"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
