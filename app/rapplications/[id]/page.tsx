"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RSidebar from "../../../components/rsidebar";
import { User2, MapPin, CalendarDays, IndianRupee } from "lucide-react";
import { Application, Opportunity, StudentProfile } from "../../../types";

export default function RecruiterApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<{ application: Application; opportunity: Opportunity; studentProfile: StudentProfile } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/recruiter/applications/${id}`);
        if (!res.ok) throw new Error("Failed to load application");
        const d = await res.json();
        setData(d);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load application");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <RSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[18rem_1fr]">
        <div className="hidden md:block" />
        <main className="relative px-2 pb-10 pt-6 sm:px-3 md:pt-8">
          <button onClick={() => router.back()} className="mb-4 rounded-lg bg-white px-4 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-50">Back</button>
          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : data ? (
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white shrink-0">
                    <User2 className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-semibold truncate">{data?.application?.studentUsername}</h1>
                    <p className="text-sm text-slate-600 truncate">Applied for {data?.opportunity?.title}</p>
                  </div>
                </div>
                <button onClick={() => setShowProfile((v) => !v)} className="rounded-lg bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200 hover:bg-slate-50 cursor-pointer transition-colors shrink-0 w-full sm:w-auto text-center">{showProfile ? "Hide Profile" : "View Profile"}</button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold">Opportunity Details</h3>
                  <div className="mt-2 space-y-1 text-sm text-slate-700">
                    <p>{data?.opportunity?.company}</p>
                    <p className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {data?.opportunity?.location}</p>
                    <p className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {data?.opportunity?.duration}</p>
                    <p className="inline-flex items-center gap-1"><IndianRupee className="h-4 w-4" /> {data?.opportunity?.stipend}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold">Application Message</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{data?.application?.message || "(No message)"}</p>
                </div>
              </div>

              {showProfile && (
                <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <h3 className="text-base font-semibold">Student Profile</h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <h4 className="text-sm font-semibold">Basics</h4>
                      <div className="mt-2 text-sm text-slate-700 space-y-1">
                        <p><span className="text-slate-500">Name:</span> {data?.application?.studentUsername}</p>
                        <p><span className="text-slate-500">Department:</span> {data?.studentProfile?.department || "-"}</p>
                        <p><span className="text-slate-500">Academic Year:</span> {data?.studentProfile?.academicYear || "-"}</p>
                        <p><span className="text-slate-500">GPA:</span> {data?.studentProfile?.gpa || "-"}</p>
                        <p><span className="text-slate-500">Phone:</span> {data?.studentProfile?.phone || "-"}</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <h4 className="text-sm font-semibold">About</h4>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 min-h-[3rem]">{data?.studentProfile?.bio || "-"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <h4 className="text-sm font-semibold">Skills</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(data?.studentProfile?.skills || []).length === 0 ? (
                          <p className="text-sm text-slate-500">-</p>
                        ) : (
                          (data?.studentProfile?.skills || []).map((s: string, i: number) => (
                            <span key={i} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">{s}</span>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <h4 className="text-sm font-semibold">Interests & Links</h4>
                      <div className="mt-2 text-sm text-slate-700 space-y-1">
                        <p><span className="text-slate-500">Interests:</span> {(data?.studentProfile?.interests || []).join(", ") || "-"}</p>
                        <p><span className="text-slate-500">LinkedIn:</span> {data?.studentProfile?.social?.linkedin || "-"}</p>
                        <p><span className="text-slate-500">GitHub:</span> {data?.studentProfile?.social?.github || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}


