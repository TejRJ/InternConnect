import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import Application from "../../../../models/Application";
import { Session, Application as IApplication } from "../../../../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions) as Session | null;
  if (!session || session.user.role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const recruiterId = session.user.id || session.user.sub;
  const items = await Application.find({ recruiterId }).sort({ createdAt: -1 }).lean() as unknown as IApplication[];
  return NextResponse.json(items);
}


