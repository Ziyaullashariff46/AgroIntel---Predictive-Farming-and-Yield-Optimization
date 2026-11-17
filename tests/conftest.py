import sys
import os
import tempfile
import shutil

# Ensure the root project directory is on sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Isolate database for tests to prevent modifying tracked agrointel.db
_temp_dir = tempfile.mkdtemp()
_temp_db = os.path.join(_temp_dir, 'test_agrointel.db')
_src_db = os.path.join(PROJECT_ROOT, 'agrointel.db')
if os.path.exists(_src_db):
    shutil.copyfile(_src_db, _temp_db)
os.environ['DB_PATH'] = _temp_db
