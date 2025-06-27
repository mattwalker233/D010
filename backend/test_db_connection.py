import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise ValueError("DATABASE_URL not set in environment!")

engine = create_engine(db_url)

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        print("Connection successful!")
        print("PostgreSQL version:", result.fetchone()[0])
except Exception as e:
    print("Connection failed:", e) 