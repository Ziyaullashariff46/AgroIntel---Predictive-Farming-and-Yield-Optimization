"""
Unit test suite verifying multilingual (Kannada, Hindi, English), Crop & Mandi Language Module,
state/district localization, removal of voice module, and removal of Crop Price Predictor.
"""
import os
import unittest
from app import app, BASE_DIR

class MultilingualAndLocalizationTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()

    def test_static_asset_files_exist(self):
        """Verify CSS and JS asset files exist on disk."""
        css_file = os.path.join(BASE_DIR, 'assets', 'css', 'agrointel-multilingual.css')
        i18n_file = os.path.join(BASE_DIR, 'assets', 'js', 'agrointel-i18n.js')

        self.assertTrue(os.path.exists(css_file), f"Missing {css_file}")
        self.assertTrue(os.path.exists(i18n_file), f"Missing {i18n_file}")

    def test_static_asset_routes_serve_200_and_crops_and_locations_translated(self):
        """Verify assets route serves CSS and JS assets correctly with 200 OK and translation dictionaries."""
        r_css = self.client.get('/assets/css/agrointel-multilingual.css')
        self.assertEqual(r_css.status_code, 200)
        self.assertIn(b'agrointel-lang-dropdown', r_css.data)

        r_i18n = self.client.get('/assets/js/agrointel-i18n.js')
        self.assertEqual(r_i18n.status_code, 200)
        self.assertIn(b'AgroIntelI18N', r_i18n.data)
        self.assertIn(b'CROP_TRANSLATIONS', r_i18n.data)
        self.assertIn(b'STATE_TRANSLATIONS', r_i18n.data)
        self.assertIn(b'DISTRICT_TRANSLATIONS', r_i18n.data)
        self.assertIn(b'getCropName', r_i18n.data)
        self.assertIn(b'getStateName', r_i18n.data)
        self.assertIn(b'getDistrictName', r_i18n.data)

        # 1. Crops in Kannada & Hindi
        self.assertIn('ಭತ್ತ'.encode('utf-8'), r_i18n.data)      # Rice in Kannada
        self.assertIn('ಮೆಕ್ಕೆಜೋಳ'.encode('utf-8'), r_i18n.data) # Maize in Kannada
        self.assertIn('ರಾಗಿ'.encode('utf-8'), r_i18n.data)      # Ragi in Kannada
        self.assertIn('ಕಡಲೆ'.encode('utf-8'), r_i18n.data)      # Chickpea in Kannada
        self.assertIn('ಕಬ್ಬು'.encode('utf-8'), r_i18n.data)      # Sugarcane in Kannada
        self.assertIn('चावल'.encode('utf-8'), r_i18n.data)      # Rice in Hindi
        self.assertIn('मक्का'.encode('utf-8'), r_i18n.data)     # Maize in Hindi
        self.assertIn('गन्ना'.encode('utf-8'), r_i18n.data)     # Sugarcane in Hindi

        # 2. States in Kannada & Hindi
        self.assertIn('ಕರ್ನಾಟಕ'.encode('utf-8'), r_i18n.data)   # Karnataka in Kannada
        self.assertIn('ಮಹಾರಾಷ್ಟ್ರ'.encode('utf-8'), r_i18n.data) # Maharashtra in Kannada
        self.assertIn('कर्नाटक'.encode('utf-8'), r_i18n.data)   # Karnataka in Hindi
        self.assertIn('महाराष्ट्र'.encode('utf-8'), r_i18n.data) # Maharashtra in Hindi

        # 3. Districts in Kannada & Hindi
        self.assertIn('ಉಡುಪಿ'.encode('utf-8'), r_i18n.data)     # Udupi in Kannada
        self.assertIn('ಬೆಂಗಳೂರು'.encode('utf-8'), r_i18n.data)  # Bengaluru in Kannada
        self.assertIn('ಬೆಳಗಾವಿ'.encode('utf-8'), r_i18n.data)   # Belagavi in Kannada
        self.assertIn('उडुपी'.encode('utf-8'), r_i18n.data)     # Udupi in Hindi
        self.assertIn('बेंगलुरु'.encode('utf-8'), r_i18n.data)  # Bengaluru in Hindi

    def test_base_template_contains_language_and_no_voice_controls(self):
        """Verify base.html renders language dropdown and has REMOVED voice assistant buttons."""
        r = self.client.get('/')
        self.assertEqual(r.status_code, 200)
        html = r.get_data(as_text=True)

        # Language dropdown and translation script must be present
        self.assertIn('agrointel-lang-dropdown', html)
        self.assertIn('agrointel-multilingual.css', html)
        self.assertIn('agrointel-i18n.js', html)
        self.assertIn('Noto+Sans+Kannada', html)
        self.assertIn('Noto+Sans+Devanagari', html)

        # Voice assistant trigger buttons and voice script must be REMOVED
        self.assertNotIn('agrointel-nav-voice-btn', html)
        self.assertNotIn('agrointel-voice.js', html)

    def test_market_prices_template_has_multilingual_hooks(self):
        """Verify Live Mandi Prices template renders with state/district translation hooks."""
        with self.client.session_transaction() as s:
            s['user_type'] = 'farmer'
            s['farmer_name'] = 'Basavaraj'

        r = self.client.get('/farmer/market_prices')
        self.assertEqual(r.status_code, 200)
        html = r.get_data(as_text=True)

        self.assertIn('data-i18n="Live Mandi Prices"', html)
        self.assertIn('data-i18n="Market Intelligence"', html)
        self.assertIn('data-i18n="Top Commodities"', html)
        self.assertIn('data-i18n="Commodity"', html)
        self.assertIn('data-i18n="District"', html)
        self.assertIn('updateStateDropdownTranslations', html)
        self.assertIn('renderMarketData', html)
        self.assertIn('agrointel-language-changed', html)

    def test_farmer_base_template_sidebar_without_crop_price_predictor(self):
        """Verify farmer portal sidebar has i18n hooks and NO crop price predictor link."""
        with self.client.session_transaction() as s:
            s['user_type'] = 'farmer'
            s['farmer_name'] = 'Basavaraj'

        r = self.client.get('/farmer/crop_recommendation')
        self.assertEqual(r.status_code, 200)
        html = r.get_data(as_text=True)

        self.assertIn('data-i18n="Crop Recommendation"', html)
        self.assertIn('data-i18n="Fertilizer Advisory"', html)
        self.assertIn('data-i18n="Live Mandi Prices"', html)
        self.assertNotIn('/farmer/crop_prediction', html)

    def test_crop_prediction_removed_and_redirects(self):
        """Verify /farmer/crop_prediction safely redirects to crop recommendation without error."""
        with self.client.session_transaction() as s:
            s['user_type'] = 'farmer'
            s['farmer_name'] = 'Basavaraj'

        r = self.client.get('/farmer/crop_prediction')
        self.assertEqual(r.status_code, 302)
        self.assertIn('/farmer/crop_recommendation', r.headers.get('Location', ''))

if __name__ == '__main__':
    unittest.main()
