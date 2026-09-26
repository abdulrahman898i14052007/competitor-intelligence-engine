from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from groq import Groq
from dotenv import load_dotenv
import os
import subprocess

from database import SessionLocal, User, Profile, Competitor

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Competitor Intelligence Engine backend running!"}


# ---------- Chatbot ----------

class ChatMessage(BaseModel):
    message: str


@app.post("/chat")
def chat(payload: ChatMessage):
    try:
        response = client.chat.completions.create(
    model="mixtral-8x7b-32768",
    messages=[
        {"role": "system", "content": "You are a social media marketing strategy assistant. Answer briefly and practically in 2-3 sentences."},
        {"role": "user", "content": payload.message}
    ]
)
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}


# ---------- Database Models ----------

class UserCreate(BaseModel):
    username: str


class ProfileCreate(BaseModel):
    username: str
    platform: str
    profile_id: str
    email: str
    mobile: str
    category: str


class CompetitorCreate(BaseModel):
    username: str
    competitor_id: str


# ---------- Database Endpoints ----------

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        return {"message": "Welcome back!", "username": existing.username}
    new_user = User(username=user.username)
    db.add(new_user)
    db.commit()
    return {"message": "User created", "username": new_user.username}


@app.post("/connect-profile")
def connect_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    new_profile = Profile(**profile.dict())
    db.add(new_profile)
    db.commit()
    return {"message": "Profile connected successfully"}


@app.post("/add-competitor")
def add_competitor(comp: CompetitorCreate, db: Session = Depends(get_db)):
    new_comp = Competitor(**comp.dict())
    db.add(new_comp)
    db.commit()
    return {"message": "Competitor added"}


@app.get("/competitors/{username}")
def get_competitors(username: str, db: Session = Depends(get_db)):
    comps = db.query(Competitor).filter(Competitor.username == username).all()
    return [{"competitor_id": c.competitor_id} for c in comps]
from database import SocialProfile, Post

@app.get("/profile-data/{handle}")
def get_profile_data(handle: str, db: Session = Depends(get_db)):
    profile = db.query(SocialProfile).filter(SocialProfile.handle == handle).first()
    if not profile:
        return {"found": False, "message": "Profile not in manual database"}

    profile_posts = db.query(Post).filter(Post.handle == handle).all()
    return {
        "found": True,
        "handle": profile.handle,
        "display_name": profile.display_name,
        "niche": profile.niche,
        "followers": profile.followers,
        "following": profile.following,
        "total_posts": profile.total_posts,
        "posts": [
            {
                "date": p.date, "type": p.post_type,
                "captionLength": p.caption_length, "hashtags": p.hashtag_count,
                "likes": p.likes, "comments": p.comments, "shares": p.shares,
            } for p in profile_posts
        ],
    }


@app.get("/run-seed")
def run_seed():
    try:
        subprocess.run(["python", "seed_data.py"], check=True)
        return {"status": "success", "message": "Database seeded successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    