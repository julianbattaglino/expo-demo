const Database = require("better-sqlite3")
const path = require("path")
const fs = require("fs")

const dbPath = path.join(process.cwd(), "data", "app.db")

// Crear directorio si no existe
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true })
}

const db = new Database(dbPath)

try {
  // Leer y ejecutar el script SQL
  const sqlScript = fs.readFileSync(path.join(process.cwd(), "scripts", "init-db.sql"), "utf-8")
  db.exec(sqlScript)

  console.log("✅ Base de datos inicializada correctamente")
  console.log("📍 Base de datos guardada en:", dbPath)

  // Verificar que las categorías se crearon
  const categories = db.prepare("SELECT * FROM categories").all()
  console.log("📂 Categorías creadas:", categories)

  // Verificar que el usuario admin se creó
  const users = db.prepare("SELECT id, username FROM users").all()
  console.log("👤 Usuarios creados:", users)
} catch (error) {
  console.error("❌ Error al inicializar la base de datos:", error)
  process.exit(1)
} finally {
  db.close()
}
