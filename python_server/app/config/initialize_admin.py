#initial credential for the admin
from app.config.database import users_collection
from app.utils.hash import hash_password
import os
from dotenv import load_dotenv
from bson import ObjectId
import asyncio

load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not ADMIN_EMAIL or not ADMIN_PASSWORD:
    raise ValueError("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file")

async def initiliaze_admin():
    print(f"Looking for admin with email: {ADMIN_EMAIL}")
    existing_admin = await users_collection.find_one({"email": ADMIN_EMAIL})

    if existing_admin:
        email = existing_admin["email"]
        print(f"Admin already exists with email: {email}")
    else:
        result = await users_collection.insert_one({
            "email": ADMIN_EMAIL,
            "password": hash_password(ADMIN_PASSWORD),
            "role": "admin"
        })

        print(f"Admin created successfully with ID: {result.inserted_id}")

asyncio.run(initiliaze_admin())