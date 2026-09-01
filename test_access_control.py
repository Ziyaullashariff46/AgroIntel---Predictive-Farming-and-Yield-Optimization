"""
Access-control regression check.

Hits every protected URL with a clean session (no cookie) and asserts the
before_request guard refuses it. This is the check for the critical finding:
"farmer portal URLs rendered the full authenticated page with no login".

Run:  python test_access_control.py
"""
from app import app

PORTAL_ROUTES = [
    '/farmer/crop_recommendation',
    '/farmer/fertilizer_recommendation',
    '/farmer/crop_prediction',
    '/farmer/yield_prediction',
    '/farmer/rainfall_prediction',
    '/farmer/weather_forecast',
    '/farmer/market_prices',
    '/admin/farmers',
    '/admin/messages',
]

API_ROUTES = [
    '/api/weather/coords/13.34/74.74',
    '/api/weather/city/Udupi',
    '/api/nearby_cities/13.34/74.74',
    '/api/reverse_geocode/13.34/74.74',
    '/api/market_prices?city=Udupi',
]

PUBLIC_ROUTES = ['/', '/contact', '/login/farmer', '/login/admin', '/register/farmer']


def main():
    app.config['WTF_CSRF_ENABLED'] = False

    with app.test_client() as c:
        for url in PORTAL_ROUTES:
            r = c.get(url)
            assert r.status_code == 302, f'{url} returned {r.status_code}, expected 302 redirect'
            assert '/login/' in r.headers['Location'], f'{url} redirected to {r.headers["Location"]}'

        for url in API_ROUTES:
            r = c.get(url)
            assert r.status_code == 401, f'{url} returned {r.status_code}, expected 401'

        for url in PUBLIC_ROUTES:
            r = c.get(url)
            assert r.status_code == 200, f'public {url} returned {r.status_code}, expected 200'

    # A farmer session must actually get through.
    with app.test_client() as c:
        with c.session_transaction() as s:
            s['user_type'] = 'farmer'
            s['farmer_name'] = 'Test'
        r = c.get('/farmer/crop_recommendation')
        assert r.status_code == 200, f'logged-in farmer got {r.status_code}, expected 200'

    # A farmer session must NOT reach the admin dashboards.
    with app.test_client() as c:
        with c.session_transaction() as s:
            s['user_type'] = 'farmer'
        r = c.get('/admin/farmers')
        assert r.status_code == 302, f'farmer reached /admin/farmers with {r.status_code}'

    # No seeded account may keep a dictionary-word password.
    import sqlite3
    from app import DB_FILE
    conn = sqlite3.connect(DB_FILE)
    weak = conn.execute("SELECT email FROM farmerlogin WHERE password = 'password'").fetchall()
    weak += conn.execute("SELECT admin_name FROM admin WHERE admin_password = 'password'").fetchall()
    conn.close()
    assert not weak, f'accounts still using the password "password": {weak}'

    # The published fallback secret must be gone — a known key means forgeable
    # admin cookies, which would defeat every check above.
    assert app.secret_key != 'agrointel_secret_key_2026', \
        'app.secret_key is still the value hardcoded in the public repo'

    print('OK - all portal routes redirect, all API routes 401, public routes reachable,')
    print('     farmer session works, farmer cannot reach admin, no weak seeded passwords,')
    print('     no hardcoded session secret.')


if __name__ == '__main__':
    main()
