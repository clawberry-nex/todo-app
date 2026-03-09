import { getDb } from "@/app/lib/db";
import { NextResponse } from "next/server";

const sql = getDb();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  let todo;

  if ("completed" in body) {
    [todo] = await sql`
      UPDATE todos SET completed = ${body.completed} WHERE id = ${parseInt(id)} RETURNING *
    `;
  } else if ("priority" in body) {
    if (!["high", "medium", "low"].includes(body.priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }
    [todo] = await sql`
      UPDATE todos SET priority = ${body.priority} WHERE id = ${parseInt(id)} RETURNING *
    `;
  } else {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

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
