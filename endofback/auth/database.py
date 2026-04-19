import os
from datetime import date
from sqlmodel import SQLModel, create_engine, Session, select
from dotenv import load_dotenv, find_dotenv
from models.msee import Mzee
from models.shop import Merch
from models.events import Sherehe
from models.trips import Matrip
from models.collaboraters import Mamorio 
from auth.security import hash_password 

load_dotenv(find_dotenv())

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    seed_initial_data()

def seed_initial_data():
    with Session(engine) as session:
        # --- Mzee (Admin) ---
        admin_email = os.getenv("ADMIN_EMAIL")
        admin_username = os.getenv("ADMIN_USERNAME")
        raw_admin_password = os.getenv("ADMIN_PASSWORD")
        
        existing_mzee = session.exec(select(Mzee).where(Mzee.email == admin_email)).first()
        if not existing_mzee and admin_email and raw_admin_password:
            new_admin = Mzee(
                email=admin_email,
                username=admin_username,
                hashed_password=hash_password(raw_admin_password), 
                full_name=os.getenv("ADMIN_FULL_NAME"),
                is_admin=True 
            )
            session.add(new_admin)
            print(f"--- Seeding: Admin '{admin_username}' created ---")

        test_merch_sku = "BRAND-001"
        existing_merch = session.exec(select(Merch).where(Merch.sku == test_merch_sku)).first()
        if not existing_merch:
            new_merch = Merch(
                sku=test_merch_sku,
                name="Official Brand Tee",
                price=1500.00,
                stock_quantity=100,
                category="Apparel"
            )
            session.add(new_merch)
            print(f"--- Seeding: Test Merch '{test_merch_sku}' added ---")
            
        test_trip_sku = "Trip-001"
        existing_trip = session.exec(select(Matrip).where(Matrip.sku == test_trip_sku)).first()
        if not existing_trip:
            new_trip = Matrip(
                sku=test_trip_sku,
                name="Moyale Expedition",
                description="Lovely trip to the border",
                start_date=date(2026, 3, 22), 
                end_date=date(2026, 4, 22),
                location="Moyale",
                activities="Swimming",
                price=40300.00, 
                capacity=55,
                public_rating=4.5,
                image_url=""
            )
            session.add(new_trip)
            print(f"--- Seeding: Test Trip '{test_trip_sku}' added ---")
            
       
        test_sherehe_sku = "Sherehe-001"
        existing_sherehe = session.exec(select(Sherehe).where(Sherehe.sku == test_sherehe_sku)).first()
        if not existing_sherehe:
            new_sherehe = Sherehe(
                sku=test_sherehe_sku,
                name="Sip & Paint",
                description="Pombe na kupaint",
                date=date(2026, 4, 22),
                location="Thika",
                activities="Painting, Drinking", 
                price=255.75,
                public_rating=4.5,
                image_url=""
            )
            session.add(new_sherehe)
            print(f"--- Seeding: Test Event '{test_sherehe_sku}' added ---")
        
       
        test_mori_sku = "Collaboraters-001"
        existing_mori = session.exec(select(Mamorio).where(Mamorio.sku == test_mori_sku)).first()
        if not existing_mori:
            new_mori = Mamorio(
                sku=test_mori_sku,
                name="Kenya Cane",
                description="Calm like a mf",
                email="testingemail@gmail.com",
                phone="0712345678",
                location="Kiambu",
                profile_picture_url="Calm"
            )
            session.add(new_mori)
            print(f"--- Seeding: Test Mamorio '{test_mori_sku}' added ---") 

        session.commit()

def get_session():
    with Session(engine) as session:
        yield session