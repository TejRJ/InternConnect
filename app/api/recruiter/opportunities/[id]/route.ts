import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import Opportunity from "../../../../../models/Opportunity";
import { Session, ApiRouteParams, Opportunity as IOpportunity } from "../../../../../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: ApiRouteParams) {
  // Public read by id for details view; recruiters can also read their own for manage
  const session = await getServerSession(authOptions);
  await dbConnect();
  const { id } = await params;
  if (session && (session as Session).user.role === "recruiter") {
    const recruiterId = (session as Session).user.id || (session as Session).user.sub;
    const own = await Opportunity.findOne({ _id: id, recruiterId }).lean() as unknown as IOpportunity | null;
    if (own) return NextResponse.json(own);
  }
  const doc = await Opportunity.findById(id).lean() as unknown as IOpportunity | null;
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(req: Request, { params }: ApiRouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user.role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const recruiterId = (session as Session).user.id || (session as Session).user.sub;
  const doc = await Opportunity.findOneAndUpdate(
    { _id: id, recruiterId },
    { $set: body },
    { new: true }
  );
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_: Request, { params }: ApiRouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user.role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { id } = await params;
  const recruiterId = (session as Session).user.id || (session as Session).user.sub;
  const res = await Opportunity.deleteOne({ _id: id, recruiterId });
  if (!res.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}


