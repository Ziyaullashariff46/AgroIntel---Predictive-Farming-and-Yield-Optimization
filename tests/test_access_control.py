"""
Access-control regression check.

Hits every protected URL with a clean session (no cookie) and asserts the
before_request guard refuses it. This is the check for the critical finding:
"farmer portal URLs rendered the full authenticated page with no login".

Run:  pytest tests/test_access_control.py
"""
from app import app
from db import get_db

PORTAL_ROUTES = [
    '/farmer/crop_recommendation',
    '/farmer/fertilizer_recommendation',
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

PUBLIC_ROUTES = ['/', '/contact', '/login/farmer', '/login/admin', '/register/farmer', '/privacy']


def test_access_control():
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
    db = get_db()
    weak = db.execute("SELECT email FROM farmerlogin WHERE password = 'password'").fetchall()
    weak += db.execute("SELECT admin_name FROM admin WHERE admin_password = 'password'").fetchall()
    db.close()
    assert not weak, f'accounts still using the password "password": {weak}'

    # The published fallback secret must be gone — a known key means forgeable
    # admin cookies, which would defeat every check above.
    assert app.secret_key != 'agrointel_secret_key_2026', \
        'app.secret_key is still the value hardcoded in the public repo'
    assert app.secret_key != 'agrointel_production_secret_key_2026_xyz', \
        'app.secret_key is using the README example placeholder'


def main():
    test_access_control()
    print('OK - all portal routes redirect, all API routes 401, public routes reachable,')
    print('     farmer session works, farmer cannot reach admin, no weak seeded passwords,')
    print('     no hardcoded session secret.')


if __name__ == '__main__':
    main()
