"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RSidebar from "../../components/rsidebar";
import { User2, Clock, XCircle } from "lucide-react";
import { Application } from "../../types";

function ApplicationRow({ app, onDetails }: { app: Application; onDetails: (id: string) => void }) {
  const map: Record<string, { text: string; classes: string }> = {
    New: { text: "New", classes: "bg-indigo-100 text-indigo-800" },
    Shortlisted: { text: "Shortlisted", classes: "bg-amber-100 text-amber-800" },
    Selected: { text: "Selected", classes: "bg-green-100 text-green-700" },
    Rejected: { text: "Rejected", classes: "bg-red-100 text-red-700" },
  };
  const status = map[app.status] || map.New;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white">
            <User2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">{app.studentUsername}</h3>
            <p className="text-sm text-slate-600">Applied for {app.opportunity?.title || "Opportunity"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.classes}`}>{status.text}</span>
          <button onClick={() => onDetails(app._id)} className="rounded-lg bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200 hover:bg-slate-50">Details</button>
        </div>
      </div>
    </div>
  );
}

function RecruiterApplicationsContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get('opportunityId');

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/recruiter/applications");
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      const applications = Array.isArray(data) ? data : [];
      
      // Filter by opportunityId if provided
      if (opportunityId) {
        const filtered = applications.filter(app => app.opportunityId === opportunityId);
        setFilteredItems(filtered);
      } else {
        setFilteredItems(applications);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => { load(); }, [opportunityId, load]);

  const onDetails = (id: string) => {
    router.push(`/rapplications/${id}`);
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
        <p className="font-semibold">InternConnect – Recruiter</p>
      </header>

      <RSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[18rem_1fr]">
        <div className="hidden md:block" />
        <main className="relative px-2 pb-10 pt-6 sm:px-3 md:pt-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Applications</h1>
              <p className="mt-1 text-gray-600">
                {opportunityId ? "Applications for selected opportunity" : "Review and manage candidate applications"}
              </p>
              {opportunityId && (
                <button 
                  onClick={() => router.push('/rapplications')}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  ← View all applications
                </button>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {loading ? "Loading..." : error ? error : `${filteredItems.length} ${opportunityId ? 'filtered' : 'total'} applications`}
            </p>
          </div>

          {loading ? (
            <div className="mt-6 grid place-items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <Clock className="h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600">Loading applications...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="mt-6 grid place-items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <XCircle className="h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700">
                {opportunityId ? "No applications for this opportunity" : "No applications received"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {opportunityId ? "This opportunity hasn't received any applications yet." : "Your posted opportunities will appear here when students apply."}
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredItems.map((app) => (
                <ApplicationRow key={app._id} app={app} onDetails={onDetails} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function RecruiterApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[18rem_1fr]">
          <div className="hidden md:block" />
          <main className="relative px-2 pb-10 pt-6 sm:px-3 md:pt-8">
            <div className="grid place-items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <Clock className="h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600">Loading...</p>
            </div>
          </main>
        </div>
      </div>
    }>
      <RecruiterApplicationsContent />
    </Suspense>
  );
}

