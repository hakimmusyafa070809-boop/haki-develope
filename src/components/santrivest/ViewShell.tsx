"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { Eyebrow } from "./animations/primitives";
import type { ViewId } from "@/lib/educational-data";
import { Reveal, Stagger, StaggerItem, Magnetic } from "./animations/primitives";

export function ViewShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 pt-28 md:px-8 md:pt-36", className)}>
      {children}
    </div>
  );
}

export function ViewHeader({
  eyebrow,
  title,
  subtitle,
  back = "home",
  backLabel = "Back",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  back?: ViewId;
  backLabel?: string;
}) {
  const setView = useSantrivest((s) => s.setView);
  return (
    <div className="relative flex flex-col gap-5 border-b border-border/60 pb-8">
      {/* Decorative arch accent */}
      <svg
        className="pointer-events-none absolute -right-4 top-0 hidden h-24 w-24 opacity-[0.06] md:block"
        viewBox="0 0 96 96"
        aria-hidden
      >
        <path
          d="M20 96 L20 48 Q20 16 48 16 Q76 16 76 48 L76 96 Z"
          fill="none"
          stroke="oklch(0.52 0.13 162)"
          strokeWidth="1"
        />
        <path
          d="M28 96 L28 52 Q28 24 48 24 Q68 24 68 52 L68 96 Z"
          fill="none"
          stroke="oklch(0.72 0.13 85)"
          strokeWidth="0.8"
        />
      </svg>
      <button
        onClick={() => setView(back)}
        data-cursor="Back"
        className="flex w-fit items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {backLabel}
      </button>
      <div className="flex items-center gap-2.5">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/40" />
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.04] tracking-tight text-foreground md:text-5xl lg:text-6xl"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function ViewBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col py-10 md:py-14", className)}>{children}</div>;
}

/* Definition / explanation block used across Sharia & Learn */
export function ConceptBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card p-6 md:p-8", className)}>
      {children}
    </div>
  );
}

/* Decorative Islamic geometric divider — 8-point star pattern */
export function GeometricDivider({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-4 py-6", className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary/50" aria-hidden>
        <path
          d="M12 1 L14.5 7 L21 7 L16 11 L18 17 L12 13.5 L6 17 L8 11 L3 7 L9.5 7 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.4" />
      </svg>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </span>
      )}
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-500/50" aria-hidden>
        <path
          d="M12 1 L14.5 7 L21 7 L16 11 L18 17 L12 13.5 L6 17 L8 11 L3 7 L9.5 7 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.4" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

/* Continue exploring — cross-view navigation strip shown at the bottom of non-home views */
interface RelatedLink {
  id: ViewId;
  title: string;
  desc: string;
}

export function ContinueExploring({
  current,
  links,
}: {
  current: ViewId;
  links: RelatedLink[];
}) {
  const setView = useSantrivest((s) => s.setView);
  const filtered = links.filter((l) => l.id !== current).slice(0, 3);
  if (filtered.length === 0) return null;

  return (
    <Reveal>
      <div className="mt-16 mb-4">
        <GeometricDivider label="Continue exploring" />
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Eyebrow>Related</Eyebrow>
            <span className="text-[11px] text-muted-foreground">{filtered.length} suggestions</span>
          </div>
          <Stagger className="grid gap-3 md:grid-cols-3">
            {filtered.map((link) => (
              <StaggerItem key={link.id}>
                <Magnetic strength={0.3}>
                  <button
                    onClick={() => setView(link.id)}
                    data-cursor="Open"
                    className="bento-card hover-glow group relative flex w-full flex-col items-start gap-2 overflow-hidden rounded-2xl border border-border/70 bg-card p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                      e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                    }}
                  >
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex w-full items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                        {link.title}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{link.desc}</p>
                  </button>
                </Magnetic>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Reveal>
  );
}

/* Helper: suggested next-view links per current view */
export const RELATED_LINKS: Record<ViewId, RelatedLink[]> = {
  home: [
    { id: "learn", title: "Learn", desc: "Start the 6-module pathway from money basics to risk & return." },
    { id: "finance", title: "Finance", desc: "Build a santri budget and practice needs vs wants." },
    { id: "sharia", title: "Sharia", desc: "Understand riba, gharar, maysir, and Islamic contracts." },
  ],
  learn: [
    { id: "finance", title: "Finance", desc: "Apply what you learned in the budget simulator." },
    { id: "sharia", title: "Sharia", desc: "Deepen your understanding of Islamic finance principles." },
    { id: "quiz", title: "Quiz", desc: "Test your understanding with scenario questions." },
  ],
  finance: [
    { id: "investment", title: "Investment", desc: "Try the Sharia portfolio simulator next." },
    { id: "simulation", title: "Simulation", desc: "Project your future and compare trade vs riba." },
    { id: "learn", title: "Learn", desc: "Revisit the personal finance module for context." },
  ],
  sharia: [
    { id: "investment", title: "Investment", desc: "See Sharia principles applied to real asset classes." },
    { id: "quiz", title: "Quiz", desc: "Test your grasp of riba, gharar, and maysir." },
    { id: "learn", title: "Learn", desc: "Explore the Islamic finance learning module." },
  ],
  investment: [
    { id: "simulation", title: "Simulation", desc: "Project long-term growth with the Future You tool." },
    { id: "sharia", title: "Sharia", desc: "Revisit the principles behind Sharia screening." },
    { id: "progress", title: "Progress", desc: "Review your simulation history and journey." },
  ],
  simulation: [
    { id: "investment", title: "Investment", desc: "Build a diversified Sharia portfolio." },
    { id: "finance", title: "Finance", desc: "Plan the budget that funds your future." },
    { id: "quiz", title: "Quiz", desc: "Check your understanding of risk and return." },
  ],
  quiz: [
    { id: "learn", title: "Learn", desc: "Strengthen areas you missed in the quiz." },
    { id: "certificate", title: "Certificate", desc: "See if you qualify for a completion certificate." },
    { id: "sharia", title: "Sharia", desc: "Revisit the concepts behind tricky questions." },
  ],
  progress: [
    { id: "learn", title: "Learn", desc: "Continue from where you left off." },
    { id: "quiz", title: "Quiz", desc: "Retake to improve your score." },
    { id: "certificate", title: "Certificate", desc: "Check your certificate eligibility." },
  ],
  research: [
    { id: "progress", title: "Progress", desc: "See your learning journey and stats." },
    { id: "learn", title: "Learn", desc: "Explore the educational content." },
    { id: "quiz", title: "Quiz", desc: "Test your understanding." },
  ],
  certificate: [
    { id: "progress", title: "Progress", desc: "Review your full journey dashboard." },
    { id: "learn", title: "Learn", desc: "Complete more modules to strengthen your certificate." },
    { id: "quiz", title: "Quiz", desc: "Retake the quiz to improve your score." },
  ],
};
