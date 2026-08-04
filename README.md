# AgroIntel 🌾🤖
> **AI-Powered Smart Agriculture & Direct Produce Marketplace Platform**

AgroIntel is an end-to-end intelligent agricultural management portal designed to empower farmers, buyers, and agricultural administrators. Built with Python Flask, Scikit-learn Machine Learning models, and modern Glassmorphism UI aesthetics, AgroIntel provides scientific crop recommendations, fertilizer planning, harvest yield estimations, market price trend predictions, weather forecasting, and direct farmer-to-buyer produce trading without middleman commission markups.

---

## ✨ Features & Modules

### 🚜 1. Farmer Portal & AI Science Suite
- **🌱 Crop Recommendation System**: Evaluates soil NPK levels (Nitrogen, Phosphorus, Potassium), pH balance, ambient temperature, humidity, and rainfall using a trained **Random Forest Classifier** to suggest optimal crops.
- **🧪 Fertilizer Advisory System**: Analyzes soil nutrient deficits against target crop requirements using **Decision Tree Classifiers** to recommend tailored, eco-friendly fertilizer formulations.
- **📈 Crop Price & Suitability Predictor**: Utilizes historical agricultural metrics across Indian states and districts to forecast market price trends and crop cultivation suitability.
- **🌾 Yield Output Predictor**: Estimates total crop harvest production (in Tonnes) based on land size (in Hectares) and district historical data using **Random Forest Regressors**.
- **🌧️ Subdivision Rainfall Forecasting**: Delivers monthly rainfall estimations across all subdivisions in India derived from 115-year IMD (India Meteorological Department) climate logs.
- **🌤️ Live Weather Forecast**: Displays real-time temperature, humidity, wind speed, and atmospheric conditions via OpenWeather API integration.
- **🛒 Direct Produce Trading**: Enables farmers to list harvested crops with prices and quantities for direct trading with registered buyers.
- **📜 Trade Selling History**: Track past produce sales, buyer details, quantities sold, and revenue logs.

---

### 🛒 2. Buyer / Customer Marketplace
- **🌾 Crop Produce Catalog**: Browse live agricultural produce listings posted by verified farmers across districts.
- **🛍️ Direct Order Booking**: Purchase crops directly from farmers at transparent prices without commission markups.
- **📞 Direct Support & Inquiries**: Send messages and feedback directly to platform administrators.

---

### 🛡️ 3. Admin Command Center
- **👨‍🌾 Farmer Management**: View registered farmers, monitor activities, and delete invalid farmer accounts.
- **🧑‍🤝‍🧑 Customer/Buyer Management**: Manage registered buyer accounts and customer details.
- **💬 Feedback & Support Center**: Review user inquiries and support messages submitted through the platform.

---

### 🌓 4. Dual Light/Dark Theme Engine
- **Sliding Pill Toggle Switch**: Integrated dual-theme engine (`data-theme="light"` and `data-theme="dark"`) with smooth sliding knob animation.
- **Persistence**: Remembers user theme preference across browser sessions using `localStorage`.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.x, Flask Web Framework
- **Machine Learning**: Scikit-learn, Pandas, NumPy, Joblib
- **Database**: SQLite 3 (`agrointel.db`)
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System with CSS Custom Properties), JavaScript (ES6+)
- **UI & Iconography**: Glassmorphism aesthetic, Plus Jakarta Sans & Inter fonts, FontAwesome 6 Free icons, Bootstrap 4.6 Grid

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8+ installed on your system.
- Git (optional).

### 1. Clone or Download Repository
```bash
git clone https://github.com/vaishnavid0604/agriculture-portal.git
cd AgroIntel
```

### 2. Install Required Python Packages
```bash
pip install -r requirements.txt
```

### 3. Initialize Database
Initialize the SQLite database (`agrointel.db`) from SQL schema logs:
```bash
python init_db.py
```

### 4. Seed Sample Accounts
Seed dedicated test accounts for Admin, Farmer, and Buyer roles:
```bash
python seed_sample_users.py
```

### 5. Run the Application
Launch the standalone Flask application:
```bash
python app.py
# or run the automated launcher script
python run.py
```
Open your browser and navigate to: **`http://127.0.0.1:5000`**

---

## 🔑 Sample Login Credentials

| Role | Portal Login URL | Username / Email | Password |
| :--- | :--- | :--- | :--- |
| **🛡️ Admin** | `http://127.0.0.1:5000/login/admin` | `admin` | `password` |
| **🚜 Farmer** | `http://127.0.0.1:5000/login/farmer` | `farmer@agrointel.com` | `password` |
| **🛒 Buyer** | `http://127.0.0.1:5000/login/customer` | `buyer@agrointel.com` | `password` |

*(Detailed credential notes are also available in [`SAMPLE_LOGINS.md`](SAMPLE_LOGINS.md)).*

---

## 📁 Project Directory Structure

```text
AgroIntel/
├── app.py                      # Main Flask Web Server & Route Handlers
├── init_db.py                  # Database Initializer (MySQL SQL -> SQLite Converter)
├── seed_sample_users.py        # Test User Seeding Script
├── run.py                      # Server Automated Launcher
├── run.bat                     # Windows Batch Launcher
├── agrointel.db                # Embedded SQLite Database
├── requirements.txt            # Python Dependencies
├── SAMPLE_LOGINS.md            # Sample Credentials Documentation
├── README.md                   # Project Overview & Setup Guide
├── assets/                     # Static Web Assets
│   ├── css/
│   │   └── modern-agrointel.css# Glassmorphic Design System & Dual Theme Engine
│   └── img/                    # Logos & UI Graphics
├── db/
│   └── agriculture_portal.sql  # Original Database Schema SQL Dump
├── farmer/
│   └── ML/                     # Machine Learning Models & Datasets
│       ├── crop_recommendation/
│       ├── fertilizer_recommendation/
│       ├── crop_prediction/
│       ├── yield_prediction/
│       └── rainfall_prediction/
└── templates/                  # Jinja2 HTML View Templates
    ├── base.html               # Sticky Navbar, Footer & Layout Shell
    ├── index.html              # Modern Hero Landing Page
    ├── login.html              # Auth Login Form
    ├── register.html           # User Registration Form
    ├── crop_recommendation.html
    ├── fertilizer_recommendation.html
    ├── crop_prediction.html
    ├── yield_prediction.html
    ├── rainfall_prediction.html
    ├── weather_forecast.html
    ├── trade_crops.html
    ├── selling_history.html
    ├── customer_buy_crops.html
    ├── admin_dashboard.html
    └── contact.html
```

---

## 🤝 Contributing & Support

Contributions, bug reports, and feature requests are welcome! Feel free to open an issue or submit a pull request.
