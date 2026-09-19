import { useEffect, useRef } from "react";

/* ---------- tuning knobs (live in index.css as custom properties) ----------
   --dot-base      dim dot color        (akkila.dev: #ffffff14 — white @ 8%)
   --grid-line     cell line color      (akkila.dev: #ffffff06 — white @ 2.4%)
   --dot-bright    revealed dot color   (akkila.dev: #00ff88; we use --green)
   --torch-radius  mask radius          (akkila.dev: 220px; visible reach = 75%)
--------------------------------------------------------------------------- */

/**
 * "Flashlight" dot grid modeled on akkila.dev, using the same architecture as
 * the reference: stacked fixed layers — a faint 96px cell grid, dim 24px base
 * dots, and a layer of bright green dots revealed near the pointer by a
 * radial mask-image. A rAF loop lerps the mask center toward the cursor
 * (0.18/frame in the reference, normalized to frame rate here) and parks it
 * offscreen on pointer leave, so the light glides away like on the reference.
 * Pure CSS painting (GPU-composited), no per-frame canvas drawing; resize is
 * handled by CSS itself. Reduced-motion users get the static grid only.
 */
export default function DotBackground() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canAnimate = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    if (!canAnimate.matches) return;

    const LERP = 0.18; // per-frame follow factor used by the reference
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;
    let last = 0;

    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      start();
    };
    // park the target offscreen; the light glides away, like the reference
    const onLeave = () => {
      tx = -9999;
      ty = -9999;
      start();
    };
    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const k = 1 - Math.pow(1 - LERP, dt * 60); // frame-rate independent
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.setProperty("--mx", `${x.toFixed(1)}px`);
      el.style.setProperty("--my", `${y.toFixed(1)}px`);
      if (Math.abs(tx - x) > 0.2 || Math.abs(ty - y) > 0.2) {
        raf = requestAnimationFrame(loop);
      } else {
        x = tx;
        y = ty;
        raf = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="dot-background"
      role="presentation"
      aria-hidden="true"
    >
      <div className="bg-grid" />
      <div className="bg-dots-base" />
      <div className="bg-dots-torch" />
      <div className="bg-vignette" />
    </div>
  );
}
