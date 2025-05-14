from fastapi import APIRouter, HTTPException
from app.config.database import outbreak_collection


router = APIRouter()
@router.get("/disease-pie")
async def get_disease_pie():
    pipeline = [
        {
            "$group": {
                "_id": "$predicted_disease",
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"count": -1}},
        {"$limit": 5}, #top 5 reported diseases
    ]

    results = await outbreak_collection.aggregate(pipeline).to_list(length=None)
    if not results:
            raise HTTPException(status_code=404, detail="No data found") 
    top_diseases = [{"diseaseType": item["_id"], "count": item["count"], "latitude": item["latitude"], "longitude": item["longitude"]} for item in results]
    return top_diseases