from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# --- دیتابیس ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./razy_soft.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    otp_code = Column(String)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class LoginSchema(BaseModel):
    PhoneNumber: str

class VerifySchema(BaseModel):
    PhoneNumber: str
    Code: str

# --- پروفایل (بسیار مهم برای خروج از حالت بارگذاری) ---
@app.get("/api/b2b/Customer/Profile")
async def get_profile():
    return {
        "isSuccess": True,
        "data": {
            "fullName": "کاربر سیستم",
            "mobile": "09128449782",
            "avatar": "https://ui-avatars.com/api/?name=User"
        }
    }

# --- احراز هویت ---
@app.post("/api/b2b/Customer/SignUp")
async def sign_up(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == data.PhoneNumber).first()
    if not user:
        user = User(phone_number=data.PhoneNumber, otp_code="1234")
        db.add(user)
    else:
        user.otp_code = "1234"
    db.commit()
    return {"isSuccess": True, "message": "کد ۱۲۳۴ ثبت شد"}

@app.post("/api/b2b/Customer/VerifySignIn")
async def verify(data: VerifySchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == data.PhoneNumber).first()
    if user and user.otp_code == data.Code:
        return {"isSuccess": True, "data": f"TOKEN_{user.phone_number}", "message": "خوش آمدید"}
    raise HTTPException(status_code=400, detail="کد غلط است")

# --- فروشگاه‌ها (Stores) ---
@app.get("/api/b2b/Commodity/Stores")
@app.get("/api/b2b/Commodity/stores")
async def get_stores(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return {
        "status": 1,
        "resultCode": 0,
        "message": "با موفقیت انجام شد",
        "errors": [],
        "data": [
            {
                "Id": u.id,
                "Name": f"فروشگاه شماره {u.id}",   # ✅ چیزی که فرانت می‌خواهد
                "StoreName": f"فروشگاه شماره {u.id}",  # برای اطمینان
                "Mobile": u.phone_number,
                "CityTitle": "تهران"
            }
            for u in users
        ]
    }


# --- موجودی کالا (Stock) ---
@app.get("/api/b2b/Commodity/Stock")
@app.get("/api/b2b/Commodity/stock")
def get_stock():
    """
    موجودی کالا:
    - فرانت شما احتمالاً این فیلدها را می‌خواند: CmFullName, Barcode, Supply
    - برای سازگاری، علاوه بر آن‌ها بقیه کلیدها را هم نگه می‌داریم.
    """

    products_seed = [
        ("شیر استریل رازی", "RZ-101", "عدد", 30000),
        ("پنیر خامه‌ای رازی", "RZ-102", "بسته", 45000),
        ("ماست کم‌چرب رازی", "RZ-103", "لیوان", 22000),
        ("دوغ نعناع رازی", "RZ-104", "بطری", 18000),
        ("کره حیوانی رازی", "RZ-105", "قوطی", 65000),
        ("خامه صبحانه رازی", "RZ-106", "بسته", 40000),
        ("شیر کاکائو رازی", "RZ-107", "پاکت", 28000),
        ("پنیر پیتزا رازی", "RZ-108", "کیلو", 210000),
        ("بستنی وانیلی رازی", "RZ-109", "عدد", 55000),
        ("آب‌پنیر رازی", "RZ-110", "بطری", 25000),
    ]

    data = []

    for i in range(1, 51):
        name, code, unit, price = products_seed[(i - 1) % len(products_seed)]

        # هر 4 تا یکی ناموجود، بقیه موجود 1..25
        supply = 0 if (i % 4 == 0) else (i % 25) + 1
        is_available = supply > 0

        full_title = f"{name} - سری {i}"
        barcode = f"{code}-{i:03d}"  # مثل RZ-104-004

        item = {
            # شناسه‌ها
            "Id": i,
            "id": i,

            # ✅ چیزی که فرانت شما احتمالاً می‌خونه
            "CmFullName": full_title,   # اگر نبود => UI می‌زند "نامشخص"
            "Barcode": barcode,         # UI خودش # را اضافه می‌کند
            "Supply": supply,           # اگر نبود/undefined => UI می‌زند "ناموجود"

            # برای سازگاری‌های دیگر
            "commodityFullTitle": full_title,
            "CommodityFullTitle": full_title,
            "Name": full_title,

            "commodityCode": barcode,
            "CommodityCode": barcode,

            "availableCount": supply,
            "AvailableCount": supply,

            "unitTitle": unit,
            "UnitTitle": unit,

            "price": price,
            "Price": price,

            "isAvailable": is_available,
            "IsAvailable": is_available,
        }

        data.append(item)

    return {"isSuccess": True, "data": data, "message": "با موفقیت انجام شد"}