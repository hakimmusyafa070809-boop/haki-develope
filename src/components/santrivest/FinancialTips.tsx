"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiggyBank,
  Clock,
  ShieldAlert,
  TrendingUp,
  BookOpen,
  Scale,
  Wallet,
  Users,
  Sprout,
  Heart,
  ListChecks,
  AlertTriangle,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { FINANCIAL_TIPS } from "@/lib/educational-data";
import { Reveal, Eyebrow } from "./animations/primitives";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  PiggyBank,
  Clock,
  ShieldAlert,
  TrendingUp,
  BookOpen,
  Scale,
  Wallet,
  Users,
  Sprout,
  Heart,
  ListChecks,
  AlertTriangle,
};

const CATEGORY_STYLES: Record<string, { bg: string; soft: string; text: string; label: string }> = {
  saving: { bg: "oklch(0.55 0.13 162)", soft: "oklch(0.55 0.13 162 / 0.1)", text: "oklch(0.4 0.13 162)", label: "Saving" },
  spending: { bg: "oklch(0.68 0.08 175)", soft: "oklch(0.68 0.08 175 / 0.1)", text: "oklch(0.45 0.08 175)", label: "Spending" },
  investing: { bg: "oklch(0.72 0.13 85)", soft: "oklch(0.72 0.13 85 / 0.12)", text: "oklch(0.5 0.1 75)", label: "Investing" },
  mindset: { bg: "oklch(0.6 0.1 280)", soft: "oklch(0.6 0.1 280 / 0.1)", text: "oklch(0.45 0.1 280)", label: "Mindset" },
  sharia: { bg: "oklch(0.52 0.13 162)", soft: "oklch(0.52 0.13 162 / 0.1)", text: "oklch(0.4 0.13 162)", label: "Sharia" },
};

export function FinancialTips() {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const tip = FINANCIAL_TIPS[index];
  const Icon = ICON_MAP[tip.icon] || Lightbulb;
  const cat = CATEGORY_STYLES[tip.category];

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (!autoPlay) return;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % FINANCIAL_TIPS.length);
    }, 6000);
    return () => window.clearTimeout(t);
  }, [index, autoPlay]);

  const goNext = () => {
    setAutoPlay(false);
    setIndex((i) => (i + 1) % FINANCIAL_TIPS.length);
  };
  const goPrev = () => {
    setAutoPlay(false);
    setIndex((i) => (i - 1 + FINANCIAL_TIPS.length) % FINANCIAL_TIPS.length);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <Eyebrow>Financial Wisdom</Eyebrow>
              <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                A tip at a time, a habit for life
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Bite-sized principles from Islamic finance and personal money management. Rotates automatically.
              </p>
            </div>
            {/* Dot indicators */}
            <div className="flex flex-wrap gap-1.5">
              {FINANCIAL_TIPS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => { setAutoPlay(false); setIndex(i); }}
                  aria-label={`Go to tip ${i + 1}: ${t.title}`}
                  aria-pressed={i === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                  )}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative mt-6 overflow-hidden rounded-3xl border border-border/70 bg-card p-6 md:p-8">
            {/* Accent glow */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl"
              style={{ background: cat.soft }}
              aria-hidden
            />
            {/* Islamic geometric corner */}
            <svg
              className="pointer-events-none absolute -bottom-3 -right-3 h-32 w-32 opacity-[0.05]"
              viewBox="0 0 80 80"
              aria-hidden
            >
              <g stroke={cat.bg} strokeWidth="0.6" fill="none">
                <circle cx="40" cy="40" r="18" />
                <circle cx="40" cy="40" r="12" />
                <path d="M40 22 L52 40 L40 58 L28 40 Z" />
                <path d="M22 40 L40 28 L58 40 L40 52 Z" />
              </g>
            </svg>

            <AnimatePresence mode="wait">
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col gap-4 md:flex-row md:items-start md:gap-6"
              >
                {/* Icon + category */}
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: cat.soft }}
                  >
                    <Icon className="h-6 w-6" style={{ color: cat.bg }} strokeWidth={1.6} />
                  </div>
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                    style={{ borderColor: cat.bg + "40", color: cat.text, background: cat.soft }}
                  >
                    {cat.label}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground md:text-2xl">{tip.title}</h3>
                    <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {index + 1} / {FINANCIAL_TIPS.length}
                    </span>
                  </div>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                    {tip.body}
                  </p>
                </div>

                {/* Nav arrows (desktop) */}
                <div className="hidden items-center gap-1.5 md:flex">
                  <button
                    onClick={goPrev}
                    data-cursor="Prev"
                    aria-label="Previous tip"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goNext}
                    data-cursor="Next"
                    aria-label="Next tip"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile nav */}
            <div className="mt-4 flex items-center justify-between md:hidden">
              <button
                onClick={goPrev}
                aria-label="Previous tip"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                {index + 1} / {FINANCIAL_TIPS.length}
              </span>
              <button
                onClick={goNext}
                aria-label="Next tip"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
