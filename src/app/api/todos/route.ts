import { getDb } from "@/app/lib/db";
import { NextResponse } from "next/server";

const sql = getDb();

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false,
      priority TEXT NOT NULL DEFAULT 'medium',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  // Add priority column if it doesn't exist (for existing deployments)
  await sql`
    ALTER TABLE todos ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'medium'
  `;
}

const PRIORITY_ORDER = `CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`;

export async function GET() {
  await ensureTable();
  const todos = await sql`SELECT * FROM todos ORDER BY ${sql.unsafe(PRIORITY_ORDER)}, created_at ASC`;
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  await ensureTable();
  const { text, priority = "medium" } = await request.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  if (!["high", "medium", "low"].includes(priority)) {
    return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
  }
  const [todo] = await sql`
    INSERT INTO todos (text, priority) VALUES (${text.trim()}, ${priority}) RETURNING *
  `;
  return NextResponse.json(todo);
}
