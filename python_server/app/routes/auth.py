from fastapi import FastAPI, APIRouter, HTTPException
from app.config.database import users_collection
from app.utils.hash import verify_password, hash_password
from bson import ObjectId
from app.schemas.user import UserLoginSchema, UserSignUpSchema


router = APIRouter()
@router.post("/signup")
async def signup(user: UserSignUpSchema):    
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    
    result = await users_collection.insert_one(user_dict)
    return {"message": "user created successfully", "userid": str(result.inserted_id)}

@router.post("/login")
async def login(user: UserLoginSchema):
    existing_user = await users_collection.find_one({"email": user.email})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email and password")
    return {"message": "login successfully"}