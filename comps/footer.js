"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const year = new Date().getFullYear();

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to your newsletter API
    setEmail("");
  };

  return (
    <footer className="relative mt-24 text-slate-200">
      {/* Top accent to mirror header bottom line */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      {/* Glassy dark background with animated aurora like header */}
      <div className="relative overflow-hidden border-t border-slate-700/50 bg-slate-900/70 supports-[backdrop-filter]:backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.85) 45%, rgba(15,23,42,0.95) 100%)",
            backgroundSize: "200% 200%",
            animation: "auroraShift 20s ease-in-out infinite",
            maskImage: "linear-gradient(to top, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black 90%, transparent)",
          }}
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <a href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/10 blur-md opacity-0 group-hover:opacity-100 transition" />
                  <div className="relative w-10 h-10 rounded-lg grid place-items-center border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-900 text-amber-300 shadow">
                    <span className="font-serif text-sm font-black tracking-wider">E</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-serif font-bold tracking-[0.12em] uppercase bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent">
                    EXCALIBUR
                  </span>
                  <span className="text-xs text-slate-400">Premium commerce</span>
                </div>
              </a>
              <p className="mt-4 text-sm text-slate-400 max-w-sm">
                Curated gear. Fast checkout. Secure by default.
              </p>

              {/* Socials */}
              <div className="mt-5 flex items-center gap-3">
                {[
                  { href: "https://x.com", label: "X", path: "M4 12c5 3 11 3 16 0M8 7l8 10M16 7l-8 10" },
                  { href: "https://instagram.com", label: "Instagram", path: "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm11 3h.01M12 8a4 4 0 100 8 4 4 0 000-8z" },
                  { href: "https://github.com", label: "GitHub", path: "M9 19c-5 1-5-3-7-4 0-1 1-2 1-2-1 0-1-1 0-1-1 0-1-1 0-1 0-1 1-1 1-1 0 0-1-1 0-2 2 0 3 2 3 2 1-1 2-1 3-1s2 0 3 1c0 0 1-2 3-2 1 1 0 2 0 2 0 0 1 0 1 1 0 0 1 1 0 1 0 0 1 1 0 2-2 1-2 5-7 4" },
                ].map((s) => (
                  <a
                    key={s.label}
                    aria-label={s.label}
                    href={s.href}
                    target="_blank"
                    className="rounded-lg p-2 border border-slate-700/60 bg-slate-800/60 hover:border-amber-400/60 hover:text-amber-300 transition group"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 tracking-wider">Shop</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {["New Arrivals", "Best Sellers", "Deals", "Gift Cards"].map((t, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-slate-300 hover:text-amber-300 transition inline-flex items-center gap-2"
                    >
                      <span className="h-px w-0 bg-amber-400 transition-all group-hover:w-3" />
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  { t: "Help Center", href: "/support" },
                  { t: "Shipping", href: "/shipping" },
                  { t: "Returns", href: "/returns" },
                  { t: "Contact", href: "/contact" },
                ].map((l) => (
                  <li key={l.t}>
                    <a href={l.href} className="text-slate-300 hover:text-amber-300 transition">
                      {l.t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold text-amber-300 tracking-wider">Stay in the loop</h3>
              <p className="mt-3 text-sm text-slate-400">
                Subscribe for drops and limited releases.
              </p>
              <form onSubmit={onSubmit} className="mt-4 relative">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-700/60 bg-slate-800/70 px-4 py-3 pr-28 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-4 rounded-md text-slate-900 text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-400 border border-amber-400/60 hover:from-amber-400 hover:to-amber-300 transition"
                  >
                    Join
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  By subscribing you agree to our{" "}
                  <a href="/privacy" className="underline hover:text-amber-300">Privacy Policy</a>.
                </p>
              </form>

              {/* Payment badges mock */}
              <div className="mt-6 flex flex-wrap items-center gap-2 opacity-80">
                {["Visa", "Mastercard", "Amex", "UPI"].map((p) => (
                  <span
                    key={p}
                    className="text-[11px] px-2 py-1 rounded border border-slate-700/60 bg-slate-800/60"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>© {year} Excalibur</span>
              <span className="text-slate-600">•</span>
              <a href="/terms" className="hover:text-amber-300">Terms</a>
              <span className="text-slate-600">/</span>
              <a href="/privacy" className="hover:text-amber-300">Privacy</a>
              <span className="text-slate-600">/</span>
              <a href="/cookies" className="hover:text-amber-300">Cookies</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/sitemap.xml")}
                className="rounded-md border border-slate-700/60 px-2 py-1 hover:border-amber-400/60 hover:text-amber-300 transition"
              >
                Sitemap
              </button>
              <a
                href="#top"
                className="inline-flex items-center gap-1 rounded-md border border-slate-700/60 px-2 py-1 hover:border-amber-400/60 hover:text-amber-300 transition"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
                </svg>
                Top
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes shared with header */}
      <style jsx global>{`
        @keyframes auroraShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </footer>
  );
}
