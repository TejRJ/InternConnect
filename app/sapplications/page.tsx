"use client";

import Sidebar from "../../components/ssidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, XCircle, ExternalLink } from "lucide-react";
import { Application } from "../../types";

function ApplicationCard({ app, onViewDetails }: { app: Application; onViewDetails: (opportunityId: string) => void }) {
  const map: Record<string, string> = {
    New: "bg-indigo-100 text-indigo-800",
    Shortlisted: "bg-amber-100 text-amber-800",
    Selected: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  const badge = map[app.status] || map.New;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-all duration-200 border-l-4 border-l-indigo-500">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{app.opportunity?.title || "Opportunity"}</h3>
          <p className="text-sm text-slate-600 mt-1">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
          {app.message && <p className="mt-2 line-clamp-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-2">{app.message}</p>}
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge}`}>{app.status}</span>
          <button 
            onClick={() => onViewDetails(app.opportunityId)}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <ExternalLink className="h-3 w-3" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/student/applications");
        if (!res.ok) throw new Error("Failed to load applications");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleViewDetails = (opportunityId: string) => {
    router.push(`/sopportunities/${opportunityId}`);
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Applications</h1>
              <p className="mt-1 text-gray-600">Track your submitted applications and their status</p>
            </div>
            <p className="text-sm text-slate-500">{loading ? "Loading..." : error ? error : `${items.length} total applications`}</p>
          </div>

          {loading ? (
            <div className="mt-6 grid place-items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <Clock className="h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-slate-600">Loading applications...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-6 grid place-items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <XCircle className="h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700">No applications yet</p>
              <p className="mt-1 text-sm text-slate-500">Apply to opportunities to see them here.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((app) => (
                <ApplicationCard key={app._id} app={app} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


