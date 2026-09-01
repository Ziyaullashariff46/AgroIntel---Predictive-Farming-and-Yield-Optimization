-- AgroIntel schema — the three tables the application actually queries.
--
-- The original MySQL dump declared its primary keys in a trailing ALTER TABLE
-- block, which the old init_db.py stripped. That left farmer_id / c_id as
-- "INTEGER NOT NULL" with no PRIMARY KEY, so SQLite never auto-assigned them
-- and every INSERT that omitted an id failed with a NOT NULL constraint error.
-- Registration and the contact form were broken from the start as a result.
-- Declaring them INTEGER PRIMARY KEY makes them rowid aliases, which SQLite
-- fills in automatically.

CREATE TABLE IF NOT EXISTS farmerlogin (
    farmer_id   INTEGER PRIMARY KEY,
    farmer_name TEXT    NOT NULL,
    password    TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    phone_no    TEXT    NOT NULL,
    F_gender    TEXT    NOT NULL DEFAULT 'Not specified',
    F_birthday  TEXT    NOT NULL DEFAULT '2000-01-01',
    F_State     TEXT    NOT NULL,
    F_District  TEXT    NOT NULL,
    F_Location  TEXT    NOT NULL,
    otp         INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS admin (
    admin_id       INTEGER PRIMARY KEY,
    admin_name     TEXT    NOT NULL UNIQUE,
    admin_password TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS contactus (
    c_id      INTEGER PRIMARY KEY,
    c_name    TEXT NOT NULL,
    c_mobile  TEXT NOT NULL,
    c_email   TEXT NOT NULL,
    c_address TEXT NOT NULL,
    c_message TEXT NOT NULL
);
