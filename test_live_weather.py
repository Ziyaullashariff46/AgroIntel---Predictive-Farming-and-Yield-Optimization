import unittest
from app import app, _REVERSE_GEO_CACHE, get_closest_location

class WeatherLiveLocationTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        with self.client.session_transaction() as sess:
            sess['user_id'] = 1
            sess['user_type'] = 'farmer'
            sess['farmer_id'] = 1

    def test_weather_coords_live_bangalore(self):
        res = self.client.get('/api/weather/coords/12.9716/77.5946')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('current', data)
        self.assertIn('forecast', data)
        self.assertEqual(len(data['forecast']), 7)
        self.assertGreater(data['current']['temp'], 0)
        self.assertNotEqual(data['current']['desc'], 'Unavailable')
        print(f"Bangalore weather: {data['current']['city']} | {data['current']['temp']}°C | {data['current']['desc']}")

    def test_weather_coords_live_mysore(self):
        res = self.client.get('/api/weather/coords/12.2958/76.6394')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('Mysuru', data['current']['city'])
        self.assertGreater(data['current']['temp'], 0)
        print(f"Mysore weather: {data['current']['city']} | {data['current']['temp']}°C | {data['current']['desc']}")

    def test_reverse_geocode_and_cache(self):
        res = self.client.get('/api/reverse_geocode/12.9716/77.5946')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertIsNotNone(data.get('label'))
        print(f"Reverse geocode: {data.get('label')}")

        # Check cache
        cache_key = (round(12.9716, 3), round(77.5946, 3))
        self.assertIn(cache_key, _REVERSE_GEO_CACHE)

    def test_closest_location(self):
        closest = get_closest_location(12.2958, 76.6394)
        self.assertIsNotNone(closest)
        self.assertIn('Mysore', closest['name'])
        print(f"Closest location: {closest['name']}, {closest['state']} ({closest['dist']:.2f} km)")

    def test_weather_city_search_mysuru(self):
        res = self.client.get('/api/weather/city/Mysuru?state=Karnataka')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('Mysuru', data['current']['city'])
        self.assertGreater(data['current']['temp'], 0)
        print(f"City search Mysuru: {data['current']['city']} | {data['current']['temp']}°C")

    def test_weather_city_search_udupi(self):
        res = self.client.get('/api/weather/city/Udupi')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('Udupi', data['current']['city'])
        print(f"City search Udupi: {data['current']['city']} | {data['current']['temp']}°C")

if __name__ == '__main__':
    unittest.main()
