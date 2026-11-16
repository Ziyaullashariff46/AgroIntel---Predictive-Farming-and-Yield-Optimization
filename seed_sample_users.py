import bcrypt
import os
import db

def seed_users():
    db.ensure_db()
    conn = db.get_db()

    # Ensure Admin Account exists
    admin = conn.execute("SELECT * FROM admin WHERE admin_name = ?", ('admin',)).fetchone()
    if not admin:
        conn.execute(
            "INSERT INTO admin (admin_id, admin_name, admin_password) VALUES (?, ?, ?)",
            (1, 'admin', '$2b$12$Qmr0bYXJomXoiMBgVdQ77OM0wOPqVRGoRPnSc.Ve7aTyMCTqS8SJW')
        )

    # Seed Farmer Account
    farmer = conn.execute("SELECT * FROM farmerlogin WHERE email = ?", ('farmer@agrointel.com',)).fetchone()
    if not farmer:
        conn.execute("""
            INSERT INTO farmerlogin (farmer_id, farmer_name, password, email, phone_no, F_State, F_District, F_Location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (100, 'Sample Farmer', '$2b$12$Qmr0bYXJomXoiMBgVdQ77OM0wOPqVRGoRPnSc.Ve7aTyMCTqS8SJW', 'farmer@agrointel.com', '9876543210', 'Karnataka', 'Udupi', 'Bantakal'))

    # Rotate any legacy account still holding the dictionary-word password
    conn.execute("UPDATE farmerlogin SET password = ? WHERE password = ?",
                 ('$2b$12$Qmr0bYXJomXoiMBgVdQ77OM0wOPqVRGoRPnSc.Ve7aTyMCTqS8SJW', 'password'))
    conn.execute("UPDATE admin SET admin_password = ? WHERE admin_password = ?",
                 ('$2b$12$Qmr0bYXJomXoiMBgVdQ77OM0wOPqVRGoRPnSc.Ve7aTyMCTqS8SJW', 'password'))

    conn.commit()
    conn.close()
    print("Sample test accounts seeded successfully.")
    print("  Farmer  -> email: farmer@agrointel.com  | password: Demo@2026!")
    print("  Admin   -> username: admin              | password: Demo@2026!")

if __name__ == '__main__':
    seed_users()
