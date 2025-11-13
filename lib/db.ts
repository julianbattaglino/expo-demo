import Database from "better-sqlite3"
import path from "path"
import { hashPassword } from "./auth"

let db: Database.Database | null = null

export async function getDb() {
  if (!db) {
    const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "data", "app.db")
    db = new Database(dbPath)
    db.pragma("journal_mode = WAL")

    await initializeDatabase()
  }
  return db
}

async function initializeDatabase() {
  if (!db) return

  // Ensure tables exist (idempotent)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

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
  `)

  // Insert default categories
  const categoryInsert = db.prepare("INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)")
  categoryInsert.run("stands", "Stands")
  categoryInsert.run("activities", "Actividades")
  categoryInsert.run("teachers", "Profesores")

  // Ensure default admin exists and that the password is hashed.
  // This handles cases where an earlier SQL seed inserted a plain-text password.
  const getAdmin = db.prepare("SELECT id, username, password FROM users WHERE username = ?").get("admin") as { id: string; username: string; password: string } | undefined

  if (!getAdmin) {
    const hashedPassword = await hashPassword("admin123")
    db.prepare("INSERT OR IGNORE INTO users (id, username, password) VALUES (?, ?, ?)").run(
      "admin-1",
      "admin",
      hashedPassword,
    )
    console.log("[v0] Default admin created")
  } else {
    const pw = getAdmin.password || ""
    // rudimentary check for bcrypt hash prefix
    if (!pw.startsWith("$2a$") && !pw.startsWith("$2b$") && !pw.startsWith("$2y$")) {
      const hashed = await hashPassword(pw)
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashed, getAdmin.id)
      console.log("[v0] Existing admin password hashed")
    }
  }

  console.log("[v0] Database ensured with tables, categories and admin user")
}
