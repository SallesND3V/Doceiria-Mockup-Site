from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'paula-veiga-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# ==================== Models ====================

class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminRegister(BaseModel):
    email: str
    password: str
    name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    name: str

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CategoryCreate(BaseModel):
    name: str
    slug: str

class Cake(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category_id: str
    image_url: str
    instagram_url: Optional[str] = None
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CakeCreate(BaseModel):
    name: str
    description: str
    price: float = 0
    category_id: str
    image_url: str
    instagram_url: Optional[str] = None
    featured: bool = False

class CakeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    instagram_url: Optional[str] = None
    featured: Optional[bool] = None

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author_name: str
    content: str
    rating: int = 5
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestimonialCreate(BaseModel):
    author_name: str
    content: str
    rating: int = 5

class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "site_settings"
    hero_image_url: str = ""
    logo_url: str = ""
    instagram_access_token: Optional[str] = None
    instagram_user_id: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SiteSettingsUpdate(BaseModel):
    hero_image_url: Optional[str] = None
    logo_url: Optional[str] = None
    instagram_access_token: Optional[str] = None
    instagram_user_id: Optional[str] = None

# ==================== Auth Utils ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        user = await db.admins.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# ==================== Auth Routes ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: AdminRegister):
    existing = await db.admins.find_one({"email": data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    admin = AdminUser(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name
    )
    doc = admin.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.admins.insert_one(doc)
    
    token = create_token(admin.id, admin.email)
    return TokenResponse(access_token=token, name=admin.name)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: AdminLogin):
    user = await db.admins.find_one({"email": data.email}, {"_id": 0})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    token = create_token(user["id"], user["email"])
    return TokenResponse(access_token=token, name=user["name"])

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"id": current_user["id"], "email": current_user["email"], "name": current_user["name"]}

# ==================== Category Routes ====================

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    for cat in categories:
        if isinstance(cat.get('created_at'), str):
            cat['created_at'] = datetime.fromisoformat(cat['created_at'])
    return categories

@api_router.post("/categories", response_model=Category)
async def create_category(data: CategoryCreate, current_user: dict = Depends(get_current_user)):
    category = Category(**data.model_dump())
    doc = category.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.categories.insert_one(doc)
    return category

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return {"message": "Categoria removida"}

# ==================== Cake Routes ====================

@api_router.get("/cakes", response_model=List[Cake])
async def get_cakes(category_id: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category_id:
        query["category_id"] = category_id
    if featured is not None:
        query["featured"] = featured
    
    cakes = await db.cakes.find(query, {"_id": 0}).to_list(500)
    for cake in cakes:
        if isinstance(cake.get('created_at'), str):
            cake['created_at'] = datetime.fromisoformat(cake['created_at'])
    return cakes

@api_router.get("/cakes/{cake_id}", response_model=Cake)
async def get_cake(cake_id: str):
    cake = await db.cakes.find_one({"id": cake_id}, {"_id": 0})
    if not cake:
        raise HTTPException(status_code=404, detail="Bolo não encontrado")
    if isinstance(cake.get('created_at'), str):
        cake['created_at'] = datetime.fromisoformat(cake['created_at'])
    return cake

@api_router.post("/cakes", response_model=Cake)
async def create_cake(data: CakeCreate, current_user: dict = Depends(get_current_user)):
    cake = Cake(**data.model_dump())
    doc = cake.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.cakes.insert_one(doc)
    return cake

@api_router.put("/cakes/{cake_id}", response_model=Cake)
async def update_cake(cake_id: str, data: CakeUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
    
    result = await db.cakes.update_one({"id": cake_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Bolo não encontrado")
    
    cake = await db.cakes.find_one({"id": cake_id}, {"_id": 0})
    if isinstance(cake.get('created_at'), str):
        cake['created_at'] = datetime.fromisoformat(cake['created_at'])
    return cake

@api_router.delete("/cakes/{cake_id}")
async def delete_cake(cake_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.cakes.delete_one({"id": cake_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bolo não encontrado")
    return {"message": "Bolo removido"}

# ==================== Image Upload Route ====================

@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    contents = await file.read()
    base64_image = base64.b64encode(contents).decode('utf-8')
    content_type = file.content_type or 'image/jpeg'
    data_url = f"data:{content_type};base64,{base64_image}"
    return {"url": data_url}

# ==================== Testimonial Routes ====================

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    for t in testimonials:
        if isinstance(t.get('created_at'), str):
            t['created_at'] = datetime.fromisoformat(t['created_at'])
    return testimonials

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(data: TestimonialCreate, current_user: dict = Depends(get_current_user)):
    testimonial = Testimonial(**data.model_dump())
    doc = testimonial.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.testimonials.insert_one(doc)
    return testimonial

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Depoimento não encontrado")
    return {"message": "Depoimento removido"}

# ==================== Site Settings Routes ====================

@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        # Return defaults
        return {
            "id": "site_settings",
            "hero_image_url": "",
            "logo_url": "",
            "instagram_access_token": None,
            "instagram_user_id": None
        }
    # Don't expose the access token publicly
    settings.pop("instagram_access_token", None)
    return settings

@api_router.get("/settings/admin")
async def get_settings_admin(current_user: dict = Depends(get_current_user)):
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        return {
            "id": "site_settings",
            "hero_image_url": "",
            "logo_url": "",
            "instagram_access_token": "",
            "instagram_user_id": ""
        }
    return settings

@api_router.put("/settings")
async def update_settings(data: SiteSettingsUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.settings.update_one(
        {"id": "site_settings"},
        {"$set": update_data},
        upsert=True
    )
    
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    return settings

# ==================== Instagram Sync Route ====================

@api_router.post("/instagram/sync")
async def sync_instagram(current_user: dict = Depends(get_current_user)):
    """
    Sync photos from Instagram using Graph API.
    Requires instagram_access_token and instagram_user_id in settings.
    """
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    
    if not settings or not settings.get("instagram_access_token") or not settings.get("instagram_user_id"):
        raise HTTPException(
            status_code=400, 
            detail="Instagram não configurado. Configure o Access Token e User ID nas configurações."
        )
    
    import requests
    
    access_token = settings["instagram_access_token"]
    user_id = settings["instagram_user_id"]
    
    try:
        # Fetch media from Instagram Graph API
        url = f"https://graph.instagram.com/{user_id}/media"
        params = {
            "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
            "access_token": access_token,
            "limit": 20
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail=f"Erro ao acessar Instagram API: {response.json().get('error', {}).get('message', 'Token inválido ou expirado')}"
            )
        
        data = response.json()
        media_items = data.get("data", [])
        
        # Get default category
        default_category = await db.categories.find_one({}, {"_id": 0})
        category_id = default_category["id"] if default_category else "cat-especial"
        
        imported_count = 0
        
        for item in media_items:
            if item["media_type"] not in ["IMAGE", "CAROUSEL_ALBUM"]:
                continue
            
            # Check if already imported
            existing = await db.cakes.find_one({"instagram_url": item["permalink"]}, {"_id": 0})
            if existing:
                continue
            
            # Get image URL
            image_url = item.get("media_url") or item.get("thumbnail_url")
            if not image_url:
                continue
            
            # Create cake entry
            cake = {
                "id": str(uuid.uuid4()),
                "name": (item.get("caption") or "Criação Paula Veiga")[:50],
                "description": item.get("caption") or "Mais uma delícia da Paula Veiga!",
                "price": 0,
                "category_id": category_id,
                "image_url": image_url,
                "instagram_url": item["permalink"],
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            await db.cakes.insert_one(cake)
            imported_count += 1
        
        return {"message": f"{imported_count} fotos importadas do Instagram com sucesso!"}
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Erro de conexão: {str(e)}")

# ==================== Stats Route ====================

@api_router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    cakes_count = await db.cakes.count_documents({})
    categories_count = await db.categories.count_documents({})
    testimonials_count = await db.testimonials.count_documents({})
    return {
        "cakes": cakes_count,
        "categories": categories_count,
        "testimonials": testimonials_count
    }

# ==================== Seed Data Route ====================

@api_router.post("/seed")
async def seed_data():
    # Check if already seeded
    existing_categories = await db.categories.count_documents({})
    existing_cakes = await db.cakes.count_documents({})
    existing_testimonials = await db.testimonials.count_documents({})
    if existing_categories > 0 or existing_cakes > 0 or existing_testimonials > 0:
        return {"message": "Dados já existentes"}
    
    # Create categories
    categories_data = [
        {"id": "cat-aniversario", "name": "Aniversário", "slug": "aniversario", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": "cat-casamento", "name": "Casamento", "slug": "casamento", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": "cat-especial", "name": "Ocasiões Especiais", "slug": "especial", "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    await db.categories.insert_many(categories_data)
    
    # Create sample cakes
    cakes_data = [
        {
            "id": str(uuid.uuid4()),
            "name": "Bolo Red Velvet",
            "description": "Delicioso bolo red velvet com cobertura de cream cheese",
            "price": 180.00,
            "category_id": "cat-aniversario",
            "image_url": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600",
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Bolo de Chocolate Belga",
            "description": "Bolo de chocolate belga com ganache e morangos",
            "price": 220.00,
            "category_id": "cat-aniversario",
            "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Bolo Clássico de Casamento",
            "description": "Elegante bolo de 3 andares com decoração em flores",
            "price": 650.00,
            "category_id": "cat-casamento",
            "image_url": "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600",
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Bolo Naked Cake",
            "description": "Bolo rústico com frutas frescas e flores comestíveis",
            "price": 280.00,
            "category_id": "cat-casamento",
            "image_url": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600",
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Bolo de Morango",
            "description": "Bolo leve com chantilly e morangos frescos",
            "price": 150.00,
            "category_id": "cat-especial",
            "image_url": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600",
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Bolo Confeitado Personalizado",
            "description": "Bolo decorado com tema à escolha do cliente",
            "price": 350.00,
            "category_id": "cat-especial",
            "image_url": "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600",
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.cakes.insert_many(cakes_data)
    
    # Create testimonials
    testimonials_data = [
        {
            "id": str(uuid.uuid4()),
            "author_name": "Maria Silva",
            "content": "O bolo do casamento da minha filha ficou simplesmente perfeito! Todos os convidados elogiaram muito. Obrigada Paula!",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "author_name": "João Santos",
            "content": "Encomendei um bolo de aniversário para minha esposa e ela amou! Além de lindo, estava delicioso.",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "author_name": "Ana Paula Costa",
            "content": "Profissionalismo e carinho em cada detalhe. Já é a terceira vez que encomendo e sempre supera minhas expectativas!",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.testimonials.insert_many(testimonials_data)
    
    return {"message": "Dados iniciais criados com sucesso"}

# ==================== Base Route ====================

@api_router.get("/")
async def root():
    return {"message": "Paula Veiga Doces API"}

# Include the router in the main app
app.include_router(api_router)

# Configure CORS to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_credential_requests=True,
    allow_origins=["https://doceiria-mockup-site.vercel.app", "http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
@app.on_event("startup")
async def startup_event():
    """Initialize default admin user if not exists"""
    try:
        existing_admin = await db.admins.find_one({"email": "admin@paulaveiga.com"})
        if not existing_admin:
            # Hash password properly
            password_hash = bcrypt.hashpw("senha123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            default_admin = {
                "id": str(uuid.uuid4()),
                "email": "admin@paulaveiga.com",
                "password_hash": password_hash,
                "name": "Paula Veiga",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.admins.insert_one(default_admin)
            logger.info("Default admin user created successfully")
        else:
            logger.info("Admin user already exists")
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
