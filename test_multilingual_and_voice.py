"""
Unit test suite verifying multilingual (Kannada, Hindi, English), Crop Language Module,
voice assistant persistent listening, and removal of Crop Price Predictor.
"""
import os
import unittest
from app import app, BASE_DIR

class MultilingualAndVoiceTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()

    def test_static_asset_files_exist(self):
        """Verify CSS and JS asset files exist on disk."""
        css_file = os.path.join(BASE_DIR, 'assets', 'css', 'agrointel-multilingual.css')
        i18n_file = os.path.join(BASE_DIR, 'assets', 'js', 'agrointel-i18n.js')
        voice_file = os.path.join(BASE_DIR, 'assets', 'js', 'agrointel-voice.js')

        self.assertTrue(os.path.exists(css_file), f"Missing {css_file}")
        self.assertTrue(os.path.exists(i18n_file), f"Missing {i18n_file}")
        self.assertTrue(os.path.exists(voice_file), f"Missing {voice_file}")

    def test_static_asset_routes_serve_200_and_crops_translated(self):
        """Verify assets route serves CSS and JS assets correctly with 200 OK and crop dictionary."""
        r_css = self.client.get('/assets/css/agrointel-multilingual.css')
        self.assertEqual(r_css.status_code, 200)
        self.assertIn(b'agrointel-lang-dropdown', r_css.data)
        self.assertIn(b'agrointel-voice-fab', r_css.data)

        r_i18n = self.client.get('/assets/js/agrointel-i18n.js')
        self.assertEqual(r_i18n.status_code, 200)
        self.assertIn(b'AgroIntelI18N', r_i18n.data)
        self.assertIn(b'CROP_TRANSLATIONS', r_i18n.data)
        self.assertIn(b'getCropName', r_i18n.data)

        # Check key crop translations in Kannada and Hindi
        self.assertIn('ಭತ್ತ'.encode('utf-8'), r_i18n.data) # Rice in Kannada
        self.assertIn('ಮೆಕ್ಕೆಜೋಳ'.encode('utf-8'), r_i18n.data) # Maize in Kannada
        self.assertIn('ರಾಗಿ'.encode('utf-8'), r_i18n.data) # Ragi in Kannada
        self.assertIn('ಕಡಲೆ'.encode('utf-8'), r_i18n.data) # Chickpea in Kannada
        self.assertIn('ಕಬ್ಬು'.encode('utf-8'), r_i18n.data) # Sugarcane in Kannada
        self.assertIn('चावल'.encode('utf-8'), r_i18n.data) # Rice in Hindi
        self.assertIn('मक्का'.encode('utf-8'), r_i18n.data) # Maize in Hindi

        r_voice = self.client.get('/assets/js/agrointel-voice.js')
        self.assertEqual(r_voice.status_code, 200)
        self.assertIn(b'AgroIntelVoice', r_voice.data)
        self.assertIn(b'kn-IN', r_voice.data)
        self.assertIn(b'hi-IN', r_voice.data)
        # Verify continuous persistent listening is enabled
        self.assertIn(b'recognition.continuous = true', r_voice.data)
        self.assertIn(b'shouldBeListening', r_voice.data)

    def test_base_template_contains_language_and_voice_controls(self):
        """Verify base.html renders language dropdown and voice assistant button."""
        r = self.client.get('/')
        self.assertEqual(r.status_code, 200)
        html = r.get_data(as_text=True)

        self.assertIn('agrointel-lang-dropdown', html)
        self.assertIn('agrointel-nav-voice-btn', html)
        self.assertIn('agrointel-multilingual.css', html)
        self.assertIn('agrointel-i18n.js', html)
        self.assertIn('agrointel-voice.js', html)
        self.assertIn('Noto+Sans+Kannada', html)
        self.assertIn('Noto+Sans+Devanagari', html)

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
        # Ensure Crop Price Predictor link is NOT in sidebar
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
