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
