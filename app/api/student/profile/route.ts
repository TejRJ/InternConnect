import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import StudentProfile from "../../../../models/StudentProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { Session } from "../../../../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const userId = (session as Session).user.id || (session as Session).user.sub;
  const doc = await StudentProfile.findOne({ userId });
  return NextResponse.json(doc || {});
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const userId = (session as Session).user.id || (session as Session).user.sub;
  const body = await req.json();
  const update = {
    department: body.department ?? "",
    academicYear: body.academicYear ?? "",
    gpa: body.gpa ?? "",
    phone: body.phone ?? "",
    bio: body.bio ?? "",
    skills: Array.isArray(body.skills) ? body.skills : [],
    interests: Array.isArray(body.interests) ? body.interests : [],
    social: {
      linkedin: body.social?.linkedin ?? "",
      github: body.social?.github ?? "",
    },
  };
  const doc = await StudentProfile.findOneAndUpdate(
    { userId },
    { $set: update, $setOnInsert: { userId } },
    { upsert: true, new: true }
  );
  return NextResponse.json(doc);
}


