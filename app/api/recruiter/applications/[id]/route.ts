import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import dbConnect from "../../../../../lib/db";
import Application from "../../../../../models/Application";
import Opportunity from "../../../../../models/Opportunity";
import StudentProfile from "../../../../../models/StudentProfile";
import { Session, ApiRouteParams, Application as IApplication, Opportunity as IOpportunity, StudentProfile as IStudentProfile } from "../../../../../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: ApiRouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions) as Session | null;
  if (!session || session.user.role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const recruiterId = session.user.id || session.user.sub;
  const app = await Application.findOne({ _id: id, recruiterId }).lean() as unknown as IApplication | null;
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const opp = await Opportunity.findById(app.opportunityId).lean() as unknown as IOpportunity | null;
  const profile = await StudentProfile.findOne({ userId: app.studentId }).lean() as unknown as IStudentProfile | null;
  return NextResponse.json({ application: app, opportunity: opp, studentProfile: profile });
}


