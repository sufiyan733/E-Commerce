"use client";
import { useEffect, useState } from "react";
import { redirect} from "next/navigation";
import { authClient } from "@/lib/auth-client";\
import { useRouter } from "next/navigation";


// --- Sign-in Page (app/(auth)/sign-in/page.js or app/sign-in/page.js) ---
export default function SignInPage() {

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email";
    if (!form.password) return "Password is required";
    return null;
  }

  const { data: session, pending, error, refetch } = authClient.useSession();

 if (session) redirect("/")

  async function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const { data, error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        callbackUrl: "/", // corrected key
        remember: form.remember,
      });
      if (error) throw new Error(error.message || "Sign-in failed");
      // Most SDKs will redirect automatically when callbackUrl is used.
      // Fallback if no redirect happened:
      router.replace("/");
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      setLoading(true);
      // Common SDK shape; adjust if your client differs
     const data= await authClient.signIn.social({ provider: "google", callbackURL: `/` });
      // Usually redirects; if not, do fallback
      router.replace("/");      
    } catch (e) {
      console.log(e)
      setMsg({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ">
      <div className="w-full max-w-md">
        <form onSubmit={onSubmit} className="space-y-5 bg-white rounded-4xl border border-slate-200 p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to your account</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-800">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-800">Password</label>
              <a href="/forgot" className="text-xs text-indigo-600 hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? EyeOffIcon : EyeIcon}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-400"
              />
              Remember me
            </label>
            </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-500">or continue with</span>
            </div>
          </div>

          {/* Google Provider Button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full mt-2 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Sign in with Google
          </button>

          <p className="text-center text-sm text-slate-600">
            New here? <a className="underline" href="/signup">Create account</a>
          </p>
        </form>

      </div>
    </main>
  );
}

// --- Simple SVG icons ---
const EyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a3 3 0 004.2 4.2" />
    <path d="M9.9 4.3A10.9 10.9 0 0112 5c6.5 0 10 7 10 7a19.9 19.9 0 01-4.2 5.3" />
    <path d="M6.6 6.6A20.2 20.2 0 002 12s3.5 7 10 7c1.4 0 2.7-.3 3.9-.8" />
  </svg>
);

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19.3-7.5 19.3-20 0-1.2-.1-2.1-.3-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.6 18.9 14 24 14c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6.1 29 4 24 4 16 4 9.2 8.6 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.7 13.2-4.7l-6.1-5c-2 1.4-4.7 2.3-7.1 2.3-5.3 0-9.8-3.6-11.4-8.5l-6.6 5.1C9.8 39.4 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.4-4.1 5.9-7.3 5.9-3 0-5.6-1.9-6.7-4.6l-6.6 5.1C16.3 39.4 20.8 43 24 43c10.4 0 19.3-7.5 19.3-20 0-1.2-.1-2.1-.3-3.5z"/>
    </svg>
  );
}