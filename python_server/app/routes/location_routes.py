from fastapi import APIRouter, HTTPException, Depends
from app.config.database import location_collection, outbreak_collection
from datetime import datetime, timezone
from app.models.location import Location
from app.utils.hash import get_current_user
from app.utils.geo import reverse_geocode

router = APIRouter()


@router.post("/store-location")
async def store_location(data: Location, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    user_age = current_user.get("age")
    user_gender = current_user.get("gender")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID missing in token")
    
    if user_age is None or user_gender is None:
        raise HTTPException(status_code=400, detail="User age and gender must be provided in token")
    
    print(f"Details from token: {user_age}, {user_gender}")

    try:
        location_name = await reverse_geocode(data.latitude, data.longitude)
        # 1. Check if same user has already submitted a report at this location
        existing_report = await location_collection.find_one({
            "user_id": user_id,
            "longitude": data.longitude,
            "latitude": data.latitude
        })

        if existing_report:
            # If disease is different, overwrite it; else update timestamp
            update_fields = {"timestamp": datetime.now(timezone.utc)}
            if existing_report["predicted_disease"] != data.predicted_disease:
                update_fields["predicted_disease"] = data.predicted_disease

            await location_collection.update_one(
                {"_id": existing_report["_id"]},
                {"$set": update_fields}
            )

            # 2. Update outbreak collection (count based on location and disease, not user)
            existing_outbreak = await outbreak_collection.find_one({
                "longitude": data.longitude,
                "latitude": data.latitude,
                "predicted_disease": data.predicted_disease
            })

            if existing_outbreak:
                await outbreak_collection.update_one(
                    {"_id": existing_outbreak["_id"]},
                    {"$inc": {"case_count": 1}, "$set": {"timestamp": datetime.now(timezone.utc)}}
                )
            else:
                outbreak_data = {
                    "longitude": data.longitude,
                    "latitude": data.latitude,
                    "timestamp": datetime.now(timezone.utc),
                    "predicted_disease": data.predicted_disease,
                    "case_count": 1
                }
                await outbreak_collection.insert_one(outbreak_data)

            return {"message": "Updated report at same location"}

        else:
            # New location for the user → insert new location report
            location_data = {
                "user_id": user_id,
                "longitude": data.longitude,
                "latitude": data.latitude,
                "timestamp": datetime.now(timezone.utc),
                "predicted_disease": data.predicted_disease,
                "location_name": location_name
            }
            await location_collection.insert_one(location_data)

            # Handle outbreak collection
            existing_outbreak = await outbreak_collection.find_one({
                "longitude": data.longitude,
                "latitude": data.latitude,
                "predicted_disease": data.predicted_disease
            })

            if existing_outbreak:
                await outbreak_collection.update_one(
                    {"_id": existing_outbreak["_id"]},
                    {
                        "$inc": {"case_count": 1}, 
                        "$set": {
                            "timestamp": datetime.now(timezone.utc),
                            "age": user_age,
                            "gender": user_gender
                            
                }}
                )
            else:
                outbreak_data = {
                    "longitude": data.longitude,
                    "latitude": data.latitude,
                    "timestamp": datetime.now(timezone.utc),
                    "predicted_disease": data.predicted_disease,
                    "case_count": 1,
                    "location_name": location_name,
                    "age": user_age,
                    "gender": user_gender
                }
                await outbreak_collection.insert_one(outbreak_data)

            return {"message": "New report inserted for new location"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

