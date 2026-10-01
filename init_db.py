"""
Create the AgroIntel SQLite database from schema.sql.

Safe to run repeatedly: schema.sql uses CREATE TABLE IF NOT EXISTS, so this
adds any missing table without touching existing rows. app.py calls the same
ensure_db() on startup, so a fresh deploy (or a fresh mounted volume) builds
its own database with no manual step.
"""
import os
import shutil
import sqlite3
import tempfile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEMA_FILE = os.path.join(BASE_DIR, 'schema.sql')

# The committed database doubles as a seed for fresh deploys.
_REPO_DB = os.path.join(BASE_DIR, 'agrointel.db')

# Serverless hosts (Vercel) ship the app read-only, so SQLite must live in the
# writable temp dir; DB_PATH still wins when a platform gives a real volume.
_DEFAULT_WRITABLE = os.getenv('VERCEL') or (
    os.path.exists(_REPO_DB) and not os.access(_REPO_DB, os.W_OK)
)
DB_FILE = (
    os.getenv('DB_PATH')
    or (os.path.join(tempfile.gettempdir(), 'agrointel.db') if _DEFAULT_WRITABLE else _REPO_DB)
)


def ensure_db(db_file=None):
    """Create the database and any missing tables. Returns the path used."""
    db_file = db_file or DB_FILE
    parent = os.path.dirname(os.path.abspath(db_file))
    os.makedirs(parent, exist_ok=True)

    if db_file != _REPO_DB and not os.path.exists(db_file) and os.path.exists(_REPO_DB):
        # Read-only-host boot: seed the writable copy with the committed
        # database so demo accounts and sample data survive the redeploy.
        shutil.copyfile(_REPO_DB, db_file)

    with open(SCHEMA_FILE, 'r', encoding='utf-8') as f:
        schema = f.read()

    conn = sqlite3.connect(db_file)
    try:
        conn.executescript(schema)
        conn.commit()
    finally:
        conn.close()
    return db_file


if __name__ == '__main__':
    path = ensure_db()
    print(f"Database ready at: {path}")
    print("Run 'python seed_sample_users.py' to add the demo accounts.")
