from pydantic import BaseModel
from typing import List

class SymptomsInput(BaseModel):
    symptoms: List[int]