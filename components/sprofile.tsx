"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, BookOpen, LinkIcon, FileUp, Plus, Pencil, Check, X } from "lucide-react";

export default function SProfile() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile states
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const [gpa, setGpa] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Resume file state
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Skills & Interests
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  // Social links
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/student/profile");
        if (res.ok) {
          const data = await res.json();
          setDept(data?.department || "");
          setYear(data?.academicYear || "");
          setGpa(data?.gpa || "");
          setPhone(data?.phone || "");
          setBio(data?.bio || "");
          setSkills(Array.isArray(data?.skills) ? data.skills : []);
          setInterests(Array.isArray(data?.interests) ? data.interests : []);
          setLinkedin(data?.social?.linkedin || "");
          setGithub(data?.social?.github || "");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveProfile = async () => {
    setEditMode(false);
    setLoading(true);
    await fetch("/api/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        department: dept,
        academicYear: year,
        gpa,
        phone,
        bio,
        skills,
        interests,
        social: { linkedin, github },
      }),
    });
    setLoading(false);
  };

  const selectBase =
    "w-full rounded-lg border-0 ring-1 ring-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
  const inputBase =
    "w-full rounded-lg border-0 ring-1 ring-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills((prev) => [...prev, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      setInterests((prev) => [...prev, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const removeSkill = (index: number) => setSkills((prev) => prev.filter((_, i) => i !== index));
  const removeInterest = (index: number) => setInterests((prev) => prev.filter((_, i) => i !== index));
  const removeFile = () => setResumeFile(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
          <p className="text-slate-600 text-sm sm:text-base">Keep your profile updated for the best matches.</p>
        </div>
        <button
          onClick={() => (editMode ? saveProfile() : setEditMode(true))}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition cursor-pointer w-full sm:w-auto"
        >
          {editMode ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"></div>
        </div>
      )}

      {!loading && (
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Basic Information</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Department */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
                {editMode ? (
                  <select className={selectBase} value={dept} onChange={(e) => setDept(e.target.value)}>
                    <option value="">Select Department</option>
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>Electronics</option>
                  </select>
                ) : (
                  <p className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200 text-sm text-slate-500">{dept || "Not set"}</p>
                )}
              </div>

              {/* Year */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Academic Year</label>
                {editMode ? (
                  <select className={selectBase} value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Select Year</option>
                    <option>First Year</option>
                    <option>Second Year</option>
                    <option>Third Year</option>
                    <option>Final Year</option>
                  </select>
                ) : (
                  <p className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200 text-sm text-slate-500">{year || "Not set"}</p>
                )}
              </div>

              {/* GPA */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">GPA</label>
                {editMode ? (
                  <input className={inputBase} value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="Enter GPA" />
                ) : (
                  <p className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200 text-sm text-slate-500">{gpa || "Not set"}</p>
                )}
              </div>

              {/* Phone */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
                {editMode ? (
                  <input className={inputBase} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
                ) : (
                  <p className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200 text-sm text-slate-500">{phone || "Not set"}</p>
                )}
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
                {editMode ? (
                  <textarea
                    className={`${inputBase} h-28 resize-vertical`}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell recruiters about yourself..."
                  />
                ) : (
                  <p className="rounded-lg bg-slate-50 px-3 py-3 ring-1 ring-slate-200 text-sm text-slate-500 whitespace-pre-wrap">
                    {bio || "Not set"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Skills & Interests</h2>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-700">Skills</h3>
              {skills.length === 0 && !editMode ? (
                <p className="text-slate-500 text-sm">Not set</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">
                      {skill}
                      {editMode && <X className="h-4 w-4 cursor-pointer" onClick={() => removeSkill(idx)} />}
                    </span>
                  ))}
                </div>
              )}
              {editMode && (
                <div className="flex items-center gap-2">
                  <input className={inputBase} placeholder="Add a skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
                  <button onClick={addSkill} className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white hover:bg-black cursor-pointer transition-colors shrink-0">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Interests */}
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-medium text-slate-700">Interests</h3>
              {interests.length === 0 && !editMode ? (
                <p className="text-slate-500 text-sm">Not set</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, idx) => (
                    <span key={idx} className="flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700">
                      {interest}
                      {editMode && <X className="h-4 w-4 cursor-pointer" onClick={() => removeInterest(idx)} />}
                    </span>
                  ))}
                </div>
              )}
              {editMode && (
                <div className="flex items-center gap-2">
                  <input
                    className={inputBase}
                    placeholder="Add an interest..."
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                  />
                  <button onClick={addInterest} className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white hover:bg-black cursor-pointer transition-colors shrink-0">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Resume */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <FileUp className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Resume</h3>
            </div>
            {editMode ? (
              <div className="space-y-3">
                <label className="block w-full cursor-pointer rounded-lg bg-slate-50 px-4 py-3 text-center text-sm font-medium ring-1 ring-slate-200 hover:bg-slate-100">
                  {resumeFile ? "Change File" : "Choose File"}
                  <input type="file" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
                </label>
                {resumeFile && (
                  <button onClick={removeFile} className="text-red-600 text-sm hover:underline">
                    Remove File
                  </button>
                )}
              </div>
            ) : (
              <p className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200 text-sm text-slate-500 text-center">
                {resumeFile ? `${resumeFile.name} (${(resumeFile.size / 1024).toFixed(1)} KB)` : "Not uploaded"}
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Social Links</h3>
            </div>
            {editMode ? (
              <div className="space-y-3">
                <input className={inputBase} placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                <input className={inputBase} placeholder="GitHub URL" value={github} onChange={(e) => setGithub(e.target.value)} />
              </div>
            ) : linkedin || github ? (
              <div className="space-y-3">
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 ring-1 ring-blue-200 hover:bg-blue-100"
                  >
                    <Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" width={16} height={16} className="h-4 w-4" />
                    <span className="text-sm font-medium text-blue-700">LinkedIn</span>
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-gray-200 hover:bg-gray-100"
                  >
                    <Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub" width={16} height={16} className="h-4 w-4" />
                    <span className="text-sm font-medium text-gray-700">GitHub</span>
                  </a>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Not set</p>
            )}
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}
