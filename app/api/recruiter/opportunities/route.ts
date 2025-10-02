import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import Opportunity from "../../../../models/Opportunity";
import { Session, Opportunity as IOpportunity } from "../../../../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // If recruiter is logged in, return their own listings
  const session = await getServerSession(authOptions);
  await dbConnect();
  if (session && (session as Session).user.role === "recruiter") {
    const recruiterId = (session as Session).user.id || (session as Session).user.sub;
    const items = await Opportunity.find({ recruiterId }).sort({ createdAt: -1 }).lean() as unknown as IOpportunity[];
    return NextResponse.json(items);
  }
  // Otherwise, return all opportunities (public feed for students)
  const all = await Opportunity.find({}).sort({ createdAt: -1 }).lean() as unknown as IOpportunity[];
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user.role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const body = await req.json();
  const required = [
    "title","type","domain","location","workType","stipend","duration","deadline","skills","description"
  ];
  for (const k of required) {
    if (k === "skills") {
      if (!Array.isArray(body[k]) || body[k].length === 0) return NextResponse.json({ error: `${k} required` }, { status: 400 });
    } else if (!body[k] || (typeof body[k] === "string" && body[k].trim() === "")) {
      return NextResponse.json({ error: `${k} required` }, { status: 400 });
    }
  }
  const recruiterId = (session as Session).user.id || (session as Session).user.sub;
  const recruiterUsername = (session as Session).user.name;
  const doc = await Opportunity.create({
    recruiterId,
    recruiterUsername,
    title: body.title,
    company: body.company || "",
    type: body.type,
    domain: body.domain,
    location: body.location,
    workType: body.workType,
    stipend: body.stipend,
    duration: body.duration,
    deadline: body.deadline,
    paid: Boolean(body.paid),
    skills: body.skills,
    description: body.description,
  });
  return NextResponse.json(doc, { status: 201 });
}


