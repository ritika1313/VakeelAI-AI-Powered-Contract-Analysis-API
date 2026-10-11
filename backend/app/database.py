# Creates the MongoDB client and collection reference
from pymongo import MongoClient
from app.config import MONGODB_URI


client = MongoClient(MONGODB_URI)

db = client["mydb"]

contracts_collection = db["contracts"]
analyses_collection = db["analyses"]


def init_db():
    try:
        client.admin.command("ping")
        print("MongoDB connected successfully")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        raise