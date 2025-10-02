"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Session } from "../types";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  X,
  GraduationCap,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dept, setDept] = useState<string>("");
  const [deptLoading, setDeptLoading] = useState<boolean>(false);
  const [appsCount, setAppsCount] = useState<number>(0);

  useEffect(() => {
    const fetchDept = async () => {
      if ((session as Session)?.user?.role !== "student") return;
      try {
        setDeptLoading(true);
        const res = await fetch("/api/student/profile");
        if (res.ok) {
          const data = await res.json();
          setDept(data?.department || "");
        }
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDept();
  }, [session]);

  useEffect(() => {
    const loadApps = async () => {
      if ((session as Session)?.user?.role !== "student") return;
      try {
        const res = await fetch("/api/student/applications");
        if (res.ok) {
          const data = await res.json();
          setAppsCount(Array.isArray(data) ? data.length : 0);
        }
      } catch {}
    };
    loadApps();
  }, [session]);
  // Close on Escape for mobile drawer
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay for small screens */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar container */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl md:shadow-none md:z-10 md:ring-1 md:ring-slate-200 md:bg-white/90 md:backdrop-blur supports-[backdrop-filter]:bg-white/70 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-center gap-4 px-6 py-6">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 grid place-items-center text-white shadow-md">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">InternConnect</p>
            <p className="text-xs text-gray-500">Internship Management System</p>
          </div>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Student Portal chip */}
        <div className="px-6">
          <button className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            Student Portal
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4">
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Navigation
          </p>
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); router.push("/"); onClose(); }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 ${
                  pathname === "/" ? "text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100" : "text-gray-700"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); router.push("/sprofile"); onClose(); }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 ${
                  pathname.startsWith("/sprofile") ? "text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100" : "text-gray-700"
                }`}
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); router.push("/sopportunities"); onClose(); }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 ${
                  pathname.startsWith("/sopportunities") ? "text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100" : "text-gray-700"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Opportunities</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); router.push("/sapplications"); onClose(); }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 ${
                  pathname.startsWith("/sapplications") ? "text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100" : "text-gray-700"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>My Applications</span>
              </a>
            </li>
          </ul>

          {/* Quick Stats */}
          <div className="mt-6">
            <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Quick Stats
            </p>
            <div className="space-y-3 px-2">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                <span className="text-sm text-gray-600">Applications</span>
                <span className="text-sm font-semibold rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">
                  {appsCount}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto px-6 py-4 ring-1 ring-slate-200 absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
              <p className="text-xs text-gray-500">
                {deptLoading ? (
                  <span className="inline-block h-2 w-20 animate-pulse rounded bg-slate-200 align-middle" />
                ) : (
                  dept || "Not set"
                )}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <button
              onClick={() => { signOut({ callbackUrl: "/auth/login" }); }}
              className="w-full rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white shadow hover:bg-black cursor-pointer transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
