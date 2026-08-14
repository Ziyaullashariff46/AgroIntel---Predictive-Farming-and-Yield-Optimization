# 🌱 AgroIntel — Predictive Farming & Yield Optimization Platform

<p align="center">
  <strong>An AI-powered smart agriculture platform that empowers farmers with data-driven insights for crop selection, fertilizer optimization, yield forecasting, rainfall estimation, and real-time market intelligence.</strong>
</p>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Core Features — AI Science Suite](#-core-features--ai-science-suite)
   - [Smart Crop Recommendation](#1--smart-crop-recommendation)
   - [Fertilizer Advisory System](#2--fertilizer-advisory-system)
   - [Price Trend Predictor](#3--price-trend-predictor)
   - [Yield Harvest Forecast](#4--yield-harvest-forecast)
   - [Rainfall Estimation](#5--rainfall-estimation)
   - [Live Weather Forecast](#6--live-weather-forecast)
   - [Live Mandi Prices (Market Intelligence)](#7--live-mandi-prices-market-intelligence)
3. [User Roles & Authentication](#-user-roles--authentication)
4. [Technology Stack](#-technology-stack)
5. [System Architecture & Data Flow](#-system-architecture--data-flow)
6. [Project File Structure](#-project-file-structure)
7. [ML Datasets & Models — Detailed Breakdown](#-ml-datasets--models--detailed-breakdown)
8. [Database Schema](#-database-schema)
9. [API Integrations](#-api-integrations)
10. [UI/UX Design System](#-uiux-design-system)
11. [Installation & Setup](#-installation--setup)
12. [Sample Login Credentials](#-sample-login-credentials)
13. [Utility Scripts](#-utility-scripts)
14. [Screenshots & Use Cases](#-screenshots--use-cases)
15. [Recent Architecture Changes](#-recent-architecture-changes)

---

## 🌍 Project Overview

AgroIntel is a **Final Year Project** built to address a critical gap in Indian agriculture: the disconnect between modern data science and on-the-ground farming decisions. By combining **five different Machine Learning models** with **real-time external APIs** (OpenWeatherMap, Agmarknet/data.gov.in) and a **115-year historical rainfall dataset from the India Meteorological Department (IMD)**, the platform provides actionable intelligence on:

- **What to grow** (Crop Recommendation)
- **How to nourish it** (Fertilizer Advisory)
- **What it will yield** (Yield Forecast)
- **What the weather will be** (Weather & Rainfall)
- **What the market pays** (Live Mandi Prices & Price Trend Prediction)

The entire platform runs as a standalone **Python Flask web application** backed by an **SQLite database**, requiring no external server infrastructure.

---

## 🧠 Core Features — AI Science Suite

Each tool in the AI Science Suite is accessible via the Farmer Portal's sidebar navigation. Every tool includes a **"Model Intelligence" section** that transparently explains which ML model is being used and on what basis the recommendation is generated.

---

### 1. 🌾 Smart Crop Recommendation

| Property | Detail |
|---|---|
| **Route** | `/farmer/crop_recommendation` |
| **ML Model** | Random Forest Classifier (Supervised Ensemble) |
| **Estimators** | 100 Decision Trees with Entropy criterion |
| **Training Data** | `Crop_recommendation.csv` — 2,200 records of Indian agricultural data |
| **Input Features** | Nitrogen (N), Phosphorus (P), Potassium (K), Temperature (°C), Humidity (%), Soil pH, Rainfall (mm) |
| **Output** | The single best crop to plant (e.g., "Rice", "Maize", "Coffee") |

**How it works:**
1. The farmer adjusts 7 input parameters via interactive sliders and number fields.
2. Quick soil presets are available (Paddy Rice, Maize Loam, Cotton Alluvial, Sugarcane, Coffee & Spice) to auto-fill typical soil profiles.
3. On submission, the backend loads `Crop_recommendation.csv`, splits data 80/20 (train/test), fits a `RandomForestClassifier` with 100 estimators, and predicts the best crop.
4. The result is displayed as a large gradient-text heading with an emerald glow card.

**Recommendation Basis:**
- Soil macro-nutrient ratio (N:P:K balance)
- Ambient temperature and relative air humidity
- Soil pH level (acidity vs. alkalinity)
- Total seasonal rainfall

---

### 2. 🧪 Fertilizer Advisory System

| Property | Detail |
|---|---|
| **Route** | `/farmer/fertilizer_recommendation` |
| **ML Model** | Decision Tree Classifier |
| **Training Data** | `fertilizer_recommendation.csv` — curated soil-nutrient-to-fertilizer mapping |
| **Input Features** | Temperature, Humidity, Soil Moisture, Soil Type (5 types), Crop Type (11 types), Nitrogen, Potassium, Phosphorous |
| **Output** | The optimal fertilizer name (e.g., "Urea", "DAP", "14-35-14", "28-28", "17-17-17") |

**How it works:**
1. The farmer selects their soil type (Sandy, Loamy, Black, Red, Clayey) and crop type from dropdowns.
2. They enter 6 numeric parameters: Temperature, Humidity, Soil Moisture, N, P, K.
3. Categorical inputs (Soil Type, Crop Type) are encoded using `LabelEncoder`. Unknown labels gracefully default to the first category.
4. A `DecisionTreeClassifier` is trained on the full dataset and predicts the best fertilizer.

**Advisory Basis:**
- Soil composition analysis (sand, clay, loam, red, black)
- Current nutrient deficiencies (N, P, K imbalance)
- Crop-specific nutritional demands
- Environmental stress factors (temperature, humidity, moisture)

---

### 3. 📈 Price Trend Predictor

| Property | Detail |
|---|---|
| **Route** | `/farmer/crop_prediction` |
| **ML Model** | Custom Decision Tree (serialized pickle model) |
| **Training Data** | `preprocessed2.csv` — 11.55 MB dataset of historical Indian crop market prices |
| **Model File** | `filetest2.pkl` — pre-trained serialized decision tree (~380 KB) |
| **Input Features** | State, District, Season (Kharif/Rabi/Whole Year/Summer) |
| **Output** | Top 5 crops with demand indicators (High/Medium) |

**How it works:**
1. The farmer selects State, District, and Season via cascading dropdowns (powered by `state_district_crops_dropdown.js` — a 44 KB JavaScript file containing every Indian state, district, and crop mapping).
2. The backend executes `ZDecision_Tree_Model_Call.py` as a subprocess, which loads the pre-trained pickle model and traverses the custom decision tree.
3. If the subprocess fails or times out (15s limit), a graceful seasonal fallback provides sensible crop recommendations (e.g., Kharif → Rice, Maize, Cotton, Bajra, Groundnut).

**Prediction Basis:**
- Historical crop market price trends across Indian districts
- Seasonal demand patterns (monsoon vs. winter vs. summer crops)
- Regional agricultural suitability based on district-level data

---

### 4. 🌾 Yield Harvest Forecast

| Property | Detail |
|---|---|
| **Route** | `/farmer/yield_prediction` |
| **ML Model** | Random Forest Regressor |
| **Estimators** | 50 Decision Trees |
| **Training Data** | `crop_production_karnataka.csv` — 1.12 MB dataset of Karnataka state crop production records |
| **Input Features** | State Name, District Name, Season, Crop, Area (hectares) |
| **Output** | Estimated production output (in tonnes) |

**How it works:**
1. The farmer enters their location (State, District), season, crop, and farm area in hectares.
2. The dataset is loaded, NaN production rows are dropped, and categorical columns (State, District, Season, Crop) are one-hot encoded using `OneHotEncoder` with `handle_unknown='ignore'`.
3. Numeric features (Area) are concatenated with the encoded features via `np.hstack`.
4. A `RandomForestRegressor` is trained and predicts the production output.
5. On failure, a fallback estimate of `Area × 2.85 tonnes` is returned.

**Forecast Basis:**
- District-level historical production data
- Crop-specific yield-per-hectare averages
- Seasonal impact on production (Kharif, Rabi, Summer)
- Farm area as the primary scaling factor

---

### 5. 🌧️ Rainfall Estimation

| Property | Detail |
|---|---|
| **Route** | `/farmer/rainfall_prediction` |
| **Method** | Historical Time-Series Mean Analysis |
| **Training Data** | `rainfall_in_india_1901-2015.csv` — 115 years of IMD subdivision-level monthly rainfall data (~515 KB) |
| **Input Features** | Meteorological Subdivision (36 zones), Target Month (Jan–Dec) |
| **Output** | Average monthly rainfall in millimeters (mm) |

**How it works:**
1. The page auto-detects the farmer's geolocation and maps it to the nearest IMD meteorological zone using reverse geocoding (OpenStreetMap Nominatim API).
2. Quick region preset chips allow one-click selection of common zones (Coastal Karnataka, Tamil Nadu, Kerala, Konkan & Goa, Telangana, N. Interior Karnataka).
3. On form submission, the backend filters the 115-year dataset by subdivision and computes the mean rainfall for the target month across all recorded years (1901–2015).
4. The result is displayed as a hero card with contextual badges:
   - `> 300mm` → "Very Heavy Rainfall Zone"
   - `> 150mm` → "Moderate–Heavy Rainfall"
   - `> 50mm` → "Light–Moderate Rainfall"
   - `≤ 50mm` → "Low Rainfall / Dry Period"
5. A live 5-day precipitation forecast strip (from OpenWeather API) is shown below the form.

**Estimation Basis:**
- 115 years of monsoonal seasonality patterns
- Subdivisional topography (coastal vs. interior vs. Himalayan)
- Long-term precipitation trend analysis

---

### 6. ☀️ Live Weather Forecast

| Property | Detail |
|---|---|
| **Route** | `/farmer/weather_forecast` |
| **Data Source** | OpenWeatherMap API (Current Weather + 5-Day/3-Hour Forecast) |
| **Key Features** | Auto GPS detection, city search, nearby city suggestions, 7-day forecast cards |

**How it works:**
1. On page load, the browser requests GPS permission. If granted, current coordinates are sent to `/api/weather/coords/<lat>/<lon>`.
2. The backend fetches current weather (temperature, feels-like, humidity, pressure, wind speed, visibility, sunrise/sunset) and 5-day forecast data from OpenWeather.
3. Forecast data is aggregated into daily summaries (high/low temps, most common weather condition, total rain in mm).
4. If the API fails, a realistic fallback forecast is generated with sensible Indian weather data.
5. Nearby cities are fetched via the `/api/nearby_cities/<lat>/<lon>` endpoint using the Haversine formula against a curated database of 40+ major Indian cities.
6. Users can search any city worldwide or click nearby city chips.

**API Endpoints used internally:**
- `GET /api/weather/coords/<lat>/<lon>` — Weather by coordinates
- `GET /api/weather/city/<city_name>` — Weather by city name
- `GET /api/nearby_cities/<lat>/<lon>` — 6 nearest Indian cities

---

### 7. 💰 Live Mandi Prices (Market Intelligence)

| Property | Detail |
|---|---|
| **Route** | `/farmer/market_prices` |
| **Data Source** | Agmarknet via `data.gov.in` API (Resource ID: `9ef84268-d588-465a-a308-a864a43d0070`) |
| **Key Features** | Live district search, auto-location detect, commodity highlight cards, full price table |

**How it works:**
1. The page auto-loads prices for "Udupi" on first visit.
2. Users can search by city/district name or click preset chips (Udupi, Bangalore, Mumbai, Delhi, Nashik, Pune, Hyderabad).
3. The "My Location" button uses GPS + reverse geocoding to find the nearest market.
4. The backend (`/api/market_prices?city=X`) queries the data.gov.in API:
   - First tries district-level filter.
   - If no results, falls back to state-level filter.
5. Results display: commodity name, variety, market, district, state, min/max/modal prices (₹/quintal), and arrival date.
6. Top 6 commodities are shown as highlight cards with hover animations.
7. If the live API is unavailable, a curated **fallback database** of last-known APMC rates for major cities (Bangalore, Mumbai, Delhi, Udupi, Pune, Nashik, Hyderabad, Chennai) is served.

---

## 🔐 User Roles & Authentication

AgroIntel supports two active user roles with session-based authentication:

### Farmer Portal
- **Login**: `/login/farmer` — Authenticates against `farmerlogin` table using email + password.
- **Registration**: `/register/farmer` — Creates a new farmer account with name, email, phone, password, state, district, gender, and birthday.
- **Session Data**: `user_type`, `farmer_id`, `farmer_name`, `farmer_email`.
- **Default Redirect**: `/farmer/crop_recommendation` (first AI tool).
- **Access**: All 7 AI Science Suite tools + Market Intelligence.

### Admin Portal
- **Login**: `/login/admin` — Authenticates against `admin` table using username + password.
- **Session Data**: `user_type`, `admin_id`, `admin_name`.
- **Default Redirect**: `/admin/farmers` (user management dashboard).
- **Access**: View all registered farmers, view all contact messages, delete users/messages.

### Logout
- **Route**: `/logout` — Clears the Flask session and redirects to the landing page.

> **Note**: The buyer/customer marketplace has been retired. Accessing `/login/customer` automatically redirects to the farmer login with an informational banner.

---

## 🚀 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | Python 3.9+ / Flask 2.x | Web server, routing, session management, ML orchestration |
| **Machine Learning** | Scikit-Learn 1.x | Random Forest, Decision Tree, LabelEncoder, OneHotEncoder, train_test_split |
| **Data Processing** | Pandas 1.x, NumPy 1.x | CSV loading, data filtering, array manipulation |
| **Database** | SQLite 3 | User authentication, contact form storage |
| **Frontend** | HTML5, Vanilla CSS, Vanilla JavaScript | Templates, design system, interactive forms |
| **Templating** | Jinja2 (Flask built-in) | Server-side HTML rendering with template inheritance |
| **CSS Framework** | Custom `modern-agrointel.css` + CreativeTim Argon base | Glassmorphism design system with 130+ custom properties |
| **Icons** | Font Awesome 6 + Nucleo Icons | UI iconography |
| **External APIs** | OpenWeatherMap, data.gov.in, OpenStreetMap Nominatim | Live weather, mandi prices, reverse geocoding |
| **Environment** | python-dotenv | Secure API key management via `.env` files |
| **Serialization** | joblib / pickle | Pre-trained decision tree model storage |

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Landing Page │  │ Login/Register│  │   Farmer Portal        │ │
│  │ (index.html) │  │ (login.html) │  │   (farmer_base.html)   │ │
│  └──────┬──────┘  └──────┬───────┘  └────────┬───────────────┘ │
└─────────┼────────────────┼───────────────────┼─────────────────┘
          │                │                   │
          ▼                ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FLASK WEB SERVER (app.py)                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  ROUTE HANDLERS                           │   │
│  │  /                          → index.html                  │   │
│  │  /login/<role>              → login.html                  │   │
│  │  /register/<role>           → register.html               │   │
│  │  /logout                    → session.clear()             │   │
│  │  /contact                   → contact.html                │   │
│  │  /farmer/crop_recommendation → crop_recommendation.html   │   │
│  │  /farmer/fertilizer_recommendation → fertilizer_rec.html  │   │
│  │  /farmer/crop_prediction    → crop_prediction.html        │   │
│  │  /farmer/yield_prediction   → yield_prediction.html       │   │
│  │  /farmer/rainfall_prediction→ rainfall_prediction.html    │   │
│  │  /farmer/weather_forecast   → weather_forecast.html       │   │
│  │  /farmer/market_prices      → market_prices.html          │   │
│  │  /admin/farmers             → admin_dashboard.html        │   │
│  │  /admin/messages            → admin_dashboard.html        │   │
│  │  /api/weather/coords/<>/<>  → JSON response               │   │
│  │  /api/weather/city/<>       → JSON response               │   │
│  │  /api/nearby_cities/<>/<>   → JSON response               │   │
│  │  /api/market_prices?city=   → JSON response               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ ML PIPELINE     │  │ SQLITE DB    │  │ EXTERNAL APIS      │ │
│  │ ┌─────────────┐ │  │              │  │                    │ │
│  │ │ Load CSV    │ │  │ farmerlogin  │  │ OpenWeatherMap     │ │
│  │ │ Preprocess  │ │  │ admin        │  │  └─ Current Wx     │ │
│  │ │ Train Model │ │  │ custlogin    │  │  └─ 5-Day Forecast │ │
│  │ │ Predict     │ │  │ contactus    │  │                    │ │
│  │ └─────────────┘ │  │              │  │ data.gov.in        │ │
│  └─────────────────┘  └──────────────┘  │  └─ Agmarknet APMC│ │
│                                          │                    │ │
│                                          │ Nominatim (OSM)    │ │
│                                          │  └─ Reverse Geocode│ │
│                                          └────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow for a Crop Recommendation Request

```
User fills form (N, P, K, Temp, Humidity, pH, Rainfall)
    │
    ▼
POST /farmer/crop_recommendation
    │
    ▼
Flask route handler in app.py
    │
    ├─ Loads Crop_recommendation.csv (2,200 rows × 8 columns)
    ├─ Converts to NumPy arrays via .to_numpy()
    ├─ Splits 80/20 train/test
    ├─ Fits RandomForestClassifier (100 trees, entropy)
    ├─ Creates user_input array [[N, P, K, T, H, pH, R]]
    ├─ Calls classifier.predict(user_input)
    │
    ▼
Returns prediction string (e.g., "rice")
    │
    ▼
Renders crop_recommendation.html with result="{{ result }}"
    │
    ▼
User sees gradient-text crop name in glowing result card
```

### Data Flow for Live Weather

```
Browser requests GPS permission
    │
    ▼
navigator.geolocation.getCurrentPosition()
    │
    ▼
JavaScript sends fetch('/api/weather/coords/{lat}/{lon}')
    │
    ▼
Flask route: api_weather_coords(lat, lon)
    │
    ├─ Calls OpenWeather Current Weather API
    ├─ Calls OpenWeather 5-Day Forecast API
    ├─ Aggregates forecast into daily summaries
    ├─ Maps weather icon codes to Font Awesome classes
    │
    ▼
Returns JSON: { current: {...}, forecast: [...], is_fallback: false }
    │
    ▼
JavaScript renders weather cards, forecast strip, and detail panels
```

### Data Flow for Live Mandi Prices

```
User types city name or clicks preset chip
    │
    ▼
JavaScript sends fetch('/api/market_prices?city={city}')
    │
    ▼
Flask route: api_market_prices()
    │
    ├─ Queries data.gov.in API (district filter)
    ├─ If no results → Queries data.gov.in API (state filter)
    ├─ If API fails → Serves FALLBACK_MANDI_PRICES dict
    │
    ▼
Returns JSON: { city, count, prices: [...], is_fallback, source }
    │
    ▼
JavaScript renders:
    ├─ Status bar (city, count, source badges)
    ├─ Top 6 commodity highlight cards
    └─ Full price table (commodity, variety, market, min/max/modal ₹)
```

---

## 📁 Project File Structure

```
AgroIntel/
│
├── .env                              # API keys (OPENWEATHER, DATA_GOV, FLASK_SECRET)
├── .gitignore                        # Excludes .env from version control
├── README.md                         # This documentation file
├── SAMPLE_LOGINS.md                  # Quick-start test credentials
├── requirements.txt                  # Python dependencies
│
├── app.py                            # ★ Main Flask application (782 lines)
│                                     #   - All routes, ML pipelines, API endpoints
│                                     #   - Authentication, session management
│                                     #   - Fallback mandi price database
│                                     #   - Indian cities geolocation database
│                                     #   - Weather icon mapping
│
├── run.py                            # One-click launcher (auto-init DB + open browser)
├── init_db.py                        # SQLite database schema initializer
├── seed_sample_users.py              # Seeds default admin/farmer/buyer test accounts
├── agrointel.db                      # SQLite database file (auto-generated)
│
├── create_report.py                  # Generates Word document project report (.docx)
├── generate_ppt.py                   # Generates PowerPoint presentation (.pptx)
│
├── templates/                        # Jinja2 HTML templates (14 files)
│   ├── base.html                     #   Master layout: navbar, CSS, JS, theme toggle
│   ├── index.html                    #   Landing page: hero, features, login CTAs
│   ├── login.html                    #   Role-based login form (farmer/admin)
│   ├── register.html                 #   Farmer registration form
│   ├── contact.html                  #   Contact us form
│   ├── farmer_base.html              #   Farmer portal layout: sidebar + main content
│   ├── crop_recommendation.html      #   AI Tool: Crop Recommendation
│   ├── fertilizer_recommendation.html#   AI Tool: Fertilizer Advisory
│   ├── crop_prediction.html          #   AI Tool: Price Trend Predictor
│   ├── yield_prediction.html         #   AI Tool: Yield Harvest Forecast
│   ├── rainfall_prediction.html      #   AI Tool: Rainfall Estimation
│   ├── weather_forecast.html         #   Live Weather Forecast
│   ├── market_prices.html            #   Live Mandi Prices
│   └── admin_dashboard.html          #   Admin: User/Message management tables
│
├── assets/                           # Static frontend assets
│   ├── css/
│   │   ├── modern-agrointel.css      #   ★ Custom design system (29 KB, 1050+ lines)
│   │   ├── creativetim.min.css       #   Base UI framework (414 KB)
│   │   ├── nucleo-icons.css          #   Icon font styles
│   │   ├── nucleo-svg.css            #   SVG icon helpers
│   │   └── footer.css                #   Footer layout
│   ├── js/
│   │   ├── state_district_crops_dropdown.js  # State→District→Crop cascading selects (44 KB)
│   │   └── TradeCrops.js             #   Dynamic crop trade utilities
│   ├── fonts/                        # Nucleo icon font files (eot, ttf, woff, woff2, svg)
│   └── img/                          # 21 image assets (logos, icons, hero images)
│       ├── logo.png                  #   AgroIntel logo
│       ├── farmers.png               #   Farmer hero image (1 MB)
│       ├── agri.png                  #   Agriculture illustration
│       └── ...                       #   Tech stack logos, admin/customer icons
│
└── farmer/                           # Farmer-specific resources
    ├── static/                       #   (Empty — assets served from /assets/)
    └── ML/                           #   ★ Machine Learning datasets & models
        ├── crop_recommendation/
        │   ├── Crop_recommendation.csv       # 2,200 rows × 8 cols (146 KB)
        │   └── recommend.py                  # Standalone RF training script
        ├── fertilizer_recommendation/
        │   ├── fertilizer_recommendation.csv # Soil-nutrient-fertilizer map (3.7 KB)
        │   └── fertilizer_recommendation.py  # Standalone DTC training script
        ├── crop_prediction/
        │   ├── preprocessed2.csv             # Historical market prices (11.55 MB)
        │   ├── filetest2.pkl                 # Pre-trained Decision Tree pickle (380 KB)
        │   ├── ZDecision_Tree_Model.py       # Model training script
        │   └── ZDecision_Tree_Model_Call.py  # CLI prediction interface
        ├── yield_prediction/
        │   ├── crop_production_karnataka.csv  # Karnataka crop production (1.12 MB)
        │   └── yield_prediction.py           # Standalone yield predictor
        └── rainfall_prediction/
            ├── rainfall_in_india_1901-2015.csv # IMD 115-year rainfall (515 KB)
            └── rainfall_prediction.py         # Standalone rainfall predictor
```

---

## 🗄️ ML Datasets & Models — Detailed Breakdown

### Dataset 1: `Crop_recommendation.csv`
| Column | Type | Range | Description |
|---|---|---|---|
| N | Float | 0–140 | Nitrogen content in soil (kg/ha) |
| P | Float | 5–145 | Phosphorus content in soil (kg/ha) |
| K | Float | 5–205 | Potassium content in soil (kg/ha) |
| temperature | Float | 8.8–43.7 | Ambient temperature (°C) |
| humidity | Float | 14.3–99.9 | Relative humidity (%) |
| ph | Float | 3.5–9.9 | Soil pH level |
| rainfall | Float | 20.2–298.6 | Annual rainfall (mm) |
| label | String | 22 classes | Target crop name (rice, wheat, maize, etc.) |

### Dataset 2: `fertilizer_recommendation.csv`
| Column | Type | Description |
|---|---|---|
| Temparature | Integer | Ambient temperature (°C) |
| Humidity | Integer | Relative humidity (%) |
| Soil Moisture | Integer | Soil moisture percentage |
| Soil Type | String | Sandy / Loamy / Black / Red / Clayey |
| Crop Type | String | Maize / Sugarcane / Cotton / Tobacco / Paddy / Barley / Wheat / Millets / Oil seeds / Pulses / Ground Nuts |
| Nitrogen | Integer | Nitrogen level in soil |
| Potassium | Integer | Potassium level in soil |
| Phosphorous | Integer | Phosphorous level in soil |
| Fertilizer Name | String | Target: Urea / DAP / 14-35-14 / 28-28 / 17-17-17 / 20-20 / 10-26-26 |

### Dataset 3: `preprocessed2.csv`
- **Size**: 11.55 MB — extensive historical crop market price data across Indian states and districts.
- **Used by**: Price Trend Predictor (via pre-trained pickle model `filetest2.pkl`).

### Dataset 4: `crop_production_karnataka.csv`
| Column | Type | Description |
|---|---|---|
| State_Name | String | State (Karnataka) |
| District_Name | String | District name |
| Crop_Year | Integer | Year of production (dropped during training) |
| Season | String | Kharif / Rabi / Whole Year / Summer |
| Crop | String | Crop name |
| Area | Float | Cultivated area in hectares |
| Production | Float | Target: Production output in tonnes |

### Dataset 5: `rainfall_in_india_1901-2015.csv`
| Column | Type | Description |
|---|---|---|
| SUBDIVISION | String | IMD meteorological zone (36 zones) |
| YEAR | Integer | Year (1901–2015) |
| JAN–DEC | Float | Monthly rainfall columns in mm |
| ANNUAL | Float | Total annual rainfall |
| Jan-Feb, Mar-May, Jun-Sep, Oct-Dec | Float | Seasonal aggregates |

---

## 🗃️ Database Schema

AgroIntel uses **SQLite** with 4 tables:

### `farmerlogin`
| Column | Type | Description |
|---|---|---|
| farmer_id | INTEGER (PK) | Auto-increment primary key |
| farmer_name | TEXT | Full name |
| password | TEXT | Plain-text password |
| email | TEXT | Login email |
| phone_no | TEXT | Phone number |
| F_gender | TEXT | Gender |
| F_birthday | TEXT | Date of birth |
| F_State | TEXT | State |
| F_District | TEXT | District |
| F_Location | TEXT | Locality |
| otp | INTEGER | OTP field (reserved) |

### `admin`
| Column | Type | Description |
|---|---|---|
| admin_id | INTEGER (PK) | Primary key |
| admin_name | TEXT | Username |
| admin_password | TEXT | Password |

### `custlogin`
| Column | Type | Description |
|---|---|---|
| cust_id | INTEGER (PK) | Primary key |
| cust_name | TEXT | Customer name |
| password | TEXT | Password |
| email | TEXT | Login email |
| address | TEXT | Address |
| city | TEXT | City |
| pincode | TEXT | PIN code |
| state | TEXT | State |
| phone_no | TEXT | Phone |
| otp | INTEGER | OTP field (reserved) |

### `contactus`
| Column | Type | Description |
|---|---|---|
| c_id | INTEGER (PK) | Auto-increment |
| c_name | TEXT | Sender name |
| c_mobile | TEXT | Mobile number |
| c_email | TEXT | Email address |
| c_address | TEXT | Address |
| c_message | TEXT | Message body |

---

## 🌐 API Integrations

### 1. OpenWeatherMap API
- **Base URL**: `http://api.openweathermap.org/data/2.5/`
- **Endpoints Used**:
  - `weather?q={city}&units=metric&appid={key}` — Current weather by city
  - `weather?lat={}&lon={}&units=metric&appid={key}` — Current weather by coords
  - `forecast?lat={}&lon={}&units=metric&appid={key}` — 5-day/3-hour forecast
- **Key Storage**: `.env` → `OPENWEATHER_API_KEY`
- **Fallback**: Generates realistic static weather data if API is unreachable.

### 2. data.gov.in Agmarknet API
- **Base URL**: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`
- **Filters**: `?filters[district]={city}` or `?filters[state]={city}`
- **Key Storage**: `.env` → `DATA_GOV_API_KEY`
- **Fallback**: Curated `FALLBACK_MANDI_PRICES` dict with last-known rates for 8 major cities.

### 3. OpenStreetMap Nominatim
- **URL**: `https://nominatim.openstreetmap.org/reverse?lat={}&lon={}&format=json`
- **Purpose**: Reverse geocoding (GPS coords → state/city name) for auto-detecting meteorological zones and nearest markets.
- **No API key required** — free public API.

---

## 🎨 UI/UX Design System

The design system is built entirely in `modern-agrointel.css` (1050+ lines, 29 KB) with the following architecture:

### CSS Custom Properties (130+)
- **Color Tokens**: `--emerald-500`, `--amber-500`, `--cyan-500`, `--emerald-600`
- **Surface Tokens**: `--bg-base`, `--bg-surface`, `--bg-elevated`, `--bg-input`, `--bg-nav`
- **Text Tokens**: `--text-primary`, `--text-secondary`, `--text-muted`
- **Border Tokens**: `--border-subtle`, `--border-normal`, `--border-strong`
- **Shadow Tokens**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`
- **Spacing Tokens**: `--sp-1` through `--sp-12`
- **Typography**: `--font-display` (Inter), `--font-body` (Inter)
- **Border Radius**: `--r-sm`, `--r-md`, `--r-lg`, `--r-xl`

### Theme Support
- **Dark Mode** (default): Deep emerald background (`#0c1a14`), glass surfaces, neon-subtle glow effects.
- **Light Mode**: Crisp sage & mint palette (`#f4faf7`), enhanced contrast, visible card borders, proper form input borders. Toggle via a button in the navbar that persists via `localStorage`.

### Key Component Classes
| Class | Description |
|---|---|
| `.glass-card` | Glassmorphic card with subtle gradient, border, hover elevation |
| `.result-card-glow` | Emerald-bordered result display card with glow effect |
| `.btn-agro-primary` | Emerald gradient action button |
| `.btn-agro-secondary` | Subtle outline button |
| `.form-control-agro` | Styled form inputs with focus glow |
| `.badge-agro-emerald/amber/cyan` | Colored pill badges |
| `.soil-preset-btn` | Preset selector pill buttons |
| `.table-agro` | Styled data table with hover highlights |
| `.navbar-glass` | Frosted glass navigation bar |
| `.gradient-text` | Emerald gradient text effect |
| `.animate-fade-in-up` | Entry animation |

---

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.9+** (tested with Python 3.14)
- **pip** (Python package manager)
- **Internet connection** (for live weather and mandi price APIs)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ziyaullashariff46/AgroIntel---Predictive-Farming-and-Yield-Optimization.git
cd AgroIntel
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Dependencies installed:**
| Package | Version | Purpose |
|---|---|---|
| Flask | ≥ 2.0.0 | Web framework |
| pandas | ≥ 1.3.3 | Data loading and processing |
| numpy | ≥ 1.21.3 | Numerical array operations |
| scikit-learn | ≥ 1.0.2 | ML models (Random Forest, Decision Tree) |
| joblib | ≥ 1.1.0 | Model serialization |
| requests | ≥ 2.25.0 | HTTP client for external APIs |
| python-dotenv | ≥ 0.19.0 | `.env` file loading |

### Step 3: Configure API Keys
Create a `.env` file in the project root:
```env
FLASK_SECRET_KEY=your_secure_flask_secret_key
OPENWEATHER_API_KEY=your_openweather_api_key_here
DATA_GOV_API_KEY=your_data_gov_api_key_here
```

- **Get OpenWeather Key**: [https://openweathermap.org/api](https://openweathermap.org/api) (free tier)
- **Get data.gov.in Key**: [https://data.gov.in/](https://data.gov.in/) (free registration)

### Step 4: Initialize the Database (first run only)
```bash
python seed_sample_users.py
```
This creates `agrointel.db` with sample admin and farmer accounts.

### Step 5: Run the Application
**Option A** — Direct launch:
```bash
python app.py
```

**Option B** — Auto-launcher (initializes DB if missing + opens browser):
```bash
python run.py
```

Access at: **`http://127.0.0.1:5000`**

---

## 🔑 Sample Login Credentials

| Role | URL | Email / Username | Password |
|---|---|---|---|
| **Farmer** | `/login/farmer` | `farmer@agrointel.com` | `password` |
| **Admin** | `/login/admin` | `admin` | `password` |

> You can register new farmer accounts at `/register/farmer`.

---

## 🔧 Utility Scripts

| Script | Purpose |
|---|---|
| `run.py` | One-click launcher: checks for DB, initializes if missing, opens browser, starts Flask |
| `init_db.py` | Initializes SQLite schema from legacy SQL dump (MySQL → SQLite conversion) |
| `seed_sample_users.py` | Seeds default admin, farmer, and buyer test accounts |
| `create_report.py` | Generates a formatted Word document (.docx) project report using `python-docx` |
| `generate_ppt.py` | Generates a 16:9 PowerPoint (.pptx) presentation deck using `python-pptx` |

---

## 📸 Screenshots & Use Cases

### Use Case 1: New Farmer Onboarding
1. Farmer visits the landing page → clicks "Farmer Portal" button.
2. Registers with name, email, phone, state, district.
3. Logs in and is redirected to the AI Science Suite.
4. Uses Crop Recommendation with their soil data → gets "Rice" recommendation.
5. Checks Fertilizer Advisory for optimal fertilizer → gets "Urea" recommendation.
6. Views Live Mandi Prices for their district → sees current market rates.
7. Checks Weather Forecast before planting → sees 5-day outlook.

### Use Case 2: Pre-Season Planning
1. Farmer selects their state, district, and upcoming season in Price Trend Predictor.
2. Gets top 5 high-demand crops ranked by market potential.
3. Cross-references with Yield Harvest Forecast to estimate production.
4. Checks Rainfall Estimation for expected monsoon intensity.
5. Makes an informed decision on which crop to plant.

### Use Case 3: Admin Monitoring
1. Admin logs in at `/login/admin`.
2. Views all registered farmers with their contact details.
3. Reviews customer feedback messages from the contact form.
4. Can delete spam messages or inactive farmer accounts.

---

## 📝 Recent Architecture Changes

| Change | Detail |
|---|---|
| **PHP → Flask Migration** | Removed all legacy PHP files (`admin/`, `customer/`, `smtp/`). The entire application now runs on a single Flask server. |
| **API Key Security** | Removed all hardcoded API keys from `app.py`. Keys are now loaded exclusively from `.env` via `python-dotenv`. |
| **PyArrow Compatibility Fix** | Fixed `TypeError: only integer scalar arrays can be converted to a scalar index` across all ML routes by replacing `.values` with `.to_numpy()` for Pandas columns backed by PyArrow. |
| **Buyer Marketplace Removal** | Removed all buyer/commerce features to focus on the Farmer AI Intelligence Suite. Customer login redirects to farmer portal. |
| **Light Mode Enhancement** | Overhauled light mode CSS with better contrast ratios, visible form borders, distinct card elevations, and farmer sidebar styling. |
| **Model Intelligence Transparency** | Added consistent "Model Intelligence" cards to all 5 AI tools explaining the ML model and recommendation basis. |
| **Rainfall UI Overhaul** | Rewrote `rainfall_prediction.html` with live GPS detection, preset region chips, 5-day rain forecast strip, and hero result cards. |
| **Mandi Prices Redesign** | Redesigned `market_prices.html` with search bar, location detection, commodity highlight cards, and responsive data tables. |
| **Legacy Cleanup** | Deleted `__pycache__/`, legacy DB dumps, redundant JSON city lists, and unused PHP scripts. |

---

## 📄 License

This project is developed as a Final Year academic project.

---

<p align="center">
  Built with 🌿 by the AgroIntel Team
</p>
