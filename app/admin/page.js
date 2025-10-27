"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import useProductStore from "@/store/useCartStore";
import { SparklesIcon, ShieldCheckIcon, RocketIcon, ZapIcon, MenuIcon, XIcon } from "lucide-react";

/* Responsive scaling hook */
function useResponsiveScale() {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const calcScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Check device type
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Calculate scale based on screen size
      if (width < 640) { // Mobile
        setScale(0.9);
      } else if (width < 768) { // Small tablet
        setScale(0.95);
      } else if (width < 1024) { // Tablet
        setScale(0.98);
      } else { // Desktop
        setScale(1);
      }
    };

    calcScale();
    window.addEventListener("resize", calcScale);
    return () => window.removeEventListener("resize", calcScale);
  }, []);

  return { scale, isMobile, isTablet };
}

/* Enhanced Premium Toast */
const usePremiumToast = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4200);
  };
  
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 z-[999] space-y-4 max-w-[380px] mx-auto sm:mx-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`relative rounded-2xl p-4 sm:p-5 text-sm sm:text-base shadow-2xl border-2 backdrop-blur-sm ${
            t.type === "success"
              ? "bg-gradient-to-br from-white to-emerald-50 border-emerald-200 text-emerald-900 dark:from-slate-900 dark:to-emerald-900/20 dark:border-emerald-700 dark:text-emerald-100"
              : "bg-gradient-to-br from-white to-rose-50 border-rose-200 text-rose-900 dark:from-slate-900 dark:to-rose-900/20 dark:border-rose-700 dark:text-rose-100"
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl grid place-items-center shadow-lg ${
              t.type === "success" 
                ? "bg-gradient-to-br from-emerald-500 to-green-500" 
                : "bg-gradient-to-br from-rose-500 to-pink-500"
            }`}>
              <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base sm:text-lg">{t.type === "success" ? "Success!" : "Attention!"}</p>
              <p className="text-xs sm:text-sm opacity-90 mt-1">{t.message}</p>
            </div>
          </div>
          <div className="h-1.5 mt-3 sm:mt-4 rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
            <div className={`h-full animate-progress rounded-full ${
              t.type === "success" 
                ? "bg-gradient-to-r from-emerald-500 to-green-500" 
                : "bg-gradient-to-r from-rose-500 to-pink-500"
            }`} />
          </div>
        </div>
      ))}
    </div>
  );
  
  return { addToast, ToastContainer };
};

/* Enhanced Theme with smooth transitions */
function useTheme() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return { theme, toggle, mounted };
}

/* Responsive Square Preview Card */
function ResponsiveSquarePreviewCard({ p, priceFmt, isMobile, isTablet }) {
  const hasDiscount = (p.originalPrice || 0) > (p.price || 0);
  const pct = Math.round((p.discountPercent || 0) * 10) / 10;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className={`relative w-full bg-white dark:bg-slate-900 overflow-hidden group/card border border-slate-200 dark:border-slate-700 rounded-2xl transition-all duration-300 ${
        !isMobile ? 'hover:shadow-xl' : ''
      }`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Image Zone with responsive aspect ratio */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
        <div className="aspect-[6/4] relative">
          {p.image ? (
            <img 
              src={p.image} 
              alt={p.title} 
              className={`h-full w-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`} 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Responsive Badges */}
        <span className={`absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full px-2 py-1 text-[10px] font-bold text-white shadow-lg transition-all duration-300 ${
          p.inStock 
            ? "bg-gradient-to-r from-emerald-500 to-green-500" 
            : "bg-gradient-to-r from-rose-500 to-pink-500"
        } ${isHovered ? 'scale-105' : ''}`}>
          {p.inStock ? "In Stock" : "Out"}
        </span>
        
        {hasDiscount && pct > 0 && (
          <span className={`absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg transition-all duration-300 ${
            isHovered ? 'scale-105' : ''
          }`}>
            -{pct}%
          </span>
        )}

        {/* Subtle Hover Overlay */}
        <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Responsive Info Zone */}
      <div className="p-3 sm:p-4 grid gap-2 bg-white dark:bg-slate-900">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-[14px] leading-tight line-clamp-2">
          {p.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {p.category}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <span>⭐ {p.rating?.rate || 0}</span>
            <span className="hidden sm:inline">({p.rating?.count || 0})</span>
          </div>
        </div>
        <div className="flex items-end justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              {priceFmt(+p.price || 0)}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-[13px] text-slate-500 line-through dark:text-slate-400 font-semibold">
                {priceFmt(+p.originalPrice || 0)}
              </span>
            )}
          </div>
          <button
            type="button"
            className={`h-7 sm:h-8 px-2 sm:px-3 text-xs font-bold rounded-lg text-white shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ${
              isHovered ? 'scale-105' : ''
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Subtle Border Glow */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : ''
      }`} />
    </article>
  );
}

/* Responsive Field Component */
function ResponsiveField({ label, name, value, onChange, type = "text", className = "", isMobile, ...rest }) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs sm:text-[11px] font-semibold tracking-wide text-slate-700 dark:text-slate-200">
          {label}
        </span>
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-8 rounded-xl border border-slate-300 bg-white px-2 sm:px-2.5 text-xs sm:text-[13px] text-slate-900 shadow-sm outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500"
        {...rest}
      />
    </label>
  );
}

/* Responsive Toggle */
function ResponsiveToggle({ label, name, checked, onChange, isMobile }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs sm:text-[11px] font-semibold tracking-wide text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
        className={`relative h-5 w-9 rounded-full transition-all duration-500 shadow-inner ${
          checked 
            ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg" 
            : "bg-slate-400 dark:bg-slate-600"
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-lg transition-all duration-500 ${
          checked ? "translate-x-4" : ""
        }`} />
      </button>
    </div>
  );
}

function AutoBadge({ price, original, isMobile }) {
  const p = Number(price || 0);
  const o = Number(original || 0);
  const pct = o > 0 ? Math.max(0, ((o - p) / o) * 100) : 0;
  return (
    <span className="text-[10px] font-bold bg-gradient-to-r from-indigo-500/15 to-purple-600/15 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
      Auto · {Math.round(pct * 10) / 10}%
    </span>
  );
}

/* Enhanced Icons */
function SaveIcon() {
  return (
    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

/* Mobile Navigation */
function MobileNav({ isOpen, onClose, theme, toggleTheme, saveBtnRef }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700 shadow-2xl transform transition-transform duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <SparklesIcon className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quick Save</span>
              <kbd className="ml-auto text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-1 rounded">
                ⌘S
              </kbd>
            </div>
            
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
            
            <button
              ref={saveBtnRef}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              <SaveIcon />
              <span className="text-sm font-medium">Save Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Main Component */
export default function AdminProducts() {
  const { theme, toggle, mounted } = useTheme();
  const { addToast, ToastContainer } = usePremiumToast();
  const { scale, isMobile, isTablet } = useResponsiveScale();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const saveBtnRef = useRef(null);
  const [deleteId, setDeleteId] = useState("");

  const setProductField = useProductStore((s) => s.setProductField);
  const setRating = useProductStore((s) => s.setRating);
  const resetProduct = useProductStore((s) => s.resetProduct);
  const productstate = useProductStore((s) => s.productstate);

  const [form, setForm] = useState({
    id: "",
    title: "",
    price: "",
    originalPrice: "",
    category: "electronics",
    ratingRate: "",
    ratingCount: "",
    image: "",
    inStock: true,
  });

  useEffect(() => {
    if (productstate) {
      setForm({
        id: productstate.id || "",
        title: productstate.title || "",
        price: productstate.price || "",
        originalPrice: productstate.originalPrice || "",
        category: productstate.category || "electronics",
        ratingRate: productstate.rating?.rate || "",
        ratingCount: productstate.rating?.count || "",
        image: productstate.image || "",
        inStock: productstate.inStock !== false,
      });
    }
  }, [productstate]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (name === "ratingRate") setRating(value, form.ratingCount);
    else if (name === "ratingCount") setRating(form.ratingRate, value);
    else setProductField(name, type === "checkbox" ? checked : value);
  };

  const cast = (v, def = 0) => {
    if (v === "" || v === null || v === undefined) return def;
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };

  const live = useMemo(() => {
    const price = cast(form.price);
    const original = form.originalPrice === "" ? price : cast(form.originalPrice);
    const discountPercent = original > 0 ? Math.max(0, ((original - price) / original) * 100) : 0;
    return {
      id: cast(form.id),
      title: (form.title || "").trim() || "Untitled product",
      price,
      originalPrice: original,
      discountPercent: Math.round(discountPercent * 100) / 100,
      category: (form.category || "").trim() || "uncategorized",
      rating: { rate: cast(form.ratingRate, 0), count: cast(form.ratingCount, 0) },
      image: (form.image || "").trim(),
      inStock: !!form.inStock,
    };
  }, [form]);

  const validate = (p) => {
    if (!Number.isFinite(p.id) || p.id <= 0) return "Valid ID required";
    if (!p.title || p.title.trim() === "") return "Title required";
    if (p.price <= 0) return "Price must be > 0";
    if (p.originalPrice < p.price) return "Original price must be >= price";
    if (p.rating.rate < 0 || p.rating.rate > 5) return "Rating must be 0–5";
    if (p.rating.count < 0) return "Rating count cannot be negative";
    return null;
  };

  const addPRODUCT = async (e) => {
    e?.preventDefault();
    const err = validate(live);
    if (err) return addToast(err, "error");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(live),
      });
      if (!res.ok) throw new Error("Failed to add product");
      addToast("Product added successfully!", "success");
      resetProduct();
      setForm({
        id: "",
        title: "",
        price: "",
        originalPrice: "",
        category: "electronics",
        ratingRate: "",
        ratingCount: "",
        image: "",
        inStock: true,
      });
    } catch (e2) {
      addToast(e2.message, "error");
    }
  };

  const remProduct = async () => {
    if (!deleteId) return addToast("Enter product ID to delete", "error");
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });
      if (!res.ok) throw new Error("Failed to delete product");
      addToast("Product deleted successfully!", "success");
      setDeleteId("");
    } catch (e2) {
      addToast(e2.message, "error");
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveBtnRef.current?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const resetForm = () =>
    (resetProduct(),
    setForm({
      id: "",
      title: "",
      price: "",
      originalPrice: "",
      category: "electronics",
      ratingRate: "",
      ratingCount: "",
      image: "",
      inStock: true,
    }));

  const priceFmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
      Number.isFinite(+n) ? +n : 0
    );

  if (!mounted) {
    return (
      <div className="h-screen grid place-items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading Premium Interface...</p>
        </div>
      </div>
    );
  }

  return (
    // REMOVED bottom margin and adjusted padding
    <div className="overflow-x-hidden h-screen relative pt-19 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <ToastContainer />
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)}
        theme={theme}
        toggleTheme={toggle}
        saveBtnRef={saveBtnRef}
      />

      {/* FLOATING CONTROLS - Theme toggle and menu moved to top right */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-xl bg-black/5 dark:bg-white/5 px-2.5 py-1 border border-slate-200 dark:border-slate-600">
          <SparklesIcon className="h-3 w-3 text-amber-500" />
          <kbd className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Ctrl+S</kbd>
        </div>
        
        <button
          onClick={toggle}
          className="hidden sm:flex h-8 w-8 rounded-2xl bg-white dark:bg-slate-800 grid place-items-center hover:scale-105 transition-all duration-300 border border-slate-200 dark:border-slate-600 shadow-lg"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden h-8 w-8 rounded-2xl bg-white dark:bg-slate-800 grid place-items-center hover:scale-105 transition-all duration-300 border border-slate-200 dark:border-slate-600 shadow-lg"
          aria-label="Open menu"
        >
          <MenuIcon className="h-4 w-4" />
        </button>
      </div>

      {/* MAIN CONTENT - Removed the header container, keeping only form and preview */}
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        className="mx-auto w-full max-w-[98vw] lg:max-w-7xl"
      >
        {/* DIRECT GRID - Form and Preview cards only */}
        <div className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-4 p-3 sm:p-4 lg:p-6">
          {/* Add Product Form */}
          <form
            onSubmit={addPRODUCT}
            className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 lg:p-6 shadow-xl overflow-hidden"
          >
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 grid place-items-center shadow-lg">
                    <ZapIcon className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Product</h2>
                </div>
                <AutoBadge price={form.price} original={form.originalPrice} isMobile={isMobile} />
              </div>

              {/* Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
                <ResponsiveField 
                  label="ID" 
                  name="id" 
                  type="number" 
                  value={form.id} 
                  onChange={onChange} 
                  className="sm:col-span-1 lg:col-span-6"
                  isMobile={isMobile}
                />
                <ResponsiveField 
                  label="Title" 
                  name="title" 
                  value={form.title} 
                  onChange={onChange} 
                  className="sm:col-span-1 lg:col-span-6"
                  isMobile={isMobile}
                />

                <ResponsiveField 
                  label="Price" 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  value={form.price} 
                  onChange={onChange} 
                  className="sm:col-span-1 lg:col-span-4"
                  isMobile={isMobile}
                />
                <ResponsiveField
                  label="Original"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={onChange}
                  className="sm:col-span-1 lg:col-span-4"
                  isMobile={isMobile}
                />
                <ResponsiveField 
                  label="Category" 
                  name="category" 
                  value={form.category} 
                  onChange={onChange} 
                  className="sm:col-span-1 lg:col-span-4"
                  isMobile={isMobile}
                />

                <ResponsiveField 
                  label="Rating" 
                  name="ratingRate" 
                  type="number" 
                  step="0.1" 
                  value={form.ratingRate} 
                  onChange={onChange} 
                  className="sm:col-span-1 lg:col-span-6"
                  isMobile={isMobile}
                />
                <ResponsiveField 
                  label="Reviews" 
                  name="ratingCount" 
                  type="number" 
                  value={form.ratingCount} 
                  onChange={onChange} 
                  className="sm:col-span-1 lg:col-span-6"
                  isMobile={isMobile}
                />
                <ResponsiveField 
                  label="Image URL" 
                  name="image" 
                  value={form.image} 
                  onChange={onChange} 
                  className="sm:col-span-2 lg:col-span-12"
                  isMobile={isMobile}
                />
              </div>

              {/* Action Bar */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <ResponsiveToggle 
                    label="In Stock" 
                    name="inStock" 
                    checked={form.inStock} 
                    onChange={onChange} 
                    isMobile={isMobile} 
                  />
                  
                  <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-slate-600" />
                  
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="ID to delete"
                      className="flex-1 h-8 rounded-xl border border-slate-300 bg-white px-2 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all duration-300"
                      value={deleteId}
                      onChange={(e) => setDeleteId(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={remProduct}
                      className="h-8 px-3 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 sm:flex-none h-8 px-3 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Reset
                  </button>
                  <button
                    ref={saveBtnRef}
                    type="submit"
                    className="flex-1 sm:flex-none h-8 px-4 text-xs font-semibold rounded-xl text-white shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden group/btn"
                  >
                    <span className="relative z-10 inline-flex items-center gap-1">
                      <SaveIcon />
                      Save
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Live Preview Card */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 lg:p-6 shadow-xl overflow-hidden">
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 grid place-items-center shadow-lg">
                    <EyeIcon />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Live Preview</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-700 dark:text-amber-300 font-semibold border border-amber-400/30">
                  {live.discountPercent}% OFF
                </span>
              </div>

              {/* Preview Card Container */}
              <div className="w-full max-w-[95%] sm:max-w-sm mx-auto lg:max-w-[300px]">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <ResponsiveSquarePreviewCard 
                    p={live} 
                    priceFmt={priceFmt} 
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}