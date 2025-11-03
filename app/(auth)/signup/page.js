"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  const { data: session } = authClient.useSession();
  if (session) redirect("/");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setMsg({ type: "error", text: "All fields are required" });
      return;
    }
    setLoading(true);
    setMsg({ type: "info", text: "Creating account..." });

    const { data, error } = await authClient.signUp.email(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => redirect("/"),
        onError: (ctx) => console.error("Signup error", ctx),
      }
    );

    if (error) {
      setMsg({ type: "error", text: error.message || "Signup failed" });
    } else {
      setMsg({ type: "success", text: "Account created successfully!" });
    }
    setLoading(false);
  }

  return (
    <main className="h-screen p-4 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-5xl h-135 rounded-4xl border border-slate-200 p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
            <p className="text-sm text-slate-500">Join your developer dashboard</p>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-800">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-800">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-800">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
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
            onClick={async () => {
              setLoading(true);
              try {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                });
              } catch (e) {
                console.error(e);
                setMsg({ type: "error", text: "Google signup failed" });
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full -mt-3 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center  text-sm text-slate-600">
            Already have an account? <a className="underline" href="/signin">Sign in</a>
          </p>
        </form>
      </div>
    </main>
  );
}

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