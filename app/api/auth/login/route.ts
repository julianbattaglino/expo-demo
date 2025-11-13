import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { verifyPassword, createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const db = await getDb()
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username)

    console.log("[v0] Login attempt for user:", username)
    console.log("[v0] User found in DB:", !!user)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const passwordMatch = await verifyPassword(password, user.password as string)
    console.log("[v0] Password match:", passwordMatch)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createToken(user.id, user.username)

    const response = NextResponse.json({ success: true, username: user.username }, { status: 200 })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
