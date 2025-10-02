"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { username: username.trim(), password, redirect: false });
    if (res?.ok) {
      // After login, fetch session to get role and redirect accordingly
      try {
        const resp = await fetch("/api/auth/session");
        const data = await resp.json();
        const role = data?.user?.role;
        if (role === "recruiter") {
          router.push("/r");
        } else {
          router.push("/");
        }
      } catch {
        router.push("/");
      }
    } else {
      setError("Invalid credentials");
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
          <h2 className="text-xl font-semibold text-slate-800">Welcome</h2>
          <p className="mt-1 text-sm text-slate-600">Sign in to access your account</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none ring-indigo-200 focus:ring-2 focus:border-indigo-300 transition-colors" 
              placeholder="Enter your username"
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
                placeholder="Enter your password"
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
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
          <button 
            type="submit" 
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-2">Don&apos;t have an account?</p>
          <button 
            onClick={() => router.push("/auth/register")} 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer hover:underline transition-colors"
          >
            Create a new account
          </button>
        </div>
      </div>
    </div>
  );
}


