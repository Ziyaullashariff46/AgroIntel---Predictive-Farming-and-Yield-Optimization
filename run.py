import os
import sys
import subprocess
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'agrointel.db')

def main():
    print("==================================================")
    print("          AgroIntel Python App Launcher           ")
    print("==================================================")

    # 1. Initialize SQLite Database if missing
    if not os.path.exists(DB_FILE):
        print("Database file not found. Running init_db.py...")
        init_script = os.path.join(BASE_DIR, 'init_db.py')
        subprocess.run([sys.executable, init_script], check=True)

    print("\nStarting AgroIntel Python Flask server...")
    print("Server URL: http://127.0.0.1:5000")
    print("Press Ctrl+C to stop the server.\n")

    # Automatically open browser after 1 second
    try:
        webbrowser.open('http://127.0.0.1:5000')
    except Exception:
        pass

    # Launch app.py
    app_script = os.path.join(BASE_DIR, 'app.py')
    subprocess.run([sys.executable, app_script])

if __name__ == '__main__':
    main()
