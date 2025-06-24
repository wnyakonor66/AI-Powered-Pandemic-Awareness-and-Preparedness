from fastapi import APIRouter, Depends, HTTPException
from app.utils.hash import get_current_user
from app.config.database import users_collection
from pydantic import BaseModel
from bson import ObjectId

class PushToken(BaseModel):
    token: str

router = APIRouter()

@router.put("/save-push-token")
async def save_push_token(payload: PushToken, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]
        print("Push token:", payload.token)
        print("Current user:", current_user)

        doc = await users_collection.find_one({"_id": ObjectId(user_id)})
        print("Matched doc:", doc)

        update_result = await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"push_token": payload.token}}
        )

        if update_result.matched_count == 1:
            print("User found — token updated or already exists")
            return {"message": "Push token saved or already existed"}
        else:
            raise HTTPException(status_code=404, detail="No matching user found")
        
    except Exception as e:
        print("Error in saving push token:", str(e))
        raise HTTPException(status_code=500, detail=str(e))