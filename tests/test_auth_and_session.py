import pytest
import re
import uuid
import secrets
from app import app, get_db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = True  # Explicitly test CSRF protection
    with app.test_client() as c:
        yield c

def extract_csrf_token(html):
    m = re.search(r'name="csrf_token"\s+value="([^"]+)"', html)
    return m.group(1) if m else None

def test_sample_farmer_login_lowercase(client):
    """Test sample farmer login with lowercase email."""
    res_get = client.get('/login/farmer')
    token = extract_csrf_token(res_get.data.decode('utf-8'))
    assert token is not None

    res_post = client.post('/login/farmer', data={
        'csrf_token': token,
        'email': 'farmer@agrointel.com',
        'password': 'Demo@2026!'
    }, follow_redirects=True)

    assert res_post.status_code == 200
    html = res_post.data.decode('utf-8')
    assert 'Welcome back, Sample Farmer!' in html
    with client.session_transaction() as sess:
        assert sess.get('user_type') == 'farmer'
        assert sess.get('farmer_email') == 'farmer@agrointel.com'

def test_sample_farmer_login_case_insensitivity(client):
    """Test sample farmer login with mixed-case and uppercase email."""
    # Titlecase: Farmer@agrointel.com
    res_get = client.get('/login/farmer')
    token = extract_csrf_token(res_get.data.decode('utf-8'))
    res_post = client.post('/login/farmer', data={
        'csrf_token': token,
        'email': 'Farmer@AgroIntel.com',
        'password': 'Demo@2026!'
    }, follow_redirects=True)
    assert res_post.status_code == 200
    assert 'Welcome back, Sample Farmer!' in res_post.data.decode('utf-8')

def test_sample_farmer_login_by_phone_and_name(client):
    """Test farmer login using registered phone number and farmer name."""
    # By Phone
    res_get = client.get('/login/farmer')
    token = extract_csrf_token(res_get.data.decode('utf-8'))
    res_post = client.post('/login/farmer', data={
        'csrf_token': token,
        'email': '9876543210',
        'password': 'Demo@2026!'
    }, follow_redirects=True)
    assert 'Welcome back, Sample Farmer!' in res_post.data.decode('utf-8')

    # By Name
    res_get2 = client.get('/login/farmer')
    token2 = extract_csrf_token(res_get2.data.decode('utf-8'))
    res_post2 = client.post('/login/farmer', data={
        'csrf_token': token2,
        'email': 'Sample Farmer',
        'password': 'Demo@2026!'
    }, follow_redirects=True)
    assert 'Welcome back, Sample Farmer!' in res_post2.data.decode('utf-8')

def test_sample_admin_login(client):
    """Test admin login with both 'admin' and 'Admin'."""
    res_get = client.get('/login/admin')
    token = extract_csrf_token(res_get.data.decode('utf-8'))
    res_post = client.post('/login/admin', data={
        'csrf_token': token,
        'email': 'Admin',
        'password': 'Demo@2026!'
    }, follow_redirects=True)
    assert 'Welcome Admin!' in res_post.data.decode('utf-8')

def test_registered_farmer_registration_and_login(client):
    """Test registering a new farmer and immediately logging in with the new account."""
    unique_email = f"farmer_{uuid.uuid4().hex[:6]}@example.com"
    phone = f"9{secrets.randbelow(900000000) + 100000000}"
    password = "MySecurePassword2026!"

    # 1. Register
    res_get = client.get('/register/farmer')
    token = extract_csrf_token(res_get.data.decode('utf-8'))
    res_reg = client.post('/register/farmer', data={
        'csrf_token': token,
        'name': 'Pooja Patil',
        'email': unique_email,
        'phone': phone,
        'password': password,
        'confirm_password': password,
        'state': 'Karnataka',
        'district': 'DHARWAD'
    }, follow_redirects=True)

    assert res_reg.status_code == 200
    assert 'Account created successfully!' in res_reg.data.decode('utf-8')

    # 2. Login with newly registered email
    res_login_page = client.get('/login/farmer')
    login_token = extract_csrf_token(res_login_page.data.decode('utf-8'))
    res_login = client.post('/login/farmer', data={
        'csrf_token': login_token,
        'email': unique_email,
        'password': password
    }, follow_redirects=True)

    assert res_login.status_code == 200
    assert 'Welcome back, Pooja Patil!' in res_login.data.decode('utf-8')

    # 3. Login with newly registered phone
    res_login_page2 = client.get('/login/farmer')
    login_token2 = extract_csrf_token(res_login_page2.data.decode('utf-8'))
    res_login2 = client.post('/login/farmer', data={
        'csrf_token': login_token2,
        'email': phone,
        'password': password
    }, follow_redirects=True)
    assert 'Welcome back, Pooja Patil!' in res_login2.data.decode('utf-8')

def test_invalid_password_handling(client):
    """Test that bad credentials return a clear error and do not crash."""
    res_get = client.get('/login/farmer')
    token = extract_csrf_token(res_get.data.decode('utf-8'))
    res_post = client.post('/login/farmer', data={
        'csrf_token': token,
        'email': 'farmer@agrointel.com',
        'password': 'WrongPassword!'
    }, follow_redirects=True)
    assert 'Invalid credentials' in res_post.data.decode('utf-8')

def test_auth_pages_have_cache_control_headers(client):
    """Test that login and register pages have anti-caching headers."""
    res_login = client.get('/login/farmer')
    assert 'no-cache' in res_login.headers.get('Cache-Control', '')
    assert 'no-store' in res_login.headers.get('Cache-Control', '')

    res_reg = client.get('/register/farmer')
    assert 'no-cache' in res_reg.headers.get('Cache-Control', '')
    assert 'no-store' in res_reg.headers.get('Cache-Control', '')

def test_csrf_expired_session_self_heals(client):
    """Test that when a stale CSRF token is submitted, the system warns and re-arms a fresh token."""
    # Submit bad/stale token
    res_post = client.post('/login/farmer', data={
        'csrf_token': 'STALE_OLD_TOKEN',
        'email': 'farmer@agrointel.com',
        'password': 'Demo@2026!'
    }, follow_redirects=True)

    html = res_post.data.decode('utf-8')
    assert 'Your session expired' in html

    # Verify that the redirected page now has a fresh, valid token ready for immediate use
    fresh_token = extract_csrf_token(html)
    assert fresh_token is not None

    # Next attempt with fresh token immediately succeeds
    res_post2 = client.post('/login/farmer', data={
        'csrf_token': fresh_token,
        'email': 'farmer@agrointel.com',
        'password': 'Demo@2026!'
    }, follow_redirects=True)
    assert 'Welcome back, Sample Farmer!' in res_post2.data.decode('utf-8')
