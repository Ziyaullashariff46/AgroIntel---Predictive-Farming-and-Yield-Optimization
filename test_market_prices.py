"""Headless checks for the Live Mandi Prices district dropdown.

Run: python test_market_prices.py
Covers the parts that break silently: dropdown data shape, chip validity,
state-aware fallback, and the ambiguous-district disambiguation.
"""
import json
import re
import sys

import app as appmod

sys.stdout.reconfigure(encoding='utf-8')

app = appmod.app
app.config.update(TESTING=True, WTF_CSRF_ENABLED=False)
c = app.test_client()

r = c.get('/login/farmer')
m = re.search(r'name="csrf_token"[^>]*value="([^"]+)"', r.data.decode('utf-8', 'replace'))
assert m, 'login page must expose csrf_token'
c.post('/login/farmer', data={'email': 'farmer@agrointel.com', 'password': 'Demo@2026!', 'csrf_token': m.group(1)})

h = c.get('/farmer/market_prices')
assert h.status_code == 200, 'page must render'
h = h.data.decode('utf-8')

# Free-text city box gone; both dropdowns present
assert 'citySearch' not in h, 'free-text city input must be gone'
assert 'id="stateSelect"' in h and 'id="districtSelect"' in h

# JSON island: 33 states, 646 unique districts, known ambiguous set
data = json.loads(re.search(
    r'<script type="application/json" id="districts-data">(.*?)</script>', h, re.S).group(1))
assert len(data) == 33, f'expected 33 states, got {len(data)}'
occ = {}
for ds in data.values():
    for d in ds:
        occ[d] = occ.get(d, 0) + 1
assert len(occ) == 646, f'expected 646 unique districts, got {len(occ)}'
ambiguous = {d for d, n in occ.items() if n > 1}
assert ambiguous == {'AURANGABAD', 'BALRAMPUR', 'BIJAPUR', 'BILASPUR', 'HAMIRPUR', 'PRATAPGARH'}

# Every quick-access chip names a district that exists in its state
chips = re.findall(r"loadDistrict\('([^']+)', '([^']+)'\)", h)
assert chips, 'chips must exist'
bad = [(s, d) for s, d in chips if d not in data.get(s, [])]
assert not bad, f'chips referencing unknown districts: {bad}'

# State-aware fallback: same district name, different states -> different crops
dm = c.get('/api/market_prices?city=AURANGABAD&state=Maharashtra').get_json()
db = c.get('/api/market_prices?city=AURANGABAD&state=Bihar').get_json()
assert dm['state'] == 'Maharashtra' and db['state'] == 'Bihar'
sm = sorted(p['commodity'] for p in dm['prices'])
sb = sorted(p['commodity'] for p in db['prices'])
assert sm and sb and sm != sb, 'ambiguous district must disambiguate by state'
assert sm == sorted(appmod._find_district_crops('AURANGABAD', 'Maharashtra'))
assert sb == sorted(appmod._find_district_crops('AURANGABAD', 'Bihar'))

# District we cover -> district-level fallback with today's date
from datetime import datetime
d = c.get('/api/market_prices?city=UDUPI&state=Karnataka').get_json()
assert d['is_fallback'] and d['count'] == 10 and d['city'] == 'UDUPI'
assert d['prices'][0]['arrival_date'] == datetime.now().strftime('%d/%m/%Y')

# District we don't cover -> graceful generic fallback, not a 500
d = c.get('/api/market_prices?city=NOWHERE&state=Karnataka').get_json()
assert d['count'] > 0

# Regression: sibling farmer pages still render
for url in ('/farmer/crop_prediction', '/farmer/weather_forecast',
            '/farmer/yield_prediction', '/farmer/crop_recommendation',
            '/farmer/market_prices'):
    assert c.get(url).status_code == 200, url

print(f'OK: 33 states, 646 districts, {len(chips)} valid chips, '
      'Aurangabad disambiguates, fallback + regressions pass')
