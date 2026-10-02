"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, GraduationCap, Wallet, Scale, TrendingUp, FlaskConical, Brain, BarChart3, Menu, X, Moon, Sun } from "lucide-react";
import { NAV_ITEMS, type ViewId } from "@/lib/educational-data";
import { useSantrivest } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Magnetic } from "./animations/primitives";
import { CommandPalette } from "./CommandPalette";

const ICONS: Record<ViewId, React.ElementType> = {
  home: Home,
  learn: GraduationCap,
  finance: Wallet,
  sharia: Scale,
  investment: TrendingUp,
  simulation: FlaskConical,
  quiz: Brain,
  progress: BarChart3,
};

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-8 w-8">
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.5 0.13 162)" />
              <stop offset="100%" stopColor="oklch(0.7 0.12 150)" />
            </linearGradient>
          </defs>
          {/* Islamic 8-point star */}
          <path
            d="M20 2 L25 12 L36 8 L32 19 L38 25 L27 26 L25 38 L20 30 L15 38 L13 26 L2 25 L8 19 L4 8 L15 12 Z"
            fill="url(#lg)"
            opacity="0.95"
          />
          <circle cx="20" cy="20" r="5" fill="oklch(0.99 0.005 95)" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-extrabold tracking-[0.18em] text-foreground">
          SANTRIVEST
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Learn · Manage · Invest
        </span>
      </div>
    </div>
  );
}

export function FloatingNav() {
  const view = useSantrivest((s) => s.view);
  const setView = useSantrivest((s) => s.setView);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const go = (v: ViewId) => {
    setView(v);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop / top */}
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3 md:px-6 md:pt-4"
      >
        <div
          className={cn(
            "flex w-full max-w-6xl items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-500 md:px-5",
            scrolled
              ? "glass-strong border-border/80 shadow-lift"
              : "border-transparent bg-transparent"
          )}
        >
          <button
            onClick={() => go("home")}
            data-cursor="Home"
            className="shrink-0 rounded-xl px-1 py-1"
          >
            <Logo />
          </button>

          {/* Center nav (desktop) */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.id];
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  data-cursor={item.label}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5" strokeWidth={2} />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <CommandPalette />
            <button
              onClick={() => setDark((d) => !d)}
              data-cursor="Theme"
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Magnetic strength={0.5}>
              <button
                onClick={() => go("progress")}
                data-cursor="Progress"
                className="hidden items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-[13px] font-semibold text-background transition-all hover:opacity-90 sm:flex"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                My Progress
              </button>
            </Magnetic>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              data-cursor="Menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-foreground lg:hidden"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-3 top-[72px] z-[99] lg:hidden"
          >
            <div className="glass-strong scroll-thin max-h-[70vh] overflow-y-auto rounded-2xl border border-border/80 p-2 shadow-lift">
              {NAV_ITEMS.map((item) => {
                const Icon = ICONS[item.id];
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav — key quick-access items */}
      <nav className="fixed inset-x-0 bottom-0 z-[100] flex justify-center px-3 pb-3 lg:hidden">
        <div className="glass-strong flex items-center gap-1 rounded-2xl border border-border/80 px-1.5 py-1.5 shadow-lift">
          {(["home", "learn", "investment", "quiz", "progress"] as ViewId[]).map((id) => {
            const Icon = ICONS[id];
            const item = NAV_ITEMS.find((n) => n.id === id)!;
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => go(id)}
                className={cn(
                  "relative flex h-10 w-11 items-center justify-center rounded-xl transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
                aria-label={item.label}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill-mobile"
                    className="absolute inset-0 rounded-xl bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" strokeWidth={2} />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
