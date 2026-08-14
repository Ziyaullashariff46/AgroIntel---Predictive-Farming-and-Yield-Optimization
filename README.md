# 🌱 AgroIntel: Predictive Farming and Yield Optimization

**AgroIntel** is a modern, AI-powered smart agriculture platform designed to empower farmers with data-driven insights. By combining Machine Learning models with real-time meteorological and market data, AgroIntel helps farmers make optimal decisions regarding crop selection, fertilizer usage, yield estimation, and market intelligence.

---

## ✨ Key Features & AI Suite

The platform offers a comprehensive **Farmer Portal** featuring a suite of intelligent tools:

### 🧠 1. Smart Crop Recommendation
- **Model**: Random Forest Classifier (Supervised Ensemble)
- **Function**: Recommends the highest-yielding crop based on soil macro-nutrients (N, P, K), micro-climate metrics (Temperature, Humidity), soil pH, and expected rainfall.
- **Data**: Trained on 2,200 Indian agricultural records.

### 🧪 2. Fertilizer Advisory System
- **Model**: Decision Tree Classifier
- **Function**: Recommends the optimal NPK fertilizer formula tailored to specific soil types, crop choices, and environmental conditions (temperature, humidity, soil moisture).

### 📈 3. Yield Harvest Forecast
- **Model**: Random Forest Regressor
- **Function**: Estimates the agricultural output (in tonnes) for a given region.
- **Inputs**: State, District, Season, Crop Type, and cultivated Area (in hectares).
- **Data**: Trained on extensive crop production datasets across Indian states.

### 🌧️ 4. Rainfall Estimation & Weather Forecasting
- **Historical Rainfall Estimation**: Predicts monthly rainfall for Indian meteorological subdivisions using 115 years of IMD historical data.
- **Live Weather Forecast**: Real-time local weather conditions and a 5-day rolling forecast utilizing the OpenWeather API.
- **Features**: Includes automatic geolocation detection and quick-access regional presets.

### 📊 5. Live Market Intelligence (Mandi Prices)
- **Function**: Displays real-time APMC commodity rates sourced directly from **Agmarknet** (Ministry of Agriculture, Govt. of India).
- **Features**: 
  - Live search by city or district.
  - Automatic geolocation detection to find nearby markets.
  - Clean, responsive data tables highlighting minimum, maximum, and modal prices (₹/quintal).
  - Graceful fallbacks to the last known market rates if live data is temporarily unavailable.

### 🔮 6. Price Trend Predictor
- **Function**: Forecasts market price trends and recommends high-demand crops based on state, district, and current season.

---

## 🎨 Premium UI / UX Design

AgroIntel features a completely bespoke, highly polished user interface:
- **Glassmorphism Aesthetics**: Built with a custom Vanilla CSS design system (`modern-agrointel.css`) featuring sleek glass cards, soft glow effects, and modern gradients.
- **Responsive Layouts**: Fully optimized for both desktop and mobile viewing.
- **Model Intelligence Transparency**: Every AI tool includes a dedicated "Model Intelligence" section that clearly explains to the user *which* machine learning model is being used and *on what basis* the recommendation is made.
- **Light & Dark Mode**: Carefully calibrated contrast ratios, visible focus indicators, and harmonious color palettes (Sage & Mint themes).

---

## 🚀 Technology Stack

- **Backend Framework**: Python / Flask
- **Machine Learning**: Scikit-Learn, Pandas, NumPy
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript
- **Database**: SQLite (for User & Admin management)
- **External APIs**: 
  - `data.gov.in` (Live Mandi Prices)
  - `OpenWeatherMap` (Live Weather & Geocoding)
  - `OpenStreetMap Nominatim` (Reverse Geocoding)

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.9+
- pip (Python package manager)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/AgroIntel.git
cd AgroIntel
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```
*(Dependencies include Flask, pandas, numpy, scikit-learn, requests, and python-dotenv)*

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the project and add your API keys:
```env
FLASK_SECRET_KEY=your_secure_flask_secret_key
OPENWEATHER_API_KEY=your_openweather_api_key_here
DATA_GOV_API_KEY=your_data_gov_api_key_here
```

### 4. Run the Application
Start the standalone Flask server:
```bash
python app.py
```
Access the application in your web browser at: `http://127.0.0.1:5000`

---

## 📝 Recent Architecture Updates

- **Migration to Pure Python/Flask**: The project has been fully migrated away from legacy PHP scripts to a unified, high-performance Flask architecture.
- **Security Enhancements**: Hardcoded API keys have been removed in favor of secure `.env` environment variables.
- **ML Stability**: Fixed PyArrow and Pandas backend compatibility issues to ensure stable array processing for scikit-learn predictions.
- **Streamlined Scope**: E-commerce and buyer-side marketplace features were removed to focus exclusively on delivering the best predictive analytics and intelligence tools for Farmers.
