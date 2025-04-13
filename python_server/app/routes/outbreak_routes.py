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
        "id": str(outbreak["_id"]),  # Convert ObjectId to string
        "longitude": outbreak["longitude"],
        "latitude": outbreak["latitude"],
        "timestamp": outbreak.get("timestamp"),
        "predicted_disease": outbreak["predicted_disease"]
    }

@router.get("/outbreaks", response_model=List[Location])
async def get_outbreaks():
    outbreaks = await outbreak_collection.find().to_list(10)
    print(outbreaks)
    return [serialize_outbreak(outbreak) for outbreak in outbreaks] 
