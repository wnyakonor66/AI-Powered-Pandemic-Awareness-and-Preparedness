from fastapi import Depends, APIRouter
from app.utils.hash import get_current_user
from app.middleware.auth import role_required

router = APIRouter()
@router.get("/protected")
async def protected_route(user: dict = Depends(get_current_user)):
    return {"message": "This is a protected routes", "user": user}

@router.get("/admin-only")
async def admin_dashboard(user=Depends(role_required, required_role="admin")):
     return {"message": "Welcome Admin!"}

@router.get("/user-only")
async def user_dashboard(user=Depends(role_required, required_role="user")):
    return {"message": "Welcome User!"}