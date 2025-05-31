from fastapi import APIRouter, Depends, HTTPException, Form
from app.utils.hash import get_current_user
from app.config.database import users_collection
from fastapi.responses import JSONResponse
from bson import ObjectId

router = APIRouter()
@router.get("/user-profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    print("current_user:", current_user)
    return {
        "username": current_user.get("username"),
        "email": current_user.get("email"),
    }
    
@router.put("/update-profile")
async def update_user_profile(
    username: str = Form(...), 
    email: str = Form(...),
    password: str = Form(None),
    current_user: dict = Depends(get_current_user)
):
    if not username or not email:
        raise HTTPException(status_code=400, detail="Username and email are required")

    update_fields = {
        "username": username,
        "email": email,
    }
    
    print("current_user:", current_user)
    
    if password:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed_password = pwd_context.hash(password)
        update_fields["password"] = hashed_password
        
    user_id = ObjectId(current_user["id"])
    print("user_id:", user_id)
    if not await users_collection.find_one({"_id": user_id}):
        raise HTTPException(status_code=404, detail="UserID not found")
    await users_collection.update_one(
        {"_id": user_id},
        {"$set": update_fields},
    )
    if not await users_collection.find_one({"_id": user_id}):
        raise HTTPException(status_code=404, detail="User not found")
    
    return JSONResponse(content={"message": "Profile updated successfully"})
