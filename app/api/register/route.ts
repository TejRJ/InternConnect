import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import { hash } from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const usernameRaw = (body?.username || "").toString();
    const password: string = (body?.password || "").toString();
    const role: string = (body?.role || "student").toString();
    const username = usernameRaw.trim();
    if (!username || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const normalizedRole = role === "recruiter" ? "recruiter" : "student";
    await dbConnect();
    const exists = await User.findOne({ username });
    if (exists) return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    const hashed = await hash(password, 10);
    await User.create({ username, password: hashed, role: normalizedRole });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("/api/register error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


