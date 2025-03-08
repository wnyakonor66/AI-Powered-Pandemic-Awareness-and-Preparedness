#extract the token from the middleware
from fastapi import HTTPException, Depends, Security
from app.utils.hash import decode_access_token
from app.config.database import users_collection
from fastapi.security import OAuth2PasswordBearer

oath2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Security(oath2_scheme)):
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return {"email": user["email"], "role": user.get("role", "user")}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
async def role_required(required_role: str, user: dict = Depends(get_current_user)):
    if user["role"] != required_role:
        raise HTTPException(status_code=403, detail="Access denied")
    return user
            