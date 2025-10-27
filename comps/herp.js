"use client";

import { useRef, useEffect, useLayoutEffect, forwardRef } from "react";
import { gsap } from "gsap";
import Lenis from "@studio-freight/lenis";
import { useCartStore } from "@/store/useCartStore";

/* --------------------------- PAGE: ONLY CAROUSEL --------------------------- */
export default function Page() {
  const lenisRef = useRef(null);
  const rafId = useRef(0);

  useEffect(() => {
    if (lenisRef.current) return;
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    lenisRef.current = lenis;
    const raf = (t) => { lenis.raf(t); rafId.current = requestAnimationFrame(raf); };
    rafId.current = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId.current); lenis.destroy(); lenisRef.current = null; };
  }, []);

  return (
    <main style={{ background: "#0b0d12", color: "#e9eef5" }}>
      <HeroCarousel lenisRef={lenisRef} />
      <section aria-hidden style={{ height: "12vh" }} />
      <style jsx global>{`
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        html { scroll-behavior: auto; }
        body, main { overflow: visible; }
      `}</style>
    </main>
  );
}

/* --------------------------- HERO CAROUSEL (PRO) --------------------------- */
function HeroCarousel({ lenisRef }) {
  const hostRef = useRef(null);
  const cardRefs = useRef([]);
  const setCardRef = (el, i) => (cardRefs.current[i] = el);
  const loopRef = useRef(null);
  const unbindTiltRef = useRef(() => {});
  const ioRef = useRef(null);

  const CFG = {
    gapX: 34,
    sideScale: 0.74,
    blurPx: 6,
    sideRot: 10,   // ° Y-tilt for side cards
    stepDur: 0.7,
    hold: 1.3,     // extra settle time per step
    ease: "power3.inOut",
  };

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length < 3) return;

    // background glow behind center
    const centerGlow = document.createElement("div");
    centerGlow.setAttribute("aria-hidden", "true");
    Object.assign(centerGlow.style, {
      position: "absolute",
      inset: "auto 0 10%",
      margin: "0 auto",
      width: "42rem",
      height: "42rem",
      borderRadius: "999px",
      filter: "blur(60px)",
      background: "radial-gradient(closest-side, rgba(59,130,246,0.35), rgba(59,130,246,0) 60%)",
      pointerEvents: "none",
      transform: "translateZ(0)",
      opacity: "0",
    });
    hostRef.current?.appendChild(centerGlow);

    const { gapX, sideScale, blurPx, sideRot, stepDur, ease, hold } = CFG;
    let active = 0;

    const roles = () => {
      const n = cards.length;
      return {
        offLeft:  (active - 2 + n) % n,
        left:     (active - 1 + n) % n,
        center:    active % n,
        right:    (active + 1) % n,
        offRight: (active + 2) % n,
      };
    };

    const reset = () => {
      cards.forEach((c) => {
        gsap.set(c, {
          xPercent: 0,
          yPercent: 0,
          rotateY: 0,
          scale: 0.62,
          zIndex: 1,
          autoAlpha: 0,
          filter: "blur(0px)",
          pointerEvents: "none",
          willChange: "transform, filter, opacity",
        });
        const inner = c.querySelector('[data-tilt-inner="1"]');
        if (inner) {
          inner.style.transform = "translateZ(0) rotateY(0deg) rotateX(0deg)";
          inner.style.boxShadow = "none";
        }
      });
      gsap.set(centerGlow, { opacity: 0, scale: 0.9 });
    };

    const place = () => {
      reset();
      const { offLeft, left, center, right, offRight } = roles();

      gsap.set(cards[offLeft],  { xPercent: -gapX, scale: sideScale, rotateY: -sideRot, zIndex: 2, autoAlpha: 0, filter: `blur(${blurPx}px)` });
      gsap.set(cards[left],     { xPercent: -gapX, scale: sideScale, rotateY: -sideRot, zIndex: 5, autoAlpha: 1, filter: `blur(${blurPx}px)` });
      gsap.set(cards[center],   { xPercent: 0,     scale: 1,         rotateY: 0,        zIndex: 10, autoAlpha: 1, filter: "blur(0px)", pointerEvents: "auto" });
      gsap.set(cards[right],    { xPercent: gapX,  scale: sideScale, rotateY:  sideRot, zIndex: 5, autoAlpha: 1, filter: `blur(${blurPx}px)` });
      gsap.set(cards[offRight], { xPercent: gapX,  scale: sideScale, rotateY:  sideRot, zIndex: 2, autoAlpha: 0, filter: `blur(${blurPx}px)` });

      unbindTiltRef.current();
      unbindTiltRef.current = bindTilt(cards[center]); // parallax tilt only on center

      // subtle ambient bob on center
      if (!prefersReduced) {
        gsap.to(cards[center], { y: -6, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      // glow on center
      gsap.to(centerGlow, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" });
    };

    const stepOnce = () => {
      const { offLeft, left, center, right } = roles();
      const tl = gsap.timeline({
        defaults: { ease },
        onComplete: () => {
          active = (active - 1 + cards.length) % cards.length; // left becomes new center
          place();
          loopRef.current = prefersReduced ? null : gsap.delayedCall(hold, () => { loopRef.current = stepOnce(); });
        },
      });

      tl.to(cards[right],  { autoAlpha: 0, scale: sideScale, rotateY:  sideRot, filter: `blur(${blurPx}px)`, duration: stepDur }, 0);
      tl.to(cards[center], { xPercent: gapX, scale: sideScale, rotateY:  sideRot, filter: `blur(${blurPx}px)`, zIndex: 5, pointerEvents: "none", duration: stepDur }, 0);
      tl.to(cards[left],   { xPercent: 0,    scale: 1,         rotateY: 0,        filter: "blur(0px)",        zIndex: 10, pointerEvents: "auto", duration: stepDur }, 0);
      tl.to(cards[offLeft],{ autoAlpha: 1, duration: stepDur }, 0);

      // center emphasis pulse
      const inner = cards[left].querySelector('[data-tilt-inner="1"]');
      if (inner && !prefersReduced) {
        tl.to(inner, { boxShadow: "0 30px 80px rgba(37,99,235,0.25)", duration: stepDur, ease: "power2.out" }, 0.05);
      }
      return tl;
    };

    place();
    if (!prefersReduced) loopRef.current = stepOnce();

    // Pause Lenis while ≥70% of hero visible
    ioRef.current = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.7) {
          lenisRef.current?.stop();
          loopRef.current?.resume?.();
        } else {
          loopRef.current?.resume?.();
          lenisRef.current?.start();
        }
      },
      { threshold: [0, 0.7, 1] }
    );
    if (hostRef.current) ioRef.current.observe(hostRef.current);

    return () => {
      ioRef.current?.disconnect();
      loopRef.current && (loopRef.current.kill?.(), loopRef.current = null);
      unbindTiltRef.current();
      centerGlow.remove();
    };
  }, [lenisRef]);

  // Continue: down by 50vh
  const jumpDown = () => {
    const delta = window.innerHeight * 1.1;
    const y = window.scrollY + delta;
    lenisRef.current?.start?.();
    if (lenisRef.current?.scrollTo) lenisRef.current.scrollTo(y, { immediate: true });
    else window.scrollTo({ top: y, behavior: "auto" });
  };

  return (
    <section
      ref={hostRef}
      data-lenis-prevent
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <BackgroundGrid />

      <div style={{ position: "relative", width: "min(1200px,92vw)", height: "26rem", perspective: "1400px" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Card key={i} ref={(el) => (cardRefs.current[i] = el)} />
        ))}
      </div>

      <button
        onClick={jumpDown}
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 18px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.2)",
          fontWeight: 600,
          background: "linear-gradient(135deg,#3b82f6,#22d3ee 60%,#10b981)",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(16,185,129,0.25)",
        }}
      >
        Continue
      </button>
    </section>
  );
}

/* --------------------------- Enhanced Tilt Function --------------------------- */
function bindTilt(cardEl) {
  const inner = cardEl?.querySelector('[data-tilt-inner="1"]');
  if (!inner) return () => {};

  const img = inner.querySelector("img");
  const sheen = inner.querySelector('[data-sheen="1"]');
  const depthEls = [...inner.querySelectorAll("[data-depth]")];

  // Ensure 3D context and set initial state
  gsap.set(inner, { 
    transformStyle: "preserve-3d",
    transform: "translateZ(0) rotateY(0deg) rotateX(0deg) scale(1)"
  });

  // Quick setters for smooth animation
  const qRotY  = gsap.quickTo(inner, "rotateY", { duration: 0.18, ease: "power2.out" });
  const qRotX  = gsap.quickTo(inner, "rotateX", { duration: 0.18, ease: "power2.out" });
  const qScale = gsap.quickTo(inner, "scale",   { duration: 0.18, ease: "power2.out" });
  const qImgZ  = img ? gsap.quickTo(img, "scale", { duration: 0.25, ease: "power2.out" }) : () => {};
  
  // Depth parallax for elements
  const qDepth = depthEls.map((el) => ({
    x: gsap.quickTo(el, "x", { duration: 0.2, ease: "power2.out" }),
    y: gsap.quickTo(el, "y", { duration: 0.2, ease: "power2.out" }),
    d: parseFloat(el.getAttribute("data-depth") || "0"),
  }));

  const move = (e) => {
    const r = inner.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / r.width;   // -0.5..0.5
    const py = (e.clientY - (r.top + r.height / 2)) / r.height;  // -0.5..0.5
    
    qRotY(px * 22);  // Rotate Y based on X mouse position
    qRotX(-py * 14); // Rotate X based on Y mouse position (negative for natural feel)
    
    // Apply depth parallax
    qDepth.forEach(({ x, y, d }) => { 
      x(px * d * 14); 
      y(py * d * 14); 
    });
  };

  const onEnter = (e) => {
    // Scale up and enhance image on hover
    qScale(1.02);
    qImgZ(1.06);
    
    // Add glow shadow
    gsap.to(inner, { 
      boxShadow: "0 30px 80px rgba(37,99,235,0.28)", 
      duration: 0.25, 
      ease: "power2.out" 
    });
    
    // Animate sheen effect
    if (sheen) {
      gsap.killTweensOf(sheen);
      gsap.set(sheen, { opacity: 0, xPercent: -120, rotate: 12 });
      gsap.to(sheen, { 
        opacity: 1, 
        xPercent: 120, 
        duration: 0.9, 
        ease: "power3.out",
        onComplete: () => {
          gsap.to(sheen, { opacity: 0, duration: 0.25 });
        }
      });
    }
    
    // Start tracking mouse movement
    cardEl.addEventListener("pointermove", move, { passive: true });
    move(e); // Initial position
  };

  const onLeave = () => {
    // Reset all transforms
    qRotY(0); 
    qRotX(0); 
    qScale(1); 
    qImgZ(1);
    
    // Reset depth elements
    qDepth.forEach(({ x, y }) => { 
      x(0); 
      y(0); 
    });
    
    // Reset shadow
    gsap.to(inner, { 
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)", 
      duration: 0.25, 
      ease: "power2.out" 
    });
    
    // Stop tracking mouse
    cardEl.removeEventListener("pointermove", move);
  };

  // Ensure pointer capture for smooth interaction
  const onDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  // Set cursor and bind events
  cardEl.style.cursor = "grab";
  cardEl.addEventListener("pointerenter", onEnter);
  cardEl.addEventListener("pointerleave", onLeave);
  cardEl.addEventListener("pointerdown", onDown);

  return () => {
    cardEl.removeEventListener("pointerenter", onEnter);
    cardEl.removeEventListener("pointerleave", onLeave);
    cardEl.removeEventListener("pointerdown", onDown);
    cardEl.removeEventListener("pointermove", move);
  };
}

/* --------------------------- Card --------------------------- */
const Card = forwardRef(function Card(_, ref) {
  const frameGrad = "linear-gradient(135deg,#1e293b,#111827)";
  const rim = "linear-gradient(135deg,#3b82f6,#22d3ee 55%,#10b981)";

  return (
    <article
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        margin: "auto",
        width: "38rem",
        height: "21rem",
        borderRadius: 26,
        padding: 2,
        backgroundImage: rim,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
        cursor: "pointer",
      }}
    >
      <div
        data-tilt-inner="1"
        style={{
          position: "relative",
          height: "100%",
          borderRadius: 24,
          overflow: "hidden",
          background: frameGrad,
          display: "grid",
          placeItems: "center",
          transform: "translateZ(0) rotateY(0deg) rotateX(0deg)",
          transition: "transform 120ms linear",
          willChange: "transform",
        }}
      >
        {/* background image layer */}
        <img
          src="/img.jpg"
          alt="product"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
            transform: "translateZ(0)",
          }}
        />

        {/* foreground logo/tag depth sample */}
        <div
          data-depth="3"
          style={{
            position: "absolute",
            left: 18,
            top: 16,
            padding: "6px 10px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.6,
            color: "#0b1220",
            background: "linear-gradient(135deg,#34d399,#22d3ee)",
            boxShadow: "0 8px 24px rgba(34,211,238,0.25)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          PREMIUM
        </div>

        {/* subtle corner spark depth */}
        <div
          data-depth="6"
          aria-hidden
          style={{
            position: "absolute",
            right: -40,
            bottom: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(59,130,246,0.35), transparent 70%)",
            filter: "blur(22px)",
            pointerEvents: "none",
          }}
        />

        {/* sheen layer */}
        <div
          data-sheen="1"
          aria-hidden
          style={{
            position: "absolute",
            inset: -2,
            background:
              "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 70%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
            opacity: 0,
          }}
        />
      </div>
    </article>
  );
});

/* --------------------------- Background grid (tasteful) --------------------------- */
function BackgroundGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(1000px 600px at 50% 20%, rgba(59,130,246,0.12), transparent 60%), linear-gradient(0deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04))",
        maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  );
}