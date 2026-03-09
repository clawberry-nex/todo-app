import { getDb } from "@/app/lib/db";
import { NextResponse } from "next/server";

const sql = getDb();

// Ensure table exists
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

export async function GET() {
  await ensureTable();
  const todos = await sql`SELECT * FROM todos ORDER BY created_at ASC`;
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  await ensureTable();
  const { text } = await request.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  const [todo] = await sql`
    INSERT INTO todos (text) VALUES (${text.trim()}) RETURNING *
  `;
  return NextResponse.json(todo);
}
