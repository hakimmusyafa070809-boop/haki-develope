"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Compass, TrendingUp, ShieldCheck, ArrowDown, BookOpen, Wallet, Scale } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { HeroVisual } from "../HeroVisual";
import {
  Reveal,
  Stagger,
  StaggerItem,
  CountUp,
  SectionHeading,
  Eyebrow,
  Magnetic,
  Parallax,
} from "../animations/primitives";
import { GeometricDivider } from "../ViewShell";
import { DailyChallenge } from "../DailyChallenge";
import { FinancialTips } from "../FinancialTips";
import { TermOfTheDay } from "../TermOfTheDay";

function Hero() {
  const setView = useSantrivest((s) => s.setView);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-50" />
        {/* Animated Islamic geometric pattern overlay */}
        <svg
          className="absolute left-0 top-0 h-full w-full opacity-[0.04]"
          aria-hidden
        >
          <defs>
            <pattern id="hero-islamic-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <g stroke="oklch(0.52 0.13 162)" strokeWidth="0.6" fill="none">
                <circle cx="40" cy="40" r="18" />
                <circle cx="40" cy="40" r="12" />
                <path d="M40 22 L52 40 L40 58 L28 40 Z" />
                <path d="M22 40 L40 28 L58 40 L40 52 Z" />
                <circle cx="0" cy="0" r="18" />
                <circle cx="80" cy="0" r="18" />
                <circle cx="0" cy="80" r="18" />
                <circle cx="80" cy="80" r="18" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-islamic-pattern)" />
        </svg>
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-amber-300/15 blur-[100px]" />
        {/* Subtle animated arch silhouette */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 2 }}
          className="absolute -bottom-20 left-1/2 hidden h-[400px] w-[300px] -translate-x-1/2 md:block"
        >
          <svg viewBox="0 0 300 400" className="h-full w-full" aria-hidden>
            <path
              d="M50 400 L50 200 Q50 50 150 50 Q250 50 250 200 L250 400 Z"
              fill="none"
              stroke="oklch(0.52 0.13 162)"
              strokeWidth="1.5"
            />
            <path
              d="M80 400 L80 210 Q80 80 150 80 Q220 80 220 210 L220 400 Z"
              fill="none"
              stroke="oklch(0.72 0.13 85)"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="flex flex-col items-start gap-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Islamic Financial Literacy · SDG 8
            </span>
          </Reveal>

          <div className="flex flex-col gap-5">
            <Reveal delay={0.05}>
              <h1 className="text-balance text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Your Money Has a <span className="text-gradient-emerald">Future.</span>
                <br />
                Learn How to Manage It.
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Understand your money, explore Islamic finance, and discover
                responsible ways to grow your future — built for santri of MAS
                Husnul Khotimah.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic strength={0.45}>
                  <button
                    onClick={() => setView("learn")}
                    data-cursor="Start"
                    className="group glow-pulse inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:gap-3 hover:opacity-90"
                  >
                    Start Learning
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Magnetic>
                <Magnetic strength={0.45}>
                  <button
                    onClick={() => setView("sharia")}
                    data-cursor="Explore"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-secondary"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    Explore Santrivest
                  </button>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                <Stat value={6} label="Learning modules" suffix="" />
                <span className="hidden h-8 w-px bg-border sm:block" />
                <Stat value={12} label="Quiz scenarios" suffix="" />
                <span className="hidden h-8 w-px bg-border sm:block" />
                <Stat value={4} label="Interactive simulations" suffix="" />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Hero visual */}
        <Reveal delay={0.15} y={36}>
          <Parallax amount={30} className="relative">
            {/* Rotating gradient ring behind hero visual */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] opacity-30 blur-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{
                background:
                  "conic-gradient(from 0deg, oklch(0.52 0.13 162 / 0.4), oklch(0.72 0.13 85 / 0.3), oklch(0.68 0.08 175 / 0.3), oklch(0.52 0.13 162 / 0.4))",
              }}
            />
            <HeroVisual />
            <motion.button
              onClick={() => setView("finance")}
              data-cursor="Open"
              whileHover={{ scale: 1.04 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-lift backdrop-blur"
            >
              Try the budget simulator
            </motion.button>
          </Parallax>
        </Reveal>
      </div>

      {/* scroll cue */}
      <div className="mt-14 flex justify-center md:mt-20">
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
            Scroll to explore
          </span>
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  return (
    <div className="group flex flex-col">
      <span className="text-2xl font-extrabold transition-colors duration-300 text-foreground group-hover:text-gradient-emerald md:text-3xl">
        <CountUp value={value} suffix={suffix} />
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

const PILLARS = [
  {
    icon: Compass,
    tag: "KNOW",
    title: "Understand how money works",
    desc: "From income and expenses to budgeting and saving — see the full picture of where money comes from and where it goes.",
    color: "oklch(0.55 0.13 162)",
  },
  {
    icon: Wallet,
    tag: "MANAGE",
    title: "Control your income & expenses",
    desc: "Plan a realistic santri budget, build an emergency fund, and turn small daily choices into long-term financial strength.",
    color: "oklch(0.68 0.08 175)",
  },
  {
    icon: TrendingUp,
    tag: "GROW",
    title: "Invest responsibly, the Sharia way",
    desc: "Discover sukuk, Sharia stocks, and Islamic funds. Learn risk, diversification, and how to evaluate before you invest.",
    color: "oklch(0.72 0.13 85)",
  },
];

function WhySantrivest() {
  const setView = useSantrivest((s) => s.setView);
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Why Santrivest"
          title={
            <>
              A premium financial learning world, <br className="hidden sm:block" />
              built around three pillars.
            </>
          }
          subtitle="Learn → See → Try → Reflect → Apply. Every concept follows the same clear path so understanding becomes real."
        />

        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <StaggerItem key={p.tag}>
              <button
                onClick={() => setView("learn")}
                data-cursor="Learn"
                className="bento-card group relative flex h-full w-full flex-col items-start gap-5 overflow-hidden rounded-2xl border border-border/70 bg-card p-7 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-border hover:shadow-lift"
              >
                {/* Gradient glow on hover */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: p.color + "33" }}
                />
                {/* Decorative corner geometric pattern */}
                <svg
                  className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.1]"
                  viewBox="0 0 80 80"
                  aria-hidden
                >
                  <g stroke={p.color} strokeWidth="0.8" fill="none">
                    <circle cx="40" cy="40" r="18" />
                    <circle cx="40" cy="40" r="12" />
                    <path d="M40 22 L52 40 L40 58 L28 40 Z" />
                    <path d="M22 40 L40 28 L58 40 L40 52 Z" />
                  </g>
                </svg>
                {/* Bottom gradient bar on hover */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: `linear-gradient(to right, ${p.color}, transparent)` }}
                />
                {/* Number badge */}
                <div className="flex w-full items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
                    style={{ background: p.color + "1f" }}
                  >
                    <p.icon className="h-5 w-5" strokeWidth={1.8} style={{ color: p.color }} />
                  </div>
                  <span
                    className="text-5xl font-extrabold leading-none opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.12]"
                    style={{ color: p.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: p.color }}>
                    {p.tag}
                  </span>
                  <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  Explore module
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* Where does your money go — scroll storytelling wow moment */
function WhereMoneyGoes() {
  const setView = useSantrivest((s) => s.setView);
  const cats = [
    { label: "Food", amount: 400000, color: "oklch(0.55 0.13 162)", pct: 40 },
    { label: "Transport", amount: 100000, color: "oklch(0.68 0.08 175)", pct: 10 },
    { label: "Savings", amount: 200000, color: "oklch(0.72 0.13 85)", pct: 20 },
    { label: "Emergency", amount: 100000, color: "oklch(0.6 0.1 200)", pct: 10 },
    { label: "Investment", amount: 100000, color: "oklch(0.6 0.16 50)", pct: 10 },
    { label: "Charity", amount: 100000, color: "oklch(0.65 0.12 320)", pct: 10 },
  ];
  const total = 1000000;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-40" />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="A Story Moment"
          title={
            <>
              Where Does Your <span className="text-gradient-gold">Money</span> Go?
            </>
          }
          subtitle="Rp1,000,000 arrives. Watch how a thoughtful plan turns it into intention — not disappearance."
        />

        <Reveal delay={0.1} className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-lift md:p-10">
            {/* Total bar */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Monthly Allowance
                </p>
                <p className="mt-1 text-4xl font-extrabold text-foreground md:text-5xl">
                  <CountUp value={total} prefix="Rp " />
                </p>
              </div>
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>

            {/* animated bar */}
            <div className="mt-6 flex h-12 w-full overflow-hidden rounded-xl border border-border/60">
              {cats.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: `${c.pct}%`, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-center justify-center text-[10px] font-bold text-white/95"
                  style={{ background: c.color }}
                >
                  {c.pct >= 10 ? `${c.pct}%` : ""}
                </motion.div>
              ))}
            </div>

            {/* breakdown */}
            <Stagger className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {cats.map((c) => (
                <StaggerItem key={c.label}>
                  <div className="rounded-xl border border-border/60 bg-background/60 p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {c.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-bold text-foreground">
                      Rp {(c.amount / 1000).toFixed(0)}k
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-secondary/60 p-5 md:flex-row md:items-center md:justify-between">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-bold">Your money is not disappearing.</span> It is being
                allocated — toward needs, protection, growth, and charity.
              </p>
              <Magnetic strength={0.4}>
                <button
                  onClick={() => setView("finance")}
                  data-cursor="Try"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-xs font-semibold text-background"
                >
                  Build your budget
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* SDG 8 section */
function SDGSection() {
  const steps = [
    { t: "Financial Literacy", d: "Understand money, income, expenses, and Islamic principles." },
    { t: "Better Decisions", d: "Think before spending. Resist impulse and FOMO." },
    { t: "Financial Capability", d: "Budget, save, and plan for the future." },
    { t: "Economic Participation", d: "Productive work, halal income, responsible investment." },
    { t: "Inclusive Growth", d: "Supporting SDG 8 — decent work and economic growth." },
  ];
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-emerald-50/60 via-card to-amber-50/40 p-6 md:p-12">
          {/* Islamic pattern overlay */}
          <div className="pointer-events-none absolute inset-0 bg-islamic-pattern opacity-40" aria-hidden />
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col gap-5">
              <Eyebrow>SDG No. 8</Eyebrow>
              <h2 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">
                Finance Can Build <span className="text-gradient-emerald">Better Futures</span>
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Sharia financial literacy connects to decent work and economic
                growth — through responsible decisions, entrepreneurship, and
                inclusive participation.
              </p>
              <div className="mt-2 inline-flex w-fit items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background text-xs font-extrabold">
                  8
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">Decent Work &amp; Economic Growth</span>
                  <span className="text-[11px] text-muted-foreground">United Nations Sustainable Development Goal</span>
                </div>
              </div>
            </div>

            {/* chain */}
            <Stagger className="flex flex-col gap-3">
              {steps.map((s, i) => (
                <StaggerItem key={s.t}>
                  <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{s.t}</span>
                      <span className="text-xs text-muted-foreground">{s.d}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <ArrowDown className="ml-auto h-4 w-4 text-border" />
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Final CTA */
function FinalCTA() {
  const setView = useSantrivest((s) => s.setView);
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]" />
      </div>
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <Eyebrow className="justify-center">One Decision at a Time</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your Future Is Built <br className="hidden sm:block" />
            <span className="text-gradient-emerald">One Decision at a Time.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Learn how money works. Understand Islamic finance. Make responsible
            decisions for tomorrow.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic strength={0.45}>
              <button
                onClick={() => setView("learn")}
                data-cursor="Start"
                className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-7 py-4 text-sm font-semibold text-background transition-all hover:gap-3"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Magnetic>
            <Magnetic strength={0.45}>
              <button
                onClick={() => setView("quiz")}
                data-cursor="Open"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-7 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                Take the Quiz
              </button>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-16 flex flex-col items-center gap-2 border-t border-border/60 pt-8">
            <div className="flex items-center gap-2.5">
              <Scale className="h-4 w-4 text-primary" />
              <span className="text-sm font-extrabold tracking-[0.22em] text-foreground">
                SANTRIVEST
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Financial literacy for a more capable generation.
            </p>
            <p className="mt-2 text-[10px] text-muted-foreground/70">
              Supporting SDG No. 8 · MAS Husnul Khotimah
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CredentialStrip() {
  const items = [
    { label: "MAS Husnul Khotimah", sub: "Pilot school" },
    { label: "SDG No. 8", sub: "Decent work & growth" },
    { label: "Sharia-compliant", sub: "Curriculum reviewed" },
    { label: "Bahasa Indonesia", sub: "Friendly local context" },
  ];
  return (
    <section className="border-y border-border/40 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 md:px-8">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-border md:block" aria-hidden />}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">{item.label}</span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeView() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CredentialStrip />
      <DailyChallenge />
      <TermOfTheDay />
      <GeometricDivider label="Three pillars" className="py-2" />
      <WhySantrivest />
      <GeometricDivider label="A story moment" className="py-2" />
      <WhereMoneyGoes />
      <GeometricDivider label="SDG No. 8" className="py-2" />
      <SDGSection />
      <GeometricDivider label="Wisdom" className="py-2" />
      <FinancialTips />
      <GeometricDivider label="Begin" className="py-2" />
      <FinalCTA />
    </div>
  );
}
