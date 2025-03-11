#authenticate routes
from fastapi import FastAPI, APIRouter, HTTPException
from app.config.database import users_collection
from app.utils.hash import verify_password, hash_password, create_access_token
from bson import ObjectId
from app.schemas.user import UserLoginSchema, UserSignUpSchema
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

@router.post("/signup")
async def signup(user: UserSignUpSchema):    
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        print("Email already registered")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    user_dict["role"] = "admin" if user.email == ADMIN_EMAIL else "user"
    
    result = await users_collection.insert_one(user_dict)
    print(f"User {user.email} signed successfully with role {user_dict['role']}")
    user_id = str(result.inserted_id)
    
    token_data = {
        "sub": user.email,
        "role": user_dict["role"]
    }
    token = create_access_token(token_data)
    
    return {
        "message": "User created successfully",
        "userid": user_id,
        "role": user_dict["role"],
        "access_token": token,
        "token_type": "bearer"
    }
    
    # return {"message": "user created successfully", "userid": user_id}


@router.post("/login")
async def login(user: UserLoginSchema):
    existing_user = await users_collection.find_one({"email": user.email})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        print("Invalid email and password")
        raise HTTPException(status_code=401, detail="Invalid email and password")
    
    token_data = {
        "sub": existing_user["email"],
        "role": existing_user["role"]
    }
    token = create_access_token(token_data)
    print(f"Token generated for {existing_user['email']} with role: {existing_user['role']}")    
    return {"access_token": token, "token_type": "bearer"}
