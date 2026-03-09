import { getDb } from "@/app/lib/db";
import { NextResponse } from "next/server";

const sql = getDb();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { completed } = await request.json();
  const [todo] = await sql`
    UPDATE todos SET completed = ${completed} WHERE id = ${parseInt(id)} RETURNING *
  `;
  if (!todo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(todo);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await sql`DELETE FROM todos WHERE id = ${parseInt(id)}`;
  return NextResponse.json({ success: true });
}
