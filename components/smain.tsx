import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Calendar, Lightbulb } from "lucide-react";
import { Application } from "../types";

function Card({
  children,
  accent = "indigo",
  icon: Icon,
  withDecor = true,
}: {
  children: React.ReactNode;
  accent?: "indigo" | "purple" | "emerald" | "amber";
  icon?: React.ElementType;
  withDecor?: boolean;
}) {
  const accentColors: Record<string, string> = {
    indigo: "text-indigo-500",
    purple: "text-purple-500",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
  };

  return (
    <div className="relative rounded-2xl bg-white px-5 py-4 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Top Right Icon */}
      {Icon && (
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 shadow-sm">
          <Icon className={`${accentColors[accent]} h-4 w-4`} />
        </div>
      )}

      {/* Single Decorative Circle */}
      {withDecor && (
        <svg
          className="absolute -right-10 -top-10 h-32 w-32 opacity-10"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle
            cx="40"
            cy="40"
            r="40"
            className={accentColors[accent]}
            fill="currentColor"
          />
        </svg>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Main() {
  const router = useRouter();
  const [appCount, setAppCount] = useState<number>(0);
  const [recent, setRecent] = useState<Application[]>([]);
  const [oppCount, setOppCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [appsRes, oppsRes] = await Promise.all([
          fetch("/api/student/applications"),
          fetch("/api/recruiter/opportunities"),
        ]);
        if (appsRes.ok) {
          const apps = await appsRes.json();
          setAppCount(Array.isArray(apps) ? apps.length : 0);
          setRecent((Array.isArray(apps) ? apps : []).slice(0, 3));
        }
        if (oppsRes.ok) {
          const opps = await oppsRes.json();
          setOppCount(Array.isArray(opps) ? opps.length : 0);
        }
      } catch {}
    };
    load();
  }, []);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card accent="indigo" icon={Briefcase}>
          <p className="text-sm text-slate-500">Applications</p>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{appCount}</p>
          <p className="mt-1 text-sm text-slate-600">Total submitted</p>
        </Card>
        <Card accent="purple" icon={Calendar}>
          <p className="text-sm text-slate-500">Interviews</p>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">3</p>
          <p className="mt-1 text-sm text-slate-600">1 scheduled</p>
        </Card>
        <Card accent="amber" icon={Lightbulb}>
          <p className="text-sm text-slate-500">Opportunities</p>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">{oppCount}</p>
          <p className="mt-1 text-sm text-slate-600">Available now</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Card accent="indigo" withDecor={false}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Applications
              </h2>
              <button onClick={() => router.push("/sapplications")} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                View All →
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {recent.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-8 text-center ring-1 ring-slate-200">
                  <p className="text-sm text-slate-600">No recent applications</p>
                </div>
              ) : (
                recent.map((app: Application) => (
                  <div key={app._id} className="relative rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow duration-300">
                    <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
                      app.status === "Selected" ? "bg-green-100 text-green-700" :
                      app.status === "Shortlisted" ? "bg-amber-100 text-amber-800" :
                      app.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-800"
                    }`}>
                      {app.status}
                    </span>
                    <p className="pr-28 font-medium text-slate-900">{app.opportunity?.title || "Opportunity"}</p>
                    <p className="text-xs text-slate-500">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card accent="purple" withDecor={false}>
          <h2 className="text-lg font-semibold text-slate-900">
            AI Recommendations
          </h2>
          <div className="mt-6 grid place-items-center rounded-xl bg-slate-50 p-5 text-center shadow-inner ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-700">
              No Recommendations Available
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Complete your profile with skills and interests to get personalized job recommendations.
            </p>
            <button className="mt-4 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-black transition-colors cursor-pointer">
              Complete Your Profile
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}