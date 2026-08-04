import os
import subprocess
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def main():
    print("==========================================================")
    print("     AgroIntel Built-in PHP CLI Web Server Launcher      ")
    print("                 (No XAMPP / Apache required)             ")
    print("==========================================================")

    print("\nStarting PHP built-in web server on http://127.0.0.1:8000 ...")
    print("Press Ctrl+C to stop.\n")

    try:
        webbrowser.open('http://127.0.0.1:8000')
    except Exception:
        pass

    try:
        subprocess.run(['php', '-S', '127.0.0.1:8000', '-t', BASE_DIR])
    except FileNotFoundError:
        print("\n[ERROR] PHP CLI binary is not found in PATH.")
        print("Please use 'python app.py' to run the native Python server instead!")

if __name__ == '__main__':
    main()
