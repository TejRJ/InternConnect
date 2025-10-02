"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RSidebar from "../../components/rsidebar";
import { Briefcase, MapPin, CalendarDays, IndianRupee, Plus, Users, Edit3 } from "lucide-react";
import { Opportunity } from "../../types";

function EmptyState({ onPost }: { onPost: () => void }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-600">
        <Briefcase className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No job postings yet</h3>
      <p className="mt-1 text-sm text-slate-600">Start posting opportunities to attract the best talent</p>
      <button
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 cursor-pointer transition-colors"
        onClick={onPost}
      >
        <Plus className="h-4 w-4" /> Post Your First Job
      </button>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{children}</span>;
}

function JobCard({ item, onManage, onViewApplicants }: { item: Opportunity; onManage: (id: string) => void; onViewApplicants: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-600 text-white shadow shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-900 break-words">{item.title}</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-start lg:items-center gap-2 lg:gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 shrink-0" /> 
                <span className="truncate">{item.location}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4 shrink-0" /> 
                <span className="truncate">{item.duration}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <IndianRupee className="h-4 w-4 shrink-0" /> 
                <span className="truncate">{item.stipend}</span>
              </span>
              <Badge>{item.workType}</Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={() => onViewApplicants(item._id)} 
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">View Applicants</span>
            <span className="sm:hidden">Applicants</span>
          </button>
          <button 
            onClick={() => onManage(item._id)} 
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}


export default function RecruiterListingsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  const postNew = () => { router.push("/ropportunities"); };

  const fetchMine = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/recruiter/opportunities");
      if (!res.ok) throw new Error("Failed to load listings");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMine(); }, []);

  const manage = (id: string) => {
    router.push(`/rlistings/${id}`);
  };

  const viewApplicants = (opportunityId: string) => {
    // Navigate to a filtered applications page for this specific opportunity
    router.push(`/rapplications?opportunityId=${opportunityId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      {/* Mobile top bar */}
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">My Job Listings</h1>
              <p className="mt-1 text-gray-600">Manage your posted opportunities</p>
            </div>
            <button onClick={postNew} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 cursor-pointer transition-colors">
              <Plus className="h-4 w-4" /> Post New Job
            </button>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-slate-600">Loading...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : items.length > 0 ? (
              <div className="space-y-4">
                {items.map((it) => (
                  <JobCard key={it._id} item={it} onManage={manage} onViewApplicants={viewApplicants} />
                ))}
              </div>
            ) : (
              <EmptyState onPost={postNew} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

