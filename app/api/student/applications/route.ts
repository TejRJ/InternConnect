import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import Application from "../../../../models/Application";
import { Session, Application as IApplication, Opportunity as IOpportunity } from "../../../../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const studentId = (session as Session).user.id || (session as Session).user.sub;
  const items = await Application.find({ studentId })
    .sort({ createdAt: -1 })
    .populate({ path: "opportunityId", select: "title company recruiterUsername" })
    .lean();
  const normalized = (items as unknown as (IApplication & { opportunityId: IOpportunity })[]).map((it) => ({
    ...it,
    opportunity: it.opportunityId,
    opportunityId: it.opportunityId?._id || it.opportunityId,
  }));
  return NextResponse.json(normalized);
}


