from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in environment!")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Entity model
class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, index=True)
    entity_name = Column(String, nullable=True)
    printed_name = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Dashboard record model
class DashboardRecord(Base):
    __tablename__ = "dashboard_records"

    id = Column(Integer, primary_key=True, index=True)
    operator = Column(String)
    entity = Column(String)
    state = Column(String)
    effective_date = Column(DateTime)
    property_name = Column(String)
    property_description = Column(Text)
    decimal_interest = Column(Float)
    county = Column(String)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 