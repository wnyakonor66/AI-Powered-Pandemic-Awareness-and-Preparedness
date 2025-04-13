from pydantic import BaseModel, Field
from typing import Optional

class Location(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    longitude: float
    latitude: float
    timestamp: Optional[str] = None
    predicted_disease: str