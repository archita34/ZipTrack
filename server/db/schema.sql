-- Run this in PostgreSQL when you're ready to upgrade from in-memory to a real DB
-- psql -U postgres -d parcelpilot -f schema.sql

CREATE DATABASE IF NOT EXISTS parcelpilot;

CREATE TABLE IF NOT EXISTS drivers (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  avatar      TEXT,
  lat         NUMERIC(10, 7) NOT NULL,
  lng         NUMERIC(10, 7) NOT NULL,
  status      TEXT DEFAULT 'available' CHECK (status IN ('available', 'delivering')),
  order_id    TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  customer    TEXT NOT NULL,
  item        TEXT NOT NULL,
  from_loc    TEXT,
  to_loc      TEXT,
  status      TEXT DEFAULT 'preparing' CHECK (status IN ('preparing', 'picked_up', 'delivered')),
  driver_id   TEXT REFERENCES drivers(id),
  eta         INTEGER,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Seed drivers
INSERT INTO drivers (id, name, avatar, lat, lng, status) VALUES
  ('d1', 'Ravi Kumar',  '🛵', 12.9716, 77.5946, 'available'),
  ('d2', 'Priya Singh', '🚴', 12.9750, 77.6000, 'available'),
  ('d3', 'Arjun Mehta', '🛺', 12.9680, 77.5900, 'available')
ON CONFLICT (id) DO NOTHING;

-- Seed orders
INSERT INTO orders (id, customer, item, from_loc, to_loc, status, eta) VALUES
  ('PPT-001', 'Sneha Patel', '🍕 Margherita Pizza',   'Dominos, Koramangala',      '4th Block, HSR Layout',  'preparing', 25),
  ('PPT-002', 'Karan Bose',  '🍔 Smash Burger Combo', 'McDonald''s, Indiranagar',  'Whitefield Main Rd',     'preparing', 35),
  ('PPT-003', 'Meera Joshi', '🥗 Poke Bowl',          'Sattvik, Jayanagar',        'JP Nagar 6th Phase',     'preparing', 20)
ON CONFLICT (id) DO NOTHING;