from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.endpoints import router as v1_router
from .data.seed_projects import get_all_seed_projects

app = FastAPI(
    title="ForgeGrad AI - Deterministic Engine & Reality Check Core",
    description="Mathematical constraint evaluation, skill compatibility, multi-factor scoring, and Reality Check services.",
    version="1.0.0",
)

import os

# Configure permitted origins for local development and production Vercel domains
default_origins = [
    "https://forgegradai.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

env_origins = os.environ.get("ALLOWED_ORIGINS", "")
if env_origins:
    default_origins.extend([o.strip() for o in env_origins.split(",") if o.strip()])

# Enable CORS for local Vite dev server and production Vercel deployments (NO wildcard *)
app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api")


@app.get("/api/health", tags=["System"])
def health_check():
    """
    Health check endpoint returning system status and registry seed metrics.
    """
    return {
        "status": "healthy",
        "service": "ForgeGrad AI Deterministic Core",
        "milestone": "Milestone 1 Complete",
        "seed_projects_count": len(get_all_seed_projects()),
    }
