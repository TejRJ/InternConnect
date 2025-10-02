"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "../components/ssidebar";
import Main from "../components/smain";
import RSidebar from "../components/rsidebar";
import RMain from "../components/rmain";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const { data: session } = useSession();

  // Prevent background scroll when sidebar drawer is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  // Derive recruiter flag from session to avoid type errors on role
  useEffect(() => {
    const role = (session?.user as { role?: string | null } | undefined)?.role;
    setIsRecruiter(role === "recruiter");
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      {((session?.user as { role?: string | null } | undefined)?.role) === "recruiter" ? (
        <div className="grid min-h-screen place-items-center px-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow ring-1 ring-slate-200">
            <h1 className="text-2xl font-semibold">Unauthorized</h1>
            <p className="mt-1 text-sm text-slate-600">Recruiters cannot access the student homepage.</p>
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
        <p className="font-semibold">{isRecruiter ? "InternConnect – Recruiter" : "InternConnect"}</p>
      </header>

      {/* Sidebar (fixed on the left) */}
      {isRecruiter ? (
        <RSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      ) : (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}

      {/* Page layout */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[18rem_1fr]">
        {/* Spacer column to account for fixed sidebar on desktop */}
        <div className="hidden md:block" />

        {/* Main content area */}
        <main className={`relative px-2 pb-10 pt-6 sm:px-3 md:pt-8 ${isSidebarOpen ? "md:blur-0" : ""}`}>
          <div className={`transition duration-200 ${isSidebarOpen ? "md:opacity-100" : ""}`}>
            <h1 className="text-3xl font-bold">{isRecruiter ? "Welcome back, Recruiter!" : "Welcome back, Student!"}</h1>
            <p className="mt-1 text-gray-600">{isRecruiter ? "Manage listings and review candidate applications" : "Track your placement journey and discover new opportunities"}</p>
            <div className="mt-6">
              {isRecruiter ? <RMain /> : <Main />}
            </div>
          </div>
        </main>
      </div>
      </>
      )}
    </div>
  );
}
