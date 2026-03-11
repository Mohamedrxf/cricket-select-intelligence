from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.scan import router as scan_router

app = FastAPI(title="OS3 Security Scanner")

# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Register API Routes
# -----------------------------
app.include_router(scan_router)