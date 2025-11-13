-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Art Cards table
CREATE TABLE IF NOT EXISTS art_cards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL,
  table_number TEXT NOT NULL,
  logo_path TEXT,
  whatsapp TEXT,
  web_link TEXT,
  instagram TEXT,
  facebook TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert default categories
INSERT OR IGNORE INTO categories (id, name) VALUES
  ('stands', 'Stands'),
  ('activities', 'Actividades'),
  ('teachers', 'Profesores');

-- Insert default admin user (username: admin, password: admin123)
INSERT OR IGNORE INTO users (id, username, password) VALUES
  ('admin-1', 'admin', 'admin123');
z