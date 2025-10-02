import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import dbConnect from "../../../../../lib/db";
import Opportunity from "../../../../../models/Opportunity";
import Application from "../../../../../models/Application";
import { Session, ApiRouteParams, Application as IApplication, Opportunity as IOpportunity } from "../../../../../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: ApiRouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { opportunityId } = await params;
  const studentId = (session as Session).user.id || (session as Session).user.sub;
  const existing = await Application.findOne({ opportunityId, studentId }).lean() as unknown as IApplication | null;
  return NextResponse.json(existing || null);
}

export async function POST(req: Request, { params }: ApiRouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { opportunityId } = await params;
  const studentId = (session as Session).user.id || (session as Session).user.sub;
  const studentUsername = (session as Session).user.name;
  const opp = await Opportunity.findById(opportunityId).lean() as unknown as IOpportunity | null;
  if (!opp) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  const body = await req.json();
  const message = (body?.message || "").toString();
  try {
    const doc = await Application.create({
      opportunityId,
      recruiterId: opp.recruiterId,
      studentId,
      studentUsername,
      message,
      status: "New",
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: number })?.code === 11000) return NextResponse.json({ error: "Already applied" }, { status: 409 });
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }
}


