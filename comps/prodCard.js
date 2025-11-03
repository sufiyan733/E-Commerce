"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useCartProdQnt, useCartActions } from "@/store/useCartStore";

// Add Lenis import
import Lenis from 'lenis';

/* constants */
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#eef2f7'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#94a3b8' font-family='sans-serif' font-size='20'>Image unavailable</text></svg>"
  );

/* utils */
const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

/* Compact Premium Search Bar Component */
function PremiumSearchBar({ onSearch, products = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Filter suggestions based on search query
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return products.filter(product => 
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
  }, [searchQuery, products]);

  const handleSearch = (query = searchQuery) => {
    onSearch?.(query.trim());
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch?.("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.title);
    handleSearch(product.title);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8" ref={searchRef}>
      <div className={`relative flex items-center bg-white/90 backdrop-blur-md rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
        isFocused 
          ? "border-slate-900 shadow-xl scale-[1.02]" 
          : "border-slate-200/60 hover:border-slate-300"
      }`}>
        {/* Search Icon */}
        <div className="pl-4 pr-3 text-slate-500 transition-colors duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search products, categories, brands..."
          className="w-full py-3 pr-4 bg-transparent border-none outline-none text-slate-900 placeholder-slate-500 text-sm font-medium"
        />

        {/* Clear Search Button (when there's text) */}
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-300 hover:bg-slate-100 rounded-lg mx-1"
            type="button"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2 m-1.5 rounded-xl font-semibold text-sm hover:from-slate-800 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
          type="button"
        >
          <span>Search</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-2xl z-50 overflow-hidden animate-scale-in">
          {suggestions.map((product, index) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full p-4 text-left hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100 last:border-b-0 flex items-center gap-4 group"
              type="button"
            >
              {/* Product Image */}
              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                <OptimizedImage
                  src={isNonEmpty(product.image) ? product.image : PLACEHOLDER}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-slate-700">
                  {product.title}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <span className="capitalize">{product.category}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-900">${product.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* premium background with enhanced animations */
function PremiumBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Animated gradient orbs */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-float transition-all duration-1000"
        style={{ 
          left: `${mousePosition.x}%`, 
          top: `${mousePosition.y}%`, 
          transform: "translate(-50%, -50%)",
          opacity: 0.7
        }}
      />
      <div 
        className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-full blur-3xl animate-float-delayed"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div 
        className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/12 to-blue-500/12 rounded-full blur-3xl animate-float-slow"
        style={{ transform: `translateY(${scrollY * -0.05}px)` }}
      />
      
      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(120,119,198,0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(120,119,198,0.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite",
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-slate-50/60 to-slate-50/20" />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }} 
      />
      
      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
}

/* enhanced star rating with smooth animations */
function PremiumStar({ filled, interactive = false, onHover, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  return (
    <button
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.(index);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      className={`transition-all duration-300 ${interactive ? "hover:scale-125 cursor-pointer" : "cursor-default"} ${
        filled ? "text-amber-400 drop-shadow-sm" : "text-slate-300"
      } ${isHovered && interactive ? "transform scale-110" : ""} ${
        isClicked ? "scale-90" : ""
      }`}
      type="button"
      aria-label={`Rate ${index} stars`}
    >
      <svg 
        className="w-4 h-4 filter drop-shadow-sm" 
        viewBox="0 0 20 20" 
        fill={filled ? "currentColor" : "none"} 
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
  );
}

/* enhanced image component with better loading states */
function OptimizedImage({ src, alt, className, onError, ...props }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className || ""}`}>
      {/* Enhanced shimmer effect */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 animate-shimmer" />
        </div>
      )}
      
      {isVisible && (
        <img
          src={hasError ? PLACEHOLDER : src}
          alt={alt}
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={(e) => {
            setIsLoading(false);
            setHasError(true);
            onError?.(e);
          }}
          className={`w-full h-full object-contain transition-all duration-700 ${
            isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
      
      {/* Enhanced overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-500 pointer-events-none" />
    </div>
  );
}

/* main enhanced grid component */
export default function PremiumProductGrid({ products }) {
  const [flash, setFlash] = useState(() => new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [ratingHover, setRatingHover] = useState({});
  const [fallbackSrc, setFallbackSrc] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);
  const flashTimers = useRef(new Map());

  const prodQnt = useCartProdQnt();
  const { addToCart, incQnt, decQnt } = useCartActions();

  // Lenis Smooth Scrolling Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    return () => {
      flashTimers.current.forEach((t) => clearTimeout(t));
      flashTimers.current.clear();
    };
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      // If search is empty, show all products
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.title?.toLowerCase().includes(query.toLowerCase()) ||
      product.category?.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (p) => {
    if (!p?.inStock) return;
    const k = String(p.id);
    addToCart(k, {
      id: p.id,
      title: p.title,
      seller: p.seller ?? "Premium Seller",
      price: p.price,
      originalPrice: p.originalPrice ?? p.price,
      image: p.image,
      delivery: p.delivery ?? "2-3 days",
      inStock: p.inStock,
    });
    setFlash((s) => new Set(s).add(k));
    clearTimeout(flashTimers.current.get(k));
    const t = setTimeout(() => {
      setFlash((s) => {
        const n = new Set(s);
        n.delete(k);
        return n;
      });
      flashTimers.current.delete(k);
    }, 1200);
    flashTimers.current.set(k, t);
  };

  return (
    <div className="relative mt-16 mb-0 min-h-screen bg-slate-50 text-slate-900 px-5 py-5 overflow-hidden">
      <PremiumBackground />

      {/* Premium Search Bar */}
      <PremiumSearchBar 
        onSearch={handleSearch} 
        products={products}
      />

      {/* Enhanced product grid with optimized spacing */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p, index) => {
            const { id, title, price, originalPrice, discountPercent, category, image, rating, inStock } = p;
            const k = String(id);
            const count = prodQnt[k] || 0;
            const full = Math.round(rating?.rate ?? 0);
            const cardSrc = fallbackSrc[k] ?? (isNonEmpty(image) ? image : PLACEHOLDER);

            return (
              <div
                key={id}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Enhanced card glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 blur-xl transition-all duration-700 opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105" />

                <div
                  className="relative rounded-2xl bg-white border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm animate-fade-in-up group-hover:-translate-y-2 group-hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Enhanced top gradient border */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_100%] animate-gradient-x" />

                  {/* Square image container */}
                  <div
                    className="relative aspect-square p-4 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden"
                  >
                    {/* Enhanced shimmer overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 translate-x-[-100%] transition-transform duration-1000 pointer-events-none z-10 group-hover:translate-x-[100%]"
                      aria-hidden
                    />
                    
                    {/* Enhanced hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 z-5" />
                    
                    <OptimizedImage
                      src={cardSrc}
                      alt={title || "product image"}
                      onError={() => setFallbackSrc((prev) => (prev[k] ? prev : { ...prev, [k]: PLACEHOLDER }))}
                      className="w-full h-full rounded-xl shadow-md ring-1 ring-slate-200/50 group-hover:ring-slate-300 transition-all duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Enhanced product info with reduced padding */}
                  <div className="relative p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        {category}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-2 hover:text-slate-700 transition-colors">
                        {title}
                      </h3>
                    </div>

                    {/* Enhanced rating */}
                    <div className="flex items-center">
                      <div className="flex mr-2" onMouseLeave={() => setRatingHover((prev) => ({ ...prev, [id]: null }))}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <PremiumStar
                            key={star}
                            filled={star <= (ratingHover[id] || full)}
                            interactive
                            index={star}
                            onHover={(hoveredIndex) => setRatingHover((prev) => ({ ...prev, [id]: hoveredIndex }))}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-900 text-xs mr-1">{rating?.rate ?? 0}</span>
                      <span className="text-slate-500 text-xs">({rating?.count ?? 0})</span>
                    </div>

                    {/* Enhanced pricing */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">${Number(price).toFixed(2)}</span>
                        {originalPrice && originalPrice > price && (
                          <span className="text-xs text-slate-500 line-through font-medium">
                            ${Number(originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {originalPrice && originalPrice > price && (
                        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          Save ${(originalPrice - price).toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Enhanced cart actions */}
                    <div className="space-y-2">
                      {(prodQnt[k] || 0) === 0 ? (
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={!inStock}
                          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 border-2 relative overflow-hidden group ${
                            flash.has(k)
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 animate-success-pulse"
                              : "bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 disabled:from-slate-300 disabled:to-slate-400 disabled:text-slate-500 border-slate-900 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                          }`}
                          type="button"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                          {flash.has(k) ? (
                            <>
                              <svg className="w-4 h-4 mr-2 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="relative">ADDED</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <span className="relative">ADD TO CART</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-stretch bg-white rounded-xl p-1.5 shadow-md border border-slate-200/60 hover:scale-[1.02] transition-transform duration-300">
                          <button
                            onClick={() => decQnt(k)}
                            aria-label="Decrease quantity"
                            className="w-10 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 hover:bg-rose-50 hover:text-rose-700 transition-all duration-300 font-bold active:scale-95 text-sm"
                            type="button"
                          >
                            <span className="text-lg">−</span>
                          </button>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-slate-900 font-bold text-lg select-none px-3 py-2 min-w-[50px] text-center">
                              {prodQnt[k] || 0}
                            </div>
                          </div>
                          <button
                            onClick={() => incQnt(k)}
                            aria-label="Increase quantity"
                            className="w-10 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 font-bold active:scale-95 text-sm"
                            type="button"
                          >
                            <span className="text-lg">+</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Enhanced trust badges */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/60">
                      <div className="text-center p-1.5 rounded-md hover:bg-slate-50 transition-colors duration-300 group">
                        <svg className="w-4 h-4 text-blue-500 mx-auto mb-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-[9px] font-semibold text-slate-700">Fast Delivery</div>
                      </div>
                      <div className="text-center p-1.5 rounded-md hover:bg-slate-50 transition-colors duration-300 group">
                        <svg className="w-4 h-4 text-emerald-500 mx-auto mb-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div className="text-[9px] font-semibold text-slate-700">Secure</div>
                      </div>
                      <div className="text-center p-1.5 rounded-md hover:bg-slate-50 transition-colors duration-300 group">
                        <svg className="w-4 h-4 text-purple-500 mx-auto mb-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <div className="text-[9px] font-semibold text-slate-700">Returns</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // No products found message
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Try adjusting your search terms or browse our categories to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes success-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
        }
        @keyframes checkmark {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 100%;
        }
        .animate-success-pulse {
          animation: success-pulse 1s ease-in-out;
        }
        .animate-checkmark {
          animation: checkmark 0.5s ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}