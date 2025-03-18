from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

MONGO_URI = "mongodb+srv://winfred:BlackClover123$$@cluster3.i7plx.mongodb.net/"

async def test_connection():
    client = AsyncIOMotorClient(MONGO_URI, tls=True)
    try:
        db = client.get_database("PandemicDb")
        collections = await db.list_collection_names()
        print("Connected Successfully! Collections:", collections)
    except Exception as e:
        print("Connection Failed:", e)

asyncio.run(test_connection())
