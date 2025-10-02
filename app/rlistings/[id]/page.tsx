"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import RSidebar from "../../../components/rsidebar";
import { Opportunity } from "../../../types";

export default function ManageListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [data, setData] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/recruiter/opportunities/${id}`);
      if (!res.ok) throw new Error("Failed to load opportunity");
      const d = await res.json();
      setData(d);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load opportunity");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) load(); }, [id, load]);

  const updateField = (k: keyof Opportunity, v: string | string[] | boolean) => setData((prev: Opportunity | null) => prev ? ({ ...prev, [k]: v }) : null);

  const save = async () => {
    if (!data) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/recruiter/opportunities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          company: data.company,
          type: data.type,
          domain: data.domain,
          location: data.location,
          workType: data.workType,
          stipend: data.stipend,
          duration: data.duration,
          deadline: data.deadline,
          paid: data.paid,
          skills: data.skills,
          description: data.description,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.push("/rlistings");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/recruiter/opportunities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/rlistings");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <RSidebar isOpen={true} onClose={() => {}} />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[18rem_1fr]">
        <div className="hidden md:block" />
        <main className="px-3 pb-10 pt-6 sm:px-6 md:pt-8">
          <h1 className="text-3xl font-bold">Manage Opportunity</h1>
          {loading ? (
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          ) : error ? (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          ) : data ? (
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Job Title * <span className="text-xs text-slate-500">({(data.title || "").length}/40)</span></label>
                <input 
                  value={data.title || ""} 
                  onChange={(e) => updateField("title", e.target.value.slice(0, 40))} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  maxLength={40}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Company Name <span className="text-xs text-slate-500">({(data.company || "").length}/20)</span></label>
                <input 
                  value={data.company || ""} 
                  onChange={(e) => updateField("company", e.target.value.slice(0, 20))} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  maxLength={20}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Opportunity Type</label>
                  <select value={data.type} onChange={(e) => updateField("type", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option>Internship</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Domain/Industry <span className="text-xs text-slate-500">({(data.domain || "").length}/20)</span></label>
                  <input 
                    value={data.domain || ""} 
                    onChange={(e) => updateField("domain", e.target.value.slice(0, 20))} 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    maxLength={20}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Location <span className="text-xs text-slate-500">({(data.location || "").length}/20)</span></label>
                <input 
                  value={data.location || ""} 
                  onChange={(e) => updateField("location", e.target.value.slice(0, 20))} 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  maxLength={20}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Work Type</label>
                  <select value={data.workType} onChange={(e) => updateField("workType", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option>On-site</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Stipend/Salary <span className="text-xs text-slate-500">({(data.stipend || "").length}/20)</span></label>
                  <input 
                    value={data.stipend || ""} 
                    onChange={(e) => updateField("stipend", e.target.value.slice(0, 20))} 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    maxLength={20}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Duration <span className="text-xs text-slate-500">({(data.duration || "").length}/20)</span></label>
                  <input 
                    value={data.duration || ""} 
                    onChange={(e) => updateField("duration", e.target.value.slice(0, 20))} 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Application Deadline</label>
                  <input value={data.deadline || ""} onChange={(e) => updateField("deadline", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!data.paid} onChange={(e) => updateField("paid", e.target.checked)} className="h-4 w-4" />
                This is a paid opportunity
              </label>
              <div>
                <label className="mb-1 block text-sm font-medium">Required Skills *</label>
                <input
                  value={(data.skills || []).join(", ")}
                  onChange={(e) => updateField("skills", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Comma separated skills"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Job Description *</label>
                <textarea rows={6} value={data.description || ""} onChange={(e) => updateField("description", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={save} disabled={saving} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed transition-colors">{saving ? "Saving..." : "Save Changes"}</button>
                <button onClick={() => setShowConfirm(true)} className="rounded-lg bg-white px-5 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">Delete</button>
                <button onClick={() => router.push("/rlistings")} className="rounded-lg bg-white px-5 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">Back</button>
              </div>

              {showConfirm && (
                <div className="fixed inset-0 z-50">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                  <div className="absolute inset-0 grid place-items-center p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
                      <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                      <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete this opportunity? This action cannot be undone.</p>
                      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                      <div className="mt-5 flex flex-col-reverse sm:flex-row justify-end gap-3">
                        <button onClick={() => setShowConfirm(false)} className="rounded-lg bg-white px-4 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">Cancel</button>
                        <button onClick={remove} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed transition-colors">{deleting ? "Deleting..." : "Delete"}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}



