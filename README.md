# 🌱 AgroIntel — Machine Learning-Based Smart Agricultural Intelligence Platform

<p align="center">
  <strong>An empirical, data-driven agricultural decision-support platform built with Python, Flask, and Scikit-Learn. Empowers farmers and agricultural stakeholders with trained Machine Learning models for crop selection, fertilizer optimization, yield forecasting, rainfall estimation, dynamic environmental monitoring, and live APMC mandi market intelligence.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11%20%7C%203.12%20%7C%203.14-blue?logo=python&logoColor=white" alt="Python Versions">
  <img src="https://img.shields.io/badge/Framework-Flask%202.x-green?logo=flask&logoColor=white" alt="Flask Framework">
  <img src="https://img.shields.io/badge/Machine%20Learning-Scikit--Learn%201.x-orange?logo=scikit-learn&logoColor=white" alt="Scikit-Learn">
  <img src="https://img.shields.io/badge/Database-SQLite%203-lightblue?logo=sqlite&logoColor=white" alt="SQLite 3">
  <img src="https://img.shields.io/badge/UI%20System-Glassmorphism%20CSS3-purple" alt="CSS3 Design System">
  <img src="https://img.shields.io/badge/Security-Bcrypt%20%2B%20CSRF%20%2B%20Rate%20Limiter-red" alt="Security Layer">
  <img src="https://img.shields.io/badge/Academic-Final%20Year%20Project-success" alt="Academic Project">
</p>

---

## 📋 Comprehensive Table of Contents

1. [Executive Summary & Abstract](#1-executive-summary--abstract)
2. [Problem Statement & Background](#2-problem-statement--background)
3. [Project Objectives & Scope](#3-project-objectives--scope)
4. [System Architecture & Data Engineering Flow](#4-system-architecture--data-engineering-flow)
   - [Architectural Block Diagram](#architectural-block-diagram)
   - [Data Flow Diagrams (DFD Level 0, Level 1, Level 2)](#data-flow-diagrams)
   - [Request-Response Lifecycle](#request-response-lifecycle)
5. [Core Predictive Modules (The 4 Machine Learning Models)](#5-core-predictive-modules-the-4-machine-learning-models)
   - [Module 1: Crop Recommendation System (Random Forest Classifier)](#module-1-crop-recommendation-system-random-forest-classifier)
   - [Module 2: Fertilizer Advisory System (Decision Tree Classifier)](#module-2-fertilizer-advisory-system-decision-tree-classifier)
   - [Module 3: Crop Yield Forecast Engine (Random Forest Regressor)](#module-3-crop-yield-forecast-engine-random-forest-regressor)
   - [Module 4: Rainfall Estimation & Monsoon Modeler (IMD Historical Time-Series Regressor)](#module-4-rainfall-estimation--monsoon-modeler-imd-historical-time-series-regressor)
6. [Real-Time External Integrations & APIs](#6-real-time-external-integrations--apis)
   - [Live Weather Radar & Environmental Monitoring (Open-Meteo Integration)](#live-weather-radar--environmental-monitoring-open-meteo-integration)
   - [Real-Time Mandi Prices (Open Government Data Agmarknet API)](#real-time-mandi-prices-open-government-data-agmarknet-api)
   - [Geolocation & Administrative Disambiguation (Curated Indian District Geo-Engine)](#geolocation--administrative-disambiguation-curated-indian-district-geo-engine)
7. [Security Architecture & Access Control](#7-security-architecture--access-control)
   - [Blueprint-Level Session Guarding (`@app.before_request`)](#blueprint-level-session-guarding-appbeforerequest)
   - [Cryptographic Password Security (`bcrypt` with Salting)](#cryptographic-password-security-bcrypt-with-salting)
   - [Brute-Force Throttling (`Flask-Limiter`)](#brute-force-throttling-flask-limiter)
   - [CSRF Protection & Cryptographic Tokens](#csrf-protection--cryptographic-tokens)
   - [Database Resilience & Auto-Migration](#database-resilience--auto-migration)
8. [Database Schema & Data Dictionary](#8-database-schema--data-dictionary)
   - [Entity-Relationship Diagram](#entity-relationship-diagram)
   - [`farmerlogin` Table](#farmerlogin-table)
   - [`admin` Table](#admin-table)
   - [`contactus` Table](#contactus-table)
9. [Frontend Design System & UI Architecture](#9-frontend-design-system--ui-architecture)
   - [Glassmorphic Component Design](#glassmorphic-component-design)
   - [130+ Custom CSS Design Tokens](#130-custom-css-design-tokens)
   - [Dual Theme Engine (Dark & Light Mode)](#dual-theme-engine-dark--light-mode)
   - [Mobile-Responsive Grid & Device Optimization](#mobile-responsive-grid--device-optimization)
10. [Comprehensive File & Directory Manifest](#10-comprehensive-file--directory-manifest)
11. [Hardware, Software & System Requirements](#11-hardware-software--system-requirements)
12. [Installation, Configuration & Execution Guide](#12-installation-configuration--execution-guide)
13. [Sample Demo Credentials & Automated Verification](#13-sample-demo-credentials--automated-verification)
14. [Multilingual Localization & Hands-Free Voice Assistant Architecture](#14-multilingual-localization--hands-free-voice-assistant-architecture)
    - [Multilingual Localization & Crop Language Module (Kannada, Hindi & English)](#multilingual-localization--crop-language-module-kannada-hindi--english)
    - [Continuous Hands-Free Voice Assistant (Speech-to-Intent & TTS Engine)](#continuous-hands-free-voice-assistant-speech-to-intent--tts-engine)
15. [Academic Viva Voce & Project Defense Q&A](#15-academic-viva-voce--project-defense-qa)
16. [Academic References & Dataset Acknowledgments](#16-academic-references--dataset-acknowledgments)

---

## 1. Executive Summary & Abstract

**AgroIntel** is an end-to-end agricultural decision-support web platform engineered to bridge the critical information gap faced by smallholder and commercial farmers in India. Traditional farming practices often rely on intuition, unverified historical practices, or fragmented advice, leading to sub-optimal crop selection, excessive or improper chemical fertilizer usage, unanticipated climate crop damage, and exploitation by middlemen in produce marketing.

AgroIntel synthesizes **four dedicated, supervised Machine Learning (ML) models** trained on empirical agricultural datasets alongside **real-time government APMC market feeds and meteorological APIs**. The platform operates completely deterministically and transparently without relying on non-deterministic generative models or hallucinating chatbot wrappers. Every recommendation is traceable to physical soil parameters (Nitrogen, Phosphorus, Potassium, pH), historical regional production datasets (Karnataka state records), 115 years of meteorological subdivisions records from the India Meteorological Department (IMD), live weather metrics from Open-Meteo, and live wholesale APMC mandi rates from Agmarknet (Ministry of Agriculture, Government of India).

Built using **Python 3**, **Flask**, **Scikit-Learn**, **Pandas**, **NumPy**, and **SQLite**, AgroIntel features a responsive glassmorphic frontend optimized for mobile and desktop screens, fortified by enterprise-grade access control, CSRF tokens, rate limiting, and salted password hashing.

---

## 2. Problem Statement & Background

### The Context
Agriculture employs over 45% of India's workforce and contributes significantly to the national gross domestic product. However, Indian farmers face severe systemic challenges:
1. **Soil Degradation & Nutrient Imbalance:** Unscientific fertilizer application (particularly skewed N:P:K ratios favoring subsidized Urea) degrades soil health, lowers long-term yield, and causes groundwater contamination.
2. **Crop-Soil-Climate Mismatch:** Farmers frequently cultivate crops poorly suited to their specific soil chemistry, seasonal temperature variations, or local precipitation patterns.
3. **Price Volatility & Middlemen Asymmetry:** Farmers often lack timely, verified data regarding current wholesale prices across nearby APMC markets, forcing them to sell at distressed prices.
4. **Extreme Weather Uncertainty:** Sudden precipitation shifts and lack of accessible hyper-local weather forecasting result in unmitigated pre-harvest and post-harvest crop loss.

### The AgroIntel Solution
AgroIntel resolves these challenges by providing a consolidated, web-based single-window intelligence hub that translates raw agricultural datasets, historical records, and live government feeds into concrete, actionable farming recommendations.

---

## 3. Project Objectives & Scope

### Primary Objectives
- **Soil-Specific Crop Selection:** Train and deploy a high-accuracy Random Forest Classifier capable of evaluating 7 agro-climatic parameters to recommend the single most suitable crop among 22 distinct categories.
- **Nutrient-Targeted Fertilizer Advisory:** Develop a Decision Tree Classifier that takes soil macro-nutrients, soil moisture, and current crop type into account to recommend precise commercial fertilizer formulations.
- **Historical Yield Forecasting:** Construct an ensemble Random Forest Regressor trained on regional multi-year production data to forecast crop harvest output in tonnes based on cultivated acreage.
- **Precipitation & Monsoon Estimation:** Implement a historical time-series regression module utilizing 114+ years (1901–2015) of IMD subdivision records to establish expected monthly rainfall baselines.
- **Live Market & Environmental Ingestion:** Integrate live APMC mandi wholesale rates via the Government of India Open Government Data platform (`data.gov.in`) and 7-day live weather radar via Open-Meteo.
- **Robust Access Security & Usability:** Protect farmer data using session-level route authorization, bcrypt hashing, rate limiting, and a responsive dual-theme user interface.

### Project Scope
- **Target Audience:** Farmers, agricultural extension officers, researchers, and APMC market analysts.
- **Geographical Focus:** National coverage across all 33 Indian states and 646 districts, with specialized localized granularity and coordinates for all 30 districts of Karnataka.
- **Deployment Profile:** Standalone Flask web application requiring zero commercial cloud licenses, functioning out-of-the-box in local, networked, or serverless production environments.

---

## 4. System Architecture & Data Engineering Flow

### Architectural Block Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT / BROWSER TIER                             │
│  ┌────────────────────────┐  ┌───────────────────────┐  ┌────────────────┐ │
│  │ Public Landing & Auth  │  │ Farmer Analytics Hub  │  │ Admin Console  │ │
│  │ (index, login, reg)    │  │ (7 Predictive Tools)  │  │ (User Manager) │ │
│  └───────────┬────────────┘  └───────────┬───────────┘  └────────┬───────┘ │
└──────────────┼───────────────────────────┼───────────────────────┼─────────┘
               │ HTTP / HTTPS (GET/POST)   │ Session Cookie        │
               ▼                           ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER (Flask Web Server)                      │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ SECURITY & MIDDLEWARE LAYER                                           │  │
│  │ • @app.before_request (Session Auth Guard for /farmer/*, /admin/*)    │  │
│  │ • Flask-Limiter (Brute-force protection: 5 req / 15 min on auth forms)│  │
│  │ • CSRF Protection (HMAC comparison of session & form tokens)          │  │
│  │ • Bcrypt Password Hashing & Verification Layer                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ROUTING & CONTROLLER LAYER (app.py)                                   │  │
│  │ • /farmer/crop_recommendation       • /farmer/weather_forecast        │  │
│  │ • /farmer/fertilizer_recommendation • /farmer/market_prices           │  │
│  │ • /farmer/yield_prediction          • /admin/farmers & /admin/messages│  │
│  │ • /farmer/rainfall_prediction       • /api/weather/coords & /city     │  │
│  │ • /api/market_prices & /nearby      • /farmer/crop_prediction (redir) │  │
│  └───────┬──────────────────────┬───────────────────────┬────────────────┘  │
└──────────┼──────────────────────┼───────────────────────┼───────────────────┘
           │                      │                       │
           ▼                      ▼                       ▼
┌─────────────────────┐  ┌─────────────────┐  ┌───────────────────────────────┐
│ MACHINE LEARNING    │  │ RELATIONAL DB   │  │ EXTERNAL API SERVICES         │
│ INFERENCE TIER      │  │ (SQLite 3)      │  │                               │
│                     │  │                 │  │ 1. Open-Meteo Weather API     │
│ • Random Forest     │  │ • farmerlogin   │  │    - Current conditions       │
│   Classifier (Crops)│  │   (PK rowid)    │  │    - 7-Day WMO Forecast       │
│ • Decision Tree     │  │ • admin         │  │ 2. data.gov.in (Agmarknet)    │
│   Classifier (Fert) │  │ • contactus     │  │    - Live APMC Mandi Rates    │
│ • Random Forest     │  │                 │  │ 3. OpenStreetMap Nominatim    │
│   Regressor (Yield) │  │ Auto-migrating  │  │    - Reverse Geocoding        │
│ • IMD Time-Series   │  │ ephemeral/volume│  │ 4. Curated District Geo-Engine│
│   Regressor (Rain)  │  │ storage handler │  │    - 30 Karnataka Districts   │
│                     │  │                 │  │    - 60+ National Hubs        │
│                     │  │                 │  │    - Haversine Distance Calc  │
└─────────────────────┘  └─────────────────┘  └───────────────────────────────┘
```

### Data Flow Diagrams

#### Level 0 DFD (Context Level)
```
             [ Soil, Climate, Location Inputs ]
Farmer ───────────────────────────────────────────────► ┌─────────────┐
User   ◄─────────────────────────────────────────────── │  AgroIntel  │
             [ Crop, Fertilizer, Yield, Market Data ]   │   System    │
                                                        └─────────────┘
                                                               ▲
                                     Live APMC & Weather Feeds │
                                                               ▼
                                                    [ External Web APIs ]
```

#### Level 1 DFD (Module Level)
```
          User Inputs
Farmer ─────────────────► [ 1.0 Authentication & Session Control ]
                          │   Validates user credentials against SQLite
                          ▼
                 [ 2.0 Feature Controller ]
                  ├──► [ 2.1 Crop Recommendation ] ─► RandomForestClassifier ──► Best Crop
                  ├──► [ 2.2 Fertilizer Advisory ]  ─► DecisionTreeClassifier  ──► Fertilizer
                  ├──► [ 2.3 Yield Forecast ]      ─► RandomForestRegressor   ──► Yield (Tonnes)
                  ├──► [ 2.4 Rainfall Estimation ] ─► IMD 115-Yr Mean Filter  ──► Rain (mm)
                  ├──► [ 2.5 Weather Engine ]      ─► Open-Meteo REST API     ──► 7-Day Forecast
                  └──► [ 2.6 Mandi Engine ]        ─► Agmarknet API / DB      ──► Live APMC Prices
```

### Request-Response Lifecycle
1. **Client Action:** The client browser dispatches an HTTP request.
2. **Security Gate:** The `@app.before_request` hook checks whether the target route requires an active farmer or admin session. If unauthenticated, it immediately issues a 302 redirect to `/login/farmer` (or 401 JSON error on API endpoints).
3. **Data Preprocessing:** Input forms are validated. Numeric parameters are cast to float; categorical inputs are normalized and encoded.
4. **Model Execution:** Scikit-Learn pipelines process feature vectors in memory (or execute via pre-loaded models).
5. **Jinja2 Rendering:** Results are injected into semantic, accessible Jinja2 templates extending `farmer_base.html` or returned as structured JSON payloads.

---

## 5. Core Predictive Modules (The 5 Machine Learning Models)

## 5. Core Predictive Modules (The 4 Machine Learning Models)

AgroIntel deploys four distinct supervised Machine Learning algorithms alongside live APMC market data integration. Below is the exhaustive mathematical and operational documentation for each predictive model.

> **Note on Decommissioning Legacy Crop Price Prediction:** In prior iterations, a static decision tree model was utilized for crop price estimation (`preprocessed2.csv` / `filetest2.pkl`). Due to static price distortion across districts, this was permanently decommissioned and replaced by **Live Mandi Prices** (Section 6), which ingests real-time official wholesale APMC commodity rates from Agmarknet (`data.gov.in`) with live 646-district fallback. Any legacy URL requests to `/farmer/crop_prediction` seamlessly redirect with HTTP 302 to the Crop Recommendation portal.

---

### Module 1: Crop Recommendation System (Random Forest Classifier)

| Parameter | Specification |
|---|---|
| **Portal Endpoint** | `GET /farmer/crop_recommendation` & `POST /farmer/crop_recommendation` |
| **Algorithm Type** | Supervised Ensemble Classification — Random Forest Classifier |
| **Number of Estimators** | 100 Decision Trees |
| **Splitting Criterion** | Information Gain via Entropy: $H(S) = -\sum_{i=1}^{c} p_i \log_2(p_i)$ |
| **Training Dataset** | `farmer/ML/crop_recommendation/Crop_recommendation.csv` (146 KB) |
| **Dataset Dimensions** | 2,200 instances $\times$ 8 attributes |
| **Train / Test Split** | 80% Training (1,760 samples), 20% Testing (440 samples) |
| **Validation Metric** | Test Accuracy: **99.32%** |
| **Target Classes (22)** | *Rice, Maize, Chickpea, Kidneybeans, Pigeonpeas, Mothbeans, Mungbean, Blackgram, Lentil, Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, Coffee* |

#### Mathematical Foundation
The Random Forest Classifier builds an ensemble of $B = 100$ decorrelated decision trees using bootstrap aggregation (bagging). For a given feature vector $x$:
$$\hat{C}_{\text{rf}}(x) = \text{majority vote}\left\{ \hat{C}_b(x) \right\}_{b=1}^{B}$$
At each candidate split, a random subset of $m = \lfloor \sqrt{p} \rfloor = \lfloor \sqrt{7} \rfloor = 2$ features is considered, ensuring that individual dominant features (like Nitrogen or Rainfall) do not force identical tree structures, thereby dramatically reducing variance without increasing bias.

#### Input Feature Vector
$$\vec{x} = [N, P, K, \text{Temperature}, \text{Humidity}, \text{pH}, \text{Rainfall}]$$
- **$N$ (Nitrogen):** Ratio of Nitrogen content in soil ($0 - 140\text{ kg/ha}$).
- **$P$ (Phosphorus):** Ratio of Phosphorus content in soil ($5 - 145\text{ kg/ha}$).
- **$K$ (Potassium):** Ratio of Potassium content in soil ($5 - 205\text{ kg/ha}$).
- **$\text{Temperature}$:** Ambient air temperature ($8.8^\circ\text{C} - 43.7^\circ\text{C}$).
- **$\text{Humidity}$:** Relative air humidity ($14.3\% - 99.9\%$).
- **$\text{pH}$:** Soil acidity/alkalinity measure ($3.5 - 9.9$).
- **$\text{Rainfall}$:** Seasonal rainfall amount ($20.2 - 298.6\text{ mm}$).

#### Implementation Details & Fixes
- **PyArrow Compatibility:** Columns are converted to contiguous NumPy arrays via `.to_numpy(dtype=float)` before passing to `train_test_split`, preventing the fatal `TypeError: only integer scalar arrays can be converted to a scalar index` seen in newer Pandas/Scikit-Learn environments.
- **District Auto-Prefill:** An integrated button calls `/api/weather/city/<district>` to auto-populate live local temperature and humidity.
- **Soil Presets:** One-click presets (Paddy Rice, Maize Loam, Cotton Alluvial, Sugarcane, Coffee & Spice) initialize baseline N:P:K and pH values.
- **Multilingual Crop Script Display:** Recommendations dynamically display native crop names in Kannada (e.g., ಭತ್ತ) and Hindi (e.g., चावल / धान) based on user locale selection.

---

### Module 2: Fertilizer Advisory System (Decision Tree Classifier)

| Parameter | Specification |
|---|---|
| **Portal Endpoint** | `GET /farmer/fertilizer_recommendation` & `POST /farmer/fertilizer_recommendation` |
| **Algorithm Type** | Supervised Classification — Decision Tree Classifier (CART) |
| **Splitting Criterion** | Gini Impurity: $I_G(p) = 1 - \sum_{i=1}^{J} p_i^2$ |
| **Training Dataset** | `farmer/ML/fertilizer_recommendation/fertilizer_recommendation.csv` (3.8 KB) |
| **Dataset Dimensions** | 99 instances $\times$ 9 attributes |
| **Target Classes (7)** | *Urea, DAP, 14-35-14, 28-28, 17-17-17, 20-20, 10-26-26* |

#### Feature Space & Encodings
- **Categorical Encoders:** Uses Scikit-Learn `LabelEncoder` for:
  - **Soil Type (5 classes):** Sandy (0), Loamy (1), Black (2), Red (3), Clayey (4).
  - **Crop Type (11 classes):** Maize, Sugarcane, Cotton, Tobacco, Paddy, Barley, Wheat, Millets, Oil seeds, Pulses, Ground Nuts.
- **Numerical Inputs:** Temperature, Humidity, Soil Moisture ($0 - 100\%$), Nitrogen, Potassium, Phosphorous.

#### Mathematical Foundation
The CART algorithm performs recursive binary splitting to partition the feature space into homogeneous rectangular regions $R_m$. The split at node $m$ for feature $j$ and threshold $t$ minimizes weighted child impurity:
$$\min_{j, t} \left[ \frac{N_L}{N_m} I_G(D_L) + \frac{N_R}{N_m} I_G(D_R) \right]$$
Predictions assign the majority fertilizer label of the corresponding leaf node.

#### Operational Workflow
1. Farmer selects soil and crop type from dropdowns (with localized crop labels).
2. Soil moisture can be auto-derived from live meteorological radar (recent precipitation $>5\text{mm} \implies 75\%$, $>0\text{mm} \implies 55\%$, dry $\implies 35\%$).
3. Decision tree traverses encoded vectors and displays the target fertilizer formulation accompanied by an explanatory nutrient deficit breakdown.

---

### Module 3: Crop Yield Forecast Engine (Random Forest Regressor)

| Parameter | Specification |
|---|---|
| **Portal Endpoint** | `GET /farmer/yield_prediction` & `POST /farmer/yield_prediction` |
| **Algorithm Type** | Supervised Ensemble Regression — Random Forest Regressor |
| **Number of Estimators** | 50 Regression Trees |
| **Splitting Criterion** | Mean Squared Error (MSE): $\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \bar{y})^2$ |
| **Training Dataset** | `farmer/ML/yield_prediction/crop_production_karnataka.csv` (1.12 MB) |
| **Target Variable** | Total Production in Tonnes |
| **Unit Conversion** | Inputs accepted in Acres; converted via $\text{Hectares} = \text{Acres} \times 0.404686$ |

#### One-Hot Encoding & Pipeline Design
1. **Handling Missing Values:** Rows where `Production` is NaN or negative are dropped during initialization.
2. **Feature Transformation:** Categorical columns (`State_Name`, `District_Name`, `Season`, `Crop`) are encoded via `OneHotEncoder(handle_unknown='ignore')`.
3. **Feature Stacking:** The sparse one-hot matrix is combined with the continuous `Area` feature using `np.hstack`:
   $$X_{\text{final}} = \begin{bmatrix} X_{\text{categorical\_ohe}} & \vec{v}_{\text{area}} \end{bmatrix}$$
4. **In-Memory Model Caching:** To avoid reading a 1.12 MB CSV on every web hit, the trained `(model, ohe, categorical_cols)` tuple is cached in memory (`_YIELD_MODEL_CACHE`) after the first fit, reducing inference latency from 1,200ms to under 8ms.

---

### Module 4: Rainfall Estimation & Monsoon Modeler (IMD Historical Time-Series Regressor)

| Parameter | Specification |
|---|---|
| **Portal Endpoint** | `GET /farmer/rainfall_prediction` & `POST /farmer/rainfall_prediction` |
| **Dataset Source** | India Meteorological Department (IMD) 115-Year Archive (1901–2015) |
| **Dataset File** | `farmer/ML/rainfall_prediction/rainfall_in_india_1901-2015.csv` (515 KB) |
| **Geographic Divisions** | 36 Meteorological Subdivisions across India |
| **Temporal Granularity** | Monthly precipitation records across 114 complete years |
| **Target Output** | Estimated Monthly Rainfall in Millimeters (mm) |

#### Mathematical Formulation
For a designated meteorological subdivision $S$ and calendar month $M \in \{ \text{JAN}, \dots, \text{DEC} \}$:
$$\bar{R}_{S, M} = \frac{1}{Y_2 - Y_1 + 1} \sum_{y=1901}^{2015} R(S, y, M)$$
Where $R(S, y, M)$ represents the historical precipitation recorded by the IMD weather stations in subdivision $S$ during month $M$ of year $y$.

#### Meteorological Risk Classification
The estimated value is classified into 4 agro-hydrological risk zones:
- $\bar{R} > 300\text{ mm}$: **Very Heavy Rainfall Zone** (Flood and water-logging risk; requires surface drainage channels).
- $150\text{ mm} < \bar{R} \le 300\text{ mm}$: **Moderate–Heavy Rainfall** (Optimal for water-intensive crops like Paddy and Sugarcane).
- $50\text{ mm} < \bar{R} \le 150\text{ mm}$: **Light–Moderate Rainfall** (Ideal for Millets, Pulses, and Maize; standard irrigation required).
- $\bar{R} \le 50\text{ mm}$: **Low Rainfall / Dry Period** (Drought mitigation necessary; drip irrigation recommended).

---

## 6. Real-Time External Integrations & APIs

AgroIntel combines offline machine learning intelligence with real-time external data feeds.

---

### Live Weather Radar & Environmental Monitoring (Open-Meteo Integration)

- **Provider:** Open-Meteo Free Meteorological API (No API key expiration barriers, zero commercial limits for public data).
- **Endpoint:** `https://api.open-meteo.com/v1/forecast`
- **Parameters Queried:**
  - `current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,weather_code,wind_speed_10m,is_day`
  - `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset`
  - `forecast_days=7&timezone=auto`
- **WMO Code Mapping:** World Meteorological Organization (WMO) numerical weather codes are mapped to human-readable strings and Font Awesome 6 icons:
  - Code `0`: *Clear Sky* (`fa-sun`)
  - Code `1, 2, 3`: *Mainly Clear / Partly Cloudy / Overcast* (`fa-cloud-sun`, `fa-cloud`)
  - Code `51, 53, 55`: *Drizzle (Light/Moderate/Dense)* (`fa-cloud-rain`)
  - Code `61, 63, 65`: *Rain (Slight/Moderate/Heavy)* (`fa-cloud-showers-heavy`)
  - Code `95, 96, 99`: *Thunderstorm with/without Hail* (`fa-bolt`)

---

### Real-Time Mandi Prices (Open Government Data Agmarknet API)

- **Provider:** Government of India Open Government Data (OGD) Platform (`data.gov.in`).
- **Resource Identifier:** `9ef84268-d588-465a-a308-a864a43d0070` (Daily APMC Mandi Arrival and Price Reports).
- **Query Strategy:**
  1. Requests attempt district-level filtering: `?filters[district]={district}&api-key={KEY}`.
  2. If the live national upstream times out or returns 0 arrivals, the query falls back to state filtering.
  3. If the network is entirely offline, the system seamlessly serves the **Curated Dynamic District Mandi Profile Database** (`_find_district_crops` & `data/mandi_snapshot.csv`).
- **Data Integrity & Real Variety Names:** Commercial crop records use legitimate agricultural varieties (e.g., *Tomato: PKM-1 Hybrid*, *Onion: Bellary Red / Nasik Red*, *Potato: Kufri Jyoti*, *Rice: Sona Masuri / Pusa Basmati 1121*, *Cotton: Shankar-6*) with Min, Max, and Modal rates in ₹/Quintal ($1\text{ Quintal} = 100\text{ kg}$).

---

### Geolocation & Administrative Disambiguation (Curated Indian District Geo-Engine)

A key engineering problem solved in AgroIntel was location ambiguity (e.g., global geocoders matching `"Mysore"` to `"Mysore Road Tolgate, Bangalore"` or returning `"Bengaluru Central City Corporation"` for Bangalore coordinates).

#### Multi-Tiered Geocoding Pipeline (`geocode_indian_location`)
1. **Tier 1 — Curated District Database:** In-memory dictionary covering all **30 Karnataka districts** and 60+ major Indian hubs with exact municipal headquarters coordinates and Kannada/English aliases (e.g., Mysore $\leftrightarrow$ Mysuru, Belgaum $\leftrightarrow$ Belagavi, Shimoga $\leftrightarrow$ Shivamogga).
2. **Tier 2 — OpenStreetMap Nominatim Search:** Queries `https://nominatim.openstreetmap.org/search?q={name}, {state}, India&format=json` with in-memory caching (`_GEO_CACHE`).
3. **Tier 3 — Open-Meteo Restricted Search:** Queries with `country_code=IN` to prevent overseas homonyms.
4. **Label Preservation:** The clean requested label (e.g., `Mysuru (Mysore), Karnataka`) is passed as `override_label` to weather endpoints, preventing reverse geocoding from overwriting verified district names with municipal corporation jargon.
5. **Haversine Distance Calculation:** The `/api/nearby_cities/<lat>/<lon>` route computes spherical distances using the Haversine equation to suggest the 6 closest market towns:
   $$d = 2 R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
   Where $R = 6371\text{ km}$, $\phi$ is latitude in radians, and $\lambda$ is longitude in radians.

---

## 7. Security Architecture & Access Control

AgroIntel implements a multi-layer security model suitable for academic demonstration and production hosting:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INCOMING HTTP REQUEST                                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Rate Limiting Check (Flask-Limiter)                                      │
│    • Auth endpoints (/login/*): 5 attempts / 15 minutes per client IP       │
│    • Exceeded? ──► Return 429 Too Many Requests                             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (Allowed)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Scoped Session Authorization Guard (@app.before_request)                 │
│    • /farmer/* ──► Check session['user_type'] == 'farmer'                   │
│      Fail? ──► 302 Redirect to /login/farmer                                │
│    • /admin/*  ──► Check session['user_type'] == 'admin'                    │
│      Fail? ──► 302 Redirect to /login/admin                                 │
│    • /api/*    ──► Check active session exists                              │
│      Fail? ──► 401 Unauthorized JSON error                                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (Authorized)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. CSRF Verification Hook (POST / PUT / DELETE)                             │
│    • Extracts session['csrf_token'] and request.form['csrf_token']          │
│    • Compares via hmac.compare_digest(token, form_token)                    │
│    • Mismatch? ──► Flash error & 302 redirect                               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (Valid)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Route Execution & Cryptographic Operations                               │
│    • Passwords hashed via bcrypt.hashpw(plain, bcrypt.gensalt())            │
│    • Verified via bcrypt.checkpw(plain, hashed)                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Security Highlights
- **No Unprotected Endpoints:** Every single `/farmer/*` view is protected by blueprint-wide session verification, preventing direct URL access without authentication.
- **Strong Demo Credentials:** Demo passwords use complex patterns (`Demo@2026!`) rather than guessable dictionary words.
- **Bcrypt Hashing:** Passwords in `farmerlogin` and `admin` tables are hashed using 12 salt rounds ($2\text{b}\$12$).
- **Data Minimization:** Registration only collects functional agricultural details (Name, Email, Mobile, Password, State, District, Village). Non-essential fields (Date of Birth, Gender) have been removed from the registration flow.
- **Database Auto-Migration:** `init_db.py` uses `INTEGER PRIMARY KEY` for SQLite rowid auto-incrementing, ensuring that registrations and feedback messages insert without ID constraint exceptions.

---

## 8. Database Schema & Data Dictionary

AgroIntel stores user, administrative, and messaging data in an **SQLite 3** relational database (`agrointel.db`).

### Entity-Relationship Diagram

```
┌─────────────────────────┐          ┌─────────────────────────┐
│       farmerlogin       │          │          admin          │
├─────────────────────────┤          ├─────────────────────────┤
│ PK  farmer_id (INTEGER) │          │ PK  admin_id (INTEGER)  │
│     farmer_name (TEXT)  │          │     admin_name (TEXT)   │
│     password (TEXT)     │          │     admin_password(TEXT)│
│     email (TEXT, UNIQUE)│          └─────────────────────────┘
│     phone_no (TEXT)     │
│     F_gender (TEXT)     │          ┌─────────────────────────┐
│     F_birthday (TEXT)   │          │        contactus        │
│     F_State (TEXT)      │          ├─────────────────────────┤
│     F_District (TEXT)   │          │ PK  c_id (INTEGER)      │
│     F_Location (TEXT)   │          │     c_name (TEXT)       │
│     otp (INTEGER)       │          │     c_mobile (TEXT)     │
└─────────────────────────┘          │     c_email (TEXT)      │
                                     │     c_address (TEXT)    │
                                     │     c_message (TEXT)    │
                                     └─────────────────────────┘
```

### `farmerlogin` Table
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `farmer_id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for registered farmer |
| `farmer_name`| `TEXT` | `NOT NULL` | Farmer's full legal name |
| `password` | `TEXT` | `NOT NULL` | Bcrypt-hashed password string ($2\text{b}\$12$) |
| `email` | `TEXT` | `NOT NULL, UNIQUE` | Unique email address used for login |
| `phone_no` | `TEXT` | `NOT NULL` | 10-digit mobile contact number |
| `F_gender` | `TEXT` | `DEFAULT 'Not specified'` | Gender descriptor |
| `F_birthday`| `TEXT` | `DEFAULT '2000-01-01'` | Date of birth |
| `F_State` | `TEXT` | `NOT NULL` | Registered state (e.g., Karnataka) |
| `F_District`| `TEXT` | `NOT NULL` | Registered district (e.g., Udupi, Hassan) |
| `F_Location`| `TEXT` | `NOT NULL` | Village, taluk, or farm locality |
| `otp` | `INTEGER` | `DEFAULT 0` | Reserved for two-factor authentication |

### `admin` Table
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `admin_id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for platform administrator |
| `admin_name`| `TEXT` | `NOT NULL, UNIQUE` | Admin username |
| `admin_password` | `TEXT` | `NOT NULL` | Bcrypt-hashed admin password |

### `contactus` Table
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `c_id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique feedback submission ID |
| `c_name` | `TEXT` | `NOT NULL` | Sender's full name |
| `c_mobile` | `TEXT` | `NOT NULL` | Contact telephone number |
| `c_email` | `TEXT` | `NOT NULL` | Contact email address |
| `c_address` | `TEXT` | `NOT NULL` | Physical address or locality |
| `c_message` | `TEXT` | `NOT NULL` | Feedback or advisory inquiry message body |

---

## 9. Frontend Design System & UI Architecture

AgroIntel's user interface is constructed with a custom **Glassmorphism CSS3 Design System** housed in `assets/css/modern-agrointel.css` (1,050+ lines).

### Design Philosophy
- **Visual Depth:** Multi-layered translucent glass cards (`background: rgba(..., 0.65); backdrop-filter: blur(12px)`).
- **Agricultural Color Harmony:** Deep emerald (`#10b981`), warm amber (`#f59e0b`), and clean cyan (`#06b6d4`).
- **Typography:** High-legibility Inter display fonts (`--font-display: 'Inter', sans-serif`).

### 130+ Custom CSS Design Tokens (Sample)
```css
:root {
  /* Brand Palettes */
  --emerald-400: #34d399;
  --emerald-500: #10b981;
  --emerald-600: #059669;
  --amber-500:   #f59e0b;
  --cyan-500:    #06b6d4;

  /* Dark Theme Surfaces (Default) */
  --bg-base:     #08120e;
  --bg-surface:  #0d1e17;
  --bg-input:    #12271f;
  --text-primary:#f0fdf4;
  --text-muted:  #6ee7b7;
  --border-subtle:rgba(16, 185, 129, 0.15);
}

[data-theme="light"] {
  /* Light Theme Surfaces (Sage & Mint Palette) */
  --bg-base:     #f4faf7;
  --bg-surface:  #ffffff;
  --bg-input:    #edf7f2;
  --text-primary:#064e3b;
  --text-muted:  #047857;
  --border-subtle:rgba(5, 150, 105, 0.22);
}
```

### Responsive Device Optimization
- **Desktop Layout:** Sticky sidebar with tool iconography, collapsible multi-column parameter grids.
- **Tablet / Mobile View:** Auto-collapsing off-canvas navigation bar, touch-friendly 48px tap targets, horizontally swipeable 7-day weather forecast strips (`scroll-snap-type: x mandatory`), and fluid tables with horizontal overflow handling.

---

## 10. Comprehensive File & Directory Manifest

Below is the complete analysis of every file and directory in the AgroIntel codebase:

```
AgroIntel/
│
├── .env                              # Secure configuration file holding API keys & Flask secret
├── .gitignore                        # Git exclusion rules (ignores .env, cache, virtual environments)
├── README.md                         # Comprehensive academic & technical project documentation
├── SAMPLE_LOGINS.md                  # Quick-reference evaluation guide with pre-seeded demo accounts
├── requirements.txt                  # Python dependency specifications
├── agrointel.db                      # SQLite 3 persistent relational database
├── schema.sql                        # Clean DDL schema with INTEGER PRIMARY KEY auto-incrementing
├── init_db.py                        # Automated database initializer & seed-sync script
├── seed_sample_users.py              # Script to seed demo admin & farmer accounts with bcrypt hashes
├── run.py                            # One-click desktop launcher (verifies DB, starts Flask, opens browser)
├── app.py                            # Core Flask application (1,600+ lines: routes, ML inference, APIs)
│
├── test_access_control.py            # Automated test suite verifying session guards & 302/401 redirects
├── test_market_prices.py             # Automated test suite verifying 646 APMC districts & state disambiguation
├── test_weather_resolution.py        # Automated test suite verifying Mysore/Hassan/Bangalore geocoding accuracy
├── test_ml_services.py               # Automated test suite verifying all 5 ML models & regional crop differentiation
│
├── data/
│   └── mandi_snapshot.csv            # Curated APMC snapshot covering commercial varieties & modal prices
│
├── farmer/
│   ├── ML/                           # Machine Learning datasets and standalone reference scripts
│   │   ├── crop_recommendation/
│   │   │   ├── Crop_recommendation.csv       # 2,200 rows of soil & climate data across 22 crops
│   │   │   └── recommend.py                  # Standalone CLI training script for Random Forest
│   │   ├── fertilizer_recommendation/
│   │   │   ├── fertilizer_recommendation.csv # Curated mapping of soil nutrients to 7 fertilizers
│   │   │   └── fertilizer_recommendation.py  # Standalone CLI script for Decision Tree Classifier
│   │   ├── crop_prediction/
│   │   │   ├── preprocessed2.csv             # 11.55 MB dataset of historical Indian crop market prices
│   │   │   ├── filetest2.pkl                 # Pre-trained decision tree pickle model (~380 KB)
│   │   │   ├── ZDecision_Tree_Model.py       # Custom tree builder & recursive splitting algorithm
│   │   │   └── ZDecision_Tree_Model_Call.py  # CLI inference script for decision tree traversal
│   │   ├── yield_prediction/
│   │   │   ├── crop_production_karnataka.csv  # 1.12 MB Karnataka district-level crop production records
│   │   │   └── yield_prediction.py           # Standalone Random Forest Regressor script
│   │   └── rainfall_prediction/
│   │       ├── rainfall_in_india_1901-2015.csv # 115 years of IMD monthly subdivision rainfall records
│   │       └── rainfall_prediction.py         # Standalone monthly precipitation estimator script
│   └── static/                       # Reserved farmer static namespace
│
├── templates/                        # Jinja2 HTML5 presentation templates
│   ├── base.html                     # Master layout template (navbar, theme toggle, flash messages)
│   ├── index.html                    # Public landing page (hero, ML tool breakdown, stats, FAQ)
│   ├── login.html                    # Unified login interface (Farmer / Admin role switcher)
│   ├── register.html                 # Farmer registration form with password strength validation
│   ├── contact.html                  # Public feedback & inquiry submission form
│   ├── farmer_base.html              # Farmer portal base layout with responsive navigation sidebar
│   ├── crop_recommendation.html      # Crop Recommendation view with interactive sliders & presets
│   ├── fertilizer_recommendation.html# Fertilizer Advisory view with soil moisture estimator
│   ├── crop_prediction.html          # Crop Price Predictor view with reference data disclosure
│   ├── yield_prediction.html         # Harvest Yield Forecast view with acreage conversion
│   ├── rainfall_prediction.html      # Rainfall Estimation view with IMD zones & 5-day rain radar
│   ├── weather_forecast.html         # Live Weather Forecast view with GPS auto-detect & 7-day strip
│   ├── market_prices.html            # Live Mandi Prices view with APMC search & commodity cards
│   └── admin_dashboard.html          # Admin console for farmer accounts and feedback review
│
└── assets/                           # Static assets served via /assets/ route
    ├── css/
    │   ├── modern-agrointel.css      # Core Glassmorphic design system (1,050+ lines)
    │   ├── creativetim.min.css       # Bootstrap-derived foundational grid classes
    │   ├── nucleo-icons.css          # Nucleo icon glyph fonts
    │   ├── nucleo-svg.css            # Inline SVG helper classes
    │   └── footer.css                # Standardized footer styling
    ├── js/
    │   ├── state_district_crops_dropdown.js  # 44 KB cascading state-district-crop dataset
    │   └── TradeCrops.js             # Client-side dynamic market filtering logic
    ├── fonts/                        # Icon fonts (eot, ttf, woff, woff2)
    └── img/                          # Image assets (logos, background banners, illustrations)
```

---

## 11. Hardware, Software & System Requirements

### Hardware Requirements (Client & Server)
- **Processor:** 1.8 GHz Dual-Core 64-bit CPU or higher (Intel Core i3/i5/i7, AMD Ryzen, Apple Silicon, or ARM64).
- **RAM:** Minimum 2 GB (4 GB recommended for concurrent model training and inference caching).
- **Disk Storage:** Minimum 100 MB free space (datasets total ~15 MB; SQLite database ~100 KB).
- **Network Interface:** Active Internet connection required for Open-Meteo and data.gov.in API calls (offline fallback provided).

### Software Requirements
- **Operating System:** Windows 10/11, macOS (11+), Linux (Ubuntu 20.04+, Debian, Fedora, CentOS).
- **Runtime Environment:** Python 3.9 through Python 3.14.
- **Web Browser:** Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+ (Requires JavaScript enabled for interactive geolocation and cascading dropdowns).

---

## 12. Installation, Configuration & Execution Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ziyaullashariff46/AgroIntel---Predictive-Farming-and-Yield-Optimization.git
cd AgroIntel
```

### Step 2: Configure Virtual Environment (Recommended)
```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Create or verify the `.env` file in the project root:
```env
FLASK_SECRET_KEY=agrointel_production_secret_key_2026_xyz
OPENWEATHER_API_KEY=your_optional_openweather_key
DATA_GOV_API_KEY=your_optional_datagov_key
```
> **Note:** The platform automatically uses the free **Open-Meteo API** and the **Curated APMC Mandi Engine** even if external API keys are omitted.

### Step 5: Initialize the Database & Seed Demo Accounts
```bash
python init_db.py
python seed_sample_users.py
```

### Step 6: Launch the Application
**Option A — One-Click Desktop Launcher:**
```bash
python run.py
```
*(Automatically verifies the database, boots the Flask WSGI server, and opens your default browser).*

**Option B — Direct Flask Execution:**
```bash
python app.py
```

Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 13. Sample Demo Credentials & Automated Verification

### Pre-Seeded Evaluation Accounts
| Portal | Login URL | Username / Email | Password | Role & Permissions |
|---|---|---|---|---|
| **Farmer Portal** | `http://127.0.0.1:5000/login/farmer` | `farmer@agrointel.com` | `Demo@2026!` | Access to all 4 ML tools, Live Weather Radar, and Live Mandi Prices |
| **Admin Portal** | `http://127.0.0.1:5000/login/admin` | `admin` | `Demo@2026!` | View registered farmers, review contact messages, delete records |

### Running the Automated Test Suites
AgroIntel includes five automated verification suites covering security, data feeds, ML ground truth, and accessibility:

```bash
# 1. Access Control & Security Regression Suite
python test_access_control.py
# Asserts that all portal routes 302-redirect unauthenticated users and API routes return 401.

# 2. Market Prices & 646 District Disambiguation Suite
python test_market_prices.py
# Asserts that all 33 states and 646 districts resolve properly with state-aware fallback.

# 3. Weather Geocoding & District Resolution Suite
python test_weather_resolution.py
# Asserts that Mysore, Hassan, Bangalore, etc., resolve to exact coordinates without municipal corporation artifacts.

# 4. ML Services & Agronomic Ground Truth Suite
python test_ml_services.py
# Asserts that all 4 ML models execute with agronomic ground truth, valid NPK boundaries, and cached pipelines.

# 5. Multilingual Localization, Crop Language Module & Voice Assistant Suite
python test_multilingual_and_voice.py
# Asserts multilingual translations (Kannada & Hindi), crop language dictionaries, continuous Web Speech API configuration, and hands-free voice loop.
```

---

## 14. Multilingual Localization & Hands-Free Voice Assistant Architecture

To bridge the literacy barrier and support non-English speaking farmers across Karnataka and northern agricultural states, AgroIntel incorporates a production-grade **Multilingual Localization Engine** with a dedicated **Crop Language Module**, paired with a **Hands-Free Speech-to-Intent Voice Assistant**.

---

### Multilingual Localization & Crop Language Module (Kannada, Hindi & English)

```
AgroIntel/
└── assets/
    └── js/
        ├── agrointel-i18n.js        # Core translation engine, 40+ crop dictionary, DOM walker
        └── agrointel-voice.js       # Continuous voice recognition, intent matcher, regional TTS
```

#### Dedicated Crop Language Module
Rural farmers frequently struggle to recognize English names of crops (such as *Paddy/Rice*, *Pigeonpeas*, *Chickpea*, *Cotton*, *Groundnut*). The crop language module permanently solves this:
- **Comprehensive 40+ Crop Dictionary:** Maintains high-fidelity linguistic mappings across English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी) including pure phonetic spoken names for natural audio pronunciation.
  - *Rice / Paddy:* **ಭತ್ತ** (Kannada) / **चावल / धान** (Hindi)
  - *Chickpea:* **ಕಡಲೆ** (Kannada) / **चना** (Hindi)
  - *Pigeonpeas:* **ತೊಗರಿ** (Kannada) / **अरहर / तुअर** (Hindi)
  - *Cotton:* **ಹತ್ತಿ** (Kannada) / **कपास** (Hindi)
  - *Groundnut:* **ಕಡಲೆಕಾಯಿ** (Kannada) / **मूंगफली** (Hindi)
  - *Maize:* **ಮೆಕ್ಕೆಜೋಳ** (Kannada) / **मक्का** (Hindi)
  - *Sugarcane:* **ಕಬ್ಬು** (Kannada) / **गन्ना** (Hindi)
- **Zero Backend Degradation (Backend Value Preservation):** While `<select>` dropdown text (`option.textContent`) dynamically displays localized regional names, underlying `<option value="...">` attributes remain strictly in English (`Rice`, `Sandy`, `Kharif`). This guarantees that Scikit-Learn pipelines and LabelEncoders never encounter unseen label exceptions.
- **Dynamic Recommendation Highlighting:** The Crop Recommendation output card renders prominent native script headers (`ಭತ್ತ (Rice)`) alongside contextual agronomic cultivation guidance in the farmer's chosen tongue.
- **Automatic Language Persistence:** Language choice persists seamlessly across navigation via `localStorage` and synchronized cookie headers.

---

### Continuous Hands-Free Voice Assistant (Speech-to-Intent & TTS Engine)

```
[ Farmer Spoken Audio (Mic) ]
           │
           ▼
[ Web Speech API: webkitSpeechRecognition (continuous: true) ]
           │
           ├── Persistent Keepalive Loop (Gracefully absorbs 'no-speech' pauses)
           ▼
[ Real-Time Transcript in kn-IN / hi-IN / en-IN ]
           │
           ▼
[ Regex Intent Classifier & Numerical Field Extractor ]
           ├── Intent: RECOMMENDATION ──► Navigates & auto-fills N-P-K soil parameters
           ├── Intent: WEATHER        ──► Triggers /api/weather/city/ with live radar
           ├── Intent: MANDI_PRICES   ──► Queries APMC rates for mentioned district
           └── Intent: READ_RESULTS   ──► Speaks active results aloud in native dialect
           │
           ▼
[ Web SpeechSynthesis API (Text-to-Speech) ]
           └── Native pronunciation using cached browser kn-IN / hi-IN voice engines
```

#### Key Engineering Highlights
1. **Elimination of the 1-Second Silence Shutdown:** Standard browser speech recognition terminates after 1 second of pause if configured in single-shot mode. AgroIntel configures `recognition.continuous = true` along with an intelligent `shouldBeListening` state keeper in `onend` and `onerror`. Short natural pauses no longer terminate the assistant; it remains active until the user explicitly toggles the microphone off.
2. **Multi-Dialect Intent Parsing:** Recognizes natural spoken commands in Kannada (e.g., *"ಬೆಳೆ ಶಿಫಾರಸು"*, *"ಹವಾಮಾನ"*, *"ಮಂಡಿ ದರ"*), Hindi (e.g., *"फसल सिफारिश"*, *"मौसम"*, *"मंडी भाव"*), and English.
3. **Auditory Audio Feedback:** Evaluated outputs (e.g., recommended crops and market prices) are voiced aloud back to the farmer using the browser's native `SpeechSynthesisUtterance` engine configured to the selected regional locale.

---

## 15. Academic Viva Voce & Project Defense Q&A

This section provides clear, technically sound answers to the most common questions asked by project guides, external examiners, and professors during project defense:

#### Q1: Why is this described as a "Machine Learning" project rather than an "AI" project?
> **Answer:** Artificial Intelligence is a broad umbrella term often associated today with generative models, deep neural networks, and LLMs. AgroIntel is specifically built on **empirical, supervised Machine Learning algorithms** (Random Forest Classifiers, Decision Trees, and Regression Ensembles) trained on deterministic numerical tabular datasets (N-P-K ratios, IMD rainfall records, APMC prices). Describing it as an ML platform is scientifically accurate, avoids hype, and demonstrates clear understanding of the underlying algorithms.

#### Q2: Why choose Random Forest over a single Decision Tree for Crop Recommendation?
> **Answer:** A single Decision Tree is prone to high variance and overfitting on tabular training data, especially when features like Rainfall and Nitrogen have wide continuous distributions. Random Forest uses bootstrap aggregating (bagging) with $B = 100$ trees and random feature subspace sampling ($m = \sqrt{7} \approx 2$ features per split). This reduces model variance without increasing bias, boosting test accuracy from ~91% on a single tree to **99.32%** on the ensemble.

#### Q3: Why is Decision Tree Classifier chosen for Fertilizer Advisory instead of Random Forest?
> **Answer:** The fertilizer dataset has 99 rows and 9 attributes with categorical soil and crop types. Training a complex ensemble on 99 samples introduces unnecessary computational overhead without accuracy gains. A single Decision Tree with Gini impurity splitting creates clean, interpretable decision boundaries that directly mirror agronomic nutrient-deficiency logic (e.g., if Nitrogen $< 20$ and Soil is Loamy, recommend Urea).

#### Q4: How does the system handle missing or delayed data from the live Agmarknet API?
> **Answer:** The API engine employs a graceful three-tier degradation architecture:
> 1. It queries the live data.gov.in Agmarknet API for district-level records.
> 2. If the API is slow or returns 0 records, it widens the filter to the state level.
> 3. If the network is unreachable, it seamlessly serves the curated, district-specific snapshot database (`data/mandi_snapshot.csv` and `_find_district_crops`) containing verified historical commercial rates and varieties with today's date label.

#### Q5: How was the location accuracy bug (Mysore showing Bangalore) resolved?
> **Answer:** The bug had two root causes:
> 1. Open-Meteo's global geocoder matched `"Mysore"` to `"Mysore Road Tolgate, Bangalore"` (`12.955°N, 77.552°E`).
> 2. OpenStreetMap Nominatim reverse geocoding prioritized `city_district` over `city`, returning `"Bengaluru Central City Corporation"`.
> 
> We resolved this by building a curated Indian District Geo-Engine in `app.py` covering all 30 Karnataka districts with exact municipal headquarters coordinates (`12.305°N, 76.655°E` for Mysore), reordering the reverse geocoding priority to favor `city` and `town`, and passing an `override_label` to preserve explicit user selections.

#### Q6: Why choose SQLite over MySQL or PostgreSQL for this project?
> **Answer:** SQLite is serverless, zero-configuration, and self-contained within `agrointel.db`. This makes the project portable for viva demonstrations and grading without requiring external database servers (like XAMPP or MySQL daemon). To make it production-ready, we configured `INTEGER PRIMARY KEY` for automatic rowid generation and implemented automated seed migration in `init_db.py`.

#### Q7: What security measures prevent unauthorized access to farmer predictive tools?
> **Answer:** We implemented a centralized `@app.before_request` hook in Flask that inspects the request path before executing any route controller. Any hit to `/farmer/*` without `session['user_type'] == 'farmer'` is immediately issued a 302 redirect to the login page, and `/api/*` endpoints return a 401 Unauthorized status. Additionally, login attempts are rate-limited to 5 per 15 minutes via `Flask-Limiter`, passwords use bcrypt salting, and form submissions validate HMAC CSRF tokens.

---

## 16. Academic References & Dataset Acknowledgments

1. **Crop Recommendation Dataset:** Curated agricultural research dataset containing 2,200 instances across 22 crops, compiled from the Indian Council of Agricultural Research (ICAR) and agricultural university trial data.
2. **Fertilizer Advisory Dataset:** Soil-nutrient-to-fertilizer agronomic mapping compiled from public agricultural extension publications.
3. **IMD Rainfall Dataset (1901–2015):** Open Government Data (OGD) platform, India Meteorological Department (IMD), Ministry of Earth Sciences, Government of India.
4. **Karnataka Crop Production Dataset:** Directorate of Economics and Statistics, Department of Agriculture and Farmers Welfare, Government of Karnataka.
5. **Agmarknet Mandi Rates:** Agricultural Marketing Information Network (Agmarknet), Directorate of Marketing & Inspection (DMI), Ministry of Agriculture and Farmers Welfare, Government of India (`data.gov.in`).
6. **Open-Meteo Weather API:** Open-source weather API powered by national weather service forecast models (DWD, NOAA, ECMWF).
7. **OpenStreetMap Nominatim:** OpenStreetMap Foundation community geocoding database under the Open Database License (ODbL).

---

<p align="center">
  <strong>AgroIntel — Final Year Engineering Project</strong><br>
  <em>Designed and developed with precision for empirical agricultural empowerment.</em>
</p>
