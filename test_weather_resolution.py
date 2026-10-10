import unittest
from app import app, geocode_indian_location, nominatim_reverse_geocode

class WeatherResolutionTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['user_type'] = 'farmer'
            sess['farmer_name'] = 'Test Farmer'

    def test_curated_karnataka_districts(self):
        test_cases = [
            ('MYSORE', 'Mysuru (Mysore), Karnataka', 12.305, 76.655),
            ('mysore', 'Mysuru (Mysore), Karnataka', 12.305, 76.655),
            ('Mysuru', 'Mysuru (Mysore), Karnataka', 12.305, 76.655),
            ('Hassan', 'Hassan, Karnataka', 13.007, 76.096),
            ('HASSAN', 'Hassan, Karnataka', 13.007, 76.096),
            ('Shimoga', 'Shimoga (Shivamogga), Karnataka', 13.931, 75.568),
            ('Belgaum', 'Belagavi (Belgaum), Karnataka', 15.857, 74.507),
            ('Mandya', 'Mandya, Karnataka', 12.522, 76.897),
            ('Bangalore', 'Bengaluru (Bangalore), Karnataka', 12.972, 77.594),
        ]
        for query, exp_label, exp_lat, exp_lon in test_cases:
            lat, lon, label = geocode_indian_location(query, state='Karnataka')
            self.assertEqual(label, exp_label)
            self.assertAlmostEqual(lat, exp_lat, places=2)
            self.assertAlmostEqual(lon, exp_lon, places=2)

    def test_reverse_geocode_bangalore_no_corporation(self):
        place, state = nominatim_reverse_geocode(12.972, 77.594)
        self.assertIsNotNone(place)
        self.assertNotIn('Central City Corporation', place)
        self.assertEqual(place, 'Bengaluru')
        self.assertEqual(state, 'Karnataka')

    def test_api_weather_city_mysore(self):
        res = self.client.get('/api/weather/city/MYSORE?state=Karnataka')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        current = data.get('current', {})
        self.assertIn('Mysuru', current.get('city', ''))
        self.assertNotIn('Bengaluru', current.get('city', ''))
        self.assertNotIn('Central City Corporation', current.get('city', ''))
        self.assertAlmostEqual(current.get('lat', 0), 12.305, places=2)
        self.assertAlmostEqual(current.get('lon', 0), 76.655, places=2)
        self.assertGreater(current.get('temp', -100), -50)
        self.assertGreater(len(data.get('forecast', [])), 0)

    def test_api_weather_city_hassan(self):
        res = self.client.get('/api/weather/city/HASSAN?state=Karnataka')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        current = data.get('current', {})
        self.assertIn('Hassan', current.get('city', ''))
        self.assertAlmostEqual(current.get('lat', 0), 13.007, places=2)
        self.assertAlmostEqual(current.get('lon', 0), 76.096, places=2)

if __name__ == '__main__':
    unittest.main()
