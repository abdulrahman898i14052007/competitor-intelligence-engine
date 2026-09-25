from database import SessionLocal, SocialProfile, Post, Base, engine

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Clear existing data so this script can be re-run safely
db.query(Post).delete()
db.query(SocialProfile).delete()
db.commit()

profiles = [
    {"handle": "your_brand", "display_name": "Your Brand", "niche": "General", "followers": 15400, "following": 320, "total_posts": 248},
    {"handle": "urban.threads", "display_name": "Urban Threads", "niche": "Fashion", "followers": 22000, "following": 410, "total_posts": 310},
    {"handle": "glow.beautyco", "display_name": "Glow Beauty Co", "niche": "Beauty", "followers": 31000, "following": 280, "total_posts": 402},
    {"handle": "techhive.gadgets", "display_name": "TechHive Gadgets", "niche": "Technology", "followers": 18500, "following": 190, "total_posts": 275},
    {"handle": "brewhouse.cafe", "display_name": "Brewhouse Cafe", "niche": "Food & Beverage", "followers": 9800, "following": 540, "total_posts": 190},
]

posts = {
    "your_brand": [
        ("2026-07-01", "Reel", 120, 8, 1200, 45, 30),
        ("2026-07-03", "Image", 60, 5, 800, 20, 10),
        ("2026-07-05", "Carousel", 200, 10, 1500, 60, 40),
        ("2026-07-08", "Reel", 90, 7, 2000, 80, 55),
        ("2026-07-10", "Image", 45, 4, 600, 15, 8),
        ("2026-07-13", "Carousel", 180, 9, 1300, 50, 35),
        ("2026-07-15", "Reel", 110, 8, 2200, 90, 60),
        ("2026-07-18", "Image", 55, 5, 700, 18, 12),
    ],
    "urban.threads": [
        ("2026-07-01", "Reel", 100, 12, 3000, 120, 90),
        ("2026-07-02", "Reel", 95, 11, 3200, 130, 95),
        ("2026-07-04", "Image", 50, 6, 1000, 30, 20),
        ("2026-07-06", "Carousel", 150, 9, 1800, 70, 45),
        ("2026-07-09", "Reel", 105, 10, 3500, 140, 100),
        ("2026-07-12", "Reel", 98, 11, 3100, 125, 88),
        ("2026-07-14", "Image", 55, 5, 900, 25, 15),
        ("2026-07-17", "Carousel", 160, 10, 2000, 75, 50),
    ],
    "glow.beautyco": [
        ("2026-07-01", "Carousel", 220, 14, 4200, 210, 130),
        ("2026-07-03", "Reel", 130, 12, 5000, 260, 175),
        ("2026-07-05", "Image", 70, 8, 1800, 60, 35),
        ("2026-07-07", "Reel", 125, 13, 4800, 240, 160),
        ("2026-07-10", "Carousel", 210, 13, 3900, 190, 120),
        ("2026-07-13", "Reel", 140, 12, 5200, 270, 180),
        ("2026-07-16", "Image", 65, 7, 1600, 55, 30),
        ("2026-07-19", "Carousel", 200, 14, 4000, 200, 125),
    ],
    "techhive.gadgets": [
        ("2026-07-01", "Image", 180, 6, 900, 40, 60),
        ("2026-07-04", "Carousel", 260, 8, 1400, 65, 95),
        ("2026-07-07", "Reel", 100, 7, 1600, 70, 110),
        ("2026-07-10", "Image", 190, 6, 850, 38, 55),
        ("2026-07-13", "Carousel", 270, 9, 1500, 68, 100),
        ("2026-07-16", "Reel", 105, 7, 1750, 75, 120),
        ("2026-07-19", "Image", 175, 5, 800, 35, 50),
        ("2026-07-22", "Carousel", 250, 8, 1450, 66, 98),
    ],
    "brewhouse.cafe": [
        ("2026-07-01", "Image", 40, 6, 500, 25, 10),
        ("2026-07-03", "Reel", 85, 9, 1400, 65, 40),
        ("2026-07-06", "Carousel", 120, 7, 800, 35, 18),
        ("2026-07-09", "Image", 45, 5, 550, 28, 12),
        ("2026-07-12", "Reel", 90, 9, 1500, 70, 45),
        ("2026-07-15", "Carousel", 115, 8, 850, 38, 20),
        ("2026-07-18", "Image", 42, 6, 520, 26, 11),
        ("2026-07-21", "Reel", 88, 9, 1450, 68, 42),
    ],
}

for p in profiles:
    db.add(SocialProfile(**p))

for handle, plist in posts.items():
    for (date, ptype, cap, tags, likes, comments, shares) in plist:
        db.add(Post(
            handle=handle, date=date, post_type=ptype,
            caption_length=cap, hashtag_count=tags,
            likes=likes, comments=comments, shares=shares
        ))

db.commit()
db.close()
print("Seed data inserted successfully — 5 profiles, 40 posts.")