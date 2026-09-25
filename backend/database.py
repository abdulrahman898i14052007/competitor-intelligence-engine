from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    platform = Column(String)
    profile_id = Column(String)
    email = Column(String)
    mobile = Column(String)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Competitor(Base):
    __tablename__ = "competitors"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    competitor_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class SocialProfile(Base):
    __tablename__ = "social_profiles"
    id = Column(Integer, primary_key=True, index=True)
    handle = Column(String, unique=True, index=True)
    display_name = Column(String)
    niche = Column(String)
    followers = Column(Integer)
    following = Column(Integer)
    total_posts = Column(Integer)


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    handle = Column(String, index=True)
    date = Column(String)
    post_type = Column(String)
    caption_length = Column(Integer)
    hashtag_count = Column(Integer)
    likes = Column(Integer)
    comments = Column(Integer)
    shares = Column(Integer)


Base.metadata.create_all(bind=engine)