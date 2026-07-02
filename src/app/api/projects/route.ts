import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const order = searchParams.get("order") || "updated_at";
    const dir = searchParams.get("dir") || "desc";
    const rows = db
      .prepare(
        `SELECT * FROM projects ORDER BY ${order === "created_at" ? "created_at" : "updated_at"} ${dir === "asc" ? "ASC" : "DESC"}`
      )
      .all();
    // Convert has_blocker from 0/1 to boolean
    const projects = rows.map((r: any) => ({
      ...r,
      has_blocker: !!r.has_blocker,
    }));
    return NextResponse.json({ data: projects, error: null });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || crypto.randomUUID();
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO projects (id, name, stage, next_action, health, notes, summary, has_blocker, blocker_reason, city, district, first_contact_date, assignee, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      body.name,
      body.stage,
      body.next_action || "",
      body.health || "green",
      body.notes || "",
      body.summary || "",
      body.has_blocker ? 1 : 0,
      body.blocker_reason || "",
      body.city || "",
      body.district || "",
      body.first_contact_date || null,
      body.assignee || "",
      now,
      now
    );
    const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as any;
    row.has_blocker = !!row.has_blocker;
    return NextResponse.json({ data: row, error: null }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: { message: err.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ data: null, error: { message: "id required" } }, { status: 400 });

    const now = new Date().toISOString();
    const sets: string[] = ["updated_at = ?"];
    const vals: any[] = [now];

    const allowed = [
      "name", "stage", "next_action", "health", "notes", "summary",
      "has_blocker", "blocker_reason", "city", "district",
      "first_contact_date", "assignee",
    ];
    for (const key of allowed) {
      if (key in fields) {
        sets.push(`${key} = ?`);
        vals.push(key === "has_blocker" ? (fields[key] ? 1 : 0) : fields[key]);
      }
    }
    vals.push(id);

    db.prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`).run(...vals);
    const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as any;
    if (row) row.has_blocker = !!row.has_blocker;
    return NextResponse.json({ data: row, error: null });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: { message: err.message } }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ data: null, error: { message: "id required" } }, { status: 400 });
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    return NextResponse.json({ data: null, error: null });
  } catch (err: any) {
    return NextResponse.json({ data: null, error: { message: err.message } }, { status: 500 });
  }
}
