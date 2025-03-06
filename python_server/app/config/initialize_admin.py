from app.config.database import users_collection
from app.utils.hash import hash_password
import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not ADMIN_EMAIL or not ADMIN_PASSWORD:
    raise ValueError("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file")

print(f"Looking for admin with email: {ADMIN_EMAIL}")
existing_admin = users_collection.find({"email": ADMIN_EMAIL})

if not existing_admin:
    print("Creating an admin...")
    result = users_collection.insert_one({
        "email": ADMIN_EMAIL,
        "password": hash_password(ADMIN_PASSWORD),
        "role": "admin"    
    })
    print(f"Admin created successfully with ID: {result.inserted_id}")
else:
    print("Admin already exist")