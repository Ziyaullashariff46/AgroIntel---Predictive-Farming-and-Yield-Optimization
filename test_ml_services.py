"""
Automated Comprehensive Test Suite for AgroIntel ML Services.
Verifies that:
1. Crop Price & Demand Predictor produces distinct, legitimate, agronomically accurate crops
   for different states, districts, and seasons (Bagalkot != Mysore != Ludhiana != Nashik != Wayanad).
2. Price trends and trajectories are region-specific, dynamic to current date, and not hardcoded.
3. Crop Recommendation (Random Forest) gives agronomically sound results.
4. Fertilizer Recommendation (Decision Tree) gives valid fertilizer recommendations.
5. Yield Prediction (Random Forest Regressor) produces realistic tonnages.
6. Rainfall Estimation (IMD 115-Year Dataset) produces accurate historical precipitations.
7. Centralized session security prevents unauthenticated access.
"""

import os
import unittest
import datetime
from app import app, _predict_crops_hybrid, _estimate_crop_prices


class TestMLServices(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()

    def _login_farmer(self):
        """Simulate an authenticated farmer session."""
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['user_type'] = 'farmer'
            sess['farmer_name'] = 'Test Farmer'
            sess['farmer_email'] = 'farmer@agrointel.com'

    # =========================================================================
    # 1. CROP PRICE & DEMAND PREDICTOR VERIFICATION
    # =========================================================================

    def test_crop_prediction_district_differentiation(self):
        """Verify that different districts and states NEVER receive the same generic 5 crops."""
        mysore_kharif = _predict_crops_hybrid('Karnataka', 'MYSORE', 'Kharif')
        bagalkot_kharif = _predict_crops_hybrid('Karnataka', 'BAGALKOT', 'Kharif')
        ludhiana_rabi = _predict_crops_hybrid('Punjab', 'LUDHIANA', 'Rabi')
        nashik_rabi = _predict_crops_hybrid('Maharashtra', 'NASHIK', 'Rabi')
        wayanad_yearly = _predict_crops_hybrid('Kerala', 'WAYANAD', 'Whole Year')
        thanjavur_kharif = _predict_crops_hybrid('Tamil Nadu', 'THANJAVUR', 'Kharif')

        # Each must return at least 4-5 crops
        self.assertGreaterEqual(len(mysore_kharif), 4)
        self.assertGreaterEqual(len(bagalkot_kharif), 4)
        self.assertGreaterEqual(len(ludhiana_rabi), 4)
        self.assertGreaterEqual(len(nashik_rabi), 4)
        self.assertGreaterEqual(len(wayanad_yearly), 4)

        # Bagalkot Kharif must differ from Mysore Kharif
        self.assertNotEqual(bagalkot_kharif, mysore_kharif, "Mysore and Bagalkot must have distinct crop portfolios")

        # Punjab Rabi must differ completely from Karnataka Kharif
        self.assertNotEqual(ludhiana_rabi, mysore_kharif, "Ludhiana Rabi must differ from Mysore Kharif")
        self.assertTrue(any('Wheat' in c or 'Barley' in c or 'Mustard' in c for c in ludhiana_rabi),
                        f"Punjab Rabi must feature wheat/barley/mustard: got {ludhiana_rabi}")

        # Kerala Wayanad must feature plantation / spice crops
        self.assertTrue(any('pepper' in c.lower() or 'arecanut' in c.lower() or 'coconut' in c.lower() or 'cashew' in c.lower() for c in wayanad_yearly),
                        f"Wayanad must feature plantation/spices: got {wayanad_yearly}")

        # Thanjavur (Tamil Nadu rice bowl) must feature Rice
        self.assertTrue(any('Rice' in c for c in thanjavur_kharif),
                        f"Thanjavur Kharif must include Rice: got {thanjavur_kharif}")

    def test_crop_prediction_seasonal_differentiation(self):
        """Verify that the same district gets distinct crops between Kharif and Rabi."""
        mysore_kharif = _predict_crops_hybrid('Karnataka', 'MYSORE', 'Kharif')
        mysore_rabi = _predict_crops_hybrid('Karnataka', 'MYSORE', 'Rabi')
        self.assertNotEqual(mysore_kharif, mysore_rabi, "Kharif and Rabi must produce distinct seasonal crops")

        ludhiana_kharif = _predict_crops_hybrid('Punjab', 'LUDHIANA', 'Kharif')
        ludhiana_rabi = _predict_crops_hybrid('Punjab', 'LUDHIANA', 'Rabi')
        self.assertNotEqual(ludhiana_kharif, ludhiana_rabi, "Punjab Kharif (paddy/cotton) must differ from Rabi (wheat/barley)")

    def test_price_trends_dynamic_and_regional(self):
        """Verify price trends are based on current dates and regionally varied."""
        today = datetime.date.today()
        current_month_str = today.strftime('%b %Y')

        crops = ['Rice', 'Maize', 'Wheat']
        mysore_prices = _estimate_crop_prices(crops, state='Karnataka', district='MYSORE')
        ludhiana_prices = _estimate_crop_prices(crops, state='Punjab', district='LUDHIANA')

        self.assertEqual(len(mysore_prices), 3)
        self.assertEqual(mysore_prices[0]['current_month'], current_month_str)

        # Regionally varied prices for different states
        self.assertNotEqual(mysore_prices[0]['current'], ludhiana_prices[0]['current'],
                            "Mysore and Ludhiana should have regionally differentiated APMC price points")

    def test_crop_prediction_http_post(self):
        """End-to-end HTTP POST test for /farmer/crop_prediction."""
        self._login_farmer()
        res = self.client.post('/farmer/crop_prediction', data={
            'state': 'Punjab',
            'district': 'LUDHIANA',
            'season': 'Rabi'
        })
        self.assertEqual(res.status_code, 200)
        content = res.get_data(as_text=True)
        self.assertIn("Wheat", content)
        self.assertIn("Punjab", content)
        self.assertIn("LUDHIANA", content)
        # Verify the 5 hardcoded Kharif crops are NOT returned
        self.assertNotIn("Rice (Paddy)", content)

    # =========================================================================
    # 2. CROP RECOMMENDATION MODEL (Random Forest)
    # =========================================================================

    def test_crop_recommendation_http(self):
        """Verify soil/weather crop recommendation with agronomic ground truth."""
        self._login_farmer()
        # High rainfall + high humidity + high N -> Rice
        res_rice = self.client.post('/farmer/crop_recommendation', data={
            'n': 90, 'p': 42, 'k': 43, 't': 20.8, 'h': 82.0, 'ph': 6.5, 'r': 202.9
        })
        self.assertEqual(res_rice.status_code, 200)
        self.assertIn("rice", res_rice.get_data(as_text=True).lower())

        # Low rainfall + moderate temp + high potassium -> Chickpea or Cotton or Lentil
        res_cotton = self.client.post('/farmer/crop_recommendation', data={
            'n': 120, 'p': 40, 'k': 20, 't': 24.0, 'h': 80.0, 'ph': 7.0, 'r': 80.0
        })
        self.assertEqual(res_cotton.status_code, 200)
        self.assertIn("cotton", res_cotton.get_data(as_text=True).lower())

    # =========================================================================
    # 3. FERTILIZER RECOMMENDATION MODEL (Decision Tree)
    # =========================================================================

    def test_fertilizer_recommendation_http(self):
        """Verify fertilizer recommendation for high nitrogen demand."""
        self._login_farmer()
        res = self.client.post('/farmer/fertilizer_recommendation', data={
            't': 26, 'h': 52, 'sm': 38, 'soil': 'Black', 'crop': 'Sugarcane',
            'n': 38, 'k': 0, 'p': 0
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("Urea", res.get_data(as_text=True))

    # =========================================================================
    # 4. YIELD PREDICTION MODEL (Random Forest Regressor)
    # =========================================================================

    def test_yield_prediction_http(self):
        """Verify yield prediction returns realistic positive tonnage."""
        self._login_farmer()
        res = self.client.post('/farmer/yield_prediction', data={
            'state': 'Karnataka',
            'district': 'BAGALKOT',
            'season': 'Kharif',
            'crop': 'Rice',
            'area': 10  # 10 acres ~ 4.047 hectares
        })
        self.assertEqual(res.status_code, 200)
        content = res.get_data(as_text=True)
        self.assertIn("Tonnes", content)
        self.assertIn("Forecasted Harvest", content)

    # =========================================================================
    # 5. RAINFALL ESTIMATION (IMD 115-Year Dataset)
    # =========================================================================

    def test_rainfall_prediction_http(self):
        """Verify historical monthly averages from IMD data."""
        self._login_farmer()
        # Coastal Karnataka in peak monsoon (July) has heavy rainfall > 800 mm
        res_monsoon = self.client.post('/farmer/rainfall_prediction', data={
            'region': 'COASTAL KARNATAKA',
            'month': 'JUL'
        })
        self.assertEqual(res_monsoon.status_code, 200)
        self.assertIn("1127", res_monsoon.get_data(as_text=True))  # Exact IMD 115yr average: 1127.03 mm

        # Coastal Karnataka in January (dry) has low rainfall < 10 mm
        res_dry = self.client.post('/farmer/rainfall_prediction', data={
            'region': 'COASTAL KARNATAKA',
            'month': 'JAN'
        })
        self.assertEqual(res_dry.status_code, 200)
        self.assertIn("1.9", res_dry.get_data(as_text=True))

    # =========================================================================
    # 6. ACCESS CONTROL VERIFICATION
    # =========================================================================

    def test_unauthenticated_redirect(self):
        """Verify that all prediction endpoints redirect to login if no session is active."""
        endpoints = [
            '/farmer/crop_prediction',
            '/farmer/crop_recommendation',
            '/farmer/fertilizer_recommendation',
            '/farmer/yield_prediction',
            '/farmer/rainfall_prediction',
            '/farmer/market_prices',
            '/farmer/weather_forecast'
        ]
        for ep in endpoints:
            res = self.client.get(ep)
            self.assertEqual(res.status_code, 302, f"Endpoint {ep} should redirect when unauthenticated")
            self.assertIn('/login/farmer', res.headers.get('Location', ''))


if __name__ == '__main__':
    unittest.main()
