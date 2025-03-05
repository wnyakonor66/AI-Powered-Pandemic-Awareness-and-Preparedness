import asyncio
from app.config.database import users_collection

async def test_connection():
    try:
        user = await users_collection.find_one()
        print("Database connection successful! Sample user:", user)
    except Exception as e:
        print("Database connection failed:", str(e))

asyncio.run(test_connection())
