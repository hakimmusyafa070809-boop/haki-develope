"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  a: number;
}

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });

  const layer1 = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const layer1y = useTransform(sy, [-0.5, 0.5], [-18, 18]);
  const layer2 = useTransform(sx, [-0.5, 0.5], [-32, 32]);
  const layer2y = useTransform(sy, [-0.5, 0.5], [-32, 32]);
  const layer3 = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const layer3y = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 2 + 0.6,
        hue: Math.random() > 0.55 ? 162 : 85, // emerald or gold
        a: Math.random() * 0.5 + 0.25,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // connect lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            const op = (1 - d / 110) * 0.16;
            ctx.strokeStyle =
              p.hue === 162
                ? `oklch(0.55 0.13 162 / ${op})`
                : `oklch(0.78 0.13 85 / ${op})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.fillStyle =
          p.hue === 162
            ? `oklch(0.52 0.13 162 / ${p.a})`
            : `oklch(0.72 0.13 88 / ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const el = wrapRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-white via-emerald-50/40 to-amber-50/30"
    >
      {/* radial glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[18%] top-[20%] h-32 w-32 rounded-full bg-amber-300/20 blur-2xl" />
      </div>

      {/* canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Islamic geometric layers */}
      <motion.div
        style={{ x: layer3, y: layer3y }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="h-[88%] w-[88%] animate-spin-slower opacity-[0.13]">
          <defs>
            <pattern id="ig" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M20 0 L30 10 L40 20 L30 30 L20 40 L10 30 L0 20 L10 10 Z"
                fill="none"
                stroke="oklch(0.45 0.13 162)"
                strokeWidth="0.8"
              />
              <circle cx="20" cy="20" r="6" fill="none" stroke="oklch(0.45 0.13 162)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#ig)" />
        </svg>
      </motion.div>

      {/* Big 8-point star */}
      <motion.div
        style={{ x: layer2, y: layer2y }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="h-[70%] w-[70%] animate-spin-slow opacity-90">
          <defs>
            <linearGradient id="starG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.55 0.13 162)" />
              <stop offset="60%" stopColor="oklch(0.62 0.12 158)" />
              <stop offset="100%" stopColor="oklch(0.7 0.1 150)" />
            </linearGradient>
            <linearGradient id="starGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.7 0.13 85)" />
              <stop offset="100%" stopColor="oklch(0.78 0.12 92)" />
            </linearGradient>
          </defs>
          {/* outer 8-point star */}
          <path
            d="M100 8 L122 50 L168 32 L150 78 L192 100 L150 122 L168 168 L122 150 L100 192 L78 150 L32 168 L50 122 L8 100 L50 78 L32 32 L78 50 Z"
            fill="url(#starG)"
            opacity="0.18"
          />
          <path
            d="M100 8 L122 50 L168 32 L150 78 L192 100 L150 122 L168 168 L122 150 L100 192 L78 150 L32 168 L50 122 L8 100 L50 78 L32 32 L78 50 Z"
            fill="none"
            stroke="url(#starG)"
            strokeWidth="1.4"
          />
          {/* inner star */}
          <path
            d="M100 40 L115 70 L148 60 L138 92 L160 100 L138 108 L148 140 L115 130 L100 160 L85 130 L52 140 L62 108 L40 100 L62 92 L52 60 L85 70 Z"
            fill="none"
            stroke="url(#starGold)"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <circle cx="100" cy="100" r="20" fill="none" stroke="oklch(0.55 0.13 162)" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="10" fill="oklch(0.52 0.13 162 / 0.15)" />
        </svg>
      </motion.div>

      {/* Floating financial glass cards */}
      <motion.div
        style={{ x: layer1, y: layer1y }}
        className="absolute inset-0"
      >
        {/* Coin */}
        <motion.div
          className="absolute left-[10%] top-[18%]"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass flex h-12 items-center gap-2 rounded-2xl border border-border/60 px-3 shadow-lift">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner" />
            <div className="text-[10px] font-semibold text-foreground">Gold</div>
          </div>
        </motion.div>

        {/* Sukuk */}
        <motion.div
          className="absolute right-[8%] top-[24%]"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass flex h-12 items-center gap-2 rounded-2xl border border-border/60 px-3 shadow-lift">
            <div className="h-6 w-6 rounded-md bg-primary/15" />
            <div className="text-[10px] font-semibold text-foreground">Sukuk</div>
          </div>
        </motion.div>

        {/* Mini chart */}
        <motion.div
          className="absolute bottom-[16%] left-[14%]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass w-28 rounded-2xl border border-border/60 p-2.5 shadow-lift">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-muted-foreground">Portfolio</span>
              <span className="text-[9px] font-bold text-primary">+8.4%</span>
            </div>
            <svg viewBox="0 0 80 28" className="h-7 w-full">
              <path
                d="M0 24 L12 20 L24 22 L36 14 L48 16 L60 8 L80 4"
                fill="none"
                stroke="oklch(0.52 0.13 162)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0 24 L12 20 L24 22 L36 14 L48 16 L60 8 L80 4 L80 28 L0 28 Z"
                fill="oklch(0.52 0.13 162 / 0.12)"
              />
            </svg>
          </div>
        </motion.div>

        {/* Budget ring */}
        <motion.div
          className="absolute bottom-[20%] right-[12%]"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 shadow-lift">
            <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(0.91 0.006 150)" strokeWidth="3.5" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="oklch(0.52 0.13 162)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="88"
                strokeDashoffset="26"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* Center statement */}
      <motion.div
        style={{ x: layer3, y: layer3y }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="font-arabic text-2xl text-primary/70 mb-2">بسم الله</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Barokah · Growth · Trust
          </div>
        </div>
      </motion.div>

      {/* corner accents */}
      <div className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-primary/30 rounded-tl-xl" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-amber-400/30 rounded-br-xl" />
    </div>
  );
}
