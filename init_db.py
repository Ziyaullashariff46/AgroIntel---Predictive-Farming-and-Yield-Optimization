"""
Create the AgroIntel database from schema.sql.
Supports both local SQLite and hosted PostgreSQL (Neon, Supabase).
Safe to run repeatedly.
"""
import db

def ensure_db():
    return db.ensure_db()

if __name__ == '__main__':
    path = ensure_db()
    print(f"Database ready at: {path}")
    print("Run 'python seed_sample_users.py' to add the demo accounts.")
