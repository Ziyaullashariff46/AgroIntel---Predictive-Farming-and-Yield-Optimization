# AgroIntel — Dev Server Run Doc

## How to reproduce uncommitted artifacts

No build step needed — this is a pure Python/Flask app with no compilation.

1. **Copy `.env` from main checkout** (optional — the app works without it, API keys fall back to hardcoded defaults):
   ```
   copy "D:\Coding\Final Year Project\Agrointel\AgroIntel\.env" .env
   ```

2. **Install dependencies** (if not already present):
   ```
   pip install -r requirements.txt
   ```

3. **Initialize the database** (done automatically on first boot, but can be run manually):
   ```
   python init_db.py
   python seed_sample_users.py
   ```

## How to run the server

```bash
python app.py
```

- **Port**: 5000 (default, configured in `app.py`)
- **Host**: 0.0.0.0 (accessible from all interfaces)
- **Debug**: False (production-like)
- **URL**: http://127.0.0.1:5000

### Sample Login Credentials
- **Farmer**: email `farmer@agrointel.com`, password `Demo@2026!`
- **Admin**: username `admin`, password `Demo@2026!`

### Key Notes
- The app uses SQLite (`agrointel.db`) — created automatically on first run
- Weather/Market API calls work without API keys (fallback data is provided)
- ML models are cached after first use per endpoint
- CSRF tokens are required on all POST forms
