"""
AgroIntel Database Adapter
Supports both local SQLite (development/evaluation) and hosted PostgreSQL
(Neon, Supabase, AWS RDS, CockroachDB) for production and serverless environments.
"""

import os
import sys
import sqlite3
import urllib.parse
import ssl

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = os.getenv('DATABASE_URL')


def is_postgres():
    return bool(DATABASE_URL and (DATABASE_URL.startswith('postgresql://') or DATABASE_URL.startswith('postgres://')))


def get_db_file():
    """Return appropriate SQLite database path, copying to /tmp for Vercel ephemeral write access."""
    if os.getenv('DB_PATH'):
        return os.getenv('DB_PATH')
    if os.getenv('VERCEL') and not is_postgres():
        tmp_db = os.path.join('/tmp', 'agrointel.db')
        bundled_db = os.path.join(BASE_DIR, 'agrointel.db')
        if not os.path.exists(tmp_db) and os.path.exists(bundled_db):
            try:
                import shutil
                shutil.copyfile(bundled_db, tmp_db)
            except Exception:
                pass
        return tmp_db
    return os.path.join(BASE_DIR, 'agrointel.db')


DB_FILE = get_db_file()


class PostgresRow(dict):
    """Provides dictionary and attribute-style access matching sqlite3.Row."""
    def __getitem__(self, key):
        if isinstance(key, int):
            return list(self.values())[key]
        return super().__getitem__(key.lower() if isinstance(key, str) else key)

    def get(self, key, default=None):
        return super().get(key.lower() if isinstance(key, str) else key, default)


class PostgresCursorWrapper:
    def __init__(self, cursor):
        self.cursor = cursor

    def execute(self, sql, params=()):
        # Convert SQLite '?' placeholders to Postgres '%s' placeholders
        pg_sql = sql.replace('?', '%s')
        if params is None:
            params = ()
        elif not isinstance(params, (list, tuple)):
            params = (params,)
        self.cursor.execute(pg_sql, params)
        return self

    def fetchone(self):
        row = self.cursor.fetchone()
        if row is None:
            return None
        col_names = [desc[0].lower() for desc in self.cursor.description]
        return PostgresRow(dict(zip(col_names, row)))

    def fetchall(self):
        rows = self.cursor.fetchall()
        if not rows:
            return []
        col_names = [desc[0].lower() for desc in self.cursor.description]
        return [PostgresRow(dict(zip(col_names, r))) for r in rows]

    @property
    def rowcount(self):
        return self.cursor.rowcount


class PostgresConnectionWrapper:
    def __init__(self, raw_conn):
        self.raw_conn = raw_conn

    def cursor(self):
        return PostgresCursorWrapper(self.raw_conn.cursor())

    def execute(self, sql, params=()):
        c = self.cursor()
        c.execute(sql, params)
        return c

    def commit(self):
        self.raw_conn.commit()

    def rollback(self):
        self.raw_conn.rollback()

    def close(self):
        self.raw_conn.close()


def get_db():
    """Return a database connection handle (Postgres or SQLite)."""
    if is_postgres():
        import pg8000.dbapi as pg
        parsed = urllib.parse.urlparse(DATABASE_URL)
        username = parsed.username or 'postgres'
        password = parsed.password or ''
        host = parsed.hostname or 'localhost'
        port = parsed.port or 5432
        database = parsed.path.lstrip('/') or 'postgres'

        # Enable SSL for cloud hosts (Neon, Supabase)
        ssl_ctx = ssl.create_default_context()
        try:
            raw = pg.connect(
                user=username,
                password=password,
                host=host,
                port=port,
                database=database,
                ssl_context=ssl_ctx
            )
            return PostgresConnectionWrapper(raw)
        except Exception as e:
            # Fallback to non-SSL if server doesn't support SSL
            raw = pg.connect(
                user=username,
                password=password,
                host=host,
                port=port,
                database=database
            )
            return PostgresConnectionWrapper(raw)

    # Serverless SQLite warning
    if os.getenv('VERCEL'):
        print(
            "WARNING: DATABASE_URL is not set while running on Vercel. "
            "SQLite filesystem is ephemeral on serverless; data will be lost across cold starts. "
            "Set DATABASE_URL to a hosted PostgreSQL instance (e.g., Neon or Supabase).",
            file=sys.stderr
        )

    conn = sqlite3.connect(get_db_file())
    conn.row_factory = sqlite3.Row
    return conn


def ensure_db():
    """Ensure database tables exist on startup."""
    conn = get_db()
    if is_postgres():
        ddl = """
        CREATE TABLE IF NOT EXISTS farmerlogin (
            farmer_id   SERIAL PRIMARY KEY,
            farmer_name VARCHAR(255) NOT NULL,
            password    VARCHAR(255) NOT NULL,
            email       VARCHAR(255) NOT NULL UNIQUE,
            phone_no    VARCHAR(20)  NOT NULL,
            F_State     VARCHAR(100) NOT NULL,
            F_District  VARCHAR(100) NOT NULL,
            F_Location  VARCHAR(100) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS admin (
            admin_id       SERIAL PRIMARY KEY,
            admin_name     VARCHAR(255) NOT NULL UNIQUE,
            admin_password VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS contactus (
            c_id      SERIAL PRIMARY KEY,
            c_name    VARCHAR(255) NOT NULL,
            c_mobile  VARCHAR(20)  NOT NULL,
            c_email   VARCHAR(255) NOT NULL,
            c_address TEXT         NOT NULL,
            c_message TEXT         NOT NULL
        );

        CREATE TABLE IF NOT EXISTS password_resets (
            id         SERIAL PRIMARY KEY,
            email      VARCHAR(255) NOT NULL,
            token      VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            used       INTEGER DEFAULT 0
        );
        """
        try:
            for statement in ddl.strip().split(';'):
                stmt = statement.strip()
                if stmt:
                    conn.execute(stmt)
            conn.commit()
        finally:
            conn.close()
        return "PostgreSQL (Hosted)"
    else:
        schema_file = os.path.join(BASE_DIR, 'schema.sql')
        if os.path.exists(schema_file):
            with open(schema_file, 'r', encoding='utf-8') as f:
                schema = f.read()
            conn.cursor().executescript(schema)
            conn.commit()
        conn.close()
        return get_db_file()
