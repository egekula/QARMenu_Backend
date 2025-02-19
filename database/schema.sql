-- Drop existing tables if they exist (in correct order due to dependencies)
DROP TABLE IF EXISTS menu_item_models CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Create admin table for authentication
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restaurant_id INTEGER REFERENCES restaurants(id)
);

-- Create restaurants table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create menu items table with restaurant reference (removed model_url)
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create menu item models table with both restaurant and menu item references
CREATE TABLE menu_item_models (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    model_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(restaurant_id, menu_item_id) -- Ensures one active model per menu item per restaurant
);