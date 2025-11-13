import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const db = await getDb()

    db.prepare(
      `UPDATE art_cards 
       SET title = ?, description = ?, category_id = ?, exposition_id = ?, table_number = ?, 
           logo_path = ?, whatsapp = ?, web_link = ?, instagram = ?, facebook = ?, email = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    ).run(
      body.title,
      body.description,
      body.category_id,
      body.exposition_id,
      body.table_number,
      body.logo_path,
      body.whatsapp,
      body.web_link,
      body.instagram,
      body.facebook,
      body.email,
      id,
    )

    const card = db
      .prepare(
        `SELECT ac.*, c.name as category_name, e.name as exposition_name FROM art_cards ac 
         JOIN categories c ON ac.category_id = c.id 
         JOIN expositions e ON ac.exposition_id = e.id WHERE ac.id = ?`,
      )
      .get(id)

    return NextResponse.json(card)
  } catch (error) {
    console.error("PUT card error:", error)
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()
    db.prepare("DELETE FROM art_cards WHERE id = ?").run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE card error:", error)
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 })
  }
}
