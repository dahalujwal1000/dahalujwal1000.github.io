import { useEffect, useRef } from "react";

type Dot = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const SPACING = 28;
const DOT_RADIUS = 1.6;
const DOT_COLOR = "139, 148, 158"; // matches --fg-dim (#8b949e)
const DOT_ALPHA = 0.45;
const TOUCH_RADIUS = 150;
const PUSH_FORCE = 3.2;
const SPRING = 0.06;
const DAMPING = 0.84;
const SMOOTH = 0.12; // cursor smoothing / trailing

/**
 * Full-page interactive dot grid: dots get pushed away from the pointer
 * (smoothed) and spring back to their grid position. Fixed behind all
 * content, pointer-events none. Reduced-motion users get a static grid.
 */
export default function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    const pointer = { tx: -9999, ty: -9999, x: -9999, y: -9999 };
    let raf = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / SPACING);
      const rows = Math.ceil(height / SPACING);
      const next: Dot[] = [];
      for (let r = 0; r <= rows; r++) {
        const shift = r % 2 === 1 ? SPACING / 2 : 0; // staggered grid
        for (let c = 0; c <= cols; c++) {
          const ox = c * SPACING + shift;
          const oy = r * SPACING;
          next.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
        }
      }
      dots = next;
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };

    const onPointerLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // smooth trailing cursor
      pointer.x += (pointer.tx - pointer.x) * SMOOTH;
      pointer.y += (pointer.ty - pointer.y) * SMOOTH;

      const px = pointer.x;
      const py = pointer.y;
      ctx.fillStyle = `rgba(${DOT_COLOR}, ${DOT_ALPHA})`;

      for (const d of dots) {
        const dx = d.x - px;
        const dy = d.y - py;
        const dist2 = dx * dx + dy * dy;

        // push away from the pointer
        if (dist2 > 0.0001 && dist2 < TOUCH_RADIUS * TOUCH_RADIUS) {
          const dist = Math.sqrt(dist2);
          const force = (1 - dist / TOUCH_RADIUS) * PUSH_FORCE;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        // spring back toward origin
        d.vx += (d.ox - d.x) * SPRING;
        d.vy += (d.oy - d.y) * SPRING;

        // damping + integrate
        d.vx *= DAMPING;
        d.vy *= DAMPING;
        d.x += d.vx;
        d.y += d.vy;

        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    build();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("resize", build);

    if (reduceMotion) {
      draw(); // static frame, no interaction, no loop
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="dot-background"
      role="presentation"
      aria-hidden="true"
    />
  );
}