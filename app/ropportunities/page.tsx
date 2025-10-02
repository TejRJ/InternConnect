"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Plus } from "lucide-react";
import RSidebar from "../../components/rsidebar";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      {children}
    </div>
  );
}

export default function RecruiterOpportunityPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("Internship");
  const [domain, setDomain] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("On-site");
  const [stipend, setStipend] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");
  const [paid, setPaid] = useState(true);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string>("");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    setSkills((s) => [...s, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (idx: number) => {
    setSkills((s) => s.filter((_, i) => i !== idx));
  };

  const isValid = () => {
    if (!title.trim()) return false;
    if (!type) return false;
    if (!domain.trim()) return false;
    if (!location.trim()) return false;
    if (!workType) return false;
    if (!stipend.trim()) return false;
    if (!duration.trim()) return false;
    if (!deadline.trim()) return false;
    if (skills.length === 0) return false;
    if (!description.trim()) return false;
    return true;
  };

  const submit = async () => {
    setError("");
    if (!isValid()) {
      setError("Please fill all required fields and add at least one skill.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/recruiter/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company,
          type,
          domain,
          location,
          workType,
          stipend,
          duration,
          deadline,
          paid,
          skills,
          description,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to post opportunity");
      }
      router.push("/rlistings");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      {/* Mobile header */}
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
        {/* Spacer for fixed sidebar */}
        <div className="hidden md:block" />
        <main className="px-3 pb-10 pt-6 sm:px-6 md:pt-8">
          <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="relative mb-6 flex items-start gap-3 sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Post New Opportunity</h1>
          <div className="ml-auto hidden sm:block">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>
        </div>
        <p className="mb-6 text-sm text-gray-600">Create a job posting to attract the right talent</p>

        {/* Grid */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <h2 className="mb-4 text-2xl font-semibold">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Job Title * <span className="text-xs text-slate-500">({title.length}/40)</span></label>
                <input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value.slice(0, 40))} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2" 
                  placeholder="e.g. Full Stack Developer"
                  maxLength={40}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Company Name <span className="text-xs text-slate-500">({company.length}/20)</span></label>
                <input 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value.slice(0, 20))} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2" 
                  placeholder="Your company name"
                  maxLength={20}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Opportunity Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2 cursor-pointer">
                    <option>Internship</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Domain/Industry <span className="text-xs text-slate-500">({domain.length}/20)</span></label>
                  <input 
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value.slice(0, 20))} 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2" 
                    placeholder="e.g. Technology, Finance"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Location & Compensation */}
          <Card>
            <h2 className="mb-4 text-2xl font-semibold">Location & Compensation</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Location <span className="text-xs text-slate-500">({location.length}/20)</span></label>
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value.slice(0, 20))} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2" 
                  placeholder="e.g. Mumbai, Delhi"
                  maxLength={20}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Work Type</label>
                  <select value={workType} onChange={(e) => setWorkType(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2 cursor-pointer">
                    <option>On-site</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Stipend/Salary <span className="text-xs text-slate-500">({stipend.length}/20)</span></label>
                  <input 
                    value={stipend} 
                    onChange={(e) => setStipend(e.target.value.slice(0, 20))} 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2" 
                    placeholder="e.g. ₹15,000/month"
                    maxLength={20}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Duration <span className="text-xs text-slate-500">({duration.length}/20)</span></label>
                  <input 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value.slice(0, 20))} 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2" 
                    placeholder="e.g. 3 months, Full-time"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Application Deadline</label>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-200">
                    <input value={deadline} onChange={(e) => setDeadline(e.target.value)} type="date" className="w-full outline-none" />
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                This is a paid opportunity
              </label>
            </div>
          </Card>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <Card>
            <h2 className="mb-4 text-2xl font-semibold">Required Skills *</h2>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
                placeholder="Add a required skill"
              />
              <button onClick={addSkill} className="grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-white hover:bg-black cursor-pointer transition-colors shrink-0">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">Add at least one required skill</p>
              {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <button type="button" key={i} onClick={() => removeSkill(i)} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Description */}
        <div className="mt-6">
          <Card>
            <h2 className="mb-4 text-2xl font-semibold">Job Description *</h2>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring-2"
              placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
            />
          </Card>
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={submit} disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed transition-colors">
              <Plus className="h-4 w-4" /> {submitting ? "Posting..." : "Post Opportunity"}
            </button>
          </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
