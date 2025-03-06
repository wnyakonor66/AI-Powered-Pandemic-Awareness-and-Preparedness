from fastapi import Depends, APIRouter
from app.utils.hash import get_current_user

router = APIRouter()
@router.get("/protected")
async def protected_route(user: dict = Depends(get_current_user)):
    return {"message": "This is a protected routes", "user": user}