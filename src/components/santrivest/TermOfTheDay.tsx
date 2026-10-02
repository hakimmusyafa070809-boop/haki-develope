"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Star } from "lucide-react";
import { GLOSSARY } from "@/lib/educational-data";
import { useSantrivest } from "@/lib/store";
import { Reveal, Eyebrow } from "./animations/primitives";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Forbidden: "oklch(0.58 0.21 27)",
  Contract: "oklch(0.55 0.13 162)",
  Investment: "oklch(0.72 0.13 85)",
  Principle: "oklch(0.68 0.08 175)",
};

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

export function TermOfTheDay() {
  const setView = useSantrivest((s) => s.setView);
  const favorites = useSantrivest((s) => s.favorites);

  const term = useMemo(() => {
    const idx = dayOfYear(new Date()) % GLOSSARY.length;
    return { ...GLOSSARY[idx], index: idx + 1 };
  }, []);

  const color = CATEGORY_COLORS[term.category] || "oklch(0.52 0.13 162)";
  const isFavorited = favorites.includes(term.term);

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <button
            onClick={() => setView("sharia")}
            data-cursor="Open"
            className="group relative block w-full overflow-hidden rounded-2xl border border-border/70 bg-card p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift md:p-6"
          >
            {/* Accent strip */}
            <div
              className="pointer-events-none absolute left-0 top-0 h-full w-1"
              style={{ background: color }}
              aria-hidden
            />
            {/* Geometric corner */}
            <svg
              className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.1]"
              viewBox="0 0 80 80"
              aria-hidden
            >
              <g stroke={color} strokeWidth="0.6" fill="none">
                <circle cx="40" cy="40" r="18" />
                <path d="M40 22 L52 40 L40 58 L28 40 Z" />
                <path d="M22 40 L40 28 L58 40 L40 52 Z" />
              </g>
            </svg>

            <div className="flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: color + "1f" }}
              >
                <BookOpen className="h-5 w-5" style={{ color }} strokeWidth={1.6} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Eyebrow>Term of the Day</Eyebrow>
                  <span className="text-[10px] text-muted-foreground">· {term.index} of {GLOSSARY.length}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-bold text-foreground md:text-xl">{term.term}</h3>
                  {term.arabic && (
                    <span className="font-arabic text-xl text-primary/80">{term.arabic}</span>
                  )}
                  {isFavorited && (
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  )}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{term.short}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                    style={{ borderColor: color + "40", color, background: color + "0d" }}
                  >
                    {term.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground">
                    Open full definition
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
