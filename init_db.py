"""
Create the AgroIntel SQLite database from schema.sql.

Safe to run repeatedly: schema.sql uses CREATE TABLE IF NOT EXISTS, so this
adds any missing table without touching existing rows. app.py calls the same
ensure_db() on startup, so a fresh deploy (or a fresh mounted volume) builds
its own database with no manual step.
"""
import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEMA_FILE = os.path.join(BASE_DIR, 'schema.sql')

# Overridable so a deploy can point at a mounted persistent volume,
# e.g. DB_PATH=/var/data/agrointel.db on Render.
DB_FILE = os.getenv('DB_PATH') or os.path.join(BASE_DIR, 'agrointel.db')


def ensure_db(db_file=None):
    """Create the database and any missing tables. Returns the path used."""
    db_file = db_file or DB_FILE
    parent = os.path.dirname(os.path.abspath(db_file))
    os.makedirs(parent, exist_ok=True)

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
