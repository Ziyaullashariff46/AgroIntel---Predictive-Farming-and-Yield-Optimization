import sqlite3
import os
import re

DB_FILE = os.path.join(os.path.dirname(__file__), 'agrointel.db')
SQL_FILE = os.path.join(os.path.dirname(__file__), 'db', 'agriculture_portal.sql')

def init_db():
    print(f"Initializing SQLite database at: {DB_FILE}")
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    with open(SQL_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        sql_script = f.read()

    # Slice off ALTER TABLE section at the bottom of MySQL dump
    alter_idx = sql_script.find('ALTER TABLE')
    if alter_idx != -1:
        sql_script = sql_script[:alter_idx]

    # Clean MySQL specific keywords
    sql_script = re.sub(r'ENGINE\s*=\s*\w+', '', sql_script, flags=re.IGNORECASE)
    sql_script = re.sub(r'DEFAULT\s*CHARSET\s*=\s*\w+', '', sql_script, flags=re.IGNORECASE)
    sql_script = re.sub(r'COLLATE\s*=\s*[\w_]+', '', sql_script, flags=re.IGNORECASE)
    sql_script = re.sub(r'int\(\d+\)', 'INTEGER', sql_script, flags=re.IGNORECASE)
    sql_script = re.sub(r'\bdouble\b', 'REAL', sql_script, flags=re.IGNORECASE)
    sql_script = re.sub(r'varchar\(\d+\)', 'TEXT', sql_script, flags=re.IGNORECASE)
    
    # Filter out set statements and comments
    cleaned_lines = []
    for line in sql_script.splitlines():
        line_u = line.strip().upper()
        if line_u.startswith('SET ') or line_u.startswith('START TRANSACTION') or line_u.startswith('COMMIT') or line_u.startswith('/*!40101'):
            continue
        cleaned_lines.append(line)

    clean_sql = '\n'.join(cleaned_lines)

    try:
        cursor.executescript(clean_sql)
        conn.commit()
        print("Database schema and seed data created successfully!")
    except Exception as e:
        print(f"executescript error: {e}")

    conn.close()

if __name__ == '__main__':
    init_db()
