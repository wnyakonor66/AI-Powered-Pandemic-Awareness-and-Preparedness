from fastapi import APIRouter, HTTPException, Depends
from app.config.database import location_collection, outbreak_collection
from datetime import datetime, timezone
from app.models.location import Location
from app.utils.hash import get_current_user

router = APIRouter()

# @router.post("/store-location")
# async def store_location(data: Location, current_user: dict = Depends(get_current_user)):
#     user_id = current_user.get("id")
#     if not user_id:
#         raise HTTPException(status_code=400, detail="User ID missing in token")

#     try:
#         # Check if the user has already submitted a report at the same location
#         existing_report = await location_collection.find_one({
#             "user_id": user_id,
#             "longitude": data.longitude,
#             "latitude": data.latitude
#         })

#         if existing_report:
#             # If same disease, just update timestamp
#             if existing_report["predicted_disease"] == data.predicted_disease:
#                 await location_collection.update_one(
#                     {"_id": existing_report["_id"]},
#                     {"$set": {"timestamp": datetime.now(timezone.utc)}}
#                 )
#                 print("Updated timestamp for same disease at same location")

#             else:
#                 # Update disease and timestamp
#                 await location_collection.update_one(
#                     {"_id": existing_report["_id"]},
#                     {
#                         "$set": {
#                             "predicted_disease": data.predicted_disease,
#                             "timestamp": datetime.now(timezone.utc)
#                         }
#                     }
#                 )
#                 print("Updated disease and timestamp at same location")

#             # Update outbreak table (same logic applies)
#             existing_outbreak = await outbreak_collection.find_one({
#                 "longitude": data.longitude,
#                 "latitude": data.latitude,
#                 "predicted_disease": data.predicted_disease
#             })

#             if existing_outbreak:
#                 await outbreak_collection.update_one(
#                     {"_id": existing_outbreak["_id"]},
#                     {"$inc": {"case_count": 1}, "$set": {"timestamp": datetime.now(timezone.utc)}}
#                 )
#                 print("Updated existing outbreak")
#             else:
#                 outbreak_data = {
#                     "longitude": data.longitude,
#                     "latitude": data.latitude,
#                     "timestamp": datetime.now(timezone.utc),
#                     "predicted_disease": data.predicted_disease,
#                     "case_count": 1
#                 }
#                 await outbreak_collection.insert_one(outbreak_data)
#                 print("Inserted new outbreak")

#             return {"message": "User report updated at same location"}

#         else:
#             # User has not reported at this location → insert new report
#             location_data = {
#                 "user_id": user_id,
#                 "longitude": data.longitude,
#                 "latitude": data.latitude,
#                 "timestamp": datetime.now(timezone.utc).isoformat(),
#                 "predicted_disease": data.predicted_disease
#             }
#             await location_collection.insert_one(location_data)
#             print("Inserted new location report")

#             # Handle outbreak
#             existing_outbreak = await outbreak_collection.find_one({
#                 "longitude": data.longitude,
#                 "latitude": data.latitude,
#                 "predicted_disease": data.predicted_disease
#             })

#             if existing_outbreak:
#                 await outbreak_collection.update_one(
#                     {"_id": existing_outbreak["_id"]},
#                     {"$inc": {"case_count": 1}, "$set": {"timestamp": datetime.now(timezone.utc)}}
#                 )
#                 print("Updated existing outbreak")
#             else:
#                 outbreak_data = {
#                     "longitude": data.longitude,
#                     "latitude": data.latitude,
#                     "timestamp": datetime.now(timezone.utc),
#                     "predicted_disease": data.predicted_disease,
#                     "case_count": 1
#                 }
#                 await outbreak_collection.insert_one(outbreak_data)
#                 print("Inserted new outbreak")

#             return {"message": "New report inserted for new location"}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
@router.post("/store-location")
async def store_location(data: Location, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID missing in token")

    try:
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
                "predicted_disease": data.predicted_disease
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

            return {"message": "New report inserted for new location"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

