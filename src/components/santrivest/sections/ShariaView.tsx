"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  BookOpen,
  AlertTriangle,
  Dices,
  HandCoins,
  FileSearch,
  Search,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Info,
  ScrollText,
  Moon,
  Clock,
  RotateCcw,
  ChevronRight,
  Coins,
  Package,
  Compass,
  Star,
} from "lucide-react";
import {
  Reveal,
  Stagger,
  StaggerItem,
  CountUp,
  Magnetic,
  Eyebrow,
  SectionHeading,
} from "@/components/santrivest/animations/primitives";
import {
  ViewShell,
  ViewHeader,
  ViewBody,
  ConceptBlock,
  ContinueExploring,
  RELATED_LINKS,
} from "@/components/santrivest/ViewShell";
import { ReflectionJournal } from "@/components/santrivest/ReflectionJournal";
import { FavoriteButton } from "@/components/santrivest/FavoriteButton";
import { useSantrivest } from "@/lib/store";
import {
  GLOSSARY,
  SCRIPTURES,
  HADITHS,
  type GlossaryTerm,
} from "@/lib/educational-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* =========================================================================
   SHARIA VIEW — Riba · Gharar · Maysir · Concepts · Glossary · Quran
   -------------------------------------------------------------------------
   Carefully written, academically respectful. Quranic verses are presented
   reverently (no gamification on the verses themselves).
   ========================================================================= */

export function ShariaView() {
  return (
    <ViewShell>
      <ViewHeader
        eyebrow="Sharia Finance"
        title={
          <>
            The Lines That <span className="text-gradient-emerald">Protect</span>{" "}
            <span className="font-arabic text-primary/90">الحلال</span> Income
          </>
        }
        subtitle="Understand the three prohibitions that shape Islamic finance — riba, gharar, maysir — and the contracts and guidance that build halal wealth."
        back="home"
        backLabel="Back to Home"
      />

      <ViewBody className="gap-14 md:gap-20">
        <RibaSection />
        <GhararSection />
        <MaysirSection />
        <ComparisonSection />
        <ConceptsSection />
        <GlossarySection />
        <ScriptureSection />
      </ViewBody>
      <ContinueExploring current="sharia" links={RELATED_LINKS.sharia} />
    </ViewShell>
  );
}

/* =========================================================================
   SECTION 1 — RIBA
   ========================================================================= */

type FlowTone = "primary" | "danger" | "neutral";

interface FlowNode {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | null;
  sub: string;
  tone: FlowTone;
}

function RibaFlowDiagram({
  runId,
  kind,
}: {
  runId: number;
  kind: "trade" | "riba";
}) {
  const isTrade = kind === "trade";
  const nodes: FlowNode[] = isTrade
    ? [
        {
          icon: HandCoins,
          label: "You buy",
          value: 1_000_000,
          sub: "Real exchange of goods",
          tone: "primary",
        },
        {
          icon: Package,
          label: "You receive",
          value: null,
          sub: "Item · risk · effort",
          tone: "neutral",
        },
        {
          icon: Sparkles,
          label: "You sell for",
          value: 1_200_000,
          sub: "+ Rp200,000 profit",
          tone: "primary",
        },
      ]
    : [
        {
          icon: HandCoins,
          label: "You lend",
          value: 1_000_000,
          sub: "Money leaves your hand",
          tone: "danger",
        },
        {
          icon: Clock,
          label: "Time passes",
          value: null,
          sub: "No goods · no shared risk",
          tone: "neutral",
        },
        {
          icon: Coins,
          label: "Repaid to you",
          value: 1_200_000,
          sub: "+ Rp200,000 interest",
          tone: "danger",
        },
      ];

  return (
    <div
      key={runId}
      className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-1.5"
      aria-label={isTrade ? "Trade flow animation" : "Riba flow animation"}
    >
      {nodes.map((n, i) => {
        const Icon = n.icon;
        const delay = 0.2 + i * 0.6;
        return (
          <div
            key={i}
            className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-1.5"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-xl border p-3.5 md:flex-none md:w-44",
                n.tone === "primary" && "border-primary/30 bg-primary/[0.04]",
                n.tone === "danger" && "border-destructive/30 bg-destructive/[0.04]",
                n.tone === "neutral" && "border-border bg-background"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  n.tone === "primary" && "bg-primary/10 text-primary",
                  n.tone === "danger" && "bg-destructive/10 text-destructive",
                  n.tone === "neutral" && "bg-secondary text-secondary-foreground"
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {n.label}
                </span>
                {n.value !== null ? (
                  <span className="text-base font-extrabold tracking-tight text-foreground">
                    <CountUp
                      value={n.value}
                      prefix="Rp "
                      duration={1.2}
                    />
                  </span>
                ) : (
                  <span className="text-sm font-bold text-foreground">{n.sub}</span>
                )}
                {n.value !== null && (
                  <span className="text-[11px] leading-snug text-muted-foreground">
                    {n.sub}
                  </span>
                )}
              </div>
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.35, duration: 0.35 }}
                className={cn(
                  "flex items-center justify-center",
                  isTrade ? "text-primary/70" : "text-destructive/70"
                )}
                aria-hidden="true"
              >
                <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RibaSection() {
  const [runId, setRunId] = useState(1);

  return (
    <section id="riba" aria-labelledby="riba-title" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-col gap-3">
          <Eyebrow>Prohibition 01</Eyebrow>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2
              id="riba-title"
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Riba
            </h2>
            <span className="font-arabic text-3xl text-primary/90 md:text-4xl">
              ربا
            </span>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            When money generates money through prohibited interest-based
            mechanisms — without any real economic activity behind it.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Simple explanation */}
        <Reveal className="lg:col-span-3">
          <ConceptBlock>
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Simple Explanation
              </span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
              Not every increase is riba.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              <span className="font-semibold text-foreground">Riba</span> is an
              increase generated by charging interest on a loan — money grows
              simply because time has passed, with no exchange of real goods,
              no effort, and no shared risk. Profit from legitimate trade is{" "}
              <span className="font-semibold text-primary">halal</span> and
              encouraged: you take a real good, you bear risk, you add value, and
              you earn a return. The line is not "making a profit" — it is
              whether money created money without real economic activity.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] p-3.5">
              <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-foreground">
                <span className="italic">
                  "Allah has permitted trade and forbidden riba."
                </span>
                <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  Al-Baqarah 2:275
                </span>
              </p>
            </div>
          </ConceptBlock>
        </Reveal>

        {/* Why prohibited + How to recognize */}
        <Reveal className="lg:col-span-2" delay={0.05}>
          <div className="grid h-full gap-4">
            <Card className="border-destructive/20 bg-destructive/[0.03] p-5 shadow-sm">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Why is it prohibited?
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive/60" />
                  Transfers all risk to the borrower.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive/60" />
                  Guarantees a return to the lender regardless of outcome.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive/60" />
                  Creates money from money — no real economic activity.
                </li>
              </ul>
            </Card>
            <Card className="border-primary/20 bg-primary/[0.03] p-5 shadow-sm">
              <div className="flex items-center gap-2 text-primary">
                <Search className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  How to recognize it
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  Interest charged on a loan.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  Money charged purely for the passing of time.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  A guaranteed fixed return on a loan.
                </li>
              </ul>
            </Card>
          </div>
        </Reveal>
      </div>

      {/* Animated comparison */}
      <Reveal delay={0.08}>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card p-5 md:p-7">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="flex flex-col gap-1">
              <Eyebrow>Side by side</Eyebrow>
              <h3 className="text-lg font-bold text-foreground md:text-xl">
                The same Rp200,000 — one is halal, one is riba.
              </h3>
              <p className="text-xs text-muted-foreground md:text-sm">
                Press <span className="font-semibold text-foreground">Run</span>{" "}
                to replay the flow.
              </p>
            </div>
            <Magnetic>
              <button
                onClick={() => setRunId((r) => r + 1)}
                data-cursor="Run"
                aria-label="Replay riba and trade flow animation"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Run
              </button>
            </Magnetic>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {/* Trade card */}
            <div className="flex flex-col rounded-2xl border border-primary/30 bg-primary/[0.03] p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/15 text-primary" variant="secondary">
                    Halal
                  </Badge>
                  <h4 className="text-sm font-bold text-foreground">
                    Trade · legitimate profit
                  </h4>
                </div>
                <Check className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Money → real goods → money + profit. Profit comes from exchanging
                a real item with effort and risk.
              </p>
              <div className="mt-4">
                <RibaFlowDiagram runId={runId} kind="trade" />
              </div>
            </div>

            {/* Riba card */}
            <div className="flex flex-col rounded-2xl border border-destructive/30 bg-destructive/[0.03] p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-destructive/15 text-destructive"
                    variant="secondary"
                  >
                    Prohibited
                  </Badge>
                  <h4 className="text-sm font-bold text-foreground">
                    Riba · interest on a loan
                  </h4>
                </div>
                <X className="h-4 w-4 text-destructive" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Money → (time passes) → money + interest. The extra is charged
                purely for time, with no real goods changing hands.
              </p>
              <div className="mt-4">
                <RibaFlowDiagram runId={runId} kind="riba" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   SECTION 2 — GHARAR MINI-GAME
   ========================================================================= */

interface GhararScenario {
  id: string;
  text: string;
  isGharar: boolean;
  why: string;
}

const GHARAR_SCENARIOS: GhararScenario[] = [
  {
    id: "g1",
    text: "You pay Rp50,000 for a sealed 'mystery box' — the contents are completely unknown to you.",
    isGharar: true,
    why: "Gharar. You cannot know what you are buying — the subject of the sale is unknown. Without clarity on the item, price-to-value is impossible to judge, and disputes become likely.",
  },
  {
    id: "g2",
    text: "You buy a phone described precisely: model, condition, storage, warranty, and a fair price you both agree on.",
    isGharar: false,
    why: "Clear transaction. The subject, price, and terms are all known and mutually agreed — the foundations of a halal sale.",
  },
  {
    id: "g3",
    text: "You pay now for 'a fish in the sea' that the seller has not yet caught and cannot point to.",
    isGharar: true,
    why: "Gharar. The subject of the sale does not yet exist and cannot be identified — its existence, quantity, and quality are all uncertain.",
  },
];

function GhararSection() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const scenario = GHARAR_SCENARIOS[index];
  const isLast = index === GHARAR_SCENARIOS.length - 1;

  const choose = (claimsGharar: boolean) => {
    if (answer !== null) return;
    setAnswer(claimsGharar);
    if (claimsGharar === scenario.isGharar) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(null);
  };

  const reset = () => {
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setDone(false);
  };

  return (
    <section id="gharar" aria-labelledby="gharar-title" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-col gap-3">
          <Eyebrow>Prohibition 02 · Mini-game</Eyebrow>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2
              id="gharar-title"
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Gharar
            </h2>
            <span className="font-arabic text-3xl text-primary/90 md:text-4xl">
              غرر
            </span>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Excessive uncertainty or ambiguity in a transaction — when the
            subject, price, or terms are unclear, unknown, or uncertain.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-6">
          <ConceptBlock>
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                The principle
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              A halal transaction requires clarity — clear subject, clear price,
              clear terms. When essential details are unknown, the door opens to
              dispute and exploitation. Three quick scenarios below: decide
              whether each is a clear transaction or potential gharar.
            </p>
          </ConceptBlock>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card p-5 md:p-7">
          {/* Progress + score */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {GHARAR_SCENARIOS.map((s, i) => (
                <div
                  key={s.id}
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    done && i === GHARAR_SCENARIOS.length - 1
                      ? "w-8 bg-primary"
                      : i < index || done
                        ? "w-8 bg-primary"
                        : i === index
                          ? "w-10 bg-primary/70"
                          : "w-6 bg-border"
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Score {score}/{GHARAR_SCENARIOS.length}
            </span>
          </div>

          <div className="mt-6 min-h-[220px]">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileSearch className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                      Scenario {index + 1} of {GHARAR_SCENARIOS.length}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold leading-relaxed text-foreground md:text-xl">
                    {scenario.text}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => choose(false)}
                      disabled={answer !== null}
                      data-cursor="Choose"
                      aria-label="Choose: clear transaction"
                      className={cn(
                        "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all",
                        answer === false
                          ? scenario.isGharar
                            ? "border-destructive/40 bg-destructive/10 text-destructive"
                            : "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/[0.04]",
                        answer !== null && "opacity-60"
                      )}
                    >
                      <Check className="h-4 w-4" />
                      Clear transaction
                    </button>
                    <button
                      onClick={() => choose(true)}
                      disabled={answer !== null}
                      data-cursor="Choose"
                      aria-label="Choose: potential gharar"
                      className={cn(
                        "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all",
                        answer === true
                          ? scenario.isGharar
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-destructive/40 bg-destructive/10 text-destructive"
                          : "border-border bg-background text-foreground hover:border-destructive/40 hover:bg-destructive/[0.04]",
                        answer !== null && "opacity-60"
                      )}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Potential gharar
                    </button>
                  </div>

                  <AnimatePresence>
                    {answer !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className={cn(
                            "mt-4 flex gap-3 rounded-xl border p-4",
                            answer === scenario.isGharar
                              ? "border-primary/30 bg-primary/[0.04]"
                              : "border-destructive/30 bg-destructive/[0.04]"
                          )}
                        >
                          {answer === scenario.isGharar ? (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          ) : (
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                          )}
                          <div className="flex flex-col gap-1">
                            <span
                              className={cn(
                                "text-xs font-bold uppercase tracking-[0.2em]",
                                answer === scenario.isGharar
                                  ? "text-primary"
                                  : "text-destructive"
                              )}
                            >
                              {answer === scenario.isGharar
                                ? "Correct"
                                : "Not quite"}
                              {" · "}
                              {scenario.isGharar ? "This is gharar" : "This is clear"}
                            </span>
                            <p className="text-sm leading-relaxed text-foreground">
                              {scenario.why}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      onClick={reset}
                      data-cursor="Reset"
                      className="inline-flex h-10 items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restart
                    </button>
                    <Magnetic>
                      <button
                        onClick={next}
                        disabled={answer === null}
                        data-cursor={isLast ? "Finish" : "Next"}
                        className={cn(
                          "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-xs font-semibold transition-all",
                          answer === null
                            ? "cursor-not-allowed bg-secondary text-muted-foreground"
                            : "bg-foreground text-background hover:opacity-90"
                        )}
                      >
                        {isLast ? "See result" : "Next scenario"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Magnetic>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-4 py-6 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold tracking-tight text-foreground">
                      {score}
                      <span className="text-muted-foreground">
                        /{GHARAR_SCENARIOS.length}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {score === GHARAR_SCENARIOS.length
                        ? "Excellent — you can spot gharar clearly."
                        : score >= 2
                          ? "Good. Revisit the cases you missed and try again."
                          : "Review the principle above and try again."}
                    </p>
                  </div>
                  <Magnetic>
                    <button
                      onClick={reset}
                      data-cursor="Retry"
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-xs font-semibold text-background hover:opacity-90"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Play again
                    </button>
                  </Magnetic>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   SECTION 3 — MAYSIR SCENARIOS
   ========================================================================= */

interface MaysirScenario {
  id: string;
  text: string;
  correct: "A" | "B"; // A = Investment, B = Gambling
  why: string;
}

const MAYSIR_SCENARIOS: MaysirScenario[] = [
  {
    id: "m1",
    text: "You pay Rp20,000 for a random prize. You either receive Rp200,000 or nothing at all.",
    correct: "B",
    why: "Gambling (maysir). The outcome depends entirely on chance — not on productive economic activity. You are not buying a real good or service; you are paying for the chance to win. Al-Maidah 5:90 explicitly prohibits maysir.",
  },
  {
    id: "m2",
    text: "You buy a Rp5,000 lottery ticket. The draw is random — most tickets win nothing, a few win large sums.",
    correct: "B",
    why: "Gambling (maysir). A lottery is a classic case of maysir: gain depends on pure chance, money moves from the many to the few, and no real value is exchanged.",
  },
  {
    id: "m3",
    text: "You bet Rp50,000 on a football match result. If your team wins, you receive Rp100,000; if they lose, you lose your Rp50,000.",
    correct: "B",
    why: "Gambling (maysir). Betting on an uncertain outcome is maysir — the gain depends on chance and produces no real economic value. Wealth changes hands without lawful trade.",
  },
];

function MaysirSection() {
  return (
    <section id="maysir" aria-labelledby="maysir-title" className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-col gap-3">
          <Eyebrow>Prohibition 03</Eyebrow>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2
              id="maysir-title"
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Maysir
            </h2>
            <span className="font-arabic text-3xl text-primary/90 md:text-4xl">
              ميسر
            </span>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Gambling and games of chance where gain depends primarily on chance
            rather than legitimate economic activity.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {MAYSIR_SCENARIOS.map((s, i) => (
          <MaysirCard key={s.id} scenario={s} index={i} />
        ))}
      </div>

      <Reveal delay={0.05}>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
          <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-foreground">
            <span className="italic">
              "Intoxicants, gambling (maysir), and divining arrows are an
              abomination, of Satan&apos;s handiwork. So avoid them, that you may
              succeed."
            </span>
            <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              Al-Maidah 5:90
            </span>
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function MaysirCard({
  scenario,
  index,
}: {
  scenario: MaysirScenario;
  index: number;
}) {
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const answered = choice !== null;
  const correct = choice === scenario.correct;

  return (
    <Reveal delay={index * 0.06}>
      <Card className="flex h-full flex-col gap-4 p-5 shadow-sm transition-shadow hover:shadow-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Dices className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Case {index + 1}
            </span>
          </div>
          {answered && (
            <Badge
              variant="secondary"
              className={
                correct
                  ? "bg-primary/15 text-primary"
                  : "bg-destructive/15 text-destructive"
              }
            >
              {correct ? (
                <>
                  <Check className="h-3 w-3" /> Correct
                </>
              ) : (
                <>
                  <X className="h-3 w-3" /> Review
                </>
              )}
            </Badge>
          )}
        </div>

        <p className="text-sm font-semibold leading-relaxed text-foreground">
          {scenario.text}
        </p>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Is this closer to investment or gambling?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setChoice("A")}
              disabled={answered}
              data-cursor="Choose"
              aria-label="Choose: investment"
              className={cn(
                "flex h-11 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition-all",
                choice === "A"
                  ? scenario.correct === "A"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-background text-foreground hover:border-primary/40",
                answered && "opacity-70"
              )}
            >
              A · Investment
            </button>
            <button
              onClick={() => setChoice("B")}
              disabled={answered}
              data-cursor="Choose"
              aria-label="Choose: gambling"
              className={cn(
                "flex h-11 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition-all",
                choice === "B"
                  ? scenario.correct === "B"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-background text-foreground hover:border-primary/40",
                answered && "opacity-70"
              )}
            >
              B · Gambling
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-border/70 bg-background/60 p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  <Info className="h-3 w-3" />
                  Answer: B · Gambling
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {scenario.why}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </Reveal>
  );
}

/* =========================================================================
   SECTION 4 — ISLAMIC FINANCE CONCEPTS GRID
   ========================================================================= */

interface ConceptMeta {
  term: string;
  whyItMatters: string;
  watchFor: string;
}

const CONCEPT_METAS: ConceptMeta[] = [
  {
    term: "Murabahah",
    whyItMatters: "Transparency in cost and profit builds trust between buyer and seller.",
    watchFor: "Profit must be disclosed, and the asset must exist and be owned by the seller first.",
  },
  {
    term: "Mudharabah",
    whyItMatters: "Rewards both capital and effort fairly by sharing risk instead of dumping it on one party.",
    watchFor: "Losses are borne by the capital provider unless the worker was negligent.",
  },
  {
    term: "Musyarakah",
    whyItMatters: "True risk-sharing makes partnerships equitable and aligned with Sharia.",
    watchFor: "Profits follow an agreed ratio; losses follow capital contribution.",
  },
  {
    term: "Wakalah",
    whyItMatters: "Lets you delegate tasks while keeping accountability clear.",
    watchFor: "The agent must act within the agreed scope and may not take undisclosed sides.",
  },
  {
    term: "Ijarah",
    whyItMatters: "Lets you use an asset you cannot yet buy without resorting to interest-based loans.",
    watchFor: "The owner bears ownership risks (maintenance, defects); rent must be for clear use.",
  },
  {
    term: "Sukuk",
    whyItMatters: "Gives halal access to investment returns tied to real assets, not interest.",
    watchFor: "Returns must come from the underlying asset's performance, not a guaranteed fixed payout.",
  },
  {
    term: "Halal Income",
    whyItMatters: "Pure income carries barakah; the Prophet ﷺ praised honest earning.",
    watchFor: "Source must be permissible work, goods, or services — no fraud, no haram industry.",
  },
  {
    term: "Sharia Screening",
    whyItMatters: "Protects investors from unintentionally funding prohibited activities.",
    watchFor: "Check both business activity and financial ratios (debt, interest, impermissible income).",
  },
];

/* =========================================================================
   SECTION 3.5 — ISLAMIC vs CONVENTIONAL FINANCE COMPARISON
   ========================================================================= */

const COMPARISON_ROWS = [
  {
    feature: "Core principle",
    islamic: "Risk & reward shared; backed by real assets",
    conventional: "Risk transferred; money generates money",
  },
  {
    feature: "Interest (riba)",
    islamic: "Prohibited — no fixed interest on loans",
    conventional: "Central — interest is the primary return",
  },
  {
    feature: "Backing",
    islamic: "Tangible assets or real economic activity",
    conventional: "May be unbacked (derivatives, speculation)",
  },
  {
    feature: "Risk",
    islamic: "Shared between parties (profit & loss)",
    conventional: "Borne by borrower; lender guaranteed",
  },
  {
    feature: "Uncertainty (gharar)",
    islamic: "Prohibited — terms must be clear",
    conventional: "Common (derivatives, complex products)",
  },
  {
    feature: "Gambling (maysir)",
    islamic: "Prohibited",
    conventional: "Permitted (speculation, derivatives)",
  },
  {
    feature: "Ethical screening",
    islamic: "Business must be Sharia-compliant",
    conventional: "No religious screening",
  },
  {
    feature: "Profit source",
    islamic: "Trade, lease, partnership, real activity",
    conventional: "Interest, speculation, fees",
  },
];

function ComparisonSection() {
  return (
    <section aria-labelledby="comparison-title" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Side by side"
        title={
          <>
            Islamic vs <span className="text-gradient-emerald">Conventional</span> Finance
          </>
        }
        subtitle="A clear comparison of the foundational differences — not to condemn, but to understand why Sharia finance is designed differently."
      />

      <Reveal delay={0.05}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-border/60 bg-secondary/40">
            <div className="p-3 md:p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Feature
              </span>
            </div>
            <div className="border-l border-border/60 p-3 md:p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Islamic Finance
              </span>
            </div>
            <div className="border-l border-border/60 p-3 md:p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Conventional Finance
              </span>
            </div>
          </div>
          {/* Data rows */}
          {COMPARISON_ROWS.map((row, i) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={cn(
                "grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-border/40 transition-colors last:border-b-0 hover:bg-primary/[0.02]",
                i % 2 === 1 && "bg-background/30"
              )}
            >
              <div className="p-3 md:p-4">
                <span className="text-xs font-bold text-foreground md:text-sm">{row.feature}</span>
              </div>
              <div className="border-l border-border/40 p-3 md:p-4">
                <div className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-xs leading-relaxed text-foreground md:text-sm">{row.islamic}</span>
                </div>
              </div>
              <div className="border-l border-border/40 p-3 md:p-4">
                <div className="flex items-start gap-1.5">
                  <X className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                  <span className="text-xs leading-relaxed text-muted-foreground md:text-sm">{row.conventional}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.03] p-3.5">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span> This comparison highlights
            structural differences, not moral judgment of individuals. The goal is understanding —
            so you can make informed, intentional financial decisions.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function categoryTone(category: string): string {
  switch (category) {
    case "Contract":
      return "bg-primary/10 text-primary";
    case "Investment":
      return "bg-[oklch(0.78_0.13_85)]/20 text-[oklch(0.45_0.1_75)]";
    case "Principle":
      return "bg-secondary text-secondary-foreground";
    case "Forbidden":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function ConceptsSection() {
  const openTerm = useSantrivest((s) => s.openTerm);

  const concepts = CONCEPT_METAS.map((m) => {
    const g = GLOSSARY.find((x) => x.term === m.term);
    return g ? { ...m, glossary: g } : null;
  }).filter((c): c is ConceptMeta & { glossary: GlossaryTerm } => c !== null);

  return (
    <section
      id="concepts"
      aria-labelledby="concepts-title"
      className="scroll-mt-24"
    >
      <SectionHeading
        eyebrow="Glossary in depth"
        title={
          <>
            Islamic Finance Contracts &amp;{" "}
            <span className="text-gradient-emerald">Concepts</span>
          </>
        }
        subtitle="Eight foundational contracts and principles that replace interest-based finance with risk-sharing, real assets, and transparency."
      />

      <Reveal delay={0.05}>
        <Accordion
          type="single"
          collapsible
          className="mt-8"
          onValueChange={(v) => {
            if (v) openTerm(v);
          }}
        >
          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {concepts.map((c) => (
              <StaggerItem key={c.term}>
                <Card className="h-full gap-0 p-0 shadow-sm transition-shadow hover:shadow-lift">
                  <AccordionItem
                    value={c.term}
                    className="border-b-0"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-base font-bold text-foreground">
                              {c.glossary.term}
                            </h3>
                            {c.glossary.arabic && (
                              <span className="font-arabic text-lg text-primary/80">
                                {c.glossary.arabic}
                              </span>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn("w-fit", categoryTone(c.glossary.category))}
                          >
                            {c.glossary.category}
                          </Badge>
                        </div>
                        <Compass className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {c.glossary.short}
                      </p>

                      <div className="mt-4 space-y-2.5">
                        <div className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                              Why it matters
                            </span>
                            <p className="text-xs leading-relaxed text-foreground">
                              {c.whyItMatters}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.45_0.1_75)]" aria-hidden="true" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                              What to watch for
                            </span>
                            <p className="text-xs leading-relaxed text-foreground">
                              {c.watchFor}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <AccordionTrigger
                      className="px-5 py-3 text-xs font-semibold text-primary hover:no-underline"
                      data-cursor="Open"
                      aria-label={`Show real-life example for ${c.term}`}
                    >
                      <span className="flex items-center gap-2">
                        <Lightbulb className="h-3.5 w-3.5" />
                        Real-life example
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-0">
                      <div className="rounded-lg border border-border/60 bg-background/60 p-3.5">
                        <p className="text-xs leading-relaxed text-foreground">
                          {c.glossary.example}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Accordion>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   SECTION 5 — INTERACTIVE GLOSSARY (SEARCH + DIALOG)
   ========================================================================= */

function GlossarySection() {
  const openTerm = useSantrivest((s) => s.openTerm);
  const favorites = useSantrivest((s) => s.favorites);
  const [query, setQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<GlossaryTerm | null>(null);

  const filtered = useMemo(() => {
    let list = GLOSSARY;
    if (showFavoritesOnly) {
      list = list.filter((g) => favorites.includes(g.term));
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((g) =>
      [
        g.term,
        g.arabic ?? "",
        g.short,
        g.long,
        g.example,
        g.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, showFavoritesOnly, favorites]);

  const openSelected = (g: GlossaryTerm) => {
    setSelected(g);
    openTerm(g.term);
  };

  return (
    <section
      id="glossary"
      aria-labelledby="glossary-title"
      className="scroll-mt-24"
    >
      <SectionHeading
        eyebrow="Look it up"
        title={
          <>
            Search the <span className="text-gradient-emerald">Glossary</span>
          </>
        }
        subtitle="Type any Islamic finance term — in English or Arabic. Tap a result to read the full definition and example."
      />

      <Reveal delay={0.05}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card p-5 md:p-7">
          {/* Search bar */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-cursor="Search"
              aria-label="Search glossary terms"
              placeholder="Search: riba, murabahah, sukuk, …"
              className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span>
              {filtered.length} {filtered.length === 1 ? "term" : "terms"}
              {query.trim() && (
                <span className="ml-1 font-normal normal-case text-muted-foreground/80">
                  · matching &ldquo;{query.trim()}&rdquo;
                </span>
              )}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFavoritesOnly((v) => !v)}
                aria-pressed={showFavoritesOnly}
                data-cursor="Filter"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-all",
                  showFavoritesOnly
                    ? "border-amber-400/40 bg-amber-50 text-amber-700"
                    : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <Star className={cn("h-3 w-3", showFavoritesOnly && "fill-amber-500 text-amber-500")} />
                Favorites {favorites.length > 0 && `(${favorites.length})`}
              </button>
              {query.trim() && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <FileSearch className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                No terms found
              </p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Try a different word, or browse the concept cards above.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {filtered.map((g) => (
                <li key={g.term} className="group relative">
                  <button
                    onClick={() => openSelected(g)}
                    data-cursor="Open"
                    aria-label={`Open glossary entry: ${g.term}`}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 px-4 py-3 pr-12 text-left transition-all hover:border-primary/40 hover:bg-primary/[0.03]"
                  >
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {g.term}
                        </span>
                        {g.arabic && (
                          <span className="font-arabic text-base text-primary/80">
                            {g.arabic}
                          </span>
                        )}
                      </div>
                      <span className="truncate text-xs text-muted-foreground">
                        {g.short}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <FavoriteButton term={g.term} size="sm" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      <Dialog
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <DialogTitle className="text-xl font-bold text-foreground">
                      {selected.term}
                    </DialogTitle>
                    {selected.arabic && (
                      <span className="font-arabic text-2xl text-primary/90">
                        {selected.arabic}
                      </span>
                    )}
                  </div>
                  <FavoriteButton term={selected.term} size="md" />
                </div>
                <DialogDescription>
                  <Badge
                    variant="secondary"
                    className={cn("mt-1", categoryTone(selected.category))}
                  >
                    {selected.category}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Definition
                  </span>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                    {selected.long}
                  </p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/60 p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    <Lightbulb className="h-3 w-3" />
                    Real-life example
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                    {selected.example}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* =========================================================================
   SECTION 6 — QURAN & HADITH (REVERENT, NOT GAMIFIED)
   ========================================================================= */

function ScriptureSection() {
  return (
    <section
      id="quran-hadith"
      aria-labelledby="scripture-title"
      className="scroll-mt-24"
    >
      <SectionHeading
        eyebrow="Guidance"
        title={
          <>
            Quran &amp; <span className="text-gradient-emerald">Hadith</span>
          </>
        }
        subtitle="The verses and narrations that ground Islamic finance in revelation — read with calm and reflection."
      />

      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Scripture is presented reverently. The interaction here is gentle — a
        quiet fade-in, room to breathe — never a game.
      </p>

      {/* Quran verses */}
      <Stagger className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {SCRIPTURES.map((s) => (
          <StaggerItem key={s.reference}>
            <article className="flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-lift md:p-7">
              <header className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                    Quran
                  </span>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {s.reference}
                </Badge>
              </header>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {s.surahName}
              </p>

              {/* Arabic verse — reverent, not animated */}
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl leading-loose text-foreground md:text-3xl"
              >
                {s.arabic}
              </p>

              {/* Translation */}
              <p className="text-sm italic leading-relaxed text-muted-foreground md:text-base">
                {s.translation}
              </p>

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Theme · {s.theme}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {s.explanation}
                </p>
                {s.reflection && (
                  <div className="rounded-xl border border-border/60 bg-background/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[oklch(0.45_0.1_75)]">
                      <Moon className="h-3 w-3" />
                      A quiet reflection
                    </div>
                    <p className="mt-1.5 text-sm italic leading-relaxed text-foreground">
                      {s.reflection}
                    </p>
                  </div>
                )}
                {/* Interactive reflection journal — student writes their own response */}
                <ReflectionJournal
                  journalKey={s.reference}
                  prompt={s.reflection || "What does this verse mean to you in your financial life?"}
                />
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Hadiths — distinct accent (gold) */}
      <Stagger className="mt-4 flex flex-col gap-4">
        {HADITHS.map((h) => (
          <StaggerItem key={h.reference}>
            <article className="flex flex-col gap-4 rounded-2xl border border-[oklch(0.78_0.13_85)]/40 bg-gradient-to-br from-[oklch(0.99_0.01_90)] via-card to-[oklch(0.97_0.03_90)] p-6 shadow-sm md:p-8">
              <header className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[oklch(0.45_0.1_75)]">
                  <ScrollText className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                    Hadith
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-[oklch(0.78_0.13_85)]/20 text-[oklch(0.45_0.1_75)]"
                >
                  {h.reference}
                </Badge>
              </header>

              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Saying of the Prophet ﷺ
              </p>

              <p
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl leading-loose text-foreground md:text-3xl"
              >
                {h.arabic}
              </p>

              <p className="text-sm italic leading-relaxed text-muted-foreground md:text-base">
                {h.translation}
              </p>

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[oklch(0.45_0.1_75)]" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Theme · {h.theme}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {h.explanation}
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.06}>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Scale className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>
            Every halal financial contract on this page traces back to these
            verses and to the example of the Prophet ﷺ.
          </span>
        </div>
      </Reveal>
    </section>
  );
}
