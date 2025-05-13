
from fastapi import APIRouter
from bson.son import SON
from app.config.database import outbreak_collection
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/daily-trends")
async def get_daily_trends():
    # Aggregate total cases per day from MongoDB
    pipeline = [
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$timestamp"
                    }
                },
                "total_cases": {"$sum": 1}
            }
        },
        {"$sort": SON([("_id", 1)])}
    ]

    results = await outbreak_collection.aggregate(pipeline).to_list(length=None)

  

    labels = [datetime.strptime(item["_id"], "%Y-%m-%d").strftime("%d") for item in results]
    values = [item["total_cases"] for item in results]

    return {"labels": labels, "values": values}