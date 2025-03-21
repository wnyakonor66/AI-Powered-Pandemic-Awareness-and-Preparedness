from pydantic import BaseModel, Field
from typing import Optional

class Location(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    latitude: float
    longitude: float
    timestamp: Optional[str] = None