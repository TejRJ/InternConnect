"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/ssidebar";
import { MapPin, CalendarDays, IndianRupee, Building2, X } from "lucide-react";
import { Opportunity } from "../../../types";

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [applyMessage, setApplyMessage] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/recruiter/opportunities/${id}`);
        if (!res.ok) throw new Error("Failed to load opportunity");
        const d = await res.json();
        setData(d);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load opportunity");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  useEffect(() => {
    const checkApplied = async () => {
      if (!id) return;
      const res = await fetch(`/api/student/applications/${id}`);
      if (res.ok) {
        const ex = await res.json();
        setAlreadyApplied(Boolean(ex));
        if (ex && ex.message) setApplyMessage(ex.message);
      }
    };
    checkApplied();
  }, [id]);

  const submitApplication = async () => {
    try {
      const res = await fetch(`/api/student/applications/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: applyMessage }),
      });
      if (res.status === 409) {
        setAlreadyApplied(true);
        setShowConfirm(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to apply");
      setAlreadyApplied(true);
      setShowConfirm(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to apply");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-white/80 px-4 py-3 backdrop-blur md:hidden">
        <button aria-label="Open Menu" className="group rounded-md border px-3 py-2" onClick={() => setIsSidebarOpen(true)}>
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-gray-900 transition group-hover:w-6"></span>
            <span className="block h-0.5 w-4 bg-gray-900 transition group-hover:w-6"></span>
            <span className="block h-0.5 w-6 bg-gray-900"></span>
          </div>
        </button>
        <p className="font-semibold">InternConnect</p>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-600 text-white shadow shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-semibold break-words">{data.title}</h1>
                  <p className="text-sm text-slate-600">{data.company}</p>
                  <p className="mt-1 text-xs text-slate-500">Posted by {data.recruiterUsername}</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-start lg:items-center gap-2 lg:gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 shrink-0" /> <span className="truncate">{data.location}</span></span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4 shrink-0" /> <span className="truncate">{data.duration}</span></span>
                    <span className="inline-flex items-center gap-1"><IndianRupee className="h-4 w-4 shrink-0" /> <span className="truncate">{data.stipend}</span></span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4 shrink-0" /> <span className="truncate">Deadline: {data.deadline}</span></span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Required Skills</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(data.skills || []).map((s: string, i: number) => (
                    <span key={i} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{data.description}</p>
              </div>
              <div className="mt-6 space-y-3">
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Write a message to the recruiter (optional)"
                  disabled={alreadyApplied}
                />
                <button 
                  onClick={() => setShowConfirm(true)} 
                  disabled={alreadyApplied} 
                  className="w-full sm:w-auto rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  {alreadyApplied ? "Already Applied" : "Apply Now"}
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Confirm Application</h3>
                <button onClick={() => setShowConfirm(false)} className="rounded-md p-1 hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600">Are you sure you want to apply? This cannot be reverted.</p>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200 whitespace-pre-wrap">
                {applyMessage || "(No message)"}
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setShowConfirm(false)} className="rounded-lg bg-white px-4 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
                <button onClick={submitApplication} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Confirm & Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


