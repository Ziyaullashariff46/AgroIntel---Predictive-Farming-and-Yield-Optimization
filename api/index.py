import sys
import os

# Add root directory to sys.path so app, db, and all modules resolve cleanly on Vercel
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app import app
