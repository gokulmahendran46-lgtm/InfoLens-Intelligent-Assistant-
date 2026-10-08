from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    app_name: str = "InfoLens"
    app_version: str = "1.0.0"
    debug: bool = True
    secret_key: str = "dev-secret-key-change-in-production"

    # Database
    database_url: str = "sqlite:///./infolens.db"

    # AI Provider
    ai_provider: str = "mock"  # mock | openai | anthropic
    ai_model: str = "gpt-4o"
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # File storage
    upload_dir: str = "./uploads"
    max_file_size_mb: int = 50

    # CORS
    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

# Ensure upload dir exists
os.makedirs(settings.upload_dir, exist_ok=True)
