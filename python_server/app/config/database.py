from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = "PandemicDb"

client = AsyncIOMotorClient(MONGO_URI)
database = client[DATABASE_NAME]
users_collection = database.get_collection("users")


