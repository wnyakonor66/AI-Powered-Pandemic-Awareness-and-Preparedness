from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    username: str
    email: EmailStr
    password: str
    