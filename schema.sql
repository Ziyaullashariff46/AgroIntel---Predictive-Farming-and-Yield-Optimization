-- AgroIntel Schema
-- Cleaned schema with data minimisation (legacy gender/birthday/otp fields removed).
-- Compatible with SQLite and convertible to hosted PostgreSQL.

CREATE TABLE IF NOT EXISTS farmerlogin (
    farmer_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_name TEXT    NOT NULL,
    password    TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    phone_no    TEXT    NOT NULL,
    F_State     TEXT    NOT NULL,
    F_District  TEXT    NOT NULL,
    F_Location  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS admin (
    admin_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_name     TEXT    NOT NULL UNIQUE,
    admin_password TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS contactus (
    c_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    c_name    TEXT NOT NULL,
    c_mobile  TEXT NOT NULL,
    c_email   TEXT NOT NULL,
    c_address TEXT NOT NULL,
    c_message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL,
    token      TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used       INTEGER DEFAULT 0
);
