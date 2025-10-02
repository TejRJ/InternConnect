"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RSidebar from "../../components/rsidebar";
import RMain from "../../components/rmain";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default function RecruiterDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      {(session?.user as SessionUser | undefined)?.role !== "recruiter" ? (
        <div className="grid min-h-screen place-items-center px-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow ring-1 ring-slate-200">
            <h1 className="text-2xl font-semibold">Unauthorized</h1>
            <p className="mt-1 text-sm text-slate-600">You do not have access to this page.</p>
          </div>
        </div>
      ) : (
      <>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-white/80 px-4 py-3 backdrop-blur md:hidden">
        <button
          aria-label="Open Menu"
          className="group rounded-md border px-3 py-2"
          onClick={() => setIsSidebarOpen(true)}
        >
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
          <h1 className="text-3xl font-bold">Welcome back, Recruiter!</h1>
          <p className="mt-1 text-gray-600">Manage listings and review candidate applications</p>
          <div className="mt-6">
            <RMain />
          </div>
        </main>
      </div>
      </>
      )}
    </div>
  );
}


