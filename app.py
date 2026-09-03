import os
import sys
import sqlite3
import json
import math
import requests
import pandas as pd
import numpy as np
from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import bcrypt
import secrets
import hmac
import time

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, template_folder='templates')

# ═══════════════════════════════════════════════════════════════
# SESSION SECRET — never fall back to a literal committed to the repo.
# The whole access-control guard below rests on session cookies being
# unforgeable; a published default key would let anyone mint an admin
# cookie. Fail loudly when deployed, use a throwaway key locally.
# ═══════════════════════════════════════════════════════════════
app.secret_key = os.getenv('FLASK_SECRET_KEY')
if not app.secret_key:
    if os.getenv('VERCEL') or os.getenv('FLASK_ENV') == 'production':
        raise RuntimeError(
            'FLASK_SECRET_KEY is not set. Set it as an environment variable '
            'before deploying — without it, session cookies can be forged.'
        )
    # Local dev: random per-process key. Sessions reset on restart, which is fine.
    app.secret_key = os.urandom(32)

# ═══════════════════════════════════════════════════════════════
# RATE LIMITER — Prevents brute-force login attacks
# 5 login attempts per 15 minutes per IP address (in-memory, demo-safe)
# ═══════════════════════════════════════════════════════════════
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[],          # No global limit — only applied where decorated
    storage_uri="memory://",    # In-memory store, suitable for single-process demo
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ═══════════════════════════════════════════════════════════════
# DATABASE — path is overridable so a deploy can point at a mounted
# persistent volume (e.g. DB_PATH=/var/data/agrointel.db on Render).
# The .db is no longer committed to the repo, so the schema is created
# on first boot; without this a fresh deploy or volume has no tables.
# ═══════════════════════════════════════════════════════════════
from init_db import ensure_db

DB_FILE = ensure_db()

# ═══════════════════════════════════════════════════════════════
# API KEYS — Loaded exclusively from .env file (no hardcoded keys)
# Create a .env file in project root with:
#   OPENWEATHER_API_KEY=your_key_here
#   DATA_GOV_API_KEY=your_key_here
# ═══════════════════════════════════════════════════════════════
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', '')
DATA_GOV_API_KEY = os.getenv('DATA_GOV_API_KEY', '')

# ═══════════════════════════════════════════════════════════════
# MANDI PRICE FALLBACK DATABASE (Last Known APMC Rates)
# ═══════════════════════════════════════════════════════════════
FALLBACK_MANDI_PRICES = {
    'Udupi': [
        {'commodity': 'Paddy (Dhan)', 'variety': 'Jyothi', 'market': 'Udupi APMC', 'district': 'Udupi', 'state': 'Karnataka', 'min_price': '2100', 'max_price': '2350', 'modal_price': '2250', 'arrival_date': '10/08/2026'},
        {'commodity': 'Coconut', 'variety': 'Local', 'market': 'Udupi APMC', 'district': 'Udupi', 'state': 'Karnataka', 'min_price': '28000', 'max_price': '32000', 'modal_price': '30000', 'arrival_date': '10/08/2026'},
        {'commodity': 'Arecanut (Betelnut)', 'variety': 'Red/Chali', 'market': 'Kundapura APMC', 'district': 'Udupi', 'state': 'Karnataka', 'min_price': '44000', 'max_price': '49500', 'modal_price': '47000', 'arrival_date': '10/08/2026'},
        {'commodity': 'Black Pepper', 'variety': 'Garbled', 'market': 'Karkala APMC', 'district': 'Udupi', 'state': 'Karnataka', 'min_price': '56000', 'max_price': '62000', 'modal_price': '59000', 'arrival_date': '10/08/2026'},
        {'commodity': 'Cashewnut', 'variety': 'Raw', 'market': 'Udupi APMC', 'district': 'Udupi', 'state': 'Karnataka', 'min_price': '11500', 'max_price': '13500', 'modal_price': '12600', 'arrival_date': '10/08/2026'},
        {'commodity': 'Banana', 'variety': 'Robusta', 'market': 'Udupi APMC', 'district': 'Udupi', 'state': 'Karnataka', 'min_price': '1800', 'max_price': '2400', 'modal_price': '2100', 'arrival_date': '10/08/2026'},
    ],
    'Bangalore': [
        {'commodity': 'Rice', 'variety': 'Sona Masuri', 'market': 'Yeshwanthpur APMC', 'district': 'Bangalore', 'state': 'Karnataka', 'min_price': '3800', 'max_price': '4400', 'modal_price': '4100', 'arrival_date': '11/08/2026'},
        {'commodity': 'Tomato', 'variety': 'PKM-1 (Hybrid)', 'market': 'Kolar/Bangalore APMC', 'district': 'Bangalore', 'state': 'Karnataka', 'min_price': '1400', 'max_price': '2200', 'modal_price': '1800', 'arrival_date': '11/08/2026'},
        {'commodity': 'Onion', 'variety': 'Bellary Red', 'market': 'Yeshwanthpur APMC', 'district': 'Bangalore', 'state': 'Karnataka', 'min_price': '2200', 'max_price': '2900', 'modal_price': '2550', 'arrival_date': '11/08/2026'},
        {'commodity': 'Potato', 'variety': 'Jyoti', 'market': 'Yeshwanthpur APMC', 'district': 'Bangalore', 'state': 'Karnataka', 'min_price': '1600', 'max_price': '2100', 'modal_price': '1850', 'arrival_date': '11/08/2026'},
        {'commodity': 'Maize', 'variety': 'Ganga Safed-2', 'market': 'Bangalore APMC', 'district': 'Bangalore', 'state': 'Karnataka', 'min_price': '2050', 'max_price': '2350', 'modal_price': '2200', 'arrival_date': '11/08/2026'},
        {'commodity': 'Ragi (Finger Millet)', 'variety': 'GPU-28', 'market': 'Bangalore APMC', 'district': 'Bangalore', 'state': 'Karnataka', 'min_price': '3200', 'max_price': '3700', 'modal_price': '3450', 'arrival_date': '11/08/2026'},
    ],
    'Mumbai': [
        {'commodity': 'Onion', 'variety': 'Nasik Red (Agrifound)', 'market': 'Vashi APMC (Mumbai)', 'district': 'Mumbai', 'state': 'Maharashtra', 'min_price': '2400', 'max_price': '3100', 'modal_price': '2750', 'arrival_date': '11/08/2026'},
        {'commodity': 'Potato', 'variety': 'Kufri Jyoti', 'market': 'Vashi APMC (Mumbai)', 'district': 'Mumbai', 'state': 'Maharashtra', 'min_price': '1700', 'max_price': '2200', 'modal_price': '1950', 'arrival_date': '11/08/2026'},
        {'commodity': 'Cotton', 'variety': 'Shankar-6 (H4)', 'market': 'Mumbai APMC', 'district': 'Mumbai', 'state': 'Maharashtra', 'min_price': '6800', 'max_price': '7400', 'modal_price': '7100', 'arrival_date': '11/08/2026'},
        {'commodity': 'Soyabean', 'variety': 'JS 335', 'market': 'Vashi APMC', 'district': 'Mumbai', 'state': 'Maharashtra', 'min_price': '4400', 'max_price': '4900', 'modal_price': '4650', 'arrival_date': '11/08/2026'},
        {'commodity': 'Tur (Pigeon Pea)', 'variety': 'ICPL 87119 (Asha)', 'market': 'Vashi APMC', 'district': 'Mumbai', 'state': 'Maharashtra', 'min_price': '9200', 'max_price': '10500', 'modal_price': '9800', 'arrival_date': '11/08/2026'},
    ],
    'Delhi': [
        {'commodity': 'Wheat', 'variety': 'HD 2967 (Dara)', 'market': 'Azadpur APMC', 'district': 'Delhi', 'state': 'Delhi', 'min_price': '2350', 'max_price': '2600', 'modal_price': '2480', 'arrival_date': '11/08/2026'},
        {'commodity': 'Rice (Basmati)', 'variety': 'Pusa Basmati 1121 (Raw)', 'market': 'Naya Bazar APMC', 'district': 'Delhi', 'state': 'Delhi', 'min_price': '8200', 'max_price': '9500', 'modal_price': '8800', 'arrival_date': '11/08/2026'},
        {'commodity': 'Tomato', 'variety': 'Pusa Ruby (Hybrid)', 'market': 'Azadpur APMC', 'district': 'Delhi', 'state': 'Delhi', 'min_price': '1600', 'max_price': '2400', 'modal_price': '2000', 'arrival_date': '11/08/2026'},
        {'commodity': 'Mustard', 'variety': 'Pusa Bold (RH-30)', 'market': 'Delhi APMC', 'district': 'Delhi', 'state': 'Delhi', 'min_price': '5200', 'max_price': '5800', 'modal_price': '5500', 'arrival_date': '11/08/2026'},
    ]
}

DEFAULT_FALLBACK_PRICES = [
    {'commodity': 'Rice / Paddy', 'variety': 'MTU 1010 (Swarna)', 'market': 'Regional APMC', 'district': 'Regional Mandi', 'state': 'India', 'min_price': '2200', 'max_price': '2550', 'modal_price': '2380', 'arrival_date': '10/08/2026'},
    {'commodity': 'Wheat', 'variety': 'GW-322 (Sharbati)', 'market': 'Regional APMC', 'district': 'Regional Mandi', 'state': 'India', 'min_price': '2300', 'max_price': '2650', 'modal_price': '2450', 'arrival_date': '10/08/2026'},
    {'commodity': 'Maize (Corn)', 'variety': 'Ganga Safed-2', 'market': 'Regional APMC', 'district': 'Regional Mandi', 'state': 'India', 'min_price': '1950', 'max_price': '2250', 'modal_price': '2100', 'arrival_date': '10/08/2026'},
    {'commodity': 'Cotton', 'variety': 'Shankar-6 (Long Staple)', 'market': 'Regional APMC', 'district': 'Regional Mandi', 'state': 'India', 'min_price': '6700', 'max_price': '7350', 'modal_price': '7050', 'arrival_date': '10/08/2026'},
    {'commodity': 'Sugarcane', 'variety': 'Co 86032', 'market': 'Regional Mill Gate', 'district': 'Regional Mandi', 'state': 'India', 'min_price': '315', 'max_price': '350', 'modal_price': '330', 'arrival_date': '10/08/2026'},
    {'commodity': 'Soyabean', 'variety': 'JS 335', 'market': 'Regional APMC', 'district': 'Regional Mandi', 'state': 'India', 'min_price': '4300', 'max_price': '4850', 'modal_price': '4600', 'arrival_date': '10/08/2026'},
    {'commodity': 'Tomato', 'variety': 'PKM-1 (Local Hybrid)', 'market': 'Regional APMC', 'district': 'Regional Mandi', 'state': 'India', 'min_price': '1500', 'max_price': '2300', 'modal_price': '1900', 'arrival_date': '10/08/2026'},
    {'commodity': 'Onion', 'variety': 'Nasik Red (Agrifound)', 'market': 'Regional APMC', 'district': 'Regional Mandi', 'state': 'India', 'min_price': '2100', 'max_price': '2800', 'modal_price': '2450', 'arrival_date': '10/08/2026'},
]


# ═══════════════════════════════════════════════════════════════
# CURATED INDIAN CITIES DATABASE (for nearby city lookup)
# ═══════════════════════════════════════════════════════════════
INDIAN_CITIES = [
    {'name': 'Mumbai', 'lat': 19.076, 'lon': 72.877, 'state': 'Maharashtra'},
    {'name': 'Delhi', 'lat': 28.704, 'lon': 77.102, 'state': 'Delhi'},
    {'name': 'Bangalore', 'lat': 12.972, 'lon': 77.594, 'state': 'Karnataka'},
    {'name': 'Hyderabad', 'lat': 17.385, 'lon': 78.486, 'state': 'Telangana'},
    {'name': 'Chennai', 'lat': 13.083, 'lon': 80.271, 'state': 'Tamil Nadu'},
    {'name': 'Kolkata', 'lat': 22.573, 'lon': 88.364, 'state': 'West Bengal'},
    {'name': 'Pune', 'lat': 18.520, 'lon': 73.857, 'state': 'Maharashtra'},
    {'name': 'Ahmedabad', 'lat': 23.023, 'lon': 72.571, 'state': 'Gujarat'},
    {'name': 'Jaipur', 'lat': 26.913, 'lon': 75.787, 'state': 'Rajasthan'},
    {'name': 'Lucknow', 'lat': 26.847, 'lon': 80.947, 'state': 'Uttar Pradesh'},
    {'name': 'Udupi', 'lat': 13.341, 'lon': 74.742, 'state': 'Karnataka'},
    {'name': 'Mangalore', 'lat': 12.914, 'lon': 74.856, 'state': 'Karnataka'},
    {'name': 'Mysore', 'lat': 12.296, 'lon': 76.639, 'state': 'Karnataka'},
    {'name': 'Hubli', 'lat': 15.349, 'lon': 75.134, 'state': 'Karnataka'},
    {'name': 'Belgaum', 'lat': 15.849, 'lon': 74.498, 'state': 'Karnataka'},
    {'name': 'Davangere', 'lat': 14.468, 'lon': 75.921, 'state': 'Karnataka'},
    {'name': 'Shimoga', 'lat': 13.931, 'lon': 75.568, 'state': 'Karnataka'},
    {'name': 'Bagalkot', 'lat': 16.186, 'lon': 75.696, 'state': 'Karnataka'},
    {'name': 'Gulbarga', 'lat': 17.329, 'lon': 76.834, 'state': 'Karnataka'},
    {'name': 'Mandya', 'lat': 12.522, 'lon': 76.897, 'state': 'Karnataka'},
    {'name': 'Hassan', 'lat': 13.007, 'lon': 76.096, 'state': 'Karnataka'},
    {'name': 'Coimbatore', 'lat': 11.017, 'lon': 76.956, 'state': 'Tamil Nadu'},
    {'name': 'Madurai', 'lat': 9.925, 'lon': 78.120, 'state': 'Tamil Nadu'},
    {'name': 'Thiruvananthapuram', 'lat': 8.524, 'lon': 76.936, 'state': 'Kerala'},
    {'name': 'Kochi', 'lat': 9.932, 'lon': 76.267, 'state': 'Kerala'},
    {'name': 'Nagpur', 'lat': 21.146, 'lon': 79.088, 'state': 'Maharashtra'},
    {'name': 'Nashik', 'lat': 19.998, 'lon': 73.790, 'state': 'Maharashtra'},
    {'name': 'Surat', 'lat': 21.170, 'lon': 72.831, 'state': 'Gujarat'},
    {'name': 'Vadodara', 'lat': 22.307, 'lon': 73.181, 'state': 'Gujarat'},
    {'name': 'Rajkot', 'lat': 22.304, 'lon': 70.802, 'state': 'Gujarat'},
    {'name': 'Indore', 'lat': 22.720, 'lon': 75.858, 'state': 'Madhya Pradesh'},
    {'name': 'Bhopal', 'lat': 23.260, 'lon': 77.413, 'state': 'Madhya Pradesh'},
    {'name': 'Patna', 'lat': 25.612, 'lon': 85.144, 'state': 'Bihar'},
    {'name': 'Chandigarh', 'lat': 30.733, 'lon': 76.779, 'state': 'Chandigarh'},
    {'name': 'Ludhiana', 'lat': 30.901, 'lon': 75.857, 'state': 'Punjab'},
    {'name': 'Amritsar', 'lat': 31.634, 'lon': 74.873, 'state': 'Punjab'},
    {'name': 'Dehradun', 'lat': 30.317, 'lon': 78.032, 'state': 'Uttarakhand'},
    {'name': 'Varanasi', 'lat': 25.318, 'lon': 82.988, 'state': 'Uttar Pradesh'},
    {'name': 'Agra', 'lat': 27.177, 'lon': 78.014, 'state': 'Uttar Pradesh'},
    {'name': 'Kanpur', 'lat': 26.450, 'lon': 80.350, 'state': 'Uttar Pradesh'},
    {'name': 'Visakhapatnam', 'lat': 17.687, 'lon': 83.218, 'state': 'Andhra Pradesh'},
    {'name': 'Vijayawada', 'lat': 16.506, 'lon': 80.648, 'state': 'Andhra Pradesh'},
    {'name': 'Bhubaneswar', 'lat': 20.297, 'lon': 85.825, 'state': 'Odisha'},
    {'name': 'Ranchi', 'lat': 23.345, 'lon': 85.310, 'state': 'Jharkhand'},
    {'name': 'Guwahati', 'lat': 26.144, 'lon': 91.736, 'state': 'Assam'},
    {'name': 'Raipur', 'lat': 21.251, 'lon': 81.630, 'state': 'Chhattisgarh'},
    {'name': 'Jodhpur', 'lat': 26.292, 'lon': 73.025, 'state': 'Rajasthan'},
    {'name': 'Udaipur', 'lat': 24.585, 'lon': 73.712, 'state': 'Rajasthan'},
    {'name': 'Goa', 'lat': 15.300, 'lon': 74.000, 'state': 'Goa'},
    {'name': 'Thanjavur', 'lat': 10.787, 'lon': 79.138, 'state': 'Tamil Nadu'},
    {'name': 'Tirupati', 'lat': 13.629, 'lon': 79.420, 'state': 'Andhra Pradesh'},
    {'name': 'Bellary', 'lat': 15.139, 'lon': 76.919, 'state': 'Karnataka'},
    {'name': 'Raichur', 'lat': 16.212, 'lon': 77.356, 'state': 'Karnataka'},
    {'name': 'Dharwad', 'lat': 15.459, 'lon': 75.007, 'state': 'Karnataka'},
    {'name': 'Tumkur', 'lat': 13.340, 'lon': 77.101, 'state': 'Karnataka'},
    {'name': 'Chitradurga', 'lat': 14.230, 'lon': 76.398, 'state': 'Karnataka'},
]

def haversine_km(lat1, lon1, lat2, lon2):
    """Calculate great-circle distance in km between two lat/lon points."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def get_nearby_cities(lat, lon, count=6):
    """Return nearest Indian cities sorted by distance, excluding self if exact match."""
    scored = []
    for c in INDIAN_CITIES:
        d = haversine_km(lat, lon, c['lat'], c['lon'])
        if d > 2:  # skip if essentially same location
            scored.append({**c, 'distance_km': round(d, 1)})
    scored.sort(key=lambda x: x['distance_km'])
    return scored[:count]

WEATHER_ICON_MAP = {
    '01d': 'fa-sun', '01n': 'fa-moon',
    '02d': 'fa-cloud-sun', '02n': 'fa-cloud-moon',
    '03d': 'fa-cloud', '03n': 'fa-cloud',
    '04d': 'fa-cloud', '04n': 'fa-cloud',
    '09d': 'fa-cloud-showers-heavy', '09n': 'fa-cloud-showers-heavy',
    '10d': 'fa-cloud-sun-rain', '10n': 'fa-cloud-moon-rain',
    '11d': 'fa-bolt', '11n': 'fa-bolt',
    '13d': 'fa-snowflake', '13n': 'fa-snowflake',
    '50d': 'fa-smog', '50n': 'fa-smog',
}

# WMO weather codes (used by Open-Meteo) -> Font Awesome icons
WMO_ICON_MAP = {
    0: 'fa-sun', 1: 'fa-sun', 2: 'fa-cloud-sun', 3: 'fa-cloud',
    45: 'fa-smog', 48: 'fa-smog',
    51: 'fa-cloud-rain', 53: 'fa-cloud-rain', 55: 'fa-cloud-showers-heavy',
    56: 'fa-cloud-rain', 57: 'fa-cloud-showers-heavy',
    61: 'fa-cloud-rain', 63: 'fa-cloud-showers-heavy', 65: 'fa-cloud-showers-heavy',
    66: 'fa-cloud-showers-heavy', 67: 'fa-cloud-showers-heavy',
    71: 'fa-snowflake', 73: 'fa-snowflake', 75: 'fa-snowflake',
    77: 'fa-snowflake',
    80: 'fa-cloud-sun-rain', 81: 'fa-cloud-showers-heavy', 82: 'fa-cloud-showers-heavy',
    85: 'fa-snowflake', 86: 'fa-snowflake',
    95: 'fa-bolt', 96: 'fa-bolt', 99: 'fa-bolt',
}

WMO_DESC_MAP = {
    0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime Fog',
    51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
    56: 'Freezing Drizzle', 57: 'Heavy Freezing Drizzle',
    61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
    66: 'Freezing Rain', 67: 'Heavy Freezing Rain',
    71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
    85: 'Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Severe Thunderstorm',
}

def map_weather_icon(icon_code):
    return WEATHER_ICON_MAP.get(icon_code, 'fa-cloud')

def wmo_to_icon(code):
    return WMO_ICON_MAP.get(code, 'fa-cloud')

def wmo_to_desc(code):
    return WMO_DESC_MAP.get(code, 'Clear')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


# ═══════════════════════════════════════════════════════════════

# BCRYPT HELPERS
def hash_password(plain):
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def check_password(plain, hashed):
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

# CSRF PROTECTION

@app.before_request
def csrf_protect():
    if request.method in ("POST", "PUT", "DELETE"):
        token = session.get("csrf_token")
        form_token = request.form.get("csrf_token", "")
        if not token or not hmac.compare_digest(token, form_token):
            flash("Session expired or invalid request. Please try again.", "error")
            return redirect(request.referrer or url_for("index"))

def generate_csrf_token():
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(32)
    return session["csrf_token"]

app.jinja_env.globals["csrf_token"] = generate_csrf_token

# NOMINATIM RATE LIMITER
_last_nominatim_call = 0.0
def _nominatim_throttle():
    global _last_nominatim_call
    elapsed = time.time() - _last_nominatim_call
    if elapsed < 1.1:
        time.sleep(1.1 - elapsed)
    _last_nominatim_call = time.time()

# ML MODEL CACHE
_CROP_MODEL_CACHE = None
_FERTILIZER_MODEL_CACHE = None
_YIELD_MODEL_CACHE = None

def _init_crop_model():
    global _CROP_MODEL_CACHE
    if _CROP_MODEL_CACHE is not None:
        return _CROP_MODEL_CACHE
    try:
        from sklearn.model_selection import train_test_split
        from sklearn.ensemble import RandomForestClassifier
        ds = os.path.join(BASE_DIR, "farmer", "ML", "crop_recommendation", "Crop_recommendation.csv")
        dataset = pd.read_csv(ds)
        fc = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        X = dataset[fc].to_numpy(dtype=float)
        y = dataset["label"].to_numpy()
        Xtr, _, ytr, _ = train_test_split(X, y, test_size=0.2, random_state=0)
        clf = RandomForestClassifier(n_estimators=100, criterion="entropy", random_state=0)
        clf.fit(Xtr, ytr)
        _CROP_MODEL_CACHE = clf
        return clf
    except Exception:
        return None

def _init_fertilizer_model():
    global _FERTILIZER_MODEL_CACHE
    if _FERTILIZER_MODEL_CACHE is not None:
        return _FERTILIZER_MODEL_CACHE
    try:
        from sklearn.preprocessing import LabelEncoder
        from sklearn.tree import DecisionTreeClassifier
        ds = os.path.join(BASE_DIR, "farmer", "ML", "fertilizer_recommendation", "fertilizer_recommendation.csv")
        data = pd.read_csv(ds)
        data["Soil Type"] = data["Soil Type"].str.strip()
        data["Crop Type"] = data["Crop Type"].str.strip()
        le_s = LabelEncoder()
        data["Soil Type"] = le_s.fit_transform(data["Soil Type"])
        le_c = LabelEncoder()
        data["Crop Type"] = le_c.fit_transform(data["Crop Type"])
        X = data[["Temparature","Humidity","Soil Moisture","Soil Type","Crop Type","Nitrogen","Potassium","Phosphorous"]].to_numpy(dtype=float)
        y = data["Fertilizer Name"].to_numpy()
        dtc = DecisionTreeClassifier(random_state=0)
        dtc.fit(X, y)
        _FERTILIZER_MODEL_CACHE = (dtc, le_s, le_c)
        return _FERTILIZER_MODEL_CACHE
    except Exception:
        return None

def _init_yield_model():
    global _YIELD_MODEL_CACHE
    if _YIELD_MODEL_CACHE is not None:
        return _YIELD_MODEL_CACHE
    try:
        from sklearn.model_selection import train_test_split
        from sklearn.preprocessing import OneHotEncoder
        from sklearn.ensemble import RandomForestRegressor
        ds = os.path.join(BASE_DIR, "farmer", "ML", "yield_prediction", "crop_production_karnataka.csv")
        df = pd.read_csv(ds).drop(["Crop_Year"], axis=1)
        df = df.dropna(subset=["Production"])
        X = df.drop(["Production"], axis=1)
        y = df["Production"].to_numpy(dtype=float)
        cc = ["State_Name","District_Name","Season","Crop"]
        Xtr, _, ytr, _ = train_test_split(X, y, test_size=0.2, random_state=42)
        ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=True)
        ohe.fit(Xtr[cc])
        Xc = ohe.transform(Xtr[cc]).toarray()
        Xn = Xtr.drop(cc, axis=1).to_numpy(dtype=float)
        Xf = np.hstack((Xc, Xn))
        m = RandomForestRegressor(n_estimators=50, random_state=42)
        m.fit(Xf, ytr)
        _YIELD_MODEL_CACHE = (m, ohe, cc)
        return _YIELD_MODEL_CACHE
    except Exception:
        return None


# ACCESS CONTROL — Single before_request guard for all portal routes
# Protects every /farmer/* and /admin/* URL without per-route checks
# ═══════════════════════════════════════════════════════════════
@app.before_request
def require_login():
    """
    Centralised auth guard. Any request to /farmer/* must have an active
    farmer session; /admin/* an admin session; /api/* either one (these
    endpoints spend metered OpenWeather / data.gov.in quota).
    This runs BEFORE every route handler, so no individual check is needed.
    """
    path = request.path
    if path.startswith('/api/'):
        # JSON endpoints back the farmer pages only — return 401, not a redirect,
        # so fetch() callers get a parseable error instead of a login page.
        if session.get('user_type') not in ('farmer', 'admin'):
            return jsonify({'error': 'Authentication required'}), 401
    elif path.startswith('/farmer/'):
        if session.get('user_type') != 'farmer':
            flash('Please log in to access the Farmer Portal.', 'warning')
            return redirect(url_for('login', role='farmer'))
    elif path.startswith('/admin/'):
        if session.get('user_type') != 'admin':
            flash('Admin login required.', 'warning')
            return redirect(url_for('login', role='admin'))


# Static file serving for assets
@app.route('/assets/<path:path>')
def static_assets(path):
    return send_from_directory(os.path.join(BASE_DIR, 'assets'), path)

# Main Home Page
@app.route('/')
def index():
    return render_template('index.html')

# Contact Us Route
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = (request.form.get('name') or '').strip()
        mobile = (request.form.get('mobile') or '').strip()
        email = (request.form.get('email') or '').strip()
        address = (request.form.get('address') or '').strip()
        message = (request.form.get('message') or '').strip()

        if not name or len(name) > 100:
            flash('Please enter a valid name.', 'error')
            return redirect(url_for('contact'))
        if not email or '@' not in email:
            flash('Please enter a valid email.', 'error')
            return redirect(url_for('contact'))
        if not message or len(message) > 2000:
            flash('Please enter a message.', 'error')
            return redirect(url_for('contact'))

        conn = get_db()
        try:
            conn.execute(
            'INSERT INTO contactus (c_name, c_mobile, c_email, c_address, c_message) VALUES (?, ?, ?, ?, ?)',
            (name, mobile, email, address, message)
        )
            conn.commit()
        finally:
            conn.close()

        flash('Your message has been submitted successfully!', 'success')
        return redirect(url_for('contact'))
    return render_template('contact.html')


# ═══════════════════════════════════════════════════════════════
# Auth Routes: Login
# Rate-limited: 5 POST attempts per 15 minutes per IP address
# ═══════════════════════════════════════════════════════════════
@app.route('/login/<role>', methods=['GET', 'POST'])
@limiter.limit("5 per 15 minutes", methods=["POST"])
def login(role):
    if role == 'customer':
        flash('The buyer marketplace has been retired. Redirecting to Farmer Portal.', 'info')
        return redirect(url_for('login', role='farmer'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        conn = get_db()
        if role == 'farmer':
            user = conn.execute('SELECT * FROM farmerlogin WHERE email = ?', (email,)).fetchone()
            conn.close()
            if user and check_password(password, user['password']):
                session['user_type'] = 'farmer'
                session['farmer_id'] = user['farmer_id']
                session['farmer_name'] = user['farmer_name']
                session['farmer_email'] = user['email']
                flash(f"Welcome back, {user['farmer_name']}!", 'success')
                return redirect(url_for('farmer_crop_recommendation'))
        elif role == 'admin':
            user = conn.execute('SELECT * FROM admin WHERE admin_name = ?', (email,)).fetchone()
            conn.close()
            if user and check_password(password, user['admin_password']):
                session['user_type'] = 'admin'
                session['admin_id'] = user['admin_id']
                session['admin_name'] = user['admin_name']
                flash('Welcome Admin!', 'success')
                return redirect(url_for('admin_farmers'))
        else:
            conn.close()

        flash('Invalid credentials. Please try again.', 'error')
    return render_template('login.html', role=role)


# ═══════════════════════════════════════════════════════════════
# Auth Routes: Register
# Validates confirm-password server-side; DOB/Gender stored as
# defaults only — not required from the user (data minimisation)
# ═══════════════════════════════════════════════════════════════
@app.route('/register/<role>', methods=['GET', 'POST'])
@limiter.limit("10 per hour", methods=["POST"])
def register(role):
    if role == 'customer':
        return redirect(url_for('register', role='farmer'))

    if request.method == 'POST':
        name     = request.form.get('name', '').strip()
        email    = request.form.get('email', '').strip()
        phone    = request.form.get('phone', '').strip()
        password = request.form.get('password', '')
        confirm  = request.form.get('confirm_password', '')
        state    = request.form.get('state', '').strip()
        district = request.form.get('district', '').strip()

        # ── Server-side confirm-password check ──
        if password != confirm:
            flash('Passwords do not match. Please re-enter them.', 'error')
            return render_template('register.html', role=role)

        # ── Server-side phone validation ──
        if not re.match(r"^\d{10}$", phone):
            flash("Please enter a valid 10-digit phone number.", "error")
            return render_template("register.html", role=role)

        # ── Minimum password length ──
        if len(password) < 8:
            flash('Password must be at least 8 characters long.', 'error')
            return render_template('register.html', role=role)

        conn = get_db()
        if role == 'farmer':
            # Check duplicate email
            existing = conn.execute('SELECT 1 FROM farmerlogin WHERE email = ?', (email,)).fetchone()
            if existing:
                conn.close()
                flash('An account with this email already exists. Please log in.', 'error')
                return render_template('register.html', role=role)
            # DOB and Gender are stored as neutral defaults — not required from the user
            hashed_pw = hash_password(password)
            conn.execute(
                'INSERT INTO farmerlogin (farmer_name, password, email, phone_no, F_gender, F_birthday, F_State, F_District, F_Location, otp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
                (name, hashed_pw, email, phone, 'Not specified', '2000-01-01', state, district, district)
            )
        try:
            conn.commit()
        finally:
            conn.close()

        flash('Account created successfully! You can now log in.', 'success')
        return redirect(url_for('login', role=role))

    return render_template('register.html', role=role)


# Logout Route
@app.route('/logout')
def logout():
    session.clear()
    flash('You have logged out.', 'info')
    return redirect(url_for('index'))

# ML Feature 1: Crop Recommendation
@app.route('/farmer/crop_recommendation', methods=['GET', 'POST'])
def farmer_crop_recommendation():
    result = None
    if request.method == 'POST':
        try:
            n = float(request.form.get('n', 0))
            p = float(request.form.get('p', 0))
            k = float(request.form.get('k', 0))
            t = float(request.form.get('t', 25))
            h = float(request.form.get('h', 50))
            ph = float(request.form.get('ph', 6.5))
            r = float(request.form.get('r', 100))

            classifier = _init_crop_model()
            if classifier is None:
                result = None
            else:
                user_input = np.array([[n, p, k, t, h, ph, r]], dtype=float)
                predictions = classifier.predict(user_input)
                result = str(predictions[0])
        except Exception as e:
            result = f"Could not compute recommendation. Please check your input values and try again."

    return render_template('crop_recommendation.html', result=result)

# ML Feature 2: Fertilizer Recommendation
@app.route('/farmer/fertilizer_recommendation', methods=['GET', 'POST'])
def farmer_fertilizer_recommendation():
    result = None
    if request.method == 'POST':
        try:
            n = float(request.form.get('n', 0))
            p = float(request.form.get('p', 0))
            k = float(request.form.get('k', 0))
            t = float(request.form.get('t', 25))
            h = float(request.form.get('h', 50))
            sm = float(request.form.get('sm', 30))
            soil = str(request.form.get('soil', '')).strip()
            crop = str(request.form.get('crop', '')).strip()

            dataset_path = os.path.join(BASE_DIR, 'farmer', 'ML', 'fertilizer_recommendation', 'fertilizer_recommendation.csv')
            fert_cache = _init_fertilizer_model()
            if fert_cache is None:
                result = None
            else:
                dtc, le_soil, le_crop = fert_cache
                try:
                    soil_enc = int(le_soil.transform([soil])[0])
                except ValueError:
                    soil_enc = 0
                try:
                    crop_enc = int(le_crop.transform([crop])[0])
                except ValueError:
                    crop_enc = 0
                user_input = np.array([[t, h, sm, soil_enc, crop_enc, n, k, p]], dtype=float)
                fertilizer_name = dtc.predict(user_input)
                result = str(fertilizer_name[0])
        except Exception as e:
            result = f"Could not compute fertilizer recommendation. Please verify your inputs and try again."

    return render_template('fertilizer_recommendation.html', result=result)

# Estimated mandi prices per quintal (₹) — base prices with seasonal variation
_CROP_PRICES = {
    'Rice': 2200, 'Paddy': 2100, 'Wheat': 2400, 'Maize': 2000, 'Cotton': 7000,
    'Bajra': 1800, 'Jowar': 1900, 'Groundnut': 5500, 'Soyabean': 4200, 'Gram': 5000,
    'Arhar/Tur': 6500, 'Moong(Green Gram)': 7500, 'Urad': 6800, 'Sesamum': 14000,
    'Rapeseed &Mustard': 5200, 'Sunflower': 6000, 'Castor seed': 5800, 'Niger seed': 8000,
    'Potato': 1200, 'Onion': 2000, 'Tomato': 1800, 'Dry chillies': 12000,
    'Sugarcane': 350, 'Coconut': 2800, 'Banana': 1500, 'Turmeric': 10000,
    'Arecanut': 35000, 'Cardamom': 25000, 'Black pepper': 65000,
    'Ragi': 3500, 'Horse-gram': 8000, 'Cowpea(Lobia)': 6000,
    'Barley': 2200, 'Peas': 4500, 'Peas & beans (Pulses)': 4500,
    'Mango': 2000, 'Grapes': 3000, 'Papaya': 1200, 'Watermelon': 800,
    'Muskmelon': 1000, 'Small millets': 4000, 'Linseed': 6500,
    'Dry ginger': 18000, 'Garlic': 8000, 'Coriander': 12000,
    'Soyabean': 4200, 'Tobacco': 15000, 'Safflower': 5500,
    'Tapioca': 1800, 'Sweet potato': 1500, 'Brinjal': 1200,
    'Beans & Mutter(Vegetable)': 3500, 'Other Kharif pulses': 5500,
    'Other Rabi pulses': 5500, 'Other Fresh Fruits': 2500,
}

def _estimate_crop_prices(crop_names):
    """Generate estimated price trends for predicted crops."""
    import random, datetime
    random.seed(42)  # Deterministic for same inputs
    today = datetime.date.today()
    rows = []
    for name in crop_names[:6]:
        base = _CROP_PRICES.get(name, 3000)
        # Generate 3-month backward prices with slight variation
        prices = []
        p = base * 0.88
        for _ in range(3):
            p = p * random.uniform(1.02, 1.08)
            prices.append(round(p))
        current = round(base * random.uniform(0.97, 1.05))
        demand_pct = round((current - prices[0]) / prices[0] * 100, 1)
        if demand_pct > 15:
            badge_class = 'badge-success'
            demand_label = f'High Demand'
        elif demand_pct > 5:
            badge_class = 'badge-info'
            demand_label = f'Stable High'
        else:
            badge_class = 'badge-warning'
            demand_label = f'Medium'
        months = []
        for i in range(3):
            d = today - datetime.timedelta(days=30 * (3 - i))
            months.append(d.strftime('%b %Y'))
        current_month = today.strftime('%b %Y')
        rows.append({
            'name': name,
            'm3': f'₹{prices[0]:,}',
            'm2': f'₹{prices[1]:,}',
            'm1': f'₹{prices[2]:,}',
            'current': f'₹{current:,}',
            'demand_badge': badge_class,
            'demand_label': f'{demand_label} (↑ {abs(demand_pct)}%)',
            'months': months,
            'current_month': current_month,
        })
    return rows

@app.route('/farmer/crop_prediction', methods=['GET', 'POST'])
def farmer_crop_prediction():
    result = None
    if request.method == 'POST':
        try:
            state = str(request.form.get('state', '')).strip()
            district = str(request.form.get('district', '')).strip()
            season = str(request.form.get('season', 'Kharif')).strip()

            # Try running the Decision Tree model script
            import subprocess
            cmd = [sys.executable, os.path.join(BASE_DIR, 'farmer', 'ML', 'crop_prediction', 'ZDecision_Tree_Model_Call.py'), state, district, season]
            output = subprocess.check_output(cmd, cwd=BASE_DIR, text=True, timeout=15)

            lines = [l.strip() for l in output.splitlines() if l.strip() and l.strip() != ',' and len(l.strip()) > 1]
            if lines:
                # Re-sort by frequency from training data (most traded = most profitable)
                freq = _find_district_crops(district, state)
                freq_order = {c: i for i, c in enumerate(freq)}
                lines.sort(key=lambda c: freq_order.get(c, 999))
                result = {crop: "High" for crop in lines[:5]}
            else:
                result = _get_season_crop_fallback(season)
        except Exception:
            # Graceful fallback: recommend crops based on season
            result = _get_season_crop_fallback(season)

    price_data = []
    if result and not isinstance(result, str):
        price_data = _estimate_crop_prices(list(result.keys()))
    return render_template('crop_prediction.html', result=result, price_data=price_data, state=state if result else '', district=district if result else '', season=season if result else '')


def _get_season_crop_fallback(season):
    """Return sensible crop recommendations based on season when the ML model fails."""
    season_crops = {
        'Kharif': {'Rice (Paddy)': 'High', 'Maize': 'High', 'Cotton': 'Medium', 'Bajra': 'High', 'Groundnut': 'Medium'},
        'Rabi': {'Wheat': 'High', 'Mustard': 'High', 'Gram (Chana)': 'Medium', 'Barley': 'Medium', 'Peas': 'High'},
        'Whole Year': {'Sugarcane': 'High', 'Coconut': 'High', 'Banana': 'Medium', 'Turmeric': 'High', 'Arecanut': 'Medium'},
        'Summer': {'Watermelon': 'High', 'Muskmelon': 'High', 'Cucumber': 'Medium', 'Groundnut': 'High', 'Sesame': 'Medium'},
    }
    return season_crops.get(season, season_crops['Kharif'])

# ML Feature 4: Yield Prediction
@app.route('/farmer/yield_prediction', methods=['GET', 'POST'])
def farmer_yield_prediction():
    result = None
    if request.method == 'POST':
        try:
            state = str(request.form.get('state', '')).strip()
            district = str(request.form.get('district', '')).strip()
            season = str(request.form.get('season', '')).strip()
            crop = str(request.form.get('crop', '')).strip()
            area = float(request.form.get('area', 1))
            # Convert acres to hectares (1 acre = 0.4047 hectares)
            area = round(area * 0.4047, 4)

            yield_cache = _init_yield_model()
            if yield_cache is None:
                try:
                    result = round(area * 2.85, 2)
                except Exception:
                    result = 2.85
            else:
                model, ohe, categorical_cols = yield_cache
                user_df = pd.DataFrame([[state, district, season, crop, area]], columns=['State_Name', 'District_Name', 'Season', 'Crop', 'Area'])
                user_cat = ohe.transform(user_df[categorical_cols]).toarray()
                user_num = user_df.drop(categorical_cols, axis=1).to_numpy(dtype=float)
                user_final = np.hstack((user_cat, user_num))
                prediction = model.predict(user_final)
                result = round(float(prediction[0]), 2)
        except Exception:
            try:
                result = round(area * 2.85, 2)
            except Exception:
                result = 2.85

    return render_template('yield_prediction.html', result=result)

# ML Feature 5: Rainfall Prediction
@app.route('/farmer/rainfall_prediction', methods=['GET', 'POST'])
def farmer_rainfall_prediction():
    result = None
    if request.method == 'POST':
        try:
            region = request.form.get('region')
            month = request.form.get('month')

            dataset_path = os.path.join(BASE_DIR, 'farmer', 'ML', 'rainfall_prediction', 'rainfall_in_india_1901-2015.csv')
            df = pd.read_csv(dataset_path)

            state_data = df[df['SUBDIVISION'] == region]
            avg_rainfall = state_data[month].mean()
            result = round(float(avg_rainfall), 2)
        except Exception:
            result = None

    return render_template('rainfall_prediction.html', result=result)

# Live Weather Forecast (page route — renders JS-driven page)
@app.route('/farmer/weather_forecast', methods=['GET', 'POST'])
def farmer_weather_forecast():
    weather = None
    city = 'Udupi'
    if request.method == 'POST':
        city = request.form.get('city', 'Udupi')

    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={OPENWEATHER_API_KEY}"
        res = requests.get(url, timeout=4).json()
        if res.get('cod') == 200:
            weather = {
                'city': res['name'],
                'temp': res['main']['temp'],
                'humidity': res['main']['humidity'],
                'wind': res['wind']['speed'],
                'desc': res['weather'][0]['description'].capitalize()
            }
        else:
            weather = {'city': city, 'temp': 28.5, 'humidity': 75, 'wind': 3.6, 'desc': 'Partly Cloudy'}
    except Exception:
        weather = {'city': city, 'temp': 28.5, 'humidity': 75, 'wind': 3.6, 'desc': 'Sunny / Clear Sky'}

    return render_template('weather_forecast.html', weather=weather, city=city)


# ═══════════════════════════════════════════════════════════════
# JSON API ENDPOINTS — Weather, Nearby Cities, Market Prices
# ═══════════════════════════════════════════════════════════════

def nominatim_reverse_geocode(lat_f, lon_f):
    """
    Use OpenStreetMap Nominatim to reverse-geocode coordinates to a precise
    district/town/village name. Returns a human-readable location string.
    No API key required. Falls back gracefully.
    """
    try:
        headers = {'User-Agent': 'AgroIntel-FarmerPortal/1.0 (agrointel@gmail.com)'}
        url = (
            f"https://nominatim.openstreetmap.org/reverse"
            f"?lat={lat_f}&lon={lon_f}&format=json&zoom=10&addressdetails=1"
        )
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code == 200:
            data = res.json()
            addr = data.get('address', {})
            # Priority order: village > town > suburb > city_district > city > county > state_district
            place = (
                addr.get('village') or
                addr.get('town') or
                addr.get('suburb') or
                addr.get('city_district') or
                addr.get('city') or
                addr.get('county') or
                addr.get('state_district') or
                addr.get('state') or
                data.get('display_name', '').split(',')[0].strip()
            )
            state = addr.get('state', '')
            return place, state
    except Exception:
        pass
    return None, None


@app.route('/api/reverse_geocode/<lat>/<lon>')
def api_reverse_geocode(lat, lon):
    """Return precise place name from GPS coordinates using Nominatim (free, no key needed)."""
    try:
        lat_f, lon_f = float(lat), float(lon)
        place, state = nominatim_reverse_geocode(lat_f, lon_f)
        if place:
            label = f"{place}, {state}" if state else place
            return jsonify({'place': place, 'state': state, 'label': label, 'success': True})
        return jsonify({'place': None, 'success': False, 'error': 'Could not resolve location'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/weather/coords/<lat>/<lon>')
def api_weather_coords(lat, lon):
    """Current weather + 7-day forecast via Open-Meteo (free, no API key).""" 
    try:
        lat_f, lon_f = float(lat), float(lon)

        # Use Nominatim for precise location label
        nom_place, nom_state = nominatim_reverse_geocode(lat_f, lon_f)
        if nom_place and nom_state:
            city_label = f"{nom_place}, {nom_state}"
        elif nom_place:
            city_label = nom_place
        else:
            nearest = get_nearby_cities(lat_f, lon_f, count=1)
            city_label = nearest[0]['name'] if nearest else 'Your Location'

        # Open-Meteo: current conditions + 7-day forecast (no key needed)
        meteo_url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat_f}&longitude={lon_f}"
            f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,"
            f"pressure_msl,weather_code,wind_speed_10m,is_day"
            f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum"
            f"&daily=sunrise,sunset"
            f"&timezone=auto&forecast_days=7"
        )
        meteo_res = requests.get(meteo_url, timeout=6)
        m = meteo_res.json() if meteo_res.status_code == 200 else {}

        if 'current' in m and 'daily' in m:
            cur = m['current']
            daily = m['daily']
            wmo = cur.get('weather_code', 3)

            # Sunrise/sunset from today's daily data
            sunrise_str = daily['sunrise'][0] if daily.get('sunrise') else None
            sunset_str = daily['sunset'][0] if daily.get('sunset') else None
            import datetime as _dt
            sunrise_ts = int(_dt.datetime.fromisoformat(sunrise_str).timestamp()) if sunrise_str else None
            sunset_ts = int(_dt.datetime.fromisoformat(sunset_str).timestamp()) if sunset_str else None

            current = {
                'city': city_label,
                'temp': round(cur['temperature_2m'], 1),
                'feels_like': round(cur.get('apparent_temperature', cur['temperature_2m']), 1),
                'humidity': int(cur.get('relative_humidity_2m', 75)),
                'pressure': int(cur.get('pressure_msl', 1013)),
                'wind': round(cur.get('wind_speed_10m', 0) / 3.6, 1),  # km/h -> m/s
                'visibility': 10.0,  # Open-Meteo doesn't provide visibility; use default
                'desc': wmo_to_desc(wmo),
                'icon': wmo_to_icon(wmo),
                'icon_code': str(wmo),
                'sunrise': sunrise_ts,
                'sunset': sunset_ts,
                'lat': lat_f,
                'lon': lon_f,
                'updated_at': cur.get('time', ''),
                'is_day': cur.get('is_day', 1),
            }

            # Build 7-day forecast from daily data
            forecast = []
            for i in range(min(7, len(daily.get('time', [])))):
                d_wmo = daily['weather_code'][i]
                forecast.append({
                    'date': daily['time'][i],
                    'high': round(daily['temperature_2m_max'][i], 1),
                    'low': round(daily['temperature_2m_min'][i], 1),
                    'desc': wmo_to_desc(d_wmo),
                    'icon': wmo_to_icon(d_wmo),
                    'rain_mm': round(daily.get('precipitation_sum', [0]*7)[i] or 0, 1),
                })

            return jsonify({'current': current, 'forecast': forecast, 'is_fallback': False})

    except Exception:
        pass

    # Fallback: try the curated Indian cities list for coordinates
    nearest = get_nearby_cities(float(lat), float(lon), count=1)
    city_label = nearest[0]['name'] if nearest else 'Local Region'
    return jsonify({
        'current': {
            'city': city_label, 'temp': 0, 'feels_like': 0, 'humidity': 0,
            'pressure': 1013, 'wind': 0, 'visibility': 10, 'desc': 'Unavailable',
            'icon': 'fa-cloud', 'icon_code': '03d', 'lat': float(lat), 'lon': float(lon),
            'updated_at': '', 'is_day': 1,
        },
        'forecast': [], 'is_fallback': True
    })

@app.route('/api/weather/city/<city_name>')
def api_weather_city(city_name):
    """Current weather + 7-day forecast by city name via Open-Meteo geocoding."""
    try:
        # Open-Meteo geocoding (free, no key)
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=en"
        geo_res = requests.get(geo_url, timeout=4)
        geo = geo_res.json() if geo_res.status_code == 200 else {}
        results = geo.get('results', [])
        if results:
            lat = results[0]['latitude']
            lon = results[0]['longitude']
            return api_weather_coords(str(lat), str(lon))
    except Exception:
        pass

    # Fallback: curated Indian cities list
    matched = next((c for c in INDIAN_CITIES if c['name'].lower() == city_name.lower()), None)
    if matched:
        return api_weather_coords(str(matched['lat']), str(matched['lon']))

    # Default to Udupi coords
    return api_weather_coords('13.341', '74.742')



@app.route('/api/nearby_cities/<lat>/<lon>')
def api_nearby_cities(lat, lon):
    """Return 6 nearest Indian cities to given coordinates."""
    try:
        lat_f, lon_f = float(lat), float(lon)
        cities = get_nearby_cities(lat_f, lon_f, count=6)
        return jsonify({'cities': cities})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Live Market Prices Page (Farmer Portal)
@app.route('/farmer/market_prices')
def farmer_market_prices():
    return render_template('market_prices.html')


@app.route('/api/market_prices')
def api_market_prices():
    """Fetch live mandi commodity prices from data.gov.in for a given city/district, with automatic fallback to last known rates."""
    from datetime import datetime
    city = request.args.get('city', 'Bangalore')
    today = datetime.now().strftime('%d/%m/%Y')

    try:
        # Try district-level filter first (government API can be slow)
        url = (
            f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
            f"?api-key={DATA_GOV_API_KEY}&format=json&limit=50"
            f"&filters[district]={city}"
        )
        res = requests.get(url, timeout=30)
        data = res.json() if res.status_code == 200 else {}
        records = data.get('records', [])

        # If no district match, try state-level
        if not records:
            url2 = (
                f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
                f"?api-key={DATA_GOV_API_KEY}&format=json&limit=50"
                f"&filters[state]={city}"
            )
            res2 = requests.get(url2, timeout=30)
            data2 = res2.json() if res2.status_code == 200 else {}
            records = data2.get('records', [])

        if records:
            prices = []
            for r in records:
                prices.append({
                    'commodity': r.get('commodity', 'N/A'),
                    'variety': r.get('variety', 'N/A'),
                    'market': r.get('market', 'N/A'),
                    'district': r.get('district', 'N/A'),
                    'state': r.get('state', 'N/A'),
                    'min_price': str(r.get('min_price', '0')),
                    'max_price': str(r.get('max_price', '0')),
                    'modal_price': str(r.get('modal_price', '0')),
                    'arrival_date': r.get('arrival_date', 'N/A'),
                })
            return jsonify({
                'city': city,
                'count': len(prices),
                'prices': prices,
                'is_fallback': False,
                'source': 'data.gov.in (Agmarknet Live)',
            })

    except Exception:
        pass

    # Serve Dynamic Mandi Rates as Fallback — district-level from ML training data
    import random
    import csv as _csv

    # District crop map loaded at startup from preprocessed2.csv

    # Mandi price ranges (₹/quintal) for common crops
    _MANDI_PRICES = {
        'Rice': (2200, 3200), 'Paddy': (2000, 2400), 'Wheat': (2100, 2500),
        'Maize': (1700, 2200), 'Cotton(lint)': (5500, 7000), 'Ragi': (3000, 4000),
        'Jowar': (1800, 2400), 'Bajra': (1600, 2100), 'Groundnut': (5000, 6800),
        'Soyabean': (3600, 4600), 'Arhar/Tur': (6000, 7800), 'Moong(Green Gram)': (7000, 8500),
        'Urad': (6500, 8000), 'Gram': (4500, 5500), 'Horse-gram': (7500, 9000),
        'Dry chillies': (14000, 22000), 'Onion': (1400, 2800), 'Tomato': (1200, 2200),
        'Potato': (1000, 1500), 'Turmeric': (10000, 16000), 'Banana': (1500, 2500),
        'Coconut': (24000, 33000), 'Arecanut (Betelnut)': (43000, 50000),
        'Cashewnut': (11000, 14000), 'Black pepper': (55000, 63000),
        'Cardamom': (25000, 35000), 'Sugarcane': (260, 380),
        'Sunflower': (5500, 7000), 'Sesamum': (12000, 16000),
        'Rapeseed &Mustard': (4800, 5800), 'Linseed': (6000, 7500),
        'Castor seed': (5200, 6500), 'Niger seed': (7500, 9000),
        'Small millets': (3500, 5000), 'Other Kharif pulses': (5000, 7000),
        'Other  Rabi pulses': (4500, 6000), 'Other Rabi pulses': (4500, 6000),
        'Other Fresh Fruits': (2000, 3500), 'Mango': (1500, 3000),
        'Grapes': (2500, 4000), 'Papaya': (1000, 1800), 'Watermelon': (600, 1200),
        'Muskmelon': (800, 1400), 'Brinjal': (1000, 1800), 'Coriander': (10000, 15000),
        'Garlic': (7000, 10000), 'Dry ginger': (16000, 22000), 'Tobacco': (13000, 18000),
        'Safflower': (5000, 6500), 'Tapioca': (1500, 2200), 'Sweet potato': (1200, 1800),
        'Beans & Mutter(Vegetable)': (3000, 4500), 'Cowpea(Lobia)': (5500, 7000),
        'Mesta': (4000, 5500), 'Sannhamp': (3000, 4500),
    }

    # City→state mapping for unknown districts
    _CITY_STATE = {
        'bangalore': 'Karnataka', 'mysore': 'Karnataka', 'mandya': 'Karnataka',
        'tumkur': 'Karnataka', 'hassan': 'Karnataka', 'udupi': 'Karnataka',
        'mangalore': 'Karnataka', 'belgaum': 'Karnataka', 'hubli': 'Karnataka',
        'pune': 'Maharashtra', 'mumbai': 'Maharashtra', 'nagpur': 'Maharashtra',
        'nashik': 'Maharashtra', 'aurangabad': 'Maharashtra', 'kolhapur': 'Maharashtra',
        'chennai': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu', 'madurai': 'Tamil Nadu',
        'hyderabad': 'Telangana', 'warangal': 'Telangana', 'nizamabad': 'Telangana',
        'delhi': 'Delhi', 'new delhi': 'Delhi',
        'ludhiana': 'Punjab', 'amritsar': 'Punjab', 'jalandhar': 'Punjab',
        'patna': 'Bihar', 'lucknow': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh',
        'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan',
        'ahmedabad': 'Gujarat', 'surat': 'Gujarat', 'rajkot': 'Gujarat',
        'bhopal': 'Madhya Pradesh', 'indore': 'Madhya Pradesh',
        'kolkata': 'West Bengal', 'bhubaneswar': 'Odisha',
        'goa': 'Goa', 'panaji': 'Goa', 'shimla': 'Himachal Pradesh',
        'srinagar': 'Jammu and Kashmir', 'raipur': 'Chhattisgarh',
        'ranchi': 'Jharkhand', 'guwahati': 'Assam', 'imphal': 'Manipur',
        'shillong': 'Meghalaya', 'gangtok': 'Sikkim', 'dehradun': 'Uttarakhand',
    }

    # Detect state from city name
    def _detect_state(city_name):
        cn = city_name.lower().strip()
        if cn in _CITY_STATE:
            return _CITY_STATE[cn]
        for k, v in _CITY_STATE.items():
            if k in cn:
                return v
        return 'Karnataka'

    # Look up district crops from training data, fallback to state
    state = _detect_state(city)
    crop_list = _find_district_crops(city, state)

    # Build fallback prices
    fallback_list = []
    if crop_list:
        # District-level data available
        for crop_name in crop_list[:10]:
            pmin, pmax = _MANDI_PRICES.get(crop_name, (2000, 5000))
            base = random.randint(pmin, pmax)
            variation = int(base * 0.08)
            fallback_list.append({
                'commodity': crop_name,
                'variety': 'Local',
                'market': f'{city} APMC',
                'district': city,
                'state': _detect_state(city),
                'min_price': str(base - variation),
                'max_price': str(base + variation),
                'modal_price': str(base),
                'arrival_date': today,
            })

    # Ultimate fallback: generic crops
    if not fallback_list:
        state = _detect_state(city)
        generic = [('Rice', 2200, 3200), ('Wheat', 2100, 2500), ('Maize', 1700, 2200),
                   ('Cotton(lint)', 5500, 7000), ('Groundnut', 5000, 6800),
                   ('Onion', 1400, 2800), ('Tomato', 1200, 2200),
                   ('Tur Dal', 6000, 7500), ('Mustard', 4500, 5500), ('Potato', 1000, 1500)]
        for crop_name, pmin, pmax in generic:
            base = random.randint(pmin, pmax)
            variation = int(base * 0.08)
            fallback_list.append({
                'commodity': crop_name, 'variety': 'Local',
                'market': f'{city} APMC', 'district': city, 'state': state,
                'min_price': str(base - variation), 'max_price': str(base + variation),
                'modal_price': str(base), 'arrival_date': today,
            })
    else:
        state = fallback_list[0]['state']

    return jsonify({
        'city': city,
        'count': len(fallback_list),
        'prices': fallback_list,
        'is_fallback': True,
        'source': f'Estimated Market Rates for {city}, {state} (govt API unavailable)',
    })

@app.route('/admin/messages')
def admin_messages():
    # Auth handled by before_request hook
    conn = get_db()
    try:
        cursor = conn.execute('SELECT c_id, c_name, c_mobile, c_email, c_address, c_message FROM contactus')
        rows = cursor.fetchall()
    finally:
        conn.close()

    headers = ['ID', 'Name', 'Mobile', 'Email', 'Address', 'Message']
    return render_template('admin_dashboard.html', title='Customer Feedback & Messages', headers=headers, rows=rows, delete_url='/admin/delete_message')

# Delete Handlers
@app.route('/admin/delete_farmer', methods=['POST'])
def delete_farmer():
    fid = request.form.get('id')
    conn = get_db()
    try:
        conn.execute('DELETE FROM farmerlogin WHERE farmer_id = ?', (fid,))
        conn.commit()
    finally:
        conn.close()
    flash('Farmer user deleted.', 'info')
    return redirect(url_for('admin_farmers'))

@app.route('/admin/delete_message', methods=['POST'])
def delete_message():
    mid = request.form.get('id')
    conn = get_db()
    try:
        conn.execute('DELETE FROM contactus WHERE c_id = ?', (mid,))
        conn.commit()
    finally:
        conn.close()
    flash('Contact message deleted.', 'info')
    return redirect(url_for('admin_messages'))


# Pre-load district crop map from ML training data on startup
import csv as _csv_init
from collections import Counter as _CounterInit
app._district_crop_map = {}
_csv_path = os.path.join(BASE_DIR, 'farmer', 'ML', 'crop_prediction', 'preprocessed2.csv')
if os.path.exists(_csv_path):
    _dc = {}
    with open(_csv_path, 'r', encoding='utf-8') as _f:
        for _row in _csv_init.DictReader(_f):
            _d = _row.get('District_Name', '').strip()
            _c = _row.get('Crop', '').strip()
            if _d and _c:
                if _d not in _dc: _dc[_d] = _CounterInit()
                _dc[_d][_c] += 1
    for _d, _cnt in _dc.items():
        app._district_crop_map[_d] = [c for c, _ in _cnt.most_common(10)]

# Also build state→districts mapping for fallback
app._state_districts = {}
with open(_csv_path, 'r', encoding='utf-8') as _f:
    for _row in _csv_init.DictReader(_f):
        _s = _row.get('State_Name', '').strip()
        _d = _row.get('District_Name', '').strip()
        if _s and _d:
            if _s not in app._state_districts:
                app._state_districts[_s] = set()
            app._state_districts[_s].add(_d)

def _find_district_crops(district_name, state_name=""):
    """Find district crops with fuzzy matching, falling back to state-level top crops."""
    dmap = app._district_crop_map
    key = district_name.upper().strip()
    if key in dmap:
        return dmap[key]
    for k, v in dmap.items():
        if key in k or k in key:
            return v
    for k, v in dmap.items():
        if any(w in k for w in key.split() if len(w) > 3):
            return v
    # State-level fallback: aggregate top crops across districts in that state
    if state_name:
        from collections import Counter
        state_crops = Counter()
        state_key = state_name.strip()
        # Find districts belonging to this state
        state_districts = app._state_districts.get(state_key, set())
        if not state_districts:
            # Try partial match on state name
            for sk, sd in app._state_districts.items():
                if state_key in sk or sk in state_key:
                    state_districts = sd
                    break
        for d in state_districts:
            if d in dmap:
                for crop in dmap[d]:
                    state_crops[crop] += 1
        if state_crops:
            return [c for c, _ in state_crops.most_common(10)]
    return []

if __name__ == '__main__':
    print("Starting AgroIntel Standalone Python Flask Server...")
    print("Access application at: http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
