import pytest
import re
from app import app, _get_rainfall_df

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    with app.test_client() as client:
        with client.session_transaction() as sess:
            sess['user_type'] = 'farmer'
            sess['farmer_id'] = 1
            sess['farmer_name'] = 'Test Farmer'
        yield client

def test_rainfall_prediction_subdivisions(client):
    """Test that each Karnataka subdivision and alias returns distinct, accurate rainfall."""
    test_cases = [
        ('COASTAL KARNATAKA', 'JUL', 1000.0, 1300.0),       # High monsoonal rainfall
        ('NORTH INTERIOR KARNATAKA', 'JUL', 100.0, 200.0),   # Rain shadow zone
        ('SOUTH INTERIOR KARNATAKA', 'JUL', 180.0, 300.0),   # Moderate interior rainfall
        ('MARATHWADA', 'JUL', 150.0, 250.0),                 # Aliased to MATATHWADA
        ('RAYALASEEMA', 'JUL', 50.0, 150.0),                 # Aliased to RAYALSEEMA
        ('ORISSA', 'JUL', 250.0, 450.0),                     # Odisha
    ]

    for region, month, min_expected, max_expected in test_cases:
        res = client.post('/farmer/rainfall_prediction', data={
            'region': region,
            'month': month
        })
        assert res.status_code == 200
        html = res.data.decode('utf-8')
        # Check that result is rendered in the HTML
        match = re.search(r'([\d\.]+)\s*<span style="font-size: 1\.2rem;">mm</span>', html)
        assert match is not None, f"Expected rainfall result not found in HTML for {region}"
        val = float(match.group(1))
        assert min_expected <= val <= max_expected, f"Rainfall {val} mm for {region} out of expected range ({min_expected}-{max_expected})"

def test_rainfall_template_contains_district_mapping_and_synchronization(client):
    """Test that the template contains the dynamic mapping engine and event handlers."""
    res = client.get('/farmer/rainfall_prediction')
    assert res.status_code == 200
    html = res.data.decode('utf-8')

    # Verify event handlers and IDs
    assert 'id="stateSelect"' in html
    assert 'id="districtSelect"' in html
    assert 'onRainDistrictChange()' in html
    assert 'onRainStateChange()' in html
    assert 'resolveSubdivision()' in html
    assert 'getIMDSubdivision' in html
    assert 'DISTRICT_ZONE_MAP' in html

    # Verify Karnataka subdivisions in presets
    assert 'S. Interior Karnataka' in html
    assert 'N. Interior Karnataka' in html
    assert 'Coastal Karnataka' in html

    # Verify key districts are present in the mapping engine
    for dist in ['UDUPI', 'DAKSHIN KANNAD', 'BENGALURU URBAN', 'MYSORE', 'BELGAUM', 'GULBARGA', 'TUMKUR', 'HASSAN']:
        assert dist in html, f"District {dist} missing from client-side mapping"
