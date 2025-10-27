
"use client";

import { useRef, forwardRef } from "react";
import { gsap } from "gsap";

export default function Pageu() {
  return (<>
    <div style={{ minHeight: "0vh", background: "#fff", color: "#0f1115" }}>
     
      <ScrollSection />
    </div>
  </>);
}


function ScrollSection() {
  const cardRef = useRef(null);

return (
    <section style={{ height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingInline: 32,
        }}
      >
        <ProductCard ref={cardRef} />
      </div>
    </section>
  );
}

/* ---------- Single product card: slightly smaller, strong shadow, product image, tighter UI ---------- */
const ProductCard = forwardRef(function ProductCard(_, ref) {
  const frameGrad = "linear-gradient(135deg,#5B21B6,#22D3EE 55%,#10B981)";
  // Product-style image
 
    ; // watch product

  const onMove = (e) => {
    const root = e.currentTarget;
    const r = root.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / r.width;
    const py = (e.clientY - (r.top + r.height / 2)) / r.height;
    root.style.transform = `perspective(1100px) rotateY(${px * 22}deg) rotateX(${-py * 18}deg)`;
  };
  const onLeave = (e) => {
    e.currentTarget.style.transform =
      "perspective(1100px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        width: "50rem",   // smaller than before
        height: "29rem",
        borderRadius: 26,
        padding: 3,
        backgroundImage: frameGrad,
        position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 160ms ease",
        boxShadow:
          "0 70px 140px rgba(0,0,0,0.30), 0 26px 60px rgba(0,0,0,0.20), 0 2px 18px rgba(0,0,0,0.22)",
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          borderRadius: 22,
          overflow: "hidden",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* image */}
        <div >
          <img
            src="/img.jpg"
            alt="product"
            style={{
              height: "1000",
              display: "block",
            }}
          />
        
        </div>
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          bottom: -36,
          height: 110,
          background:
            "radial-gradient(60% 80% at 50% 50%, rgba(0,0,0,0.33), rgba(0,0,0,0.0) 70%)",
          filter: "blur(10px)",
          zIndex: -1,
        }}
      />
    </article>
  );
});