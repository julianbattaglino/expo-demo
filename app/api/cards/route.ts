import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { generateId } from "@/lib/utils/id"

export async function GET() {
  try {
    const db = await getDb()
    const cards = db
      .prepare(
        `SELECT ac.*, c.name as category_name 
         FROM art_cards ac 
         JOIN categories c ON ac.category_id = c.id 
         ORDER BY ac.created_at DESC`,
      )
      .all()

    return NextResponse.json(cards)
  } catch (error) {
    console.error("GET cards error:", error)
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category_id, table_number, logo_path, whatsapp, web_link, instagram, facebook, email } =
      body

    if (!title || !description || !category_id || !table_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()
    const id = generateId()

    db.prepare(
      `INSERT INTO art_cards 
       (id, title, description, category_id, table_number, logo_path, whatsapp, web_link, instagram, facebook, email) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, title, description, category_id, table_number, logo_path, whatsapp, web_link, instagram, facebook, email)

    const card = db
      .prepare(
        `SELECT ac.*, c.name as category_name FROM art_cards ac 
         JOIN categories c ON ac.category_id = c.id WHERE ac.id = ?`,
      )
      .get(id)

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error("POST card error:", error)
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 })
  }
}
