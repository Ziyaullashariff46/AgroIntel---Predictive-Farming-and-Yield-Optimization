# AgroIntel Sample Login Credentials

Demo credentials for the **Farmer** and **Admin** portals. These are seeded by
`python seed_sample_users.py` and are intended for local evaluation only.

---

## 1. 🚜 Farmer Portal

- **Portal URL**: `http://127.0.0.1:5000/login/farmer`
- **Email**: `farmer@agrointel.com`
- **Password**: `Demo@2026!`

---

## 2. 🛡️ Admin Portal

- **Portal URL**: `http://127.0.0.1:5000/login/admin`
- **Username**: `admin`
- **Password**: `Demo@2026!`

---

## 💡 Notes
- The Buyer / Customer marketplace has been retired; `/login/customer` redirects to the Farmer Portal.
- Register your own farmer account at `http://127.0.0.1:5000/register/farmer` (minimum 8-character password).
- Login is rate-limited to **5 attempts per 15 minutes per IP**. If you get locked out during testing, restart the server to clear the in-memory counter.
- Every `/farmer/*`, `/admin/*` and `/api/*` URL is gated by a server-side `before_request` guard — there is no way to reach a portal page or JSON endpoint without a session.
