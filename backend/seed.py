import os 
from models.msee import Mzee
from dotenv import load_dotenv, find_dotenv
from auth.security import hash_password

load_dotenv(find_dotenv())

def seed_initial_data():
    admin_email = os.getenv("ADMIN_EMAIL")
    raw_admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not raw_admin_password:
        print("--- Seeding: Admin credentials not provided in environment variables ---")
        return

    existing_mzee = Mzee.get_by_email(admin_email)
    if not existing_mzee:
        new_admin = Mzee(
            email=admin_email,
            hashed_password=hash_password(raw_admin_password),
            is_admin=True
        )
        new_admin.save()
        print(f"--- Seeding: Admin '{admin_email}' created ---")
    else:
        print(f"--- Seeding: Admin '{admin_email}' already exists ---")