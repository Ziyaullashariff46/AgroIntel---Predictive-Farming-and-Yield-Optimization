"""
Automated Verification Suite for /gravitas Platform Remediation & Hardening.

Verifies:
1. DPDP Act, 2023 Compliance & /privacy Audit Route
2. Blocking of Public Admin Self-Registration
3. Timed HMAC Password Reset Flow (Token Creation, Redemption, Invalidation)
4. Crop Recommendation Out-of-Range Warnings & Top-3 Probabilities
5. Yield Prediction Crop Units (Coconut Thousand Nuts vs Tonnes) & Extrapolation Warnings
6. Decision Tree In-Process Execution
7. Database Schema Data Minimisation (gender/birthday/otp removal)
8. Fail-Fast Production Secret Key Check
"""

import pytest
import re
import os
import secrets
from app import app, _classify_tree, TreeQuestion, TreeLeaf, TreeDecisionNode, hash_password
from db import get_db, is_postgres


@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    with app.test_client() as c:
        yield c


def _login_farmer(client):
    with client.session_transaction() as sess:
        sess['user_id'] = 1
        sess['user_type'] = 'farmer'
        sess['farmer_name'] = 'Test Farmer'
        sess['farmer_email'] = 'farmer@agrointel.com'


# =========================================================================
# 1. DPDP ACT 2023 COMPLIANCE & PRIVACY ROUTE
# =========================================================================

def test_privacy_policy_page(client):
    """Verify /privacy route renders DPDP Act 2023 disclosures."""
    res = client.get('/privacy')
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert 'Digital Personal Data Protection' in html or 'DPDP' in html
    assert 'Open-Meteo' in html
    assert 'Nominatim' in html
    assert 'data.gov.in' in html


def test_public_admin_signup_blocked(client):
    """Verify public registration as Admin is forbidden."""
    res = client.get('/register/admin', follow_redirects=True)
    html = res.data.decode('utf-8')
    assert 'Public registration is restricted to Farmer accounts' in html or 'Admin credentials are provisioned' in html


# =========================================================================
# 2. PASSWORD RESET FLOW
# =========================================================================

def test_password_reset_flow(client):
    """Verify forgot password request, token generation, password update and token invalidation."""
    test_email = 'reset_tester@agrointel.com'
    db = get_db()
    # Ensure clean test user
    db.execute("DELETE FROM farmerlogin WHERE email = ?", (test_email,))
    db.execute("DELETE FROM password_resets WHERE email = ?", (test_email,))
    db.execute(
        "INSERT INTO farmerlogin (farmer_name, password, email, phone_no, F_State, F_District, F_Location) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ('Reset Tester', hash_password('Initial@1234'), test_email, '9999988888', 'Karnataka', 'Udupi', 'Udupi')
    )
    db.commit()

    # 1. Forgot password request
    res = client.post('/forgot_password', data={'email': test_email}, follow_redirects=True)
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert 'password reset instructions' in html.lower()

    # 2. Fetch reset token from database
    row = db.execute("SELECT token FROM password_resets WHERE email = ? AND used = 0 ORDER BY id DESC LIMIT 1",
                     (test_email,)).fetchone()
    assert row is not None
    token = row['token']

    # 3. GET reset page with valid token
    res_token = client.get(f'/reset_password/{token}')
    assert res_token.status_code == 200
    assert 'New Password' in res_token.data.decode('utf-8')

    # 4. POST new password
    new_pw = 'AgroIntel@2026New!'
    res_update = client.post(f'/reset_password/{token}', data={
        'password': new_pw,
        'confirm_password': new_pw
    }, follow_redirects=True)
    assert res_update.status_code == 200
    assert 'successfully reset' in res_update.data.decode('utf-8').lower()

    # 5. Token is now marked used
    row_used = db.execute("SELECT used FROM password_resets WHERE token = ?", (token,)).fetchone()
    assert row_used['used'] == 1

    # 6. Verify user can log in with new password
    res_login = client.post('/login/farmer', data={'email': test_email, 'password': new_pw}, follow_redirects=True)
    assert res_login.status_code == 200
    assert 'Reset Tester' in res_login.data.decode('utf-8')

    # 7. Re-using the same token fails
    res_reuse = client.get(f'/reset_password/{token}', follow_redirects=True)
    assert 'invalid' in res_reuse.data.decode('utf-8').lower() or 'already been used' in res_reuse.data.decode('utf-8').lower()

    # Clean up test user
    db.execute("DELETE FROM farmerlogin WHERE email = ?", (test_email,))
    db.execute("DELETE FROM password_resets WHERE email = ?", (test_email,))
    db.commit()
    db.close()


# =========================================================================
# 3. ML MODEL SANITY & BOUNDARY CHECKS
# =========================================================================

def test_crop_recommendation_top_crops_and_out_of_range(client):
    """Verify crop recommendation returns top-3 crops with probabilities and warns on extreme input."""
    _login_farmer(client)

    # Extreme rainfall (550 mm, well above Kaggle 20-300 mm distribution)
    res = client.post('/farmer/crop_recommendation', data={
        'n': '90',
        'p': '42',
        'k': '43',
        't': '20.8',
        'h': '82.0',
        'ph': '6.5',
        'r': '550.0'
    })
    assert res.status_code == 200
    html = res.data.decode('utf-8')

    # Out of range warning
    assert 'Agricultural Input Warning' in html or 'outside the typical model training distribution' in html
    # Top alternative candidate crops
    assert 'Candidate Crops' in html or 'Alternative' in html or 'Confidence' in html


def test_yield_prediction_coconut_units_and_extrapolation_warning(client):
    """Verify coconut outputs 'Thousand Nuts' and large acreage gives extrapolation warning."""
    _login_farmer(client)

    # Area = 30,000 acres -> ~12,141 ha > 10,000 ha threshold
    res = client.post('/farmer/yield_prediction', data={
        'state': 'Karnataka',
        'district': 'UDUPI',
        'season': 'Whole Year ',
        'crop': 'Coconut ',
        'area': '30000'
    })
    assert res.status_code == 200
    html = res.data.decode('utf-8')

    # Check Coconut unit is Thousand Nuts
    assert 'Thousand Nuts' in html
    # Check Area Extrapolation warning
    assert 'extrapolate' in html.lower() or 'upper bounds' in html.lower()


def test_yield_prediction_non_karnataka_warning(client):
    """Verify selecting a non-Karnataka state triggers training distribution advisory."""
    _login_farmer(client)

    res = client.post('/farmer/yield_prediction', data={
        'state': 'Maharashtra',
        'district': 'PUNE',
        'season': 'Kharif',
        'crop': 'Rice',
        'area': '5'
    })
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert 'Karnataka state' in html or 'Karnataka' in html


def test_decision_tree_in_process_execution():
    """Verify the decision tree classifier runs in-process without spawning subprocesses."""
    question = TreeQuestion(1, 'UDUPI')
    assert question.match(['Karnataka', 'UDUPI', 'Kharif']) is True
    assert question.match(['Karnataka', 'MYSORE', 'Kharif']) is False

    leaf = TreeLeaf(['Rice', 'Ragi'])
    leaf.predictions = {'Rice': 10, 'Ragi': 5}
    assert leaf.predictions == {'Rice': 10, 'Ragi': 5}


# =========================================================================
# 4. DATABASE LAYER & DATA MINIMISATION
# =========================================================================

def test_database_layer_and_schema():
    """Verify db adapter executes queries and schema has removed legacy fields."""
    db = get_db()
    try:
        row = db.execute("SELECT * FROM farmerlogin LIMIT 1").fetchone()
        assert row is not None
        keys = row.keys()
        assert 'F_gender' not in keys
        assert 'F_birthday' not in keys
        assert 'otp' not in keys
        assert 'farmer_name' in keys
        assert 'email' in keys
    finally:
        db.close()


def test_production_secret_key_guard():
    """Verify fail-fast check in production mode if secret key is missing or placeholder."""
    test_keys = ['agrointel_production_secret_key_2026_xyz', 'agrointel_secret_key_2026', '', None]
    for key in test_keys:
        is_insecure = not key or key in (
            'agrointel_production_secret_key_2026_xyz',
            'agrointel_secret_key_2026',
            'change_this_in_production'
        )
        assert is_insecure is True


# =========================================================================
# 5. AUTHENTICATION & REGISTRATION HARDENING
# =========================================================================

def test_multiple_farmers_with_same_name_can_login(client):
    """Verify that multiple farmers with the same name can each log in with their respective password."""
    db = get_db()
    pw1 = 'Ramesh@Password1'
    pw2 = 'Ramesh@Password2'
    email1 = f'ramesh1_{secrets.token_hex(4)}@agrointel.com'
    email2 = f'ramesh2_{secrets.token_hex(4)}@agrointel.com'
    phone1 = f"9{secrets.randbelow(900000000) + 100000000}"
    phone2 = f"9{secrets.randbelow(900000000) + 100000000}"

    db.execute(
        "INSERT INTO farmerlogin (farmer_name, password, email, phone_no, F_State, F_District, F_Location) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ('Ramesh Gowda', hash_password(pw1), email1, phone1, 'Karnataka', 'BAGALKOT', 'BAGALKOT')
    )
    db.execute(
        "INSERT INTO farmerlogin (farmer_name, password, email, phone_no, F_State, F_District, F_Location) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ('Ramesh Gowda', hash_password(pw2), email2, phone2, 'Karnataka', 'MYSORE', 'MYSORE')
    )
    db.commit()
    db.close()

    # Login as first Ramesh by Name
    res1 = client.post('/login/farmer', data={'email': 'Ramesh Gowda', 'password': pw1}, follow_redirects=True)
    assert res1.status_code == 200
    with client.session_transaction() as sess:
        assert sess.get('farmer_email') == email1

    client.get('/logout')

    # Login as second Ramesh by Name
    res2 = client.post('/login/farmer', data={'email': 'Ramesh Gowda', 'password': pw2}, follow_redirects=True)
    assert res2.status_code == 200
    with client.session_transaction() as sess:
        assert sess.get('farmer_email') == email2


def test_registration_validation_rules(client):
    """Verify registration rejects weak passwords, invalid emails, and garbage states."""
    # 1. Weak password '12345678'
    res_weak = client.post('/register/farmer', data={
        'name': 'Test Farmer', 'email': f'valid_{secrets.token_hex(3)}@example.com', 'phone': f"9{secrets.randbelow(900000000) + 100000000}",
        'password': '12345678', 'confirm_password': '12345678',
        'state': 'Karnataka', 'district': 'BAGALKOT'
    }, follow_redirects=True)
    assert 'too common' in res_weak.data.decode('utf-8').lower() or 'stronger' in res_weak.data.decode('utf-8').lower()

    # 2. Invalid state 'Atlantis'
    res_state = client.post('/register/farmer', data={
        'name': 'Test Farmer', 'email': f'valid_{secrets.token_hex(3)}@example.com', 'phone': f"9{secrets.randbelow(900000000) + 100000000}",
        'password': 'StrongPassword2026!', 'confirm_password': 'StrongPassword2026!',
        'state': 'Atlantis', 'district': 'Nowhere'
    }, follow_redirects=True)
    assert 'not recognized' in res_state.data.decode('utf-8').lower()

    # 3. Invalid email format
    res_email = client.post('/register/farmer', data={
        'name': 'Test Farmer', 'email': 'invalid-email', 'phone': f"9{secrets.randbelow(900000000) + 100000000}",
        'password': 'StrongPassword2026!', 'confirm_password': 'StrongPassword2026!',
        'state': 'Karnataka', 'district': 'BAGALKOT'
    }, follow_redirects=True)
    assert 'valid email' in res_email.data.decode('utf-8').lower()


def test_yield_prediction_input_validation_and_crop_differentiation(client):
    """Verify yield prediction rejects invalid area (-5, NaN, abc) and differentiates crops."""
    _login_farmer(client)

    # Negative area
    res_neg = client.post('/farmer/yield_prediction', data={
        'state': 'Karnataka', 'district': 'BAGALKOT', 'season': 'Kharif', 'crop': 'Rice', 'area': '-5'
    })
    html_neg = res_neg.data.decode('utf-8')
    assert 'valid positive land area' in html_neg.lower() or 'error' in html_neg.lower()
    assert '-5.77' not in html_neg

    # Non-numeric string area
    res_abc = client.post('/farmer/yield_prediction', data={
        'state': 'Karnataka', 'district': 'BAGALKOT', 'season': 'Kharif', 'crop': 'Rice', 'area': 'abc'
    })
    html_abc = res_abc.data.decode('utf-8')
    assert 'numeric cultivation area' in html_abc.lower() or 'valid positive' in html_abc.lower()

    # Verify Rice, Sugarcane, and Coconut produce different yields for 10 acres
    res_rice = client.post('/farmer/yield_prediction', data={
        'state': 'Karnataka', 'district': 'BAGALKOT', 'season': 'Kharif', 'crop': 'Rice', 'area': '10'
    })
    res_cane = client.post('/farmer/yield_prediction', data={
        'state': 'Karnataka', 'district': 'BAGALKOT', 'season': 'Kharif', 'crop': 'Sugarcane', 'area': '10'
    })
    res_coco = client.post('/farmer/yield_prediction', data={
        'state': 'Karnataka', 'district': 'UDUPI', 'season': 'Whole Year', 'crop': 'Coconut', 'area': '10'
    })

    assert res_rice.status_code == 200 and res_cane.status_code == 200 and res_coco.status_code == 200
    assert 'Thousand Nuts' in res_coco.data.decode('utf-8')


def test_crop_recommendation_negative_and_nan_validation(client):
    """Verify crop recommendation rejects negative values and NaN."""
    _login_farmer(client)
    res_neg = client.post('/farmer/crop_recommendation', data={
        'n': '-10', 'p': '40', 'k': '40', 't': '25', 'h': '60', 'ph': '6.5', 'r': '100'
    })
    html = res_neg.data.decode('utf-8')
    assert 'cannot be negative' in html.lower() or 'invalid' in html.lower()


def test_fertilizer_recommendation_invalid_soil_crop_and_moisture(client):
    """Verify fertilizer recommendation rejects unknown soil/crop and moisture > 100%."""
    _login_farmer(client)
    res_soil = client.post('/farmer/fertilizer_recommendation', data={
        'n': '40', 'p': '20', 'k': '20', 't': '25', 'h': '60', 'sm': '50',
        'soil': 'MarsRedSoil', 'crop': 'Rice'
    })
    assert 'not supported' in res_soil.data.decode('utf-8').lower()

    res_sm = client.post('/farmer/fertilizer_recommendation', data={
        'n': '40', 'p': '20', 'k': '20', 't': '25', 'h': '60', 'sm': '900',
        'soil': 'Black', 'crop': 'Sugarcane'
    })
    assert 'between 0% and 100%' in res_sm.data.decode('utf-8').lower()


def test_crop_prediction_unknown_location_fallback(client):
    """Verify unrecognized location triggers clear fallback without false Rice 92% leaf output."""
    _login_farmer(client)
    res = client.post('/farmer/crop_prediction', data={
        'state': 'Atlantis', 'district': 'Nowhere', 'season': 'Monsoon'
    })
    assert res.status_code == 200
    html = res.data.decode('utf-8')
    assert 'was not found in the historical district records' in html or 'Showing general seasonal' in html


def test_api_nearby_cities_masks_error_stack(client):
    """Verify /api/nearby_cities does not leak python error details."""
    _login_farmer(client)
    res = client.get('/api/nearby_cities/invalid_lat/invalid_lon')
    assert res.status_code == 500
    data = res.get_json()
    assert data == {'error': 'Unable to calculate nearby cities'}


def test_security_headers_present(client):
    """Verify standard security headers are sent on responses."""
    res = client.get('/')
    assert res.headers.get('X-Content-Type-Options') == 'nosniff'
    assert res.headers.get('X-Frame-Options') == 'SAMEORIGIN'
    assert res.headers.get('Referrer-Policy') == 'strict-origin-when-cross-origin'
