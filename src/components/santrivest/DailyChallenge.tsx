"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Calendar, RefreshCw } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import type { ViewId } from "@/lib/educational-data";
import { Reveal, Magnetic, Eyebrow } from "./animations/primitives";
import { cn } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  prompt: string;
  cta: { label: string; view: ViewId };
  accent: "emerald" | "gold" | "sage";
}

const CHALLENGES: Challenge[] = [
  {
    id: "track-spending",
    title: "Track today's spending",
    prompt: "Write down every rupiah you spend today. Awareness is the first step to financial control.",
    cta: { label: "Open budget simulator", view: "finance" },
    accent: "emerald",
  },
  {
    id: "needs-wants",
    title: "Sort one purchase: need or want?",
    prompt: "Before your next purchase, ask: is this a need or a want? Context matters — be honest with yourself.",
    cta: { label: "Practice needs vs wants", view: "finance" },
    accent: "gold",
  },
  {
    id: "riba-spot",
    title: "Spot riba in the wild",
    prompt: "Look at one financial product you encounter today. Can you identify whether it involves interest (riba)?",
    cta: { label: "Learn about riba", view: "sharia" },
    accent: "emerald",
  },
  {
    id: "gharar-check",
    title: "Check for gharar",
    prompt: "Before any transaction today, ask: is the subject, price, and terms clear? If not, it may involve gharar.",
    cta: { label: "Play gharar game", view: "sharia" },
    accent: "sage",
  },
  {
    id: "savings-goal",
    title: "Set a savings goal",
    prompt: "Write down one financial goal — short, medium, or long term. A written goal is far more likely to happen.",
    cta: { label: "Project your future", view: "simulation" },
    accent: "gold",
  },
  {
    id: "sharia-screen",
    title: "Sharia-screen one investment",
    prompt: "Pick one investment you've heard of. Check: is the business permissible? Does it pass Sharia screening?",
    cta: { label: "Try Sharia checker", view: "investment" },
    accent: "emerald",
  },
  {
    id: "fomo-resist",
    title: "Resist one FOMO today",
    prompt: "When friends hype an opportunity, pause. Investigate before deciding. Herd behavior is expensive.",
    cta: { label: "Experience FOMO sim", view: "investment" },
    accent: "sage",
  },
  {
    id: "reflect-verse",
    title: "Reflect on one verse",
    prompt: "Read Al-Hasyr 59:18. What are you preparing for your financial future? Write a one-line reflection.",
    cta: { label: "Open Quran reflections", view: "sharia" },
    accent: "gold",
  },
  {
    id: "emergency-fund",
    title: "Start your emergency fund",
    prompt: "Even Rp50,000 set aside today counts. Begin building your safety buffer, however small.",
    cta: { label: "Plan a budget", view: "finance" },
    accent: "emerald",
  },
  {
    id: "diversify",
    title: "Learn diversification",
    prompt: "Don't put all eggs in one basket. Explore how spreading risk protects wealth over time.",
    cta: { label: "Build a portfolio", view: "investment" },
    accent: "sage",
  },
  {
    id: "quiz-challenge",
    title: "Answer 3 quiz questions",
    prompt: "Test your understanding with three scenario-based questions. Learn from each explanation.",
    cta: { label: "Take the quiz", view: "quiz" },
    accent: "gold",
  },
  {
    id: "trade-vs-riba",
    title: "Trade or riba?",
    prompt: "Revisit the difference between profit from trade and interest from a loan. The distinction matters.",
    cta: { label: "Compare trade vs riba", view: "simulation" },
    accent: "emerald",
  },
  {
    id: "halal-income",
    title: "Reflect on halal income",
    prompt: "How you earn matters as much as how much you earn. Is your income from permissible, honest work?",
    cta: { label: "Explore Islamic finance", view: "sharia" },
    accent: "sage",
  },
  {
    id: "long-term",
    title: "Think 10 years ahead",
    prompt: "Where do you want to be financially in 10 years? One decision today shapes that future.",
    cta: { label: "See Future You", view: "simulation" },
    accent: "gold",
  },
];

const ACCENT_COLORS = {
  emerald: { bg: "oklch(0.52 0.13 162)", soft: "oklch(0.52 0.13 162 / 0.08)", text: "oklch(0.45 0.13 162)" },
  gold: { bg: "oklch(0.72 0.13 85)", soft: "oklch(0.72 0.13 85 / 0.1)", text: "oklch(0.5 0.1 75)" },
  sage: { bg: "oklch(0.68 0.08 175)", soft: "oklch(0.68 0.08 175 / 0.1)", text: "oklch(0.45 0.08 175)" },
};

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function DailyChallenge() {
  const setView = useSantrivest((s) => s.setView);

  const today = useMemo(() => {
    const d = new Date();
    const idx = dayOfYear(d) % CHALLENGES.length;
    return {
      challenge: CHALLENGES[idx],
      date: d,
      dayNum: idx + 1,
    };
  }, []);

  const accent = ACCENT_COLORS[today.challenge.accent];
  const dateStr = today.date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 md:p-10">
            {/* Decorative accent */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl"
              style={{ background: accent.soft }}
              aria-hidden
            />
            {/* Islamic geometric corner */}
            <svg
              className="pointer-events-none absolute right-4 top-4 h-20 w-20 opacity-[0.08]"
              viewBox="0 0 80 80"
              aria-hidden
            >
              <g stroke={accent.bg} strokeWidth="0.8" fill="none">
                <circle cx="40" cy="40" r="20" />
                <circle cx="40" cy="40" r="14" />
                <path d="M40 20 L56 40 L40 60 L24 40 Z" />
                <path d="M20 40 L40 24 L60 40 L40 56 Z" />
              </g>
            </svg>

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Eyebrow>Today's Challenge</Eyebrow>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    <Calendar className="h-2.5 w-2.5" />
                    {dateStr}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: accent.soft }}
                  >
                    <Sparkles className="h-3.5 w-3.5" style={{ color: accent.bg }} />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      {today.challenge.title}
                    </h3>
                    <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                      {today.challenge.prompt}
                    </p>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Refreshes tomorrow
                  </span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>Challenge {today.dayNum} of {CHALLENGES.length}</span>
                </div>
              </div>

              <Magnetic strength={0.4}>
                <button
                  onClick={() => setView(today.challenge.cta.view)}
                  data-cursor="Open"
                  className="group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-background transition-all"
                  style={{ background: accent.bg }}
                >
                  {today.challenge.cta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
