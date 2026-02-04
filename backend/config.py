"""
Configuration file for Paula Veiga Doces API
Handles environment-based settings
"""
import os
from typing import List

class Settings:
    # MongoDB
    MONGODB_URL: str = os.environ.get(
        'MONGODB_URL',
        'mongodb://localhost:27017/paula_veiga_doces'
    )
    
    # CORS
    CORS_ORIGINS: List[str] = os.environ.get(
        'CORS_ORIGINS',
        'http://localhost:3000,http://localhost:3004'
    ).split(',')
    
    # JWT
    JWT_ALGORITHM: str = 'HS256'
    JWT_EXPIRATION_HOURS: int = 24
    JWT_SECRET: str = os.environ.get(
        'JWT_SECRET',
        'sua-chave-secreta-muito-segura-em-producao'
    )
    
    # App
    APP_NAME: str = 'Paula Veiga Doces API'
    DEBUG: bool = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    # Server
    API_PREFIX: str = '/api'
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
