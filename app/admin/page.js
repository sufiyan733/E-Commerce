
// "use client";

// import { useState, useEffect, useMemo, useRef } from "react";
// import Products from "./prods";
// import useProductStore from "@/store/useCartStore";
// import { SparklesIcon, ShieldCheckIcon, RocketIcon, X, CheckCircle, Zap, Star, ShoppingBag } from "lucide-react";

// // Ultra Premium Toast System
// const usePremiumToast = () => {
//   const [toasts, setToasts] = useState([]);

//   const addToast = (message, type = "success") => {
//     const id = Date.now() + Math.random();
//     const toast = { id, message, type, visible: true };
//     setToasts(prev => [...prev, toast]);
    
//     setTimeout(() => {
//       removeToast(id);
//     }, 5000);
//   };

//   const removeToast = (id) => {
//     setToasts(prev => prev.map(toast => 
//       toast.id === id ? { ...toast, visible: false } : toast
//     ));
//     setTimeout(() => {
//       setToasts(prev => prev.filter(toast => toast.id !== id));
//     }, 500);
//   };

//   const ToastContainer = () => (
//     <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
//       {toasts.map((toast) => (
//         <div
//           key={toast.id}
//           className={`relative p-4 rounded-2xl backdrop-blur-xl border-2 shadow-2xl transform transition-all duration-500 ${
//             toast.visible ? 'animate-toast-enter' : 'animate-toast-exit'
//           } ${
//             toast.type === "success" 
//               ? "bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 border-emerald-200/80 dark:from-emerald-950/95 dark:via-green-950/95 dark:to-lime-950/95 dark:border-emerald-700/80" 
//               : "bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 border-rose-200/80 dark:from-rose-950/95 dark:via-pink-950/95 dark:to-red-950/95 dark:border-rose-700/80"
//           }`}
//         >
//           <div className="flex items-start gap-3">
//             <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
//               toast.type === "success" 
//                 ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white animate-icon-bounce" 
//                 : "bg-gradient-to-br from-rose-500 to-pink-500 text-white animate-icon-shake"
//             }`}>
//               {toast.type === "success" ? (
//                 <CheckCircle className="w-5 h-5" />
//               ) : (
//                 <X className="w-5 h-5" />
//               )}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className={`text-base font-bold mb-1 ${
//                 toast.type === "success" 
//                   ? "text-emerald-900 dark:text-emerald-100" 
//                   : "text-rose-900 dark:text-rose-100"
//               }`}>
//                 {toast.type === "success" ? "Success!" : "Error!"}
//               </p>
//               <p className={`text-sm ${
//                 toast.type === "success" 
//                   ? "text-emerald-700 dark:text-emerald-300" 
//                   : "text-rose-700 dark:text-rose-300"
//               }`}>
//                 {toast.message}
//               </p>
//             </div>
//             <button
//               onClick={() => removeToast(toast.id)}
//               className="flex-shrink-0 w-7 h-7 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700/80"
//             >
//               <X className="w-3 h-3" />
//             </button>
//           </div>
          
//           {/* Premium Progress Bar */}
//           <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-10 rounded-full overflow-hidden">
//             <div className={`h-full ${
//               toast.type === "success" 
//                 ? "bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500" 
//                 : "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500"
//             } animate-toast-progress`} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   return { addToast, removeToast, ToastContainer };
// };

// function useTheme() {
//   const [theme, setTheme] = useState("light");
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const saved = localStorage.getItem("theme");
//     const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const initialTheme = saved || (systemPrefersDark ? "dark" : "light");
//     setTheme(initialTheme);
//     document.documentElement.classList.toggle("dark", initialTheme === "dark");
//   }, []);

//   const toggle = () => {
//     const next = theme === "dark" ? "light" : "dark";
//     setTheme(next);
//     localStorage.setItem("theme", next);
//     document.documentElement.classList.toggle("dark", next === "dark");
//   };

//   return { theme, toggle, mounted };
// }

// export default function AdminProducts() {
//   const { theme, toggle, mounted } = useTheme();
//   const { addToast, ToastContainer } = usePremiumToast();
//   const productsMap = Products();

//   const [deleteId, setDeleteId] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const saveBtnRef = useRef(null);
//   const formRef = useRef(null);
//   const previewRef = useRef(null);

//   const setProductField = useProductStore((s) => s.setProductField);
//   const setRating = useProductStore((s) => s.setRating);
//   const resetProduct = useProductStore((s) => s.resetProduct);
//   const productstate = useProductStore((s) => s.productstate);

//   const [form, setForm] = useState({
//     id: "",
//     title: "",
//     price: "",
//     originalPrice: "",
//     category: "electronics",
//     ratingRate: "",
//     ratingCount: "",
//     image: "",
//     inStock: true,
//   });

//   const [isAnimating, setIsAnimating] = useState(false);

//   // Enhanced animation states
//   const [fieldAnimations, setFieldAnimations] = useState({});
//   const [previewScale, setPreviewScale] = useState(1);

//   // Sync form with productstate from store
//   useEffect(() => {
//     if (productstate) {
//       setForm({
//         id: productstate.id || "",
//         title: productstate.title || "",
//         price: productstate.price || "",
//         originalPrice: productstate.originalPrice || "",
//         category: productstate.category || "electronics",
//         ratingRate: productstate.rating?.rate || "",
//         ratingCount: productstate.rating?.count || "",
//         image: productstate.image || "",
//         inStock: productstate.inStock !== false,
//       });
//     }
//   }, [productstate]);

//   // Enhanced field focus animations
//   const handleFieldFocus = (fieldName) => {
//     setFieldAnimations(prev => ({
//       ...prev,
//       [fieldName]: true
//     }));
//   };

//   const handleFieldBlur = (fieldName) => {
//     setFieldAnimations(prev => ({
//       ...prev,
//       [fieldName]: false
//     }));
//   };

//   const addPRODUCT = async (e) => {
//     e?.preventDefault();
//     setIsSubmitting(true);
//     setIsAnimating(true);
    
//     const validationError = validate(live);
//     if (validationError) {
//       addToast(validationError, "error");
//       setIsSubmitting(false);
//       setIsAnimating(false);
//       return;
//     }

//     try {
//       // Enhanced success animation sequence
//       if (formRef.current) {
//         formRef.current.classList.add('animate-success-glow');
//         setTimeout(() => {
//           if (formRef.current) {
//             formRef.current.classList.remove('animate-success-glow');
//           }
//         }, 2000);
//       }

//       // Preview celebration animation
//       if (previewRef.current) {
//         setPreviewScale(1.1);
//         setTimeout(() => setPreviewScale(1), 600);
//         previewRef.current.classList.add('animate-celebration');
//         setTimeout(() => {
//           if (previewRef.current) {
//             previewRef.current.classList.remove('animate-celebration');
//           }
//         }, 2000);
//       }

//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       const response = await fetch('/api/products', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(live),
//       });

//       if (response.ok) {
//         addToast("🎉 Product added successfully!", "success");
//         resetProduct();
//         setForm({
//           id: "", title: "", price: "", originalPrice: "", 
//           category: "electronics", ratingRate: "", ratingCount: "", image: "", inStock: true,
//         });
//       } else {
//         throw new Error('Failed to add product');
//       }
//     } catch (error) {
//       addToast(`Failed to add product: ${error.message}`, "error");
//     } finally {
//       setIsSubmitting(false);
//       setIsAnimating(false);
//     }
//   };

//   const remProduct = async () => {
//     if (!deleteId) {
//       addToast("Please enter a product ID to delete", "error");
//       return;
//     }

//     try {
//       const response = await fetch('/api/products', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id: deleteId }),
//       });

//       if (response.ok) {
//         addToast("🗑️ Product deleted successfully!", "success");
//         setDeleteId('');
//       } else {
//         throw new Error('Failed to delete product');
//       }
//     } catch (error) {
//       addToast(`Failed to delete product: ${error.message}`, "error");
//     }
//   };

//   useEffect(() => {
//     const onKey = (e) => {
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
//         e.preventDefault();
//         saveBtnRef.current?.click();
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   const onChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    
//     if (name === "ratingRate") {
//       setRating(value, form.ratingCount);
//     } else if (name === "ratingCount") {
//       setRating(form.ratingRate, value);
//     } else {
//       setProductField(name, type === "checkbox" ? checked : value);
//     }
//   };

//   const cast = (v, def = 0) => {
//     if (v === "" || v === null || v === undefined) return def;
//     const n = Number(v);
//     return Number.isFinite(n) ? n : def;
//   };

//   const live = useMemo(() => {
//     const price = cast(form.price);
//     const original = form.originalPrice === "" ? price : cast(form.originalPrice);
//     const pct = original > 0 ? Math.max(0, ((original - price) / original) * 100) : 0;
    
//     return {
//       id: cast(form.id),
//       title: (form.title || "").trim() || "Untitled product",
//       price,
//       originalPrice: original,
//       discountPercent: Math.round(pct * 100) / 100,
//       category: (form.category || "").trim() || "uncategorized",
//       rating: { 
//         rate: cast(form.ratingRate, 0), 
//         count: cast(form.ratingCount, 0) 
//       },
//       image: (form.image || "").trim(),
//       inStock: !!form.inStock,
//     };
//   }, [form]);

//   const validate = (p) => {
//     if (!Number.isFinite(p.id) || p.id <= 0) return "Valid ID required";
//     if (!p.title || p.title.trim() === "") return "Title required";
//     if (p.price <= 0) return "Price must be > 0";
//     if (p.originalPrice < p.price) return "Original price must be >= price";
//     if (p.rating.rate < 0 || p.rating.rate > 5) return "Rating must be between 0-5";
//     if (p.rating.count < 0) return "Rating count cannot be negative";
//     return null;
//   };

//   const resetForm = () => {
//     resetProduct();
//     setForm({
//       id: "", title: "", price: "", originalPrice: "", 
//       category: "electronics", ratingRate: "", ratingCount: "", image: "", inStock: true,
//     });
//   };

//   const priceFmt = (n) =>
//     new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       maximumFractionDigits: 2,
//     }).format(Number.isFinite(+n) ? +n : 0);

//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 transition-all duration-500 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 overflow-auto m-[5px]">
//       <ToastContainer />
      
//       {/* Ultra-Compact Header */}
//       <div className="sticky top-0 z-40 border-b border-white/20 bg-white/90 backdrop-blur-xl transition-all duration-300 dark:bg-slate-900/90">
//         <div className="mx-auto max-w-7xl px-4 py-2">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg animate-float">
//                 <RocketIcon className="h-3 w-3 text-white" />
//               </div>
//               <div>
//                 <h1 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-base font-bold text-transparent dark:from-slate-100 dark:to-slate-300">
//                   Product Manager
//                 </h1>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <div className="hidden items-center gap-1 rounded-lg bg-slate-100/80 px-2 py-1 dark:bg-slate-800/80 sm:flex">
//                 <SparklesIcon className="h-3 w-3 text-amber-500 animate-pulse" />
//                 <kbd className="text-xs font-medium text-slate-700 dark:text-slate-300">
//                   ⌘S
//                 </kbd>
//               </div>
              
//               <button
//                 type="button"
//                 onClick={toggle}
//                 className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 p-1 shadow-inner transition-all duration-300 hover:shadow dark:from-slate-800 dark:to-slate-700"
//               >
//                 <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
//                   {theme === "dark" ? <SunIcon /> : <MoonIcon />}
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content - Reduced Height by 30% */}
//       <div className="min-h-[calc(70vh-3rem)] mx-auto max-w-7xl px-3 py-2">
//         <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
//           {/* Left Card - Compact Form (Reduced Height) */}
//           <div className="relative">
//             <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur transition-all duration-500 hover:opacity-30 animate-gradient-shift" />
//             <form 
//               ref={formRef}
//               onSubmit={addPRODUCT}
//               className="relative rounded-xl border border-white/20 bg-white/95 p-3 shadow-xl backdrop-blur-xl transition-all duration-300 dark:bg-slate-900/95 animate-fade-in-up"
//             >
//               <div className="mb-3 flex items-center gap-2">
//                 <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow">
//                   <PlusIcon className="h-3 w-3 text-white" />
//                 </div>
//                 <h2 className="text-sm font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
//                   Add Product
//                 </h2>
//               </div>

//               <div className="space-y-2 custom-scrollbar pr-1">
//                 {/* ID & Title Row */}
//                 <div className="grid grid-cols-1 gap-2">
//                   <AnimatedField 
//                     label="ID" 
//                     name="id" 
//                     type="number" 
//                     value={form.id} 
//                     onChange={onChange}
//                     onFocus={() => handleFieldFocus('id')}
//                     onBlur={() => handleFieldBlur('id')}
//                     isAnimating={fieldAnimations.id}
//                     required 
//                   />
//                   <AnimatedField 
//                     label="Title" 
//                     name="title" 
//                     value={form.title} 
//                     onChange={onChange}
//                     onFocus={() => handleFieldFocus('title')}
//                     onBlur={() => handleFieldBlur('title')}
//                     isAnimating={fieldAnimations.title}
//                     required 
//                   />
//                 </div>

//                 {/* Pricing Row */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <AnimatedField 
//                     label="Price" 
//                     name="price" 
//                     type="number" 
//                     step="0.01" 
//                     value={form.price} 
//                     onChange={onChange}
//                     onFocus={() => handleFieldFocus('price')}
//                     onBlur={() => handleFieldBlur('price')}
//                     isAnimating={fieldAnimations.price}
//                     required 
//                     icon="$" 
//                   />
//                   <AnimatedField 
//                     label="Original" 
//                     name="originalPrice" 
//                     type="number" 
//                     step="0.01" 
//                     value={form.originalPrice} 
//                     onChange={onChange}
//                     onFocus={() => handleFieldFocus('originalPrice')}
//                     onBlur={() => handleFieldBlur('originalPrice')}
//                     isAnimating={fieldAnimations.originalPrice}
//                     placeholder="Auto" 
//                     icon="🏷️" 
//                   />
//                 </div>

//                 {/* Category & Stock Row */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <AnimatedField 
//                     label="Category" 
//                     name="category" 
//                     value={form.category} 
//                     onChange={onChange}
//                     onFocus={() => handleFieldFocus('category')}
//                     onBlur={() => handleFieldBlur('category')}
//                     isAnimating={fieldAnimations.category}
//                     icon="📁" 
//                   />
//                   <div className="flex items-center justify-between pt-4">
//                     <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
//                       <Zap className="w-3 h-3 text-amber-500" />
//                       In Stock
//                     </span>
//                     <AnimatedToggle name="inStock" checked={form.inStock} onChange={onChange} />
//                   </div>
//                 </div>

//                 {/* Ratings Row */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <AnimatedField 
//                     label="Rating" 
//                     name="ratingRate" 
//                     type="number" 
//                     step="0.1" 
//                     value={form.ratingRate} 
//                     onChange={onChange}
//                     onFocus={() => handleFieldFocus('ratingRate')}
//                     onBlur={() => handleFieldBlur('ratingRate')}
//                     isAnimating={fieldAnimations.ratingRate}
//                     placeholder="4.5" 
//                     icon="⭐" 
//                   />
//                   <AnimatedField 
//                     label="Reviews" 
//                     name="ratingCount" 
//                     type="number" 
//                     value={form.ratingCount} 
//                     onChange={onChange}
//                     onFocus={() => handleFieldFocus('ratingCount')}
//                     onBlur={() => handleFieldBlur('ratingCount')}
//                     isAnimating={fieldAnimations.ratingCount}
//                     placeholder="120" 
//                     icon="👥" 
//                   />
//                 </div>

//                 {/* Image URL */}
//                 <AnimatedField 
//                   label="Image URL" 
//                   name="image" 
//                   value={form.image} 
//                   onChange={onChange}
//                   onFocus={() => handleFieldFocus('image')}
//                   onBlur={() => handleFieldBlur('image')}
//                   isAnimating={fieldAnimations.image}
//                   placeholder="https://..." 
//                   icon="🖼️" 
//                 />

//                 {/* Auto-calculated Discount Display */}
//                 {live.discountPercent > 0 && (
//                   <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-2 dark:from-amber-950/50 dark:to-orange-950/50 dark:border-amber-800/50 animate-pulse-once">
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-bold text-amber-900 dark:text-amber-100 flex items-center gap-1">
//                         <SparklesIcon className="w-3 h-3" />
//                         Discount
//                       </span>
//                       <span className="text-sm font-black text-amber-600 dark:text-amber-400">
//                         {live.discountPercent}% OFF
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Compact Action Bar */}
//               <div className="mt-3 rounded-lg border border-white/20 bg-white/80 p-2 shadow backdrop-blur-xl transition-all duration-300 dark:bg-slate-800/80">
//                 <div className="flex flex-col gap-2">
//                   <div className="flex items-center gap-2">
//                     <div className="relative flex-1">
//                       <input 
//                         placeholder="ID to delete..." 
//                         className="w-full rounded-lg border border-slate-200 bg-white/80 px-2 h-7 text-xs transition-all duration-300 focus:border-rose-300 focus:bg-white focus:shadow dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:border-rose-600"
//                         value={deleteId}
//                         onChange={(e) => setDeleteId(e.target.value)} 
//                       />
//                     </div>
//                     <button 
//                       type="button" 
//                       onClick={remProduct}
//                       className="h-7 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-2 text-xs font-semibold text-white shadow transition-all duration-300 hover:shadow-md hover:from-rose-600 hover:to-pink-700 active:scale-95 animate-pulse-once"
//                     >
//                       Delete
//                     </button>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <button 
//                       type="button" 
//                       onClick={resetForm}
//                       className="flex-1 h-7 rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:shadow dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
//                     >
//                       Reset
//                     </button>
//                     <button 
//                       ref={saveBtnRef}
//                       type="submit" 
//                       disabled={isSubmitting}
//                       className="flex-1 h-7 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-2 text-xs font-semibold text-white shadow-lg transition-all duration-500 hover:shadow-xl disabled:opacity-50 group relative overflow-hidden"
//                     >
//                       <span className="relative z-10 flex items-center justify-center gap-1">
//                         {isSubmitting ? (
//                           <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                         ) : (
//                           <SaveIcon />
//                         )}
//                         {isSubmitting ? "Saving..." : "Save"}
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>

//           {/* Right Card - Enhanced Preview with Square Image */}
//           <div className="relative">
//             <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-20 blur animate-gradient-shift" />
//             <div 
//               ref={previewRef}
//               className="relative rounded-xl border border-white/20 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:bg-slate-900/95 flex flex-col animate-fade-in-up"
//               style={{ transform: `scale(${previewScale})`, transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
//             >
//               <div className="mb-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 shadow">
//                     <ShoppingBag className="h-3 w-3 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Preview</h3>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800">
//                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
//                   <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">LIVE</span>
//                 </div>
//               </div>
              
//               {/* Square Image Preview Area */}
//               <div className="flex-1 flex flex-col items-center justify-center">
//                 <div className="w-full max-w-xs">
//                   <SquareImagePreviewCard p={live} priceFmt={priceFmt} />
//                 </div>
//               </div>

//               {/* Premium Stats Grid */}
//               <div className="mt-3 grid grid-cols-4 gap-1 text-center">
//                 <PremiumStatCard 
//                   label="Price" 
//                   value={priceFmt(live.price)} 
//                   color="blue"
//                   delay="0ms"
//                 />
//                 <PremiumStatCard 
//                   label="Rating" 
//                   value={`${live.rating.rate || 0}⭐`} 
//                   color="amber"
//                   delay="100ms"
//                 />
//                 <PremiumStatCard 
//                   label="Discount" 
//                   value={`${live.discountPercent}%`} 
//                   color="emerald"
//                   delay="200ms"
//                 />
//                 <PremiumStatCard 
//                   label="Reviews" 
//                   value={live.rating.count || 0} 
//                   color="purple"
//                   delay="300ms"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Ultra Premium Animated Components */
// function AnimatedField({ label, name, value, onChange, type = "text", className = "", icon, onFocus, onBlur, isAnimating, ...rest }) {
//   return (
//     <label className={`block ${className}`}>
//       <div className="mb-1 flex items-center justify-between">
//         <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
//           {icon && <span className="text-xs">{icon}</span>}
//           {label}
//         </span>
//       </div>
//       <div className="relative">
//         <input
//           type={type}
//           name={name}
//           value={value}
//           onChange={onChange}
//           onFocus={onFocus}
//           onBlur={onBlur}
//           className={`w-full rounded-lg border bg-white/80 px-2 py-1.5 text-xs text-slate-900 shadow-sm outline-none transition-all duration-500 placeholder:text-slate-400 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 ${
//             isAnimating
//               ? "border-indigo-400 bg-white shadow-lg scale-105 dark:border-indigo-500 animate-field-glow" 
//               : "border-slate-200 dark:border-slate-700"
//           }`}
//           {...rest}
//         />
//         {isAnimating && (
//           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-100 transition-transform duration-500 rounded-full" />
//         )}
//       </div>
//     </label>
//   );
// }

// function AnimatedToggle({ name, checked, onChange }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
//       className={`relative h-5 w-9 rounded-full transition-all duration-500 transform ${
//         checked 
//           ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow shadow-emerald-500/30 scale-105 animate-toggle-on" 
//           : "bg-slate-300 dark:bg-slate-700 scale-100 animate-toggle-off"
//       }`}
//     >
//       <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-500 ${
//         checked ? "translate-x-4" : ""
//       }`} />
//     </button>
//   );
// }

// function PremiumStatCard({ label, value, color, delay }) {
//   const colorClasses = {
//     blue: "from-blue-50 to-cyan-50 border-blue-200/50 dark:from-blue-900/30 dark:to-cyan-900/30 dark:border-blue-700/30 text-blue-600 dark:text-blue-400",
//     amber: "from-amber-50 to-yellow-50 border-amber-200/50 dark:from-amber-900/30 dark:to-yellow-900/30 dark:border-amber-700/30 text-amber-600 dark:text-amber-400",
//     emerald: "from-emerald-50 to-green-50 border-emerald-200/50 dark:from-emerald-900/30 dark:to-green-900/30 dark:border-emerald-700/30 text-emerald-600 dark:text-emerald-400",
//     purple: "from-purple-50 to-pink-50 border-purple-200/50 dark:from-purple-900/30 dark:to-pink-900/30 dark:border-purple-700/30 text-purple-600 dark:text-purple-400"
//   };

//   return (
//     <div 
//       className={`rounded-lg bg-gradient-to-br ${colorClasses[color]} p-1.5 border transition-all duration-500 hover:scale-110 animate-stat-pop-in`}
//       style={{ animationDelay: delay }}
//     >
//       <div className="text-[10px] font-semibold mb-0.5">{label}</div>
//       <div className="text-xs font-black">{value}</div>
//     </div>
//   );
// }

// function SquareImagePreviewCard({ p, priceFmt }) {
//   const hasDiscount = (p.originalPrice || 0) > (p.price || 0);
//   const pct = Math.round(p.discountPercent * 10) / 10;
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <article 
//       className="w-full rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white to-slate-50 p-4 shadow-2xl transition-all duration-700 hover:shadow-3xl dark:from-slate-800 dark:to-slate-900 animate-float-smooth"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{ 
//         transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0px) scale(1)',
//       }}
//     >
//       <div className="flex flex-col items-center">
//         {/* Square Image Section */}
//         <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner dark:from-slate-700 dark:to-slate-800 animate-image-reveal">
//           {p.image ? (
//             <img 
//               src={p.image} 
//               alt={p.title} 
//               className={`h-full w-full object-cover transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} ${
//                 isHovered ? 'scale-105' : 'scale-100'
//               }`}
//               onLoad={() => setImageLoaded(true)}
//             />
//           ) : (
//             <div className="flex h-full w-full items-center justify-center text-slate-400">
//               <ImageIcon className="h-8 w-8" />
//             </div>
//           )}
          
//           {/* Animated Status Badges */}
//           <div className="absolute top-2 left-2 right-2 flex justify-between">
//             {p.inStock ? (
//               <span className="rounded-full bg-emerald-500/95 px-2 py-1 text-[10px] font-black text-white shadow-xl animate-pulse animate-badge-slide-in">
//                 🟢 IN STOCK
//               </span>
//             ) : (
//               <span className="rounded-full bg-rose-500/95 px-2 py-1 text-[10px] font-black text-white shadow-xl animate-badge-slide-in">
//                 🔴 OUT OF STOCK
//               </span>
//             )}
//             {hasDiscount && pct > 0 && (
//               <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-[10px] font-black text-white shadow-xl animate-bounce animate-badge-slide-in-delayed">
//                 🔥 -{pct}%
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Enhanced Content Section */}
//         <div className="flex-1 w-full text-center">
//           <h3 className="text-base font-black text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight mb-2 animate-text-reveal">
//             {p.title || "Product Title"}
//           </h3>
//           <div className="flex items-center justify-between mb-3">
//             <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded animate-fade-in-up">
//               {p.category || "Category"}
//             </span>
//             <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 animate-fade-in-up-delayed">
//               <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
//               <span className="font-semibold">{p.rating.rate || 0}</span>
//               <span>({p.rating.count || 0})</span>
//             </div>
//           </div>
          
//           {/* Enhanced Pricing Section */}
//           <div className="flex items-center justify-center gap-3 animate-price-reveal">
//             <span className="text-xl font-black text-slate-900 dark:text-slate-100">
//               {priceFmt(+p.price || 0)}
//             </span>
//             {hasDiscount && (
//               <span className="text-sm text-slate-500 line-through dark:text-slate-400">
//                 {priceFmt(+p.originalPrice || 0)}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }

// /* Premium Icons */
// function SaveIcon() {
//   return (
//     <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//   );
// }

// function MoonIcon() {
//   return (
//     <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//     </svg>
//   );
// }

// function SunIcon() {
//   return (
//     <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//     </svg>
//   );
// }

// function PlusIcon() {
//   return (
//     <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//     </svg>
//   );
// }

// function ImageIcon() {
//   return (
//     <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//     </svg>
//   );
// }

// // Ultra Premium CSS Animations
// const styles = `
// @keyframes toast-enter {
//   0% {
//     transform: translateX(100%) scale(0.8) rotate(5deg);
//     opacity: 0;
//   }
//   60% {
//     transform: translateX(-10%) scale(1.05) rotate(-2deg);
//     opacity: 1;
//   }
//   100% {
//     transform: translateX(0) scale(1) rotate(0deg);
//     opacity: 1;
//   }
// }
// @keyframes toast-exit {
//   0% {
//     transform: translateX(0) scale(1) rotate(0deg);
//     opacity: 1;
//   }
//   100% {
//     transform: translateX(100%) scale(0.8) rotate(-5deg);
//     opacity: 0;
//   }
// }
// @keyframes toast-progress {
//   from { width: 100%; }
//   to { width: 0%; }
// }
// @keyframes icon-bounce {
//   0%, 20%, 53%, 80%, 100% {
//     transform: translate3d(0,0,0);
//   }
//   40%, 43% {
//     transform: translate3d(0, -8px, 0);
//   }
//   70% {
//     transform: translate3d(0, -4px, 0);
//   }
//   90% {
//     transform: translate3d(0, -2px, 0);
//   }
// }
// @keyframes icon-shake {
//   0%, 100% { transform: translateX(0); }
//   25% { transform: translateX(-3px); }
//   75% { transform: translateX(3px); }
// }
// @keyframes fade-in-up {
//   from { 
//     transform: translateY(20px); 
//     opacity: 0; 
//   }
//   to { 
//     transform: translateY(0); 
//     opacity: 1; 
//   }
// }
// @keyframes fade-in-up-delayed {
//   0% { 
//     transform: translateY(20px); 
//     opacity: 0; 
//   }
//   50% { 
//     transform: translateY(20px); 
//     opacity: 0; 
//   }
//   100% { 
//     transform: translateY(0); 
//     opacity: 1; 
//   }
// }
// @keyframes float-smooth {
//   0%, 100% { 
//     transform: translateY(0px) rotate(0deg); 
//   }
//   33% { 
//     transform: translateY(-3px) rotate(0.5deg); 
//   }
//   66% { 
//     transform: translateY(2px) rotate(-0.5deg); 
//   }
// }
// @keyframes gradient-shift {
//   0%, 100% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
// }
// @keyframes success-glow {
//   0%, 100% { 
//     box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); 
//   }
//   50% { 
//     box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); 
//   }
// }
// @keyframes pulse-once {
//   0% { transform: scale(1); }
//   50% { transform: scale(1.05); }
//   100% { transform: scale(1); }
// }
// @keyframes field-glow {
//   0%, 100% { 
//     box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); 
//   }
//   50% { 
//     box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); 
//   }
// }
// @keyframes toggle-on {
//   0% { 
//     box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); 
//   }
//   50% { 
//     box-shadow: 0 0 0 10px rgba(34, 197, 94, 0.3); 
//   }
//   100% { 
//     box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); 
//   }
// }
// @keyframes toggle-off {
//   0% { 
//     box-shadow: 0 0 0 0 rgba(148, 163, 184, 0.7); 
//   }
//   50% { 
//     box-shadow: 0 0 0 10px rgba(148, 163, 184, 0.3); 
//   }
//   100% { 
//     box-shadow: 0 0 0 0 rgba(148, 163, 184, 0); 
//   }
// }
// @keyframes stat-pop-in {
//   0% { 
//     transform: scale(0) rotate(-10deg); 
//     opacity: 0; 
//   }
//   70% { 
//     transform: scale(1.1) rotate(5deg); 
//     opacity: 1; 
//   }
//   100% { 
//     transform: scale(1) rotate(0deg); 
//     opacity: 1; 
//   }
// }
// @keyframes image-reveal {
//   0% { 
//     transform: scale(0.9); 
//     opacity: 0; 
//     filter: blur(10px);
//   }
//   100% { 
//     transform: scale(1); 
//     opacity: 1; 
//     filter: blur(0px);
//   }
// }
// @keyframes text-reveal {
//   0% { 
//     transform: translateY(10px); 
//     opacity: 0; 
//     letter-spacing: -0.5px;
//   }
//   100% { 
//     transform: translateY(0); 
//     opacity: 1; 
//     letter-spacing: normal;
//   }
// }
// @keyframes price-reveal {
//   0% { 
//     transform: scale(0.8); 
//     opacity: 0; 
//   }
//   100% { 
//     transform: scale(1); 
//     opacity: 1; 
//   }
// }
// @keyframes badge-slide-in {
//   0% { 
//     transform: translateY(-20px); 
//     opacity: 0; 
//   }
//   100% { 
//     transform: translateY(0); 
//     opacity: 1; 
//   }
// }
// @keyframes badge-slide-in-delayed {
//   0% { 
//     transform: translateY(-20px); 
//     opacity: 0; 
//   }
//   50% { 
//     transform: translateY(-20px); 
//     opacity: 0; 
//   }
//   100% { 
//     transform: translateY(0); 
//     opacity: 1; 
//   }
// }
// @keyframes celebration {
//   0% { 
//     transform: scale(1); 
//     box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
//   }
//   25% { 
//     transform: scale(1.05) rotate(2deg); 
//     box-shadow: 0 0 0 20px rgba(245, 158, 11, 0.5);
//   }
//   50% { 
//     transform: scale(1.03) rotate(-2deg); 
//     box-shadow: 0 0 0 40px rgba(245, 158, 11, 0.3);
//   }
//   75% { 
//     transform: scale(1.05) rotate(1deg); 
//     box-shadow: 0 0 0 60px rgba(245, 158, 11, 0.1);
//   }
//   100% { 
//     transform: scale(1) rotate(0deg); 
//     box-shadow: 0 0 0 80px rgba(245, 158, 11, 0);
//   }
// }

// /* Animation Classes */
// .animate-toast-enter {
//   animation: toast-enter 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
// }
// .animate-toast-exit {
//   animation: toast-exit 0.6s ease-in-out forwards;
// }
// .animate-toast-progress {
//   animation: toast-progress 5s linear forwards;
// }
// .animate-icon-bounce {
//   animation: icon-bounce 1s ease-in-out;
// }
// .animate-icon-shake {
//   animation: icon-shake 0.5s ease-in-out;
// }
// .animate-fade-in-up {
//   animation: fade-in-up 0.8s ease-out;
// }
// .animate-fade-in-up-delayed {
//   animation: fade-in-up-delayed 1s ease-out;
// }
// .animate-float-smooth {
//   animation: float-smooth 6s ease-in-out infinite;
// }
// .animate-gradient-shift {
//   background-size: 200% 200%;
//   animation: gradient-shift 4s ease infinite;
// }
// .animate-success-glow {
//   animation: success-glow 2s ease-in-out;
// }
// .animate-pulse-once {
//   animation: pulse-once 0.6s ease-in-out;
// }
// .animate-field-glow {
//   animation: field-glow 1s ease-in-out;
// }
// .animate-toggle-on {
//   animation: toggle-on 0.6s ease-in-out;
// }
// .animate-toggle-off {
//   animation: toggle-off 0.6s ease-in-out;
// }
// .animate-stat-pop-in {
//   animation: stat-pop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//   opacity: 0;
// }
// .animate-image-reveal {
//   animation: image-reveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
// }
// .animate-text-reveal {
//   animation: text-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
// }
// .animate-price-reveal {
//   animation: price-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
// }
// .animate-badge-slide-in {
//   animation: badge-slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
// }
// .animate-badge-slide-in-delayed {
//   animation: badge-slide-in-delayed 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
// }
// .animate-celebration {
//   animation: celebration 2s ease-in-out;
// }

// /* Custom Scrollbar */
// .custom-scrollbar::-webkit-scrollbar {
//   width: 4px;
// }
// .custom-scrollbar::-webkit-scrollbar-track {
//   background: rgba(0, 0, 0, 0.05);
//   border-radius: 8px;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb {
//   background: rgba(0, 0, 0, 0.2);
//   border-radius: 8px;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//   background: rgba(0, 0, 0, 0.3);
// }
// .dark .custom-scrollbar::-webkit-scrollbar-track {
//   background: rgba(255, 255, 255, 0.05);
// }
// .dark .custom-scrollbar::-webkit-scrollbar-thumb {
//   background: rgba(255, 255, 255, 0.2);
// }
// .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//   background: rgba(255, 255, 255, 0.3);
// }
// `;

// // Inject styles
// if (typeof document !== 'undefined') {
//   const styleSheet = document.createElement("style");
//   styleSheet.innerText = styles;
//   document.head.appendChild(styleSheet);
// }


















// "use client";

// import { useState, useEffect, useMemo, useRef } from "react";
// import useProductStore from "@/store/useCartStore";
// import { SparklesIcon, ShieldCheckIcon, RocketIcon, ZapIcon } from "lucide-react";

// /* Fit-to-screen canvas - 30% smaller */
// function useFitToScreen(baseW = 1080, baseH = 476) {
//   const [scale, setScale] = useState(1);
//   useEffect(() => {
//     const calc = () => {
//       const s = Math.min((window.innerWidth - 10) / baseW, (window.innerHeight * 0.85 - 10) / baseH);
//       setScale(Math.max(0.75, Math.min(1.05, s)));
//     };
//     calc();
//     window.addEventListener("resize", calc);
//     return () => window.removeEventListener("resize", calc);
//   }, [baseW, baseH]);
//   return { scale, baseW, baseH };
// }

// /* Enhanced Premium Toast */
// const usePremiumToast = () => {
//   const [toasts, setToasts] = useState([]);
//   const addToast = (message, type = "success") => {
//     const id = Date.now() + Math.random();
//     setToasts((p) => [...p, { id, message, type }]);
//     setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4200);
//   };
//   const ToastContainer = () => (
//     <div className="fixed top-6 right-6 z-[999] space-y-4 min-w-[380px]">
//       {toasts.map((t) => (
//         <div
//           key={t.id}
//           className={`relative rounded-2xl p-5 text-base shadow-2xl border-2 backdrop-blur-sm ${
//             t.type === "success"
//               ? "bg-gradient-to-br from-white to-emerald-50 border-emerald-200 text-emerald-900 dark:from-slate-900 dark:to-emerald-900/20 dark:border-emerald-700 dark:text-emerald-100"
//               : "bg-gradient-to-br from-white to-rose-50 border-rose-200 text-rose-900 dark:from-slate-900 dark:to-rose-900/20 dark:border-rose-700 dark:text-rose-100"
//           }`}
//         >
//           <div className="flex items-center gap-4">
//             <div className={`h-12 w-12 rounded-2xl grid place-items-center shadow-lg ${
//               t.type === "success" 
//                 ? "bg-gradient-to-br from-emerald-500 to-green-500" 
//                 : "bg-gradient-to-br from-rose-500 to-pink-500"
//             }`}>
//               <ShieldCheckIcon className="h-6 w-6 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-bold text-lg">{t.type === "success" ? "Success!" : "Attention!"}</p>
//               <p className="text-sm opacity-90 mt-1">{t.message}</p>
//             </div>
//           </div>
//           <div className="h-1.5 mt-4 rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
//             <div className={`h-full animate-progress rounded-full ${
//               t.type === "success" 
//                 ? "bg-gradient-to-r from-emerald-500 to-green-500" 
//                 : "bg-gradient-to-r from-rose-500 to-pink-500"
//             }`} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
//   return { addToast, ToastContainer };
// };

// /* Enhanced Theme with smooth transitions */
// function useTheme() {
//   const [theme, setTheme] = useState("light");
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => {
//     setMounted(true);
//     const saved = localStorage.getItem("theme");
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const initial = saved || (prefersDark ? "dark" : "light");
//     setTheme(initial);
//     document.documentElement.classList.toggle("dark", initial === "dark");
//   }, []);
//   const toggle = () => {
//     const next = theme === "dark" ? "light" : "dark";
//     setTheme(next);
//     localStorage.setItem("theme", next);
//     document.documentElement.classList.toggle("dark", next === "dark");
//   };
//   return { theme, toggle, mounted };
// }

// /* Page */
// export default function AdminProducts() {
//   const { theme, toggle, mounted } = useTheme();
//   const { addToast, ToastContainer } = usePremiumToast();
//   const { scale, baseW, baseH } = useFitToScreen(1080, 476);

//   const saveBtnRef = useRef(null);
//   const [deleteId, setDeleteId] = useState("");
//   const [isHovering, setIsHovering] = useState(false);

//   const setProductField = useProductStore((s) => s.setProductField);
//   const setRating = useProductStore((s) => s.setRating);
//   const resetProduct = useProductStore((s) => s.resetProduct);
//   const productstate = useProductStore((s) => s.productstate);

//   const [form, setForm] = useState({
//     id: "",
//     title: "",
//     price: "",
//     originalPrice: "",
//     category: "electronics",
//     ratingRate: "",
//     ratingCount: "",
//     image: "",
//     inStock: true,
//   });

//   useEffect(() => {
//     if (productstate) {
//       setForm({
//         id: productstate.id || "",
//         title: productstate.title || "",
//         price: productstate.price || "",
//         originalPrice: productstate.originalPrice || "",
//         category: productstate.category || "electronics",
//         ratingRate: productstate.rating?.rate || "",
//         ratingCount: productstate.rating?.count || "",
//         image: productstate.image || "",
//         inStock: productstate.inStock !== false,
//       });
//     }
//   }, [productstate]);

//   const onChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
//     if (name === "ratingRate") setRating(value, form.ratingCount);
//     else if (name === "ratingCount") setRating(form.ratingRate, value);
//     else setProductField(name, type === "checkbox" ? checked : value);
//   };

//   const cast = (v, def = 0) => {
//     if (v === "" || v === null || v === undefined) return def;
//     const n = Number(v);
//     return Number.isFinite(n) ? n : def;
//   };

//   const live = useMemo(() => {
//     const price = cast(form.price);
//     const original = form.originalPrice === "" ? price : cast(form.originalPrice);
//     const discountPercent = original > 0 ? Math.max(0, ((original - price) / original) * 100) : 0;
//     return {
//       id: cast(form.id),
//       title: (form.title || "").trim() || "Untitled product",
//       price,
//       originalPrice: original,
//       discountPercent: Math.round(discountPercent * 100) / 100,
//       category: (form.category || "").trim() || "uncategorized",
//       rating: { rate: cast(form.ratingRate, 0), count: cast(form.ratingCount, 0) },
//       image: (form.image || "").trim(),
//       inStock: !!form.inStock,
//     };
//   }, [form]);

//   const validate = (p) => {
//     if (!Number.isFinite(p.id) || p.id <= 0) return "Valid ID required";
//     if (!p.title || p.title.trim() === "") return "Title required";
//     if (p.price <= 0) return "Price must be > 0";
//     if (p.originalPrice < p.price) return "Original price must be >= price";
//     if (p.rating.rate < 0 || p.rating.rate > 5) return "Rating must be 0–5";
//     if (p.rating.count < 0) return "Rating count cannot be negative";
//     return null;
//   };

//   const addPRODUCT = async (e) => {
//     e?.preventDefault();
//     const err = validate(live);
//     if (err) return addToast(err, "error");
//     try {
//       const res = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(live),
//       });
//       if (!res.ok) throw new Error("Failed to add product");
//       addToast("Product added successfully!", "success");
//       resetProduct();
//       setForm({
//         id: "",
//         title: "",
//         price: "",
//         originalPrice: "",
//         category: "electronics",
//         ratingRate: "",
//         ratingCount: "",
//         image: "",
//         inStock: true,
//       });
//     } catch (e2) {
//       addToast(e2.message, "error");
//     }
//   };

//   const remProduct = async () => {
//     if (!deleteId) return addToast("Enter product ID to delete", "error");
//     try {
//       const res = await fetch("/api/products", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: deleteId }),
//       });
//       if (!res.ok) throw new Error("Failed to delete product");
//       addToast("Product deleted successfully!", "success");
//       setDeleteId("");
//     } catch (e2) {
//       addToast(e2.message, "error");
//     }
//   };

//   useEffect(() => {
//     const onKey = (e) => {
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
//         e.preventDefault();
//         saveBtnRef.current?.click();
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   const resetForm = () =>
//     (resetProduct(),
//     setForm({
//       id: "",
//       title: "",
//       price: "",
//       originalPrice: "",
//       category: "electronics",
//       ratingRate: "",
//       ratingCount: "",
//       image: "",
//       inStock: true,
//     }));

//   const priceFmt = (n) =>
//     new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
//       Number.isFinite(+n) ? +n : 0
//     );

//   if (!mounted) {
//     return (
//       <div className="h-screen grid place-items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4" />
//           <p className="text-slate-600 dark:text-slate-400 font-medium">Loading Premium Interface...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen  w-screen overflow-hidden relative pt-[65px] pb-2.5 px-2.5" 
//          onMouseEnter={() => setIsHovering(true)}
//          onMouseLeave={() => setIsHovering(false)}>
      
//       {/* Enhanced Premium background - Reduced blur */}
//       <div className="absolute inset-2.5 -z-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 rounded-3xl" />
//       <div className="premium-mesh absolute inset-2.5 -z-10 rounded-3xl" />
//       <ParticleBackground isActive={isHovering} />
//       <ToastContainer />

//       {/* Main Container with reduced blur and enhanced clarity */}
//       <div
//         style={{ width: baseW, height: baseH, transform: `scale(${scale})`, transformOrigin: "top center" }}
//         className="mx-auto rounded-3xl border border-white/40 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-2xl overflow-hidden animate-zen-float"
//       >
//         {/* Enhanced Header */}
//         <div className="h-[55px] px-6 flex items-center justify-between border-b border-white/60 dark:border-slate-700/80 bg-gradient-to-r from-white to-white/95 dark:from-slate-900 dark:to-slate-800/95 backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <div className="h-9 w-9 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 grid place-items-center shadow-lg ring-2 ring-white/50 animate-float">
//               <RocketIcon className="h-4 w-4 text-white" />
//             </div>
//             <div className="leading-tight">
//               <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">Product Manager Pro</h1>
//               <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Create, preview & publish</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-black/5 dark:bg-white/5 px-2.5 py-1 backdrop-blur-sm border border-white/40 dark:border-slate-600/60">
//               <SparklesIcon className="h-3 w-3 text-amber-500" />
//               <kbd className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Ctrl+S</kbd>
//             </div>
//             <button
//               onClick={toggle}
//               className="h-8 w-8 rounded-2xl bg-white/90 dark:bg-slate-800/90 grid place-items-center hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/60 dark:border-slate-600/60 shadow-lg hover:shadow-xl"
//               aria-label="Toggle theme"
//             >
//               {theme === "dark" ? <SunIcon /> : <MoonIcon />}
//             </button>
//           </div>
//         </div>

//         {/* Main Content - Enhanced clarity */}
//         <div className="h-[calc(100%-55px)] grid grid-cols-[0.55fr_0.45fr] gap-4 p-4">
//           {/* Enhanced Form - Reduced blur */}
//           <form
//             onSubmit={addPRODUCT}
//             className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 p-4 shadow-xl overflow-hidden group backdrop-blur-sm"
//           >
//             {/* Enhanced gradient border */}
//             <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
//             <div className="relative z-10">
//               <div className="mb-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 grid place-items-center shadow-lg">
//                     <ZapIcon className="h-3.5 w-3.5 text-white" />
//                   </div>
//                   <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add Product</h2>
//                 </div>
//                 <AutoBadge price={form.price} original={form.originalPrice} />
//               </div>

//               <div className="grid grid-cols-12 gap-2.5">
//                 <Field label="ID" name="id" type="number" value={form.id} onChange={onChange} className="col-span-3" />
//                 <Field label="Title" name="title" value={form.title} onChange={onChange} className="col-span-9" />

//                 <Field label="Price" name="price" type="number" step="0.01" value={form.price} onChange={onChange} className="col-span-4" />
//                 <Field
//                   label="Original"
//                   name="originalPrice"
//                   type="number"
//                   step="0.01"
//                   value={form.originalPrice}
//                   onChange={onChange}
//                   className="col-span-4"
//                 />
//                 <Field label="Category" name="category" value={form.category} onChange={onChange} className="col-span-4" />

//                 <Field label="Rating" name="ratingRate" type="number" step="0.1" value={form.ratingRate} onChange={onChange} className="col-span-4" />
//                 <Field label="Reviews" name="ratingCount" type="number" value={form.ratingCount} onChange={onChange} className="col-span-4" />
//                 <Field label="Image URL" name="image" value={form.image} onChange={onChange} className="col-span-12" />
//               </div>

//               <div className="mt-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Toggle label="In Stock" name="inStock" checked={form.inStock} onChange={onChange} />
//                   <div className="h-4 w-px bg-slate-300/60 dark:bg-slate-600/60" />
//                   <input
//                     placeholder="ID to delete"
//                     className="h-8 w-32 rounded-xl border border-slate-300 bg-white px-2 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all duration-300"
//                     value={deleteId}
//                     onChange={(e) => setDeleteId(e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     onClick={remProduct}
//                     className="h-8 px-3 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
//                   >
//                     Delete
//                   </button>
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="h-8 px-3 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
//                   >
//                     Reset
//                   </button>
//                   <button
//                     ref={saveBtnRef}
//                     type="submit"
//                     className="relative h-8 px-4 text-xs font-semibold rounded-xl text-white shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden group/btn"
//                   >
//                     <span className="relative z-10 inline-flex items-center gap-1">
//                       <SaveIcon />
//                       Save
//                     </span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>

//           {/* Enhanced Product Preview with Square Image - No rotation */}
//           <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 p-4 shadow-xl overflow-hidden backdrop-blur-sm">
//             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
//             <div className="relative z-10">
//               <div className="mb-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 grid place-items-center shadow-lg">
//                     <EyeIcon />
//                   </div>
//                   <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Preview</h3>
//                 </div>
//                 <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-700 dark:text-amber-300 font-semibold border border-amber-400/30">
//                   {live.discountPercent}% OFF
//                 </span>
//               </div>

//               {/* Square Image Preview Card - No rotation animation */}
//               <div className="w-full max-w-[280px] mx-auto">
//                 <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "1" }}>
//                   <SquarePreviewCard p={live} priceFmt={priceFmt} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Particle Background Component */
// function ParticleBackground({ isActive }) {
//   return (
//     <div className="absolute inset-2.5 -z-10 overflow-hidden rounded-3xl">
//       <div className={`absolute inset-0 transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
//         {/* Subtle particles */}
//         <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400/20 rounded-full animate-particle-float-1" />
//         <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/25 rounded-full animate-particle-float-2" />
//         <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/20 rounded-full animate-particle-float-3" />
//       </div>
//     </div>
//   );
// }

// /* Enhanced UI Atoms */
// function Field({ label, name, value, onChange, type = "text", className = "", ...rest }) {
//   return (
//     <label className={`block ${className}`}>
//       <div className="mb-1 flex items-center justify-between">
//         <span className="text-[11px] font-semibold tracking-wide text-slate-700 dark:text-slate-200">{label}</span>
//       </div>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full h-8 rounded-xl border border-slate-300 bg-white px-2.5 text-[13px] text-slate-900 shadow-sm outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500"
//         {...rest}
//       />
//     </label>
//   );
// }

// function Toggle({ label, name, checked, onChange }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span className="text-[11px] font-semibold tracking-wide text-slate-700 dark:text-slate-200">{label}</span>
//       <button
//         type="button"
//         role="switch"
//         aria-checked={checked}
//         onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
//         className={`relative h-5 w-9 rounded-full transition-all duration-500 shadow-inner ${
//           checked 
//             ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg" 
//             : "bg-slate-400 dark:bg-slate-600"
//         }`}
//       >
//         <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-lg transition-all duration-500 ${
//           checked ? "translate-x-4" : ""
//         }`} />
//       </button>
//     </div>
//   );
// }

// function AutoBadge({ price, original }) {
//   const p = Number(price || 0);
//   const o = Number(original || 0);
//   const pct = o > 0 ? Math.max(0, ((o - p) / o) * 100) : 0;
//   return (
//     <span className="text-[10px] font-bold bg-gradient-to-r from-indigo-500/15 to-purple-600/15 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
//       Auto · {Math.round(pct * 10) / 10}%
//     </span>
//   );
// }

// /* SQUARE Image Preview Card - Enhanced clarity */
// function SquarePreviewCard({ p, priceFmt }) {
//   const hasDiscount = (p.originalPrice || 0) > (p.price || 0);
//   const pct = Math.round((p.discountPercent || 0) * 10) / 10;

//   return (
//     <article className="relative h-full w-full bg-white dark:bg-slate-900 grid grid-rows-[55%_45%] overflow-hidden group/card border border-slate-200 dark:border-slate-700 rounded-2xl">
//       {/* Square Image Zone */}
//       <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
//         {p.image ? (
//           <img 
//             src={p.image} 
//             alt={p.title} 
//             className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105" 
//           />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center text-slate-400">
//             <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//           </div>
//         )}
//         <span className={`absolute left-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-black text-white shadow-lg ${
//           p.inStock 
//             ? "bg-gradient-to-r from-emerald-500 to-green-500" 
//             : "bg-gradient-to-r from-rose-500 to-pink-500"
//         }`}>
//           {p.inStock ? "In Stock" : "Out"}
//         </span>
//         {hasDiscount && pct > 0 && (
//           <span className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-black text-white shadow-lg">
//             -{pct}%
//           </span>
//         )}
//       </div>

//       {/* Info Zone */}
//       <div className="p-3 grid gap-1.5 bg-white dark:bg-slate-900">
//         <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[13px] leading-tight line-clamp-2">
//           {p.title}
//         </h3>
//         <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
//           {p.category} · {p.rating?.rate || 0} ⭐ ({p.rating?.count || 0})
//         </p>
//         <div className="flex items-end justify-between mt-0.5">
//           <div className="flex items-center gap-1.5">
//             <span className="text-lg font-black text-slate-900 dark:text-slate-100">
//               {priceFmt(+p.price || 0)}
//             </span>
//             {hasDiscount && (
//               <span className="text-[12px] text-slate-500 line-through dark:text-slate-400 font-semibold">
//                 {priceFmt(+p.originalPrice || 0)}
//               </span>
//             )}
//           </div>
//           <button
//             type="button"
//             className="h-7 px-2.5 text-[11px] font-bold rounded-xl text-white shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300"
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }

// /* Enhanced Icons */
// function SaveIcon() {
//   return (
//     <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//   );
// }
// function MoonIcon() {
//   return (
//     <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//     </svg>
//   );
// }
// function SunIcon() {
//   return (
//     <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//     </svg>
//   );
// }
// function EyeIcon() {
//   return (
//     <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//     </svg>
//   );
// }

// /* EXTREMELY PREMIUM ANIMATIONS & PROFESSIONAL STYLES */
// const styles = `
// /* Enhanced Premium Mesh - Reduced blur */
// .premium-mesh::before,
// .premium-mesh::after {
//   content: "";
//   position: absolute;
//   inset: -20%;
//   background:
//     radial-gradient(35% 45% at 20% 30%, rgba(99,102,241,0.15), transparent 60%),
//     radial-gradient(30% 40% at 80% 25%, rgba(236,72,153,0.15), transparent 60%),
//     radial-gradient(45% 55% at 40% 80%, rgba(20,184,166,0.15), transparent 60%),
//     radial-gradient(40% 50% at 70% 70%, rgba(245,158,11,0.1), transparent 60%);
//   filter: saturate(120%);
//   animation: premium-mesh-move 28s ease-in-out infinite alternate;
// }
// .premium-mesh::after {
//   mix-blend-mode: overlay;
//   filter: blur(25px) saturate(130%) hue-rotate(25deg);
//   animation: premium-mesh-move-2 34s ease-in-out infinite alternate-reverse;
// }
// @keyframes premium-mesh-move {
//   0% { transform: translate3d(-3%, -2%, 0) scale(1) rotate(0deg); }
//   100% { transform: translate3d(3%, 2%, 0) scale(1.05) rotate(1deg); }
// }
// @keyframes premium-mesh-move-2 {
//   0% { transform: translate3d(2%, -3%, 0) scale(1.03) rotate(1deg); }
//   100% { transform: translate3d(-2%, 3%, 0) scale(1.08) rotate(-1deg); }
// }

// /* EXTREME PREMIUM ANIMATIONS - Enhanced clarity */
// @keyframes zen-float {
//   0%, 100% { 
//     transform: translateY(0px) scale(1); 
//     box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
//   }
//   50% { 
//     transform: translateY(-5px) scale(1.002);
//     box-shadow: 0 35px 60px -10px rgba(99, 102, 241, 0.2);
//   }
// }
// .animate-zen-float { 
//   animation: zen-float 6s ease-in-out infinite; 
// }

// /* Particle Animations - Subtle */
// @keyframes particle-float-1 {
//   0%, 100% { transform: translate(0, 0); opacity: 0.2; }
//   50% { transform: translate(10px, -8px); opacity: 0.4; }
// }
// @keyframes particle-float-2 {
//   0%, 100% { transform: translate(0, 0); opacity: 0.25; }
//   50% { transform: translate(-8px, 12px); opacity: 0.45; }
// }
// @keyframes particle-float-3 {
//   0%, 100% { transform: translate(0, 0); opacity: 0.2; }
//   50% { transform: translate(12px, 6px); opacity: 0.4; }
// }

// .animate-particle-float-1 { animation: particle-float-1 8s ease-in-out infinite; }
// .animate-particle-float-2 { animation: particle-float-2 10s ease-in-out infinite; }
// .animate-particle-float-3 { animation: particle-float-3 12s ease-in-out infinite; }

// /* Enhanced Base Animations */
// @keyframes float {
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-4px); }
// }
// .animate-float { animation: float 4s ease-in-out infinite; }

// /* Enhanced Progress & Toast */
// @keyframes progress { 
//   0% { width: 100%; } 
//   100% { width: 0%; } 
// }
// .animate-progress { animation: progress 4.2s linear forwards; }

// @keyframes toastin { 
//   0% { transform: translateX(100px) scale(0.9); opacity: 0; } 
//   100% { transform: translateX(0) scale(1); opacity: 1; } 
// }
// .animate-toast-in { animation: toastin 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }

// /* Line clamp utility */
// .line-clamp-2 {
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }

// /* Enhanced focus states for better accessibility */
// input:focus, button:focus {
//   outline: 2px solid transparent;
//   outline-offset: 2px;
// }

// /* Smooth transitions */
// * {
//   transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
// }
// `;

// if (typeof document !== "undefined") {
//   const styleSheet = document.createElement("style");
//   styleSheet.innerText = styles;
//   document.head.appendChild(styleSheet);
// }













































"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import useProductStore from "@/store/useCartStore";
import { SparklesIcon, ShieldCheckIcon, RocketIcon, ZapIcon } from "lucide-react";

/* Fit-to-screen canvas - 30% smaller */
function useFitToScreen(baseW = 1080, baseH = 476) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const s = Math.min((window.innerWidth - 10) / baseW, (window.innerHeight * 0.85 - 10) / baseH);
      setScale(Math.max(0.75, Math.min(1.05, s)));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [baseW, baseH]);
  return { scale, baseW, baseH };
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
    <div className="fixed top-6 right-6 z-[999] space-y-4 min-w-[380px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`relative rounded-2xl p-5 text-base shadow-2xl border-2 backdrop-blur-sm ${
            t.type === "success"
              ? "bg-gradient-to-br from-white to-emerald-50 border-emerald-200 text-emerald-900 dark:from-slate-900 dark:to-emerald-900/20 dark:border-emerald-700 dark:text-emerald-100"
              : "bg-gradient-to-br from-white to-rose-50 border-rose-200 text-rose-900 dark:from-slate-900 dark:to-rose-900/20 dark:border-rose-700 dark:text-rose-100"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-2xl grid place-items-center shadow-lg ${
              t.type === "success" 
                ? "bg-gradient-to-br from-emerald-500 to-green-500" 
                : "bg-gradient-to-br from-rose-500 to-pink-500"
            }`}>
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg">{t.type === "success" ? "Success!" : "Attention!"}</p>
              <p className="text-sm opacity-90 mt-1">{t.message}</p>
            </div>
          </div>
          <div className="h-1.5 mt-4 rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
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

/* ENHANCED SQUARE Image Preview Card with 6:4 aspect ratio */
function EnhancedSquarePreviewCard({ p, priceFmt }) {
  const hasDiscount = (p.originalPrice || 0) > (p.price || 0);
  const pct = Math.round((p.discountPercent || 0) * 10) / 10;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className="relative h-full w-full bg-white dark:bg-slate-900 overflow-hidden group/card border border-slate-200 dark:border-slate-700 rounded-2xl transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Zone with 6:4 aspect ratio */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
        <div className="aspect-[6/4] relative"> {/* 6:4 aspect ratio */}
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
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Enhanced Badges */}
        <span className={`absolute left-3 top-3 rounded-full px-2 py-1 text-[10px] font-bold text-white shadow-lg transition-all duration-300 ${
          p.inStock 
            ? "bg-gradient-to-r from-emerald-500 to-green-500" 
            : "bg-gradient-to-r from-rose-500 to-pink-500"
        } ${isHovered ? 'scale-105' : ''}`}>
          {p.inStock ? "In Stock" : "Out of Stock"}
        </span>
        
        {hasDiscount && pct > 0 && (
          <span className={`absolute right-3 top-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg transition-all duration-300 ${
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

      {/* Enhanced Info Zone */}
      <div className="p-4 grid gap-2 bg-white dark:bg-slate-900">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[14px] leading-tight line-clamp-2">
          {p.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            {p.category}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
            <span>⭐ {p.rating?.rate || 0}</span>
            <span>({p.rating?.count || 0})</span>
          </div>
        </div>
        <div className="flex items-end justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">
              {priceFmt(+p.price || 0)}
            </span>
            {hasDiscount && (
              <span className="text-[13px] text-slate-500 line-through dark:text-slate-400 font-semibold">
                {priceFmt(+p.originalPrice || 0)}
              </span>
            )}
          </div>
          <button
            type="button"
            className={`h-8 px-3 text-[11px] font-bold rounded-lg text-white shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ${
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

/* Enhanced UI Atoms */
function Field({ label, name, value, onChange, type = "text", className = "", ...rest }) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-slate-700 dark:text-slate-200">{label}</span>
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-8 rounded-xl border border-slate-300 bg-white px-2.5 text-[13px] text-slate-900 shadow-sm outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500"
        {...rest}
      />
    </label>
  );
}

function Toggle({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-semibold tracking-wide text-slate-700 dark:text-slate-200">{label}</span>
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

function AutoBadge({ price, original }) {
  const p = Number(price || 0);
  const o = Number(original || 0);
  const pct = o > 0 ? Math.max(0, ((o - p) / o) * 100) : 0;
  return (
    <span className="text-[10px] font-bold bg-gradient-to-r from-indigo-500/15 to-purple-600/15 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
      Auto · {Math.round(pct * 10) / 10}%
    </span>
  );
}

/* Particle Background Component */
function ParticleBackground({ isActive }) {
  return (
    <div className="absolute inset-2.5 -z-10 overflow-hidden rounded-3xl">
      <div className={`absolute inset-0 transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
        {/* Subtle particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400/20 rounded-full animate-particle-float-1" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/25 rounded-full animate-particle-float-2" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/20 rounded-full animate-particle-float-3" />
      </div>
    </div>
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

/* Main Component */
export default function AdminProducts() {
  const { theme, toggle, mounted } = useTheme();
  const { addToast, ToastContainer } = usePremiumToast();
  const { scale, baseW, baseH } = useFitToScreen(1080, 476);

  const saveBtnRef = useRef(null);
  const [deleteId, setDeleteId] = useState("");
  const [isHovering, setIsHovering] = useState(false);

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
    <div className="h-screen  w-screen overflow-hidden relative pt-[65px] pb-2.5 px-2.5" 
         onMouseEnter={() => setIsHovering(true)}
         onMouseLeave={() => setIsHovering(false)}>
      
      {/* Enhanced Premium background - Reduced blur */}
      <div className="absolute inset-2.5 -z-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 rounded-3xl" />
      <div className="premium-mesh absolute inset-2.5 -z-10 rounded-3xl" />
      <ParticleBackground isActive={isHovering} />
      <ToastContainer />

      {/* Main Container with reduced blur and enhanced clarity */}
      <div
        style={{ width: baseW, height: baseH, transform: `scale(${scale})`, transformOrigin: "top center" }}
        className="mx-auto rounded-3xl border border-white/40 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-2xl overflow-hidden animate-zen-float"
      >
        {/* Enhanced Header */}
        <div className="h-[55px] px-6 flex items-center justify-between border-b border-white/60 dark:border-slate-700/80 bg-gradient-to-r from-white to-white/95 dark:from-slate-900 dark:to-slate-800/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 grid place-items-center shadow-lg ring-2 ring-white/50 animate-float">
              <RocketIcon className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">Product Manager Pro</h1>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Create, preview & publish</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-black/5 dark:bg-white/5 px-2.5 py-1 backdrop-blur-sm border border-white/40 dark:border-slate-600/60">
              <SparklesIcon className="h-3 w-3 text-amber-500" />
              <kbd className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Ctrl+S</kbd>
            </div>
            <button
              onClick={toggle}
              className="h-8 w-8 rounded-2xl bg-white/90 dark:bg-slate-800/90 grid place-items-center hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/60 dark:border-slate-600/60 shadow-lg hover:shadow-xl"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* Main Content - Enhanced clarity */}
        <div className="h-[calc(100%-55px)] grid grid-cols-[0.55fr_0.45fr] gap-4 p-4">
          {/* Enhanced Form - Reduced blur */}
          <form
            onSubmit={addPRODUCT}
            className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 p-4 shadow-xl overflow-hidden group backdrop-blur-sm"
          >
            {/* Enhanced gradient border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            <div className="relative z-10">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 grid place-items-center shadow-lg">
                    <ZapIcon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Add Product</h2>
                </div>
                <AutoBadge price={form.price} original={form.originalPrice} />
              </div>

              <div className="grid grid-cols-12 gap-2.5">
                <Field label="ID" name="id" type="number" value={form.id} onChange={onChange} className="col-span-3" />
                <Field label="Title" name="title" value={form.title} onChange={onChange} className="col-span-9" />

                <Field label="Price" name="price" type="number" step="0.01" value={form.price} onChange={onChange} className="col-span-4" />
                <Field
                  label="Original"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={onChange}
                  className="col-span-4"
                />
                <Field label="Category" name="category" value={form.category} onChange={onChange} className="col-span-4" />

                <Field label="Rating" name="ratingRate" type="number" step="0.1" value={form.ratingRate} onChange={onChange} className="col-span-4" />
                <Field label="Reviews" name="ratingCount" type="number" value={form.ratingCount} onChange={onChange} className="col-span-4" />
                <Field label="Image URL" name="image" value={form.image} onChange={onChange} className="col-span-12" />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Toggle label="In Stock" name="inStock" checked={form.inStock} onChange={onChange} />
                  <div className="h-4 w-px bg-slate-300/60 dark:bg-slate-600/60" />
                  <input
                    placeholder="ID to delete"
                    className="h-8 w-32 rounded-xl border border-slate-300 bg-white px-2 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all duration-300"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={remProduct}
                    className="h-8 px-3 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-8 px-3 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Reset
                  </button>
                  <button
                    ref={saveBtnRef}
                    type="submit"
                    className="relative h-8 px-4 text-xs font-semibold rounded-xl text-white shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden group/btn"
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

          {/* Enhanced Product Preview with 6:4 Image */}
          <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 p-4 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
            <div className="relative z-10">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 grid place-items-center shadow-lg">
                    <EyeIcon />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Preview</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-700 dark:text-amber-300 font-semibold border border-amber-400/30">
                  {live.discountPercent}% OFF
                </span>
              </div>

              {/* Enhanced 6:4 Image Preview Card */}
              <div className="w-full max-w-[300px] mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <EnhancedSquarePreviewCard p={live} priceFmt={priceFmt} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ENHANCED ANIMATIONS & STYLES */
const styles = `
/* Enhanced Premium Mesh */
.premium-mesh::before,
.premium-mesh::after {
  content: "";
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(35% 45% at 20% 30%, rgba(99,102,241,0.15), transparent 60%),
    radial-gradient(30% 40% at 80% 25%, rgba(236,72,153,0.15), transparent 60%),
    radial-gradient(45% 55% at 40% 80%, rgba(20,184,166,0.15), transparent 60%),
    radial-gradient(40% 50% at 70% 70%, rgba(245,158,11,0.1), transparent 60%);
  filter: saturate(120%);
  animation: premium-mesh-move 28s ease-in-out infinite alternate;
}
.premium-mesh::after {
  mix-blend-mode: overlay;
  filter: blur(25px) saturate(130%) hue-rotate(25deg);
  animation: premium-mesh-move-2 34s ease-in-out infinite alternate-reverse;
}
@keyframes premium-mesh-move {
  0% { transform: translate3d(-3%, -2%, 0) scale(1) rotate(0deg); }
  100% { transform: translate3d(3%, 2%, 0) scale(1.05) rotate(1deg); }
}
@keyframes premium-mesh-move-2 {
  0% { transform: translate3d(2%, -3%, 0) scale(1.03) rotate(1deg); }
  100% { transform: translate3d(-2%, 3%, 0) scale(1.08) rotate(-1deg); }
}

/* Enhanced Animations */
@keyframes zen-float {
  0%, 100% { 
    transform: translateY(0px) scale(1); 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }
  50% { 
    transform: translateY(-5px) scale(1.002);
    box-shadow: 0 35px 60px -10px rgba(99, 102, 241, 0.2);
  }
}
.animate-zen-float { 
  animation: zen-float 6s ease-in-out infinite; 
}

/* Particle Animations */
@keyframes particle-float-1 {
  0%, 100% { transform: translate(0, 0); opacity: 0.2; }
  50% { transform: translate(10px, -8px); opacity: 0.4; }
}
@keyframes particle-float-2 {
  0%, 100% { transform: translate(0, 0); opacity: 0.25; }
  50% { transform: translate(-8px, 12px); opacity: 0.45; }
}
@keyframes particle-float-3 {
  0%, 100% { transform: translate(0, 0); opacity: 0.2; }
  50% { transform: translate(12px, 6px); opacity: 0.4; }
}

.animate-particle-float-1 { animation: particle-float-1 8s ease-in-out infinite; }
.animate-particle-float-2 { animation: particle-float-2 10s ease-in-out infinite; }
.animate-particle-float-3 { animation: particle-float-3 12s ease-in-out infinite; }

/* Base Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}
.animate-float { animation: float 4s ease-in-out infinite; }

/* Progress & Toast */
@keyframes progress { 
  0% { width: 100%; } 
  100% { width: 0%; } 
}
.animate-progress { animation: progress 4.2s linear forwards; }

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced focus states */
input:focus, button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
}
`;

// Inject styles on component mount
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}



























































