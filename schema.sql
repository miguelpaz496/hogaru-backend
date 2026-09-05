-- Create database (run this separately in psql)
-- CREATE DATABASE hogaru_db;

-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  avatar VARCHAR(255),
  color VARCHAR(7) NOT NULL DEFAULT '#1a5fa8',
  role VARCHAR(10) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  google_id VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Households
CREATE TABLE households (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_by INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Household
CREATE TABLE user_household (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  household_id INT NOT NULL REFERENCES households(id),
  status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active')),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, household_id)
);

-- Shopping Lists
CREATE TABLE shopping_lists (
  id SERIAL PRIMARY KEY,
  household_id INT NOT NULL REFERENCES households(id),
  name VARCHAR(100) NOT NULL,
  created_by INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping Items
CREATE TABLE shopping_items (
  id SERIAL PRIMARY KEY,
  list_id INT NOT NULL REFERENCES shopping_lists(id),
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Otros' CHECK (category IN (
    'Lácteos',
    'Carnes y pescados',
    'Frutas y verduras',
    'Panadería y cereales',
    'Aseo personal',
    'Limpieza del hogar',
    'Congelados',
    'Enlatados y conservas',
    'Granos y pasta',
    'Farmacia',
    'Mascotas',
    'Otros'
  )),
  needed BOOLEAN NOT NULL DEFAULT true,
  added_by INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  household_id INT NOT NULL REFERENCES households(id),
  paid_by INT NOT NULL REFERENCES users(id),
  created_by INT NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  split DECIMAL(4,3) NOT NULL DEFAULT 0.500,
  category VARCHAR(100),
  description TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Debt Payments
CREATE TABLE debt_payments (
  id SERIAL PRIMARY KEY,
  household_id INT NOT NULL REFERENCES households(id),
  paid_by INT NOT NULL REFERENCES users(id),
  paid_to INT NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Household Tasks
CREATE TABLE household_tasks (
  id SERIAL PRIMARY KEY,
  household_id INT NOT NULL REFERENCES households(id),
  title VARCHAR(200) NOT NULL,
  done_by INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  household_id INT NOT NULL REFERENCES households(id),
  title VARCHAR(200) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('event', 'expense', 'task')),
  reference_id INT,
  event_date DATE NOT NULL,
  color VARCHAR(7),
  created_by INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);