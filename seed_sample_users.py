import sqlite3
import bcrypt
import os

DB_FILE = os.path.join(os.path.dirname(__file__), 'agrointel.db')

def seed_users():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Ensure Admin Account exists
    cursor.execute("SELECT * FROM admin WHERE admin_name = 'admin'")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO admin (admin_id, admin_name, admin_password) VALUES (1, 'admin', '$2b$12$8t3Duw99V4WNcIODvg4eC.iDn9IUbmw72o2mumVmwezfOnEm9WdHK')")

    # Seed Farmer Account
    cursor.execute("SELECT * FROM farmerlogin WHERE email = 'farmer@agrointel.com'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO farmerlogin (farmer_id, farmer_name, password, email, phone_no, F_gender, F_birthday, F_State, F_District, F_Location, otp)
            VALUES (100, 'Sample Farmer', '$2b$12$8t3Duw99V4WNcIODvg4eC.iDn9IUbmw72o2mumVmwezfOnEm9WdHK', 'farmer@agrointel.com', '9876543210', 'Male', '1995-05-15', 'Karnataka', 'Udupi', 'Bantakal', 0)
        """)

    # Rotate any legacy account still holding the dictionary-word password
    cursor.execute("UPDATE farmerlogin SET password = '$2b$12$8t3Duw99V4WNcIODvg4eC.iDn9IUbmw72o2mumVmwezfOnEm9WdHK' WHERE password = 'password'")
    cursor.execute("UPDATE admin SET admin_password = '$2b$12$8t3Duw99V4WNcIODvg4eC.iDn9IUbmw72o2mumVmwezfOnEm9WdHK' WHERE admin_password = 'password'")

    conn.commit()
    conn.close()
    print("Sample test accounts seeded successfully.")
    print("  Farmer  -> email: farmer@agrointel.com  | password: $2b$12$8t3Duw99V4WNcIODvg4eC.iDn9IUbmw72o2mumVmwezfOnEm9WdHK")
    print("  Admin   -> username: admin              | password: $2b$12$8t3Duw99V4WNcIODvg4eC.iDn9IUbmw72o2mumVmwezfOnEm9WdHK")

if __name__ == '__main__':
    seed_users()
