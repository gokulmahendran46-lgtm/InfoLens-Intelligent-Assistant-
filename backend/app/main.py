"""
InfoLens – Intelligent Information Assistant
FastAPI Backend Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.config import settings
from app.routers import documents, chat, compare, search, insights

# ─────────────────────────────────────────────────────────────────────────────
# App initialization
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="InfoLens API",
    description="Intelligent Information Understanding & Processing Backend",
    version=settings.app_version,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ─────────────────────────────────────────────────────────────────────────────
# CORS
# ─────────────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Routers (all prefixed with /api via uvicorn route OR direct)
# ─────────────────────────────────────────────────────────────────────────────

app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(compare.router)
app.include_router(search.router)
app.include_router(insights.router)


# ─────────────────────────────────────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "ai_provider": settings.ai_provider,
    }


@app.get("/")
async def root():
    return {
        "message": "InfoLens API is running",
        "docs": "/api/docs",
        "version": settings.app_version,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Serve React frontend in production mode
# ─────────────────────────────────────────────────────────────────────────────

FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/") or full_path == "health":
            return {"error": "Not found"}
        index_path = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "Frontend not built yet. Run 'npm run build' in the frontend directory."}
