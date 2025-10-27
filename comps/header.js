"use client";

import { useRouter } from "next/navigation";
import { useCartUniqueCount } from "../store/useCartStore";

import React, { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { useCartStore } from "../store/useCartStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  const noOfCartProd = useCartUniqueCount();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always use dark theme, just change the glass effect when scrolled
  const baseStyle =
    "bg-slate-900/60 supports-[backdrop-filter]:backdrop-blur-lg border-b border-slate-700/40";
  const scrolledStyle =
    "bg-slate-900/80 supports-[backdrop-filter]:backdrop-blur-2xl border-b border-slate-700/60 shadow-[0_6px_30px_rgba(0,0,0,0.3)]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? scrolledStyle : baseStyle
      }`}
    >
      {/* Background layers - always dark theme */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.80) 45%, rgba(15,23,42,0.95) 100%)",
          backgroundSize: "200% 200%",
          animation: "auroraShift 20s ease-in-out infinite",
          maskImage: "linear-gradient(to bottom, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent)",
          opacity: isScrolled ? 0.8 : 1,
        }}
      />
      
      {/* Enhanced glass effect when scrolled */}
      {isScrolled && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 100%)",
            maskImage: "linear-gradient(to bottom, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent)",
          }}
        />
      )}

      {/* Accent line - always amber */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Brand - aligned left for mobile */}
          <a
            href="/"
            className="flex items-center gap-2.5 group relative"
            onMouseEnter={() => setActiveHover("logo")}
            onMouseLeave={() => setActiveHover(null)}
          >
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/10 blur-md transition-all duration-500 ${
                  activeHover === "logo" ? "opacity-100 scale-110" : "opacity-0"
                }`}
              />
              <div
                className="relative w-9 h-9 rounded-lg grid place-items-center border border-amber-500/20 bg-gradient-to-br from-slate-800 to-slate-900 text-amber-300 shadow-lg group-hover:scale-105 group-hover:shadow-xl group-hover:border-amber-400/40 transition-all duration-300"
              >
                <span className="font-serif text-sm font-black tracking-wider relative z-10">E</span>
              </div>
            </div>

            <div className="flex flex-col">
              <h1
                className="text-lg font-serif font-bold tracking-[0.12em] uppercase bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:via-amber-200 group-hover:to-amber-400 transition-all duration-300"
              >
                EXCALIBUR
              </h1>
              <div className="flex items-center">
                <div
                  className={`h-0.5 rounded-full transition-all duration-500 bg-gradient-to-r from-amber-400 to-amber-300 ${
                    activeHover === "logo" ? "w-12 scale-105" : "w-6"
                  }`}
                />
              </div>
            </div>
          </a>

          {/* Actions - always dark theme style */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <button
              aria-label="Shopping Cart"
              className="relative inline-flex items-center gap-2 rounded-lg border transition-all duration-300 group overflow-hidden px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 border-amber-400/60 hover:from-amber-400 hover:to-amber-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 active:scale-95 active:shadow-lg"
              onMouseEnter={() => setActiveHover("cart")}
              onMouseLeave={() => setActiveHover(null)}
              onClick={() => router.push("/cart")}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700" />
              
              <svg className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4m-8 2a2 2 0 11-4 0 2 2 0 014 0" />
              </svg>
              <span className="text-sm font-semibold tracking-wide relative z-10 group-hover:translate-x-0.5 transition-transform duration-300">Cart</span>
              <span
                className="relative text-xs font-bold rounded-full px-2 py-1 min-w-[20px] shadow border text-center z-10 bg-slate-900 text-amber-300 border-amber-500/30 group-hover:scale-110 group-hover:bg-slate-800 group-hover:text-amber-200 transition-all duration-300"
              >
                {noOfCartProd}
              </span>
            </button>

            {/* Auth */}
            <SignedOut>
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button
                    className="relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 px-4 py-2 bg-gradient-to-br from-white to-slate-100 text-slate-900 border border-white/70 hover:from-slate-100 hover:to-white hover:scale-105 hover:shadow-2xl hover:shadow-white/25 active:scale-95 active:shadow-lg group overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700" />
                    <span className="text-sm relative z-10 group-hover:translate-y-0.5 transition-transform duration-300">Sign In</span>
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    className="relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 px-4 py-2 bg-gradient-to-br from-amber-500 to-amber-400 text-white border border-amber-400/70 hover:from-amber-400 hover:to-amber-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 active:scale-95 active:shadow-lg group overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700" />
                    <span className="text-sm relative z-10 group-hover:translate-y-0.5 transition-transform duration-300">Sign Up</span>
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9 ring-2 ring-amber-400/60 rounded-full transition-all duration-300 group-hover:ring-amber-400/80 group-hover:scale-105 group-hover:shadow-lg",
                      },
                    }}
                  />
                </div>
                <SignOutButton>
                  <button
                    className="relative rounded-lg font-semibold transition-all duration-300 px-4 py-2 bg-gradient-to-br from-white to-slate-100 text-slate-900 border border-white/70 hover:from-slate-100 hover:to-white hover:scale-105 hover:shadow-2xl hover:shadow-white/25 active:scale-95 active:shadow-lg group overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700" />
                    <span className="text-sm relative z-10 group-hover:translate-y-0.5 transition-transform duration-300">Sign Out</span>
                  </button>
                </SignOutButton>
              </div>
            </SignedIn>
          </div>

          {/* Mobile toggle - with premium effects */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center rounded-lg border shadow-sm transition-all duration-300 bg-slate-800/80 text-amber-400 border-slate-600/50 hover:bg-slate-700/80 hover:scale-105 hover:shadow-lg hover:border-amber-400/60 active:scale-95 group"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-400/10 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className={`w-5 h-0.5 bg-current transition-all duration-300 relative z-10 ${isMenuOpen ? "rotate-45 translate-y-2 bg-amber-300" : "group-hover:bg-amber-300"}`} />
            <span className={`w-5 h-0.5 bg-current transition-all duration-300 my-1 relative z-10 ${isMenuOpen ? "opacity-0" : "opacity-100 group-hover:bg-amber-300"}`} />
            <span className={`w-5 h-0.5 bg-current transition-all duration-300 relative z-10 ${isMenuOpen ? "-rotate-45 -translate-y-2 bg-amber-300" : "group-hover:bg-amber-300"}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu - with premium effects */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 backdrop-blur-xl border-t ${
          isMenuOpen ? "max-h-72 opacity-100 border-slate-700/50" : "max-h-0 opacity-0 border-transparent"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.90) 100%)",
        }}
      >
        <div className="px-4 py-4 space-y-4">
          <SignedOut>
            <div className="grid grid-cols-2 gap-3">
              <SignInButton mode="modal">
                <button className="py-3 rounded-lg bg-gradient-to-br from-white to-slate-100 text-slate-900 font-semibold border border-white/70 transition-all duration-300 hover:from-slate-100 hover:to-white hover:scale-105 hover:shadow-xl active:scale-95 group overflow-hidden relative">
                  <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700" />
                  <span className="text-sm relative z-10">Sign In</span>
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="py-3 rounded-lg bg-gradient-to-br from-amber-500 to-amber-400 text-white font-semibold border border-amber-400/70 transition-all duration-300 hover:from-amber-400 hover:to-amber-300 hover:scale-105 hover:shadow-xl active:scale-95 group overflow-hidden relative">
                  <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700" />
                  <span className="text-sm relative z-10">Sign Up</span>
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center justify-between rounded-lg border border-slate-600/40 bg-slate-800/70 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/70 hover:border-slate-500/40">
              <div className="flex items-center gap-3">
                <UserButton />
                <span className="text-sm font-semibold text-slate-100">Account</span>
              </div>
            </div>
          </SignedIn>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => router.push("/cart")}
              className="w-full py-3 flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 border border-amber-400/50 hover:from-amber-400 hover:to-amber-300 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 px-4 font-semibold shadow group overflow-hidden relative"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700" />
              <span className="text-sm relative z-10">Cart</span>
              <span className="text-xs bg-slate-900 text-amber-300 rounded-full px-2 py-1 font-bold shadow border border-amber-500/30 relative z-10 group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300">
                {noOfCartProd}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes auroraShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </header>
  );
}