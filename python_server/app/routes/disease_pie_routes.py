from fastapi import APIRouter, HTTPException, Query
from app.config.database import outbreak_collection
from app.utils.disease_descriptions import disease_descriptions


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
    top_diseases = [{"diseaseType": item["_id"], "count": item["count"], "latitude": item.get("latitude"), "longitude": item.get("longitude")} for item in results]
    return top_diseases

# New endpoint for disease description and precautions
@router.get("/disease-description")
async def get_disease_description(disease: str = Query(..., description="Disease name")):
    desc = disease_descriptions.get(disease)
    if not desc:
        raise HTTPException(status_code=404, detail="Disease description not found")
    return {
        "disease": disease,
        "description": desc.get("descriptions", "No description available."),
        "precautions": desc.get("precautions", [])
    }