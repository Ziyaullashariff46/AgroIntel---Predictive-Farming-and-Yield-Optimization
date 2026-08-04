import sqlite3
import os

DB_FILE = os.path.join(os.path.dirname(__file__), 'agrointel.db')

def seed_users():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Ensure Admin Account exists
    cursor.execute("SELECT * FROM admin WHERE admin_name = 'admin'")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO admin (admin_id, admin_name, admin_password) VALUES (1, 'admin', 'password')")

    # Seed Farmer Account
    cursor.execute("SELECT * FROM farmerlogin WHERE email = 'farmer@agrointel.com'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO farmerlogin (farmer_id, farmer_name, password, email, phone_no, F_gender, F_birthday, F_State, F_District, F_Location, otp)
            VALUES (100, 'Sample Farmer', 'password', 'farmer@agrointel.com', '9876543210', 'Male', '1995-05-15', 'Karnataka', 'Udupi', 'Bantakal', 0)
        """)

    # Seed Buyer/Customer Account
    cursor.execute("SELECT * FROM custlogin WHERE email = 'buyer@agrointel.com'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO custlogin (cust_id, cust_name, password, email, address, city, pincode, state, phone_no, otp)
            VALUES (100, 'Sample Buyer', 'password', 'buyer@agrointel.com', 'Main Street', 'Udupi', '576101', 'Karnataka', '9876543211', 0)
        """)

    conn.commit()
    conn.close()
    print("Sample test accounts successfully seeded into database.")

if __name__ == '__main__':
    seed_users()
