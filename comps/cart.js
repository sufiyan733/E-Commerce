// app/cart/page.jsx
"use client";

import { useMemo, useCallback, memo, useState, useEffect } from "react";
import {
  useCartProdQnt,
  useCartProducts,
  useCartSavedIds,
  useCartActions,
} from "@/store/useCartStore";

export default function PremiumCart() {
  const prodQnt = useCartProdQnt();
  const products = useCartProducts();
  const savedIds = useCartSavedIds();
  const { setQnt, remove, saveForLater, moveToCart, removeSaved, clearSaved } =
    useCartActions();

  const [isLoading, setIsLoading] = useState(true);
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setAnimateItems(true);
    const timer = setTimeout(() => setAnimateItems(false), 500);
    return () => clearTimeout(timer);
  }, [prodQnt, savedIds]);

  const lines = useMemo(() => {
    return Object.entries(prodQnt || {}).map(([k, qty]) => {
      const meta = products?.[k] || {};
      return { ...meta, id: Number(k), _k: k, quantity: qty || 0 };
    });
  }, [prodQnt, products]);

  const subtotal = useMemo(
    () => lines.reduce((t, it) => t + (+it.price || 0) * (+it.quantity || 0), 0),
    [lines]
  );
  const totalSavings = useMemo(
    () =>
      lines.reduce((t, it) => {
        const o = +it.originalPrice || 0;
        const p = +it.price || 0;
        return t + Math.max(0, o - p) * (+it.quantity || 0);
      }, 0),
    [lines]
  );
  const totalItems = useMemo(
    () => lines.reduce((t, it) => t + (+it.quantity || 0), 0),
    [lines]
  );

  const savedItems = useMemo(
    () =>
      (savedIds || [])
        .map((k) => {
          const m = products?.[k];
          return m
            ? { ...m, id: Number(k), _k: k }
            : { id: Number(k), _k: k, title: "Saved item", price: 0 };
        })
        .filter(Boolean),
    [savedIds, products]
  );

  const setQuantity = useCallback(
    (id, nextQty) => {
      if (nextQty < 1) return remove(id);
      setQnt(id, nextQty);
    },
    [remove, setQnt]
  );

  const fmt = useCallback(
    (n) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(Number.isFinite(+n) ? +n : 0),
    []
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin border-t-emerald-500 border-r-blue-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your premium cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Enhanced Header */}
        <header className="mb-12 text-center">
          <div className="relative inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-emerald-700 bg-clip-text text-transparent mb-3">
              Your Shopping Cart
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
          </div>
          <p className="text-slate-600 mt-4 text-lg">
            {totalItems} premium {totalItems === 1 ? 'item' : 'items'} • {fmt(subtotal)}
          </p>
          {totalSavings > 0 && (
            <div className="mt-3 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
              🎉 You're saving {fmt(totalSavings)}
            </div>
          )}
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main Cart Section */}
          <section className="space-y-6">
            {lines.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto bg-white rounded-3xl p-12 shadow-xl border border-slate-100">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h3>
                  <p className="text-slate-600 mb-6">Discover amazing products and add them to your cart</p>
                  <button className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-md">
                    Start Shopping
                  </button>
                </div>
              </div>
            ) : (
              <div className={`space-y-6 ${animateItems ? 'animate-fade-in-up' : ''}`}>
                {lines.map((item, index) => (
                  <CartItem
                    key={item._k}
                    item={item}
                    index={index}
                    onUpdateQuantity={setQuantity}
                    onRemove={remove}
                    onSave={(id) => saveForLater(String(id))}
                    fmt={fmt}
                  />
                ))}
              </div>
            )}

            {/* Enhanced Saved Items Section */}
            {savedItems.length > 0 && (
              <div className="pt-8">
                <div className="mb-6 flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Saved for later
                      </h2>
                      <p className="text-slate-600 text-sm">{savedItems.length} items waiting for you</p>
                    </div>
                  </div>
                  <button
                    onClick={clearSaved}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 border border-slate-200 hover:border-slate-300"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {savedItems.map((item, index) => (
                    <SavedItem
                      key={item._k}
                      item={item}
                      index={index}
                      onMoveToCart={() => moveToCart(item._k)}
                      onRemove={() => removeSaved(item._k)}
                      fmt={fmt}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Enhanced Compact Fixed Summary Card */}
          {lines.length > 0 && (
            <aside className="sticky top-8 h-fit space-y-4">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-emerald-400 to-blue-400 rounded-full shadow-lg"></div>
                  <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
                </div>
                
                <div className="space-y-3 mb-4">
                  <CompactRow label={`Subtotal (${totalItems} items)`} value={fmt(subtotal)} />
                  <CompactRow label="Express Shipping" value={
                    <span className="text-emerald-600 font-semibold text-sm">Free</span>
                  } />
                  <CompactRow label="Tax (8%)" value={fmt(subtotal * 0.08)} />
                  {totalSavings > 0 && (
                    <CompactRow label="Total Savings" value={`-${fmt(totalSavings)}`} accent />
                  )}
                </div>

                <div className="my-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-lg">Grand Total</span>
                    <span className="font-bold text-slate-900 text-lg">{fmt(subtotal * 1.08)}</span>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-xl font-semibold text-base hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden shadow-lg">
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Proceed to Checkout</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <div className="text-center space-y-2 mt-3">
                    <p className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                      <span>🔒</span>
                      <span>Secure checkout • 30-day returns</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Trust Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-lg p-3 shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-6 h-6 mx-auto mb-1 text-emerald-500">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Secure</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-6 h-6 mx-auto mb-1 text-blue-500">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Free Shipping</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-6 h-6 mx-auto mb-1 text-purple-500">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Easy Returns</p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.4s ease-out;
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}

function CompactRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-slate-600">
        {label}
      </span>
      <span className={`text-sm font-medium ${accent ? "text-emerald-600" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

function Row({ label, value, bold, accent }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-slate-600 ${bold ? "font-semibold text-slate-900 text-lg" : ""}`}>
        {label}
      </span>
      <span
        className={`${bold ? "font-bold text-slate-900 text-lg" : "text-slate-700"} ${
          accent ? "text-emerald-600 font-semibold" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

const CartItem = memo(function CartItem({ item, index, onUpdateQuantity, onRemove, onSave, fmt }) {
  const hasDiscount = (+item.originalPrice || 0) > (+item.price || 0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className={`bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover-lift ${
        index !== undefined ? 'animate-scale-in' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex gap-6">
          {/* Image Container - Clean without badges */}
          <div className="relative group">
            <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-1.5 shadow-inner">
              {item?.image ? (
                <img
                  src={item.image}
                  alt={item.title || "Product"}
                  className={`h-full w-full object-cover rounded-lg transition-all duration-500 ${
                    isHovered ? 'scale-105 brightness-105' : 'scale-100 brightness-100'
                  }`}
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-200">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Badges placed outside the image container */}
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Stock Badge */}
              {item.inStock ? (
                <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                  In stock
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                  Out of stock
                </span>
              )}

              {/* Discount Badge */}
              {hasDiscount && (
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate">{item.title}</h3>
                
                <div className="flex items-center space-x-4 mb-3 text-sm text-slate-600">
                  <span className="flex items-center space-x-1 bg-slate-100 rounded-lg px-2 py-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span className="font-medium">{item.seller || "Premium Seller"}</span>
                  </span>
                  <span className="flex items-center space-x-1 bg-slate-100 rounded-lg px-2 py-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="font-medium">Delivery {item.delivery || "2-3 days"}</span>
                  </span>
                </div>

                {/* Enhanced Quantity Controls */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1 shadow-inner">
                    <button
                      onClick={() => onUpdateQuantity(item.id, (+item.quantity || 0) - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all duration-200"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold text-slate-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, (+item.quantity || 0) + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all duration-200"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => onSave(item.id)}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                      </svg>
                      <span>Save</span>
                    </button>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="flex items-center space-x-1 text-sm text-rose-600 hover:text-rose-700 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="text-right">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold text-slate-900">
                    {fmt((+item.price || 0) * (+item.quantity || 0))}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-500 line-through">
                      {fmt((+item.originalPrice || 0) * (+item.quantity || 0))}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-4">{fmt(+item.price || 0)} each</p>
                {hasDiscount && (
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    Save {fmt((+item.originalPrice - +item.price) * (+item.quantity || 0))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

const SavedItem = memo(function SavedItem({ item, index, onMoveToCart, onRemove, fmt }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-white rounded-xl border border-slate-200 p-4 hover-lift group transition-all duration-300 ${
        index !== undefined ? 'animate-slide-in-right' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Fixed Image Container with 5px Padding */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-1 shadow-inner">
            {item?.image ? (
              <img
                src={item.image}
                alt={item.title || "Saved item"}
                className={`h-full w-full object-cover rounded-md transition-all duration-300 ${
                  isHovered ? 'scale-105 brightness-105' : 'scale-100 brightness-100'
                }`}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-200">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-900 truncate">{item.title}</p>
            <p className="text-sm font-semibold text-emerald-600">{fmt(+item.price || 0)}</p>
          </div>
        </div>

        <div className="flex space-x-2 ml-4">
          <button 
            onClick={onMoveToCart}
            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-1 shadow-md min-w-[70px] justify-center"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>Move</span>
          </button>
          <button 
            onClick={onRemove}
            className="border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center space-x-1 min-w-[70px] justify-center"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
});