import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Clock, FileText, PlusCircle, ClipboardList, MapPin, CalendarDays, IndianRupee } from "lucide-react";
import { Opportunity, Application } from "../types";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "indigo",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent?: "indigo" | "emerald" | "amber" | "purple";
}) {
  const accentText: Record<string, string> = {
    indigo: "text-indigo-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    purple: "text-purple-600",
  };
  const accentBg: Record<string, string> = {
    indigo: "bg-indigo-100",
    emerald: "bg-emerald-100",
    amber: "bg-amber-100",
    purple: "bg-purple-100",
  };
  const decorFill: Record<string, string> = {
    indigo: "fill-indigo-500",
    emerald: "fill-emerald-500",
    amber: "fill-amber-500",
    purple: "fill-purple-500",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white px-5 py-4 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow duration-300">
      {/* decorative circle */}
      <svg className="absolute -right-10 -top-10 h-32 w-32 opacity-10" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="40" className={decorFill[accent]} />
      </svg>
      <div className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full ${accentBg[accent]}`}>
        <Icon className={`h-5 w-5 ${accentText[accent]}`} />
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}

export default function RMain() {
  const router = useRouter();
  const [listings, setListings] = useState<Opportunity[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [appsCount, setAppsCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/recruiter/opportunities");
        if (!res.ok) return;
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setListings(arr.slice(0, 2)); // Show max 2 listings
        setCount(arr.length);
        const appsRes = await fetch("/api/recruiter/applications");
        if (appsRes.ok) {
          const apps = await appsRes.json();
          const appsArray = Array.isArray(apps) ? apps : [];
          setAppsCount(appsArray.length);
          // Sort by createdAt and take the 2 most recent
          const sortedApps = appsArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setRecentApplications(sortedApps.slice(0, 2));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  return (
    <>
      {/* Top Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Active Listings" value={String(count)} subtitle="Job postings" icon={Briefcase} accent="indigo" />
        <StatCard title="Total Candidates" value={String(appsCount)} subtitle="Applications received" icon={Users} accent="emerald" />
        <StatCard title="Pending Reviews" value={String(appsCount)} subtitle="Awaiting your review" icon={Clock} accent="amber" />
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Recent Applications */}
          <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
              <button onClick={() => router.push("/rapplications")} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                View All →
              </button>
            </div>
            {recentApplications.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-8 text-center ring-1 ring-slate-200">
                <FileText className="h-8 w-8 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">No applications received yet.</p>
                <p className="mt-1 text-sm text-slate-500">
                  Post opportunities to start receiving applications!
                </p>
              </div>
            ) : (
              <div className="mt-4 max-h-48 overflow-y-auto rounded-xl ring-1 ring-slate-200">
                <ul className="divide-y divide-slate-200">
                  {recentApplications.map((app: Application) => (
                    <li key={app._id} className="flex items-start justify-between gap-3 bg-white px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => router.push(`/rapplications/${app._id}`)}>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{app.studentUsername}</p>
                        <p className="truncate text-xs text-slate-600">Applied for {app.opportunity?.title || "Opportunity"}</p>
                        <p className="text-xs text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                        app.status === "New" ? "bg-indigo-100 text-indigo-800" :
                        app.status === "Shortlisted" ? "bg-amber-100 text-amber-800" :
                        app.status === "Selected" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {app.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* My Listings */}
          <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">My Listings</h2>
              <button onClick={() => router.push("/rlistings")} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                View All →
              </button>
            </div>
            {loading ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-8 text-center ring-1 ring-slate-200">
                <Briefcase className="h-8 w-8 text-slate-400" />
                <p className="mt-3 text-sm text-slate-600">Loading...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-8 text-center ring-1 ring-slate-200">
                <Briefcase className="h-8 w-8 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">No job postings yet</p>
                <button onClick={() => router.push("/ropportunities")} className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="mt-4 max-h-64 overflow-y-auto rounded-xl ring-1 ring-slate-200">
                <ul className="divide-y divide-slate-200">
                  {listings.map((it: Opportunity) => (
                    <li key={it._id} className="flex items-start justify-between gap-3 bg-white px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{it.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {it.location}</span>
                          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {it.duration}</span>
                          <span className="inline-flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {it.stipend}</span>
                        </div>
                      </div>
                      <button onClick={() => router.push(`/rlistings/${it._id}`)} className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200 hover:bg-slate-50">Manage</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <ul className="mt-4 space-y-3">
              <li onClick={() => router.push("/ropportunities")} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 cursor-pointer transition">
                <PlusCircle className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Post New Job</span>
              </li>
              <li onClick={() => router.push("/rapplications")} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 cursor-pointer transition">
                <ClipboardList className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Review Applications</span>
              </li>
              <li onClick={() => router.push("/rlistings")} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 cursor-pointer transition">
                <Briefcase className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">My Job Listings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
