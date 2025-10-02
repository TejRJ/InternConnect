"use client";

import Sidebar from "../../components/ssidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, CalendarDays, IndianRupee, Building2 } from "lucide-react";

// Type definitions
interface Opportunity {
  _id: string;
  title: string;
  company?: string;
  location: string;
  duration: string;
  stipend: string;
  deadline: string;
  recruiterUsername: string;
  description?: string;
  type: string;
  workType: string;
  skills: string[];
}

function Badge({ children, color = "slate" }: { children: React.ReactNode; color?: "slate" | "yellow" | "green" | "indigo" }) {
  const map: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-700",
    indigo: "bg-indigo-100 text-indigo-800",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[color]}`}>{children}</span>;
}

function JobCard({ item, onDetails }: { item: Opportunity; onDetails: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="hidden sm:grid h-12 w-12 place-items-center rounded-xl bg-indigo-600 text-white shadow">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {item.location}</span>
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {item.duration}</span>
              <span className="inline-flex items-center gap-1"><IndianRupee className="h-4 w-4" /> {item.stipend}</span>
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Deadline: {item.deadline}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Posted by {item.recruiterUsername}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onDetails(item._id)} className="rounded-lg bg-white px-4 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">Details</button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge color="yellow">{item.type}</Badge>
        <Badge color="indigo">{item.workType}</Badge>
        {(item.skills || []).slice(0, 2).map((s: string, i: number) => (
          <Badge key={i}>{s}</Badge>
        ))}
        {Array.isArray(item.skills) && item.skills.length > 4 && <Badge>More...</Badge>}
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState<Opportunity[]>([]);
  const [filteredItems, setFilteredItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [deadlineFilter, setDeadlineFilter] = useState("all");
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/recruiter/opportunities");
        if (!res.ok) throw new Error("Failed to load opportunities");
        const data = await res.json() as Opportunity[];
        const opportunities = Array.isArray(data) ? data : [];
        setItems(opportunities);
        setFilteredItems(opportunities);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load opportunities");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter and search effect
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.recruiterUsername?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        (item.skills || []).some((skill: string) => skill.toLowerCase().includes(query))
      );
    }

    // Deadline filter
    if (deadlineFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(item => {
        if (!item.deadline) return false;
        const deadline = new Date(item.deadline);
        const daysDiff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (deadlineFilter) {
          case "week": return daysDiff <= 7 && daysDiff >= 0;
          case "month": return daysDiff <= 30 && daysDiff >= 0;
          case "expired": return daysDiff < 0;
          default: return true;
        }
      });
    }

    // Sort by stipend
    if (sortBy === "stipend-low-high") {
      filtered.sort((a, b) => {
        const stipendA = parseFloat(a.stipend?.replace(/[^\d.]/g, '') || '0');
        const stipendB = parseFloat(b.stipend?.replace(/[^\d.]/g, '') || '0');
        return stipendA - stipendB;
      });
    } else if (sortBy === "stipend-high-low") {
      filtered.sort((a, b) => {
        const stipendA = parseFloat(a.stipend?.replace(/[^\d.]/g, '') || '0');
        const stipendB = parseFloat(b.stipend?.replace(/[^\d.]/g, '') || '0');
        return stipendB - stipendA;
      });
    } else if (sortBy === "deadline") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.deadline || '9999-12-31').getTime();
        const dateB = new Date(b.deadline || '9999-12-31').getTime();
        return dateA - dateB;
      });
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, sortBy, deadlineFilter]);

  const onDetails = (id: string) => {
    router.push(`/sopportunities/${id}`);
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
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="mt-1 text-gray-600">Discover internships and jobs tailored to your profile</p>

          <div className="mt-6 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_auto] lg:grid-cols-[1fr_auto_auto]">
            <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
              <Search className="h-4 w-4 text-slate-500" />
              <input 
                className="w-full border-0 bg-transparent text-sm focus:outline-none" 
                placeholder="Search opportunities, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 hover:bg-slate-50 transition-colors cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="none">Sort by</option>
              <option value="stipend-low-high">Stipend: Low to High</option>
              <option value="stipend-high-low">Stipend: High to Low</option>
              <option value="deadline">Deadline: Earliest First</option>
            </select>
            <select 
              className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 hover:bg-slate-50 transition-colors cursor-pointer"
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value)}
            >
              <option value="all">All Deadlines</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {loading ? "Loading..." : error ? error : `Showing ${filteredItems.length} of ${items.length} opportunities`}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {!loading && !error && filteredItems.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-slate-600">No opportunities found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSortBy("none");
                    setDeadlineFilter("all");
                  }}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
            {!loading && !error && filteredItems.map((it) => (
              <JobCard key={it._id} item={it} onDetails={onDetails} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}


