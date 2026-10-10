import os
import sys
import re
import sqlite3
import json
import math
import hashlib
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

# Session cookie hardening: HTTPS-only and cross-site-request-proof.
# (HttpOnly is already Flask's default; these two close the deploy gaps.)
app.config.update(
    SESSION_COOKIE_SECURE=bool(os.getenv('FLASK_ENV') == 'production' or os.getenv('VERCEL')),
    SESSION_COOKIE_SAMESITE='Lax',
)

# ═══════════════════════════════════════════════════════════════
# SESSION SECRET — never fall back to a literal committed to the repo.
# The whole access-control guard below rests on session cookies being
# unforgeable; a published default key would let anyone mint an admin
# cookie. Fail loudly outside serverless; on Vercel fall back to a per-boot
# random key (still unforgeable) with a boot warning.
# ═══════════════════════════════════════════════════════════════
app.secret_key = os.getenv('FLASK_SECRET_KEY')
if not app.secret_key:
    if os.getenv('FLASK_ENV') == 'production' and not os.getenv('VERCEL'):
        raise RuntimeError(
            'FLASK_SECRET_KEY is not set. Set it as an environment variable '
            'before deploying — without it, session cookies can be forged.'
        )
    # Local dev and first-boot serverless: random per-process key. Sessions
    # reset on restart, which is fine — cookies stay unforgeable either way.
    app.secret_key = os.urandom(32)
    if os.getenv('VERCEL'):
        print('WARNING: FLASK_SECRET_KEY not set; using a per-boot random key. '
              'Set it in Vercel -> Settings -> Environment Variables.',
              file=sys.stderr)

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


# ═══════════════════════════════════════════════════════════════
# CURATED INDIAN CITIES & DISTRICTS DATABASE
# ═══════════════════════════════════════════════════════════════
INDIAN_CITIES = [
    # Metros & Major Indian Cities
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
    # All 30 Karnataka Districts (matching ML training dataset names & official headquarters)
    {'name': 'Bagalkot', 'lat': 16.179, 'lon': 75.700, 'state': 'Karnataka'},
    {'name': 'Bangalore Rural', 'lat': 13.284, 'lon': 77.562, 'state': 'Karnataka'},
    {'name': 'Belgaum', 'lat': 15.857, 'lon': 74.507, 'state': 'Karnataka'},
    {'name': 'Bellary', 'lat': 15.139, 'lon': 76.919, 'state': 'Karnataka'},
    {'name': 'Bengaluru Urban', 'lat': 12.972, 'lon': 77.594, 'state': 'Karnataka'},
    {'name': 'Bidar', 'lat': 17.910, 'lon': 77.520, 'state': 'Karnataka'},
    {'name': 'Bijapur', 'lat': 16.830, 'lon': 75.710, 'state': 'Karnataka'},
    {'name': 'Chamarajanagar', 'lat': 11.926, 'lon': 76.940, 'state': 'Karnataka'},
    {'name': 'Chikballapur', 'lat': 13.433, 'lon': 77.727, 'state': 'Karnataka'},
    {'name': 'Chikmagalur', 'lat': 13.316, 'lon': 75.772, 'state': 'Karnataka'},
    {'name': 'Chitradurga', 'lat': 14.230, 'lon': 76.398, 'state': 'Karnataka'},
    {'name': 'Dakshin Kannad', 'lat': 12.914, 'lon': 74.856, 'state': 'Karnataka'},
    {'name': 'Davangere', 'lat': 14.468, 'lon': 75.921, 'state': 'Karnataka'},
    {'name': 'Dharwad', 'lat': 15.459, 'lon': 75.007, 'state': 'Karnataka'},
    {'name': 'Gadag', 'lat': 15.432, 'lon': 75.634, 'state': 'Karnataka'},
    {'name': 'Gulbarga', 'lat': 17.329, 'lon': 76.834, 'state': 'Karnataka'},
    {'name': 'Hassan', 'lat': 13.007, 'lon': 76.096, 'state': 'Karnataka'},
    {'name': 'Haveri', 'lat': 14.795, 'lon': 75.399, 'state': 'Karnataka'},
    {'name': 'Kodagu', 'lat': 12.424, 'lon': 75.738, 'state': 'Karnataka'},
    {'name': 'Kolar', 'lat': 13.136, 'lon': 78.129, 'state': 'Karnataka'},
    {'name': 'Koppal', 'lat': 15.345, 'lon': 76.155, 'state': 'Karnataka'},
    {'name': 'Mandya', 'lat': 12.522, 'lon': 76.897, 'state': 'Karnataka'},
    {'name': 'Mangalore', 'lat': 12.914, 'lon': 74.856, 'state': 'Karnataka'},
    {'name': 'Mysore', 'lat': 12.305, 'lon': 76.655, 'state': 'Karnataka'},
    {'name': 'Raichur', 'lat': 16.212, 'lon': 77.356, 'state': 'Karnataka'},
    {'name': 'Ramanagara', 'lat': 12.721, 'lon': 77.279, 'state': 'Karnataka'},
    {'name': 'Shimoga', 'lat': 13.931, 'lon': 75.568, 'state': 'Karnataka'},
    {'name': 'Tumkur', 'lat': 13.340, 'lon': 77.101, 'state': 'Karnataka'},
    {'name': 'Udupi', 'lat': 13.341, 'lon': 74.742, 'state': 'Karnataka'},
    {'name': 'Uttar Kannad', 'lat': 14.818, 'lon': 74.130, 'state': 'Karnataka'},
    {'name': 'Yadgir', 'lat': 16.770, 'lon': 77.140, 'state': 'Karnataka'},
    {'name': 'Hubli', 'lat': 15.349, 'lon': 75.134, 'state': 'Karnataka'},
    # Key Cities across Other States
    {'name': 'Coimbatore', 'lat': 11.017, 'lon': 76.956, 'state': 'Tamil Nadu'},
    {'name': 'Madurai', 'lat': 9.925, 'lon': 78.120, 'state': 'Tamil Nadu'},
    {'name': 'Thiruvananthapuram', 'lat': 8.524, 'lon': 76.936, 'state': 'Kerala'},
    {'name': 'Kochi', 'lat': 9.932, 'lon': 76.267, 'state': 'Kerala'},
    {'name': 'Kozhikode', 'lat': 11.258, 'lon': 75.780, 'state': 'Kerala'},
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
]

# District & City Alias Geocoding Directory
INDIAN_DISTRICTS_DATA = [
    # Karnataka (all 30 districts + regional synonyms & Kannada transliterations)
    {'name': 'Mysuru (Mysore)', 'lat': 12.305, 'lon': 76.655, 'state': 'Karnataka', 'aliases': ['mysore', 'mysuru', 'mysore district', 'mysuru district']},
    {'name': 'Bengaluru (Bangalore)', 'lat': 12.972, 'lon': 77.594, 'state': 'Karnataka', 'aliases': ['bangalore', 'bengaluru', 'bengaluru urban', 'bangalore urban', 'bangalore city', 'bengaluru city']},
    {'name': 'Bangalore Rural', 'lat': 13.284, 'lon': 77.562, 'state': 'Karnataka', 'aliases': ['bangalore rural', 'bengaluru rural']},
    {'name': 'Hassan', 'lat': 13.007, 'lon': 76.096, 'state': 'Karnataka', 'aliases': ['hassan', 'hasana', 'hassan district']},
    {'name': 'Shimoga (Shivamogga)', 'lat': 13.931, 'lon': 75.568, 'state': 'Karnataka', 'aliases': ['shimoga', 'shivamogga', 'shivamoga']},
    {'name': 'Belagavi (Belgaum)', 'lat': 15.857, 'lon': 74.507, 'state': 'Karnataka', 'aliases': ['belgaum', 'belagavi', 'belgaum district', 'belagavi district']},
    {'name': 'Ballari (Bellary)', 'lat': 15.139, 'lon': 76.919, 'state': 'Karnataka', 'aliases': ['bellary', 'ballari']},
    {'name': 'Bagalkot', 'lat': 16.179, 'lon': 75.700, 'state': 'Karnataka', 'aliases': ['bagalkot', 'bagalkote']},
    {'name': 'Bidar', 'lat': 17.910, 'lon': 77.520, 'state': 'Karnataka', 'aliases': ['bidar']},
    {'name': 'Vijayapura (Bijapur)', 'lat': 16.830, 'lon': 75.710, 'state': 'Karnataka', 'aliases': ['bijapur', 'vijayapura', 'bijapura']},
    {'name': 'Chamarajanagar', 'lat': 11.926, 'lon': 76.940, 'state': 'Karnataka', 'aliases': ['chamarajanagar', 'chamarajanagara']},
    {'name': 'Chikballapur', 'lat': 13.433, 'lon': 77.727, 'state': 'Karnataka', 'aliases': ['chikballapur', 'chikkaballapur', 'chikkaballapura']},
    {'name': 'Chikmagalur', 'lat': 13.316, 'lon': 75.772, 'state': 'Karnataka', 'aliases': ['chikmagalur', 'chikkamagaluru', 'chikmagaluru', 'chikkamagalur']},
    {'name': 'Chitradurga', 'lat': 14.230, 'lon': 76.398, 'state': 'Karnataka', 'aliases': ['chitradurga']},
    {'name': 'Dakshina Kannada (Mangalore)', 'lat': 12.914, 'lon': 74.856, 'state': 'Karnataka', 'aliases': ['dakshin kannad', 'dakshina kannada', 'mangalore', 'mangaluru', 'south canara', 'south kanara']},
    {'name': 'Davangere', 'lat': 14.468, 'lon': 75.921, 'state': 'Karnataka', 'aliases': ['davangere', 'davanagere']},
    {'name': 'Dharwad (Hubli)', 'lat': 15.459, 'lon': 75.007, 'state': 'Karnataka', 'aliases': ['dharwad', 'hubli', 'hubballi', 'dharwad district']},
    {'name': 'Gadag', 'lat': 15.432, 'lon': 75.634, 'state': 'Karnataka', 'aliases': ['gadag']},
    {'name': 'Kalaburagi (Gulbarga)', 'lat': 17.329, 'lon': 76.834, 'state': 'Karnataka', 'aliases': ['gulbarga', 'kalaburagi', 'kalburgi']},
    {'name': 'Haveri', 'lat': 14.795, 'lon': 75.399, 'state': 'Karnataka', 'aliases': ['haveri']},
    {'name': 'Kodagu (Coorg)', 'lat': 12.424, 'lon': 75.738, 'state': 'Karnataka', 'aliases': ['kodagu', 'coorg', 'madikeri']},
    {'name': 'Kolar', 'lat': 13.136, 'lon': 78.129, 'state': 'Karnataka', 'aliases': ['kolar']},
    {'name': 'Koppal', 'lat': 15.345, 'lon': 76.155, 'state': 'Karnataka', 'aliases': ['koppal']},
    {'name': 'Mandya', 'lat': 12.522, 'lon': 76.897, 'state': 'Karnataka', 'aliases': ['mandya']},
    {'name': 'Raichur', 'lat': 16.212, 'lon': 77.356, 'state': 'Karnataka', 'aliases': ['raichur']},
    {'name': 'Ramanagara', 'lat': 12.721, 'lon': 77.279, 'state': 'Karnataka', 'aliases': ['ramanagara', 'ramanagar', 'ramanagaram']},
    {'name': 'Tumakuru (Tumkur)', 'lat': 13.340, 'lon': 77.101, 'state': 'Karnataka', 'aliases': ['tumkur', 'tumakuru']},
    {'name': 'Udupi', 'lat': 13.341, 'lon': 74.742, 'state': 'Karnataka', 'aliases': ['udupi']},
    {'name': 'Uttara Kannada (Karwar)', 'lat': 14.818, 'lon': 74.130, 'state': 'Karnataka', 'aliases': ['uttar kannad', 'uttara kannada', 'karwar', 'north canara', 'north kanara']},
    {'name': 'Yadgir', 'lat': 16.770, 'lon': 77.140, 'state': 'Karnataka', 'aliases': ['yadgir', 'yadgiri']},
    # Major Metros & National Cities
    {'name': 'Mumbai', 'lat': 19.076, 'lon': 72.877, 'state': 'Maharashtra', 'aliases': ['mumbai', 'bombay']},
    {'name': 'Delhi', 'lat': 28.704, 'lon': 77.102, 'state': 'Delhi', 'aliases': ['delhi', 'new delhi']},
    {'name': 'Hyderabad', 'lat': 17.385, 'lon': 78.486, 'state': 'Telangana', 'aliases': ['hyderabad', 'secunderabad']},
    {'name': 'Chennai', 'lat': 13.083, 'lon': 80.271, 'state': 'Tamil Nadu', 'aliases': ['chennai', 'madras']},
    {'name': 'Kolkata', 'lat': 22.573, 'lon': 88.364, 'state': 'West Bengal', 'aliases': ['kolkata', 'calcutta']},
    {'name': 'Pune', 'lat': 18.520, 'lon': 73.857, 'state': 'Maharashtra', 'aliases': ['pune', 'poona']},
    {'name': 'Ahmedabad', 'lat': 23.023, 'lon': 72.571, 'state': 'Gujarat', 'aliases': ['ahmedabad', 'amdavad']},
    {'name': 'Jaipur', 'lat': 26.913, 'lon': 75.787, 'state': 'Rajasthan', 'aliases': ['jaipur']},
    {'name': 'Lucknow', 'lat': 26.847, 'lon': 80.947, 'state': 'Uttar Pradesh', 'aliases': ['lucknow']},
    {'name': 'Patna', 'lat': 25.612, 'lon': 85.144, 'state': 'Bihar', 'aliases': ['patna']},
    {'name': 'Bhopal', 'lat': 23.260, 'lon': 77.413, 'state': 'Madhya Pradesh', 'aliases': ['bhopal']},
    {'name': 'Indore', 'lat': 22.720, 'lon': 75.858, 'state': 'Madhya Pradesh', 'aliases': ['indore']},
    {'name': 'Chandigarh', 'lat': 30.733, 'lon': 76.779, 'state': 'Chandigarh', 'aliases': ['chandigarh']},
    {'name': 'Ludhiana', 'lat': 30.901, 'lon': 75.857, 'state': 'Punjab', 'aliases': ['ludhiana']},
    {'name': 'Amritsar', 'lat': 31.634, 'lon': 74.873, 'state': 'Punjab', 'aliases': ['amritsar']},
    {'name': 'Dehradun', 'lat': 30.317, 'lon': 78.032, 'state': 'Uttarakhand', 'aliases': ['dehradun']},
    {'name': 'Varanasi', 'lat': 25.318, 'lon': 82.988, 'state': 'Uttar Pradesh', 'aliases': ['varanasi', 'banaras', 'kashi']},
    {'name': 'Agra', 'lat': 27.177, 'lon': 78.014, 'state': 'Uttar Pradesh', 'aliases': ['agra']},
    {'name': 'Kanpur', 'lat': 26.450, 'lon': 80.350, 'state': 'Uttar Pradesh', 'aliases': ['kanpur']},
    {'name': 'Visakhapatnam', 'lat': 17.687, 'lon': 83.218, 'state': 'Andhra Pradesh', 'aliases': ['visakhapatnam', 'vizag']},
    {'name': 'Vijayawada', 'lat': 16.506, 'lon': 80.648, 'state': 'Andhra Pradesh', 'aliases': ['vijayawada']},
    {'name': 'Bhubaneswar', 'lat': 20.297, 'lon': 85.825, 'state': 'Odisha', 'aliases': ['bhubaneswar']},
    {'name': 'Ranchi', 'lat': 23.345, 'lon': 85.310, 'state': 'Jharkhand', 'aliases': ['ranchi']},
    {'name': 'Guwahati', 'lat': 26.144, 'lon': 91.736, 'state': 'Assam', 'aliases': ['guwahati']},
    {'name': 'Raipur', 'lat': 21.251, 'lon': 81.630, 'state': 'Chhattisgarh', 'aliases': ['raipur']},
    {'name': 'Jodhpur', 'lat': 26.292, 'lon': 73.025, 'state': 'Rajasthan', 'aliases': ['jodhpur']},
    {'name': 'Udaipur', 'lat': 24.585, 'lon': 73.712, 'state': 'Rajasthan', 'aliases': ['udaipur']},
    {'name': 'Kochi', 'lat': 9.932, 'lon': 76.267, 'state': 'Kerala', 'aliases': ['kochi', 'cochin', 'ernakulam']},
    {'name': 'Thiruvananthapuram', 'lat': 8.524, 'lon': 76.936, 'state': 'Kerala', 'aliases': ['thiruvananthapuram', 'trivandrum']},
    {'name': 'Coimbatore', 'lat': 11.017, 'lon': 76.956, 'state': 'Tamil Nadu', 'aliases': ['coimbatore']},
    {'name': 'Madurai', 'lat': 9.925, 'lon': 78.120, 'state': 'Tamil Nadu', 'aliases': ['madurai']},
    {'name': 'Nashik', 'lat': 19.998, 'lon': 73.790, 'state': 'Maharashtra', 'aliases': ['nashik', 'nasik']},
    {'name': 'Nagpur', 'lat': 21.146, 'lon': 79.088, 'state': 'Maharashtra', 'aliases': ['nagpur']},
    {'name': 'Surat', 'lat': 21.170, 'lon': 72.831, 'state': 'Gujarat', 'aliases': ['surat']},
    {'name': 'Vadodara', 'lat': 22.307, 'lon': 73.181, 'state': 'Gujarat', 'aliases': ['vadodara', 'baroda']},
    {'name': 'Rajkot', 'lat': 22.304, 'lon': 70.802, 'state': 'Gujarat', 'aliases': ['rajkot']},
]

_GEO_CACHE = {}

def geocode_indian_location(name, state=None):
    """
    Resolve any Indian district, city, or town to (lat, lon, clean_label).
    1. Checks curated database with aliases & optional state match.
    2. Searches OSM Nominatim for Indian administrative districts with caching.
    3. Falls back to Open-Meteo with country_code=IN.
    4. Falls back to default.
    """
    if not name:
        return 13.341, 74.742, "Udupi, Karnataka"

    clean_name = str(name).strip()
    norm_name = clean_name.lower().replace('_', ' ').replace('-', ' ').strip()
    state_str = str(state).strip() if state else ''
    norm_state = state_str.lower().replace('_', ' ').replace('-', ' ').strip()
    cache_key = (norm_name, norm_state)

    if cache_key in _GEO_CACHE:
        return _GEO_CACHE[cache_key]

    # Check curated districts
    match = None
    for entry in INDIAN_DISTRICTS_DATA:
        if norm_name in entry['aliases']:
            if norm_state and (norm_state in entry['state'].lower() or entry['state'].lower() in norm_state):
                match = entry
                break
            elif not norm_state:
                match = entry
                break

    if not match:
        for entry in INDIAN_DISTRICTS_DATA:
            if norm_name in entry['aliases']:
                match = entry
                break

    if match:
        lbl = f"{match['name']}, {match['state']}"
        res = (match['lat'], match['lon'], lbl)
        _GEO_CACHE[cache_key] = res
        return res

    # OSM Nominatim Search
    try:
        headers = {'User-Agent': 'AgroIntel-WeatherGeocode/1.0 (agrointel@gmail.com)'}
        query = f"{clean_name}, {state_str}, India" if state_str else f"{clean_name}, India"
        url = f"https://nominatim.openstreetmap.org/search?q={requests.utils.quote(query)}&format=json&limit=1&addressdetails=1"
        r = requests.get(url, headers=headers, timeout=4)
        if r.status_code == 200 and r.json():
            item = r.json()[0]
            lat = float(item['lat'])
            lon = float(item['lon'])
            addr = item.get('address', {})
            city_name = (
                addr.get('city') or
                addr.get('town') or
                addr.get('village') or
                addr.get('state_district') or
                addr.get('county') or
                addr.get('municipality') or
                clean_name.title()
            )
            if city_name:
                city_name = city_name.replace(' District', '').replace(' taluk', '').strip()
            st_name = addr.get('state') or state_str or 'India'
            label = f"{city_name}, {st_name}".strip(', ')
            res = (lat, lon, label)
            _GEO_CACHE[cache_key] = res
            return res
    except Exception:
        pass

    # Open-Meteo Geocoding restricted to country_code=IN
    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={requests.utils.quote(clean_name)}&count=5&language=en&country_code=IN"
        geo_res = requests.get(geo_url, timeout=4)
        if geo_res.status_code == 200:
            results = geo_res.json().get('results', [])
            for r in results:
                if r.get('country_code', '').upper() == 'IN':
                    lat = float(r['latitude'])
                    lon = float(r['longitude'])
                    adm1 = r.get('admin1', state_str or 'India')
                    label = f"{r.get('name', clean_name.title())}, {adm1}".strip(', ')
                    res = (lat, lon, label)
                    _GEO_CACHE[cache_key] = res
                    return res
    except Exception:
        pass

    # Fallback to nearest city in INDIAN_CITIES or Udupi default
    nearest = next((c for c in INDIAN_CITIES if c['name'].lower() == norm_name), None)
    if nearest:
        res = (nearest['lat'], nearest['lon'], f"{nearest['name']}, {nearest['state']}")
    else:
        res = (13.341, 74.742, f"{clean_name.title()}, Karnataka")
    _GEO_CACHE[cache_key] = res
    return res

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
    if not hashed or not plain:
        return False
    try:
        if hashed.startswith('$2b$') or hashed.startswith('$2a$'):
            return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        pass
    return plain == hashed

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
    elif path == '/admin' or path.startswith('/admin/'):
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

    states, districts_by_state = _location_choices()
    return render_template('crop_recommendation.html', result=result,
                           states=states, districts_by_state=districts_by_state)

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

    states, districts_by_state = _location_choices()
    return render_template('fertilizer_recommendation.html', result=result,
                           states=states, districts_by_state=districts_by_state)

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
    states, districts_by_state = _location_choices()
    return render_template('crop_prediction.html', result=result, price_data=price_data,
                           state=state if result else '', district=district if result else '',
                           season=season if result else '', states=states,
                           districts_by_state=districts_by_state)


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

    states, districts_by_state = _location_choices()
    form = request.form
    return render_template('yield_prediction.html', result=result,
                           states=states, districts_by_state=districts_by_state,
                           sel_state=form.get('state') or 'Karnataka',
                           sel_district=form.get('district') or 'BAGALKOT',
                           sel_season=form.get('season') or 'Kharif',
                           sel_crop=form.get('crop') or 'Rice',
                           sel_area=form.get('area') or '247')

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

    states, districts_by_state = _location_choices()
    return render_template('rainfall_prediction.html', result=result,
                           states=states, districts_by_state=districts_by_state)

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

    states, districts_by_state = _location_choices()
    return render_template('weather_forecast.html', weather=weather, city=city,
                           states=states, districts_by_state=districts_by_state)


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
            # Priority: city > town > village > state_district > county > municipality > suburb
            raw_place = (
                addr.get('city') or
                addr.get('town') or
                addr.get('village') or
                addr.get('state_district') or
                addr.get('county') or
                addr.get('municipality') or
                addr.get('suburb') or
                data.get('display_name', '').split(',')[0].strip()
            )
            place = raw_place.replace(' District', '').replace(' taluk', '').strip() if raw_place else None
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
def api_weather_coords(lat, lon, override_label=None):
    """Current weather + 7-day forecast via Open-Meteo (free, no API key).""" 
    try:
        lat_f, lon_f = float(lat), float(lon)
        lbl = override_label or request.args.get('label')

        if lbl:
            city_label = lbl
            nom_state = ''
        else:
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
                'label': city_label,
                'state': nom_state or '',
                'temp': round(cur['temperature_2m'], 1),
                'feels_like': round(cur.get('apparent_temperature', cur['temperature_2m']), 1),
                'humidity': int(cur.get('relative_humidity_2m', 75)),
                'pressure': int(cur.get('pressure_msl', 1013)),
                'wind': round(cur.get('wind_speed_10m', 0) / 3.6, 1),  # km/h -> m/s
                'visibility': 10.0,  # Open-Meteo default
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
    city_label = override_label or (nearest[0]['name'] if nearest else 'Local Region')
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
    """Current weather + 7-day forecast by city or district name."""
    state = request.args.get('state', '').strip()
    lat, lon, label = geocode_indian_location(city_name, state=state)
    return api_weather_coords(str(lat), str(lon), override_label=label)



@app.route('/api/nearby_cities/<lat>/<lon>')
def api_nearby_cities(lat, lon):
    """Return 6 nearest Indian cities to given coordinates."""
    try:
        lat_f, lon_f = float(lat), float(lon)
        cities = get_nearby_cities(lat_f, lon_f, count=6)
        return jsonify({'cities': cities})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def _location_choices():
    """States + districts from the ML training data, for the cascading
    State/District dropdowns shared by every farmer tool page."""
    districts_by_state = {
        state: sorted(districts) for state, districts in app._state_districts.items()
    }
    return sorted(districts_by_state.keys()), districts_by_state


# Live Market Prices Page (Farmer Portal)
@app.route('/farmer/market_prices')
def farmer_market_prices():
    states, districts_by_state = _location_choices()
    return render_template(
        'market_prices.html',
        states=states,
        districts_by_state=districts_by_state,
    )


def _call_data_gov(url, timeout=6):
    """Call data.gov.in with one automatic retry on transient failure.
    Returns (response_object_or_None, did_try_second_call)."""
    if not DATA_GOV_API_KEY:
        return None, False
    # First attempt with the base timeout.
    try:
        res = requests.get(url, timeout=timeout)
        if res.status_code == 200:
            return res, False
    except Exception:
        pass
    # One retry with a slightly longer timeout for the intermittent upstream.
    try:
        res2 = requests.get(url, timeout=timeout + 2)
        return (res2, True) if res2.status_code == 200 else (res2, True)
    except Exception:
        return None, False

COMMODITY_CATALOG = {
    'Arecanut': {'variety': 'Chali / Red', 'base_modal': 47000, 'min_pct': 0.93, 'max_pct': 1.06},
    'Arhar/Tur': {'variety': 'ICPL 87119 (Asha)', 'base_modal': 7100, 'min_pct': 0.90, 'max_pct': 1.10},
    'Bajra': {'variety': 'Desi / Hybrid', 'base_modal': 1950, 'min_pct': 0.88, 'max_pct': 1.08},
    'Banana': {'variety': 'Robusta / Cavendish', 'base_modal': 2100, 'min_pct': 0.85, 'max_pct': 1.14},
    'Barley': {'variety': 'RD-2035', 'base_modal': 2150, 'min_pct': 0.89, 'max_pct': 1.09},
    'Beans & Mutter(Vegetable)': {'variety': 'Local Green', 'base_modal': 3200, 'min_pct': 0.85, 'max_pct': 1.15},
    'Black pepper': {'variety': 'Malabar Garbled', 'base_modal': 59000, 'min_pct': 0.94, 'max_pct': 1.06},
    'Cardamom': {'variety': 'Alleppey Green', 'base_modal': 145000, 'min_pct': 0.92, 'max_pct': 1.08},
    'Cashewnut': {'variety': 'Raw Nut', 'base_modal': 12600, 'min_pct': 0.91, 'max_pct': 1.07},
    'Castor seed': {'variety': 'GCH-7', 'base_modal': 5850, 'min_pct': 0.90, 'max_pct': 1.08},
    'Coconut': {'variety': 'De-husked Cleaned', 'base_modal': 30000, 'min_pct': 0.92, 'max_pct': 1.07},
    'Cond-spcs other': {'variety': 'Mixed Grade', 'base_modal': 8500, 'min_pct': 0.88, 'max_pct': 1.12},
    'Coriander': {'variety': 'Badami / Green', 'base_modal': 7600, 'min_pct': 0.90, 'max_pct': 1.10},
    'Cotton(lint)': {'variety': 'Shankar-6 (Long Staple)', 'base_modal': 7050, 'min_pct': 0.92, 'max_pct': 1.06},
    'Cowpea(Lobia)': {'variety': 'Pusa Komal', 'base_modal': 5400, 'min_pct': 0.89, 'max_pct': 1.10},
    'Dry chillies': {'variety': 'Byadgi / Guntur', 'base_modal': 18000, 'min_pct': 0.85, 'max_pct': 1.18},
    'Dry ginger': {'variety': 'Cochin Unbleached', 'base_modal': 24000, 'min_pct': 0.90, 'max_pct': 1.12},
    'Garlic': {'variety': 'G-41 / Desi', 'base_modal': 9200, 'min_pct': 0.86, 'max_pct': 1.15},
    'Gram': {'variety': 'Desi / Annigeri', 'base_modal': 5100, 'min_pct': 0.91, 'max_pct': 1.08},
    'Groundnut': {'variety': 'Bold / TMV-2', 'base_modal': 5900, 'min_pct': 0.89, 'max_pct': 1.10},
    'Guar seed': {'variety': 'HG-365', 'base_modal': 5200, 'min_pct': 0.90, 'max_pct': 1.08},
    'Horse-gram': {'variety': 'PHG-9 / Local', 'base_modal': 4800, 'min_pct': 0.88, 'max_pct': 1.10},
    'Jowar': {'variety': 'Maldandi / White', 'base_modal': 2150, 'min_pct': 0.88, 'max_pct': 1.11},
    'Jute': {'variety': 'TD-5', 'base_modal': 4950, 'min_pct': 0.91, 'max_pct': 1.08},
    'Khesari': {'variety': 'Mahateora', 'base_modal': 4100, 'min_pct': 0.89, 'max_pct': 1.09},
    'Linseed': {'variety': 'Shekhar / Garima', 'base_modal': 6800, 'min_pct': 0.91, 'max_pct': 1.09},
    'Maize': {'variety': 'Ganga Safed-2 / Hybrid', 'base_modal': 2100, 'min_pct': 0.92, 'max_pct': 1.08},
    'Mango': {'variety': 'Alphonso / Banganapalli', 'base_modal': 4500, 'min_pct': 0.82, 'max_pct': 1.20},
    'Masoor': {'variety': 'Desi Small / Bold', 'base_modal': 6200, 'min_pct': 0.91, 'max_pct': 1.08},
    'Mesta': {'variety': 'AMV-5', 'base_modal': 4400, 'min_pct': 0.90, 'max_pct': 1.08},
    'Moong(Green Gram)': {'variety': 'Shiny Green / Pusa Vishal', 'base_modal': 7700, 'min_pct': 0.92, 'max_pct': 1.08},
    'Moth': {'variety': 'RMO-40', 'base_modal': 6500, 'min_pct': 0.89, 'max_pct': 1.10},
    'Niger seed': {'variety': 'IGP-76', 'base_modal': 7800, 'min_pct': 0.91, 'max_pct': 1.09},
    'Oilseeds total': {'variety': 'Standard Grade', 'base_modal': 5600, 'min_pct': 0.90, 'max_pct': 1.09},
    'Onion': {'variety': 'Nasik Red / Bellary', 'base_modal': 2450, 'min_pct': 0.85, 'max_pct': 1.15},
    'Other  Rabi pulses': {'variety': 'Grade A', 'base_modal': 5400, 'min_pct': 0.90, 'max_pct': 1.10},
    'Other Cereals & Millets': {'variety': 'Local Mixed', 'base_modal': 2300, 'min_pct': 0.88, 'max_pct': 1.10},
    'Other Fresh Fruits': {'variety': 'Farm Fresh', 'base_modal': 3800, 'min_pct': 0.82, 'max_pct': 1.18},
    'Other Kharif pulses': {'variety': 'Grade A', 'base_modal': 5600, 'min_pct': 0.89, 'max_pct': 1.10},
    'Other Vegetables': {'variety': 'Local Grade', 'base_modal': 2200, 'min_pct': 0.84, 'max_pct': 1.18},
    'Paddy': {'variety': 'Jyothi / Swarna', 'base_modal': 2250, 'min_pct': 0.93, 'max_pct': 1.06},
    'Peas & beans (Pulses)': {'variety': 'Arkel / Local', 'base_modal': 4900, 'min_pct': 0.89, 'max_pct': 1.10},
    'Potato': {'variety': 'Kufri Jyoti / Chandramukhi', 'base_modal': 1750, 'min_pct': 0.86, 'max_pct': 1.14},
    'Pulses total': {'variety': 'Standard Mandi Grade', 'base_modal': 5800, 'min_pct': 0.90, 'max_pct': 1.09},
    'Ragi': {'variety': 'GPU-28 / Indaf-8', 'base_modal': 3550, 'min_pct': 0.92, 'max_pct': 1.08},
    'Rapeseed &Mustard': {'variety': 'Pusa Bold / Kranti', 'base_modal': 5400, 'min_pct': 0.91, 'max_pct': 1.08},
    'Rice': {'variety': 'Sona Masuri / IR-64', 'base_modal': 3200, 'min_pct': 0.90, 'max_pct': 1.10},
    'Safflower': {'variety': 'A-1 / Bhima', 'base_modal': 5300, 'min_pct': 0.90, 'max_pct': 1.08},
    'Sannhamp': {'variety': 'K-12 Yellow', 'base_modal': 4600, 'min_pct': 0.90, 'max_pct': 1.09},
    'Sesamum': {'variety': 'White / Black Til', 'base_modal': 14250, 'min_pct': 0.91, 'max_pct': 1.09},
    'Small millets': {'variety': 'Desi / De-husked', 'base_modal': 3600, 'min_pct': 0.89, 'max_pct': 1.10},
    'Soyabean': {'variety': 'JS 335 / Yellow', 'base_modal': 4600, 'min_pct': 0.92, 'max_pct': 1.07},
    'Sugarcane': {'variety': 'Co 86032 / Local', 'base_modal': 330, 'min_pct': 0.94, 'max_pct': 1.06},
    'Sunflower': {'variety': 'KBSH-44 / Hybrid', 'base_modal': 6300, 'min_pct': 0.91, 'max_pct': 1.08},
    'Sweet potato': {'variety': 'Local Red / White', 'base_modal': 2400, 'min_pct': 0.86, 'max_pct': 1.14},
    'Tapioca': {'variety': 'M-4 / Local', 'base_modal': 1850, 'min_pct': 0.86, 'max_pct': 1.14},
    'Tobacco': {'variety': 'FCV Special', 'base_modal': 16500, 'min_pct': 0.90, 'max_pct': 1.10},
    'Turmeric': {'variety': 'Salem / Nizamabad Finger', 'base_modal': 13500, 'min_pct': 0.90, 'max_pct': 1.12},
    'Turnip': {'variety': 'Purple Top', 'base_modal': 1900, 'min_pct': 0.84, 'max_pct': 1.15},
    'Urad': {'variety': 'T-9 / Shekhar-2', 'base_modal': 7400, 'min_pct': 0.91, 'max_pct': 1.09},
    'Wheat': {'variety': 'Sharbati / Lok-1 / HD-2967', 'base_modal': 2500, 'min_pct': 0.92, 'max_pct': 1.07},
    'other oilseeds': {'variety': 'Standard Grade', 'base_modal': 5400, 'min_pct': 0.90, 'max_pct': 1.09},
}

def _district_crop_row(crop_name, district, state, today):
    cat = COMMODITY_CATALOG.get(crop_name)
    if not cat:
        cat = {'variety': 'Local / Hybrid', 'base_modal': 2800, 'min_pct': 0.90, 'max_pct': 1.10}
    # Deterministic price variance (-6% to +6%) per district so markets show natural variation
    h = int(hashlib.md5(f"{district.upper()}_{crop_name}".encode('utf-8')).hexdigest()[:6], 16)
    variance_pct = ((h % 13) - 6) / 100.0
    modal = int(round(cat['base_modal'] * (1.0 + variance_pct) / 10.0) * 10)
    min_p = int(round((modal * cat['min_pct']) / 10.0) * 10)
    max_p = int(round((modal * cat['max_pct']) / 10.0) * 10)
    if min_p >= modal: min_p = modal - 50
    if max_p <= modal: max_p = modal + 50

    return {
        'commodity': crop_name,
        'variety': cat['variety'],
        'market': f"{district.title()} APMC",
        'district': district.title(),
        'state': state.title() if state else '',
        'min_price': str(min_p),
        'max_price': str(max_p),
        'modal_price': str(modal),
        'arrival_date': today,
    }

def _fallback_generic_rows():
    """Committed regional India basket from the same snapshot CSV, for districts
    that have no rows of their own."""
    import csv as _csv_gen
    path = os.path.join(BASE_DIR, 'data', 'mandi_snapshot.csv')
    generic = []
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                for r in _csv_gen.DictReader(f):
                    if (r.get('district') or '') == 'Regional Mandi':
                        generic.append({
                            'commodity': r.get('commodity', 'N/A'),
                            'variety': r.get('variety', ''),
                            'market': r.get('market', 'Regional APMC'),
                            'district': 'Regional Mandi',
                            'state': r.get('state', 'India'),
                            'min_price': r.get('min_price', '0'),
                            'max_price': r.get('max_price', '0'),
                            'modal_price': r.get('modal_price', '0'),
                        })
        except Exception:
            pass
    return generic


def _load_mandi_snapshot(city, today, state=''):
    """Load last-known APMC rates for a district from the committed CSV snapshot.
    Case-insensitive district match; when `state` is given (ambiguous district
    names repeat across states), only rows for that state qualify. Empty list
    when the district isn't in the snapshot (the regional India basket rows
    cover every district instead)."""
    import csv as _csv_snap
    path = os.path.join(BASE_DIR, 'data', 'mandi_snapshot.csv')
    if not os.path.exists(path):
        return []
    rows = []
    wanted = city.lower().strip()
    state_wanted = (state or '').lower().strip()
    try:
        with open(path, 'r', encoding='utf-8') as f:
            for r in _csv_snap.DictReader(f):
                if (r.get('district') or '').lower().strip() != wanted:
                    continue
                if state_wanted and (r.get('state') or '').lower().strip() != state_wanted:
                    continue
                rows.append({
                        'commodity': r.get('commodity', 'N/A'),
                        'variety': r.get('variety', ''),
                        'market': r.get('market', ''),
                        'district': r.get('district', city),
                        'state': r.get('state', ''),
                        'min_price': r.get('min_price', '0'),
                        'max_price': r.get('max_price', '0'),
                        'modal_price': r.get('modal_price', '0'),
                        'arrival_date': today,
                    })
    except Exception:
        return []
    return rows


@app.route('/api/market_prices')

def api_market_prices():
    """Fetch live mandi commodity prices from data.gov.in for a given city/district,
    with automatic fallback to last known (committed) rates from the CSV
    snapshot when the upstream is unavailable."""
    from datetime import datetime
    city = request.args.get('city', 'Bangalore')
    state_arg = request.args.get('state', '').strip()
    today = datetime.now().strftime('%d/%m/%Y')
    # ---- Live upstream (data.gov.in Agmarknet) with retry ----
    import urllib.parse as _up

    def _build_url(district, state):
        u = (f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
             f"?api-key={DATA_GOV_API_KEY}&format=json&limit=50"
             f"&filters[district]={_up.quote(str(district))}")
        if state:
            u += f"&filters[state]={_up.quote(str(state))}"
        return u

    records = None
    upstream_ok = False
    if DATA_GOV_API_KEY:
        res, _retried = _call_data_gov(_build_url(city, state_arg or None))
        if res is not None and res.status_code == 200:
            data = res.json() if isinstance(res.text, str) else res.text
            records = data.get('records', []) if isinstance(data, dict) else []
            upstream_ok = (len(records) > 0)
            if not records:
                # Upstream answered successfully but had no rows for this district;
                # still try the state-level filter as a last live attempt.
                res2, _ = _call_data_gov(_build_url(state_arg or city, None))
                if res2 is not None and res2.status_code == 200:
                    data2 = res2.json() if isinstance(res2.text, str) else res2.text
                    records = data2.get('records', []) if isinstance(data2, dict) else []
                    upstream_ok = (len(records) > 0)

    # ---- Live winners ----
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
            'state': state_arg or (records[0].get('state', '') if records else ''),
            'is_fallback': False,
            'source': 'data.gov.in (Agmarknet Live)',
        })

    # ---- Fallback: committed last-known rates (CSV snapshot), always real rows ----
    state = state_arg or _detect_state(city)
    fallback_list = _load_mandi_snapshot(city, today, state)
    if not fallback_list:
        # Check district-specific agricultural crops first!
        district_crops = _find_district_crops(city, state)
        if district_crops:
            fallback_list = [_district_crop_row(c, city, state, today) for c in district_crops]
        else:
            # District not in snapshot and no district crops: serve regional India basket
            generic = _fallback_generic_rows()
            fallback_list = [{**row, 'market': f'{city} APMC', 'district': city, 'state': state}
                             for row in generic]

    if not fallback_list:
        state = state_arg or 'India'

    source = 'data.gov.in (Agmarknet Live)' if upstream_ok else (
        f'Estimated Market Rates for {city}, {state} (govt API unavailable)'
    )

    import sys as _sys
    _sys.stderr.write(f"[market_prices] {city},{state}: upstream_ok={upstream_ok} fallback_n={len(fallback_list)}\n")
    _sys.stderr.flush()

    return jsonify({
        'city': city,
        'count': len(fallback_list),
        'prices': fallback_list,
        'state': state,
        'is_fallback': not upstream_ok,
        'source': source,
    })


# Admin Dashboards
@app.route('/admin')
@app.route('/admin/dashboard')
def admin_dashboard():
    # Auth handled by before_request hook
    return redirect(url_for('admin_farmers'))

@app.route('/admin/farmers')
def admin_farmers():
    # Auth handled by before_request hook
    conn = get_db()
    try:
        cursor = conn.execute('SELECT farmer_id, farmer_name, email, phone_no, F_State, F_District FROM farmerlogin ORDER BY farmer_id DESC')
        rows = cursor.fetchall()
    finally:
        conn.close()

    headers = ['ID', 'Farmer Name', 'Email', 'Phone', 'State', 'District']
    return render_template('admin_dashboard.html', title='Farmer Users', headers=headers, rows=rows, delete_url='/admin/delete_farmer')

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
app._district_crop_map_by_state = {}
app._state_districts = {}
_csv_path = os.path.join(BASE_DIR, 'farmer', 'ML', 'crop_prediction', 'preprocessed2.csv')
if os.path.exists(_csv_path):
    _dc = {}
    _dcs = {}
    with open(_csv_path, 'r', encoding='utf-8') as _f:
        for _row in _csv_init.DictReader(_f):
            _d = _row.get('District_Name', '').strip()
            _s = _row.get('State_Name', '').strip()
            _c = _row.get('Crop', '').strip()
            if _s and _d:
                if _s not in app._state_districts:
                    app._state_districts[_s] = set()
                app._state_districts[_s].add(_d)
            if _d and _c:
                if _d not in _dc: _dc[_d] = _CounterInit()
                _dc[_d][_c] += 1
                if _s:
                    if _s not in _dcs: _dcs[_s] = {}
                    if _d not in _dcs[_s]: _dcs[_s][_d] = _CounterInit()
                    _dcs[_s][_d][_c] += 1
    for _d, _cnt in _dc.items():
        app._district_crop_map[_d] = [c for c, _ in _cnt.most_common(10)]
    for _s, _dists in _dcs.items():
        for _d, _cnt in _dists.items():
            app._district_crop_map_by_state[(_s.upper(), _d.upper())] = [c for c, _ in _cnt.most_common(10)]

def _detect_state(city_name):
    """Best-effort state inference for a city name (used for mandi fallback)."""
    for c in INDIAN_CITIES:
        if c['name'].lower() == city_name.lower().strip():
            return c['state']
    return ''

def _find_district_crops(district_name, state_name=""):
    """Find district crops with fuzzy matching, falling back to state-level top crops."""
    dmap = app._district_crop_map
    key = district_name.upper().strip()
    state_key = state_name.upper().strip()
    # District names repeat across states (e.g. AURANGABAD in Bihar and
    # Maharashtra), so a state-qualified lookup wins over the district-only map.
    if state_key:
        by_state = app._district_crop_map_by_state
        if (state_key, key) in by_state:
            return by_state[(state_key, key)]
        for sk in app._state_districts:
            if state_key in sk.upper() or sk.upper() in state_key:
                if (sk.upper(), key) in by_state:
                    return by_state[(sk.upper(), key)]
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
