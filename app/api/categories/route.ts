import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const categories = db.prepare("SELECT * FROM categories ORDER BY name").all()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("GET categories error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
