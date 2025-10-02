"use client";

import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk(false);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
    if (res.ok) {
      setOk(true);
      setTimeout(() => router.push("/auth/login"), 800);
    } else {
      const data = await res.json();
      setError(data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 text-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200 border-t-4 border-t-indigo-600">
        {/* Header with Logo */}
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 rounded-xl bg-indigo-600 grid place-items-center text-white shadow-lg mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">InternConnect</h1>
          <p className="text-sm text-slate-500 mt-1">Internship Management System</p>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Create Account</h2>
          <p className="mt-1 text-sm text-slate-600">Join as a Student or Recruiter</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none ring-indigo-200 focus:ring-2 focus:border-indigo-300 transition-colors" 
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-300 transition-colors">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm outline-none"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Account Type</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none ring-indigo-200 focus:ring-2 focus:border-indigo-300 transition-colors cursor-pointer"
            >
              <option value="student">🎓 Student - Looking for internships</option>
              <option value="recruiter">🏢 Recruiter - Posting opportunities</option>
            </select>
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
          {ok && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="text-sm text-green-600 text-center">Account created successfully! Redirecting...</p>
            </div>
          )}
          <button 
            type="submit" 
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-2">Already have an account?</p>
          <button 
            onClick={() => router.push("/auth/login")} 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer hover:underline transition-colors"
          >
            Sign in instead
          </button>
        </div>
      </div>
    </div>
  );
}


