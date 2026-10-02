"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Flame,
  BookOpen,
  Brain,
  FlaskConical,
  Check,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Target,
  GraduationCap,
  Compass,
  TrendingUp,
  Trophy,
  Award,
  PenLine,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ViewShell, ViewHeader, ViewBody, ContinueExploring, RELATED_LINKS } from "@/components/santrivest/ViewShell";
import { BadgeGrid } from "@/components/santrivest/Badges";
import { StreakRewards } from "@/components/santrivest/StreakRewards";
import { QuizHistory } from "@/components/santrivest/QuizHistory";
import { ProgressExport } from "@/components/santrivest/ProgressExport";
import {
  Reveal,
  Stagger,
  StaggerItem,
  CountUp,
  Magnetic,
  Eyebrow,
} from "@/components/santrivest/animations/primitives";
import { useSantrivest } from "@/lib/store";
import { LEARN_MODULES, GLOSSARY } from "@/lib/educational-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

/* ------------------------------------------------------------------ */
/*  Stage definitions                                                  */
/* ------------------------------------------------------------------ */

type StageDef = {
  label: string;
  caption: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STAGES: StageDef[] = [
  { label: "Beginner", caption: "0 modules", icon: GraduationCap },
  { label: "Explorer", caption: "1–2 modules", icon: Compass },
  { label: "Planner", caption: "3–4 modules", icon: Target },
  { label: "Investor", caption: "5–6 modules", icon: TrendingUp },
];

function stageIndexFromCompleted(n: number): number {
  if (n <= 0) return 0;
  if (n <= 2) return 1;
  if (n <= 4) return 2;
  return 3;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function relativeDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  iconClass,
  label,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <StaggerItem className="h-full">
      <Card
        className={cn(
          "group h-full gap-4 border-border/70 bg-card/80 p-6 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:border-primary/30",
          className
        )}
      >
        <CardContent className="flex h-full flex-col gap-4 px-0">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                iconClass
              )}
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </span>
          </div>
          {children}
        </CardContent>
      </Card>
    </StaggerItem>
  );
}

function StageNode({
  stage,
  index,
  active,
  reached,
  layout,
}: {
  stage: StageDef;
  index: number;
  active: boolean;
  reached: boolean;
  layout: "horizontal" | "vertical";
}) {
  const Icon = stage.icon;
  const pulseKeyframes = {
    boxShadow: [
      "0 0 0 0 oklch(0.52 0.13 162 / 0.35)",
      "0 0 0 10px oklch(0.52 0.13 162 / 0)",
      "0 0 0 0 oklch(0.52 0.13 162 / 0)",
    ],
  };

  const node = (
    <motion.div
      animate={active ? pulseKeyframes : {}}
      transition={{ duration: 2.2, repeat: active ? Infinity : 0, ease: "easeOut" }}
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors duration-300",
        reached
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground/70",
        active && "ring-1 ring-primary/30"
      )}
      aria-hidden
    >
      <Icon className="h-6 w-6" />
      {reached && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-background">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </motion.div>
  );

  const label = (
    <div className="flex flex-col gap-0.5">
      <span
        className={cn(
          "text-sm font-semibold tracking-tight",
          reached ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {stage.label}
      </span>
      <span className="text-[11px] text-muted-foreground/80">{stage.caption}</span>
      {active && (
        <Badge
          variant="outline"
          className="mt-1 w-fit border-primary/30 bg-primary/10 text-primary"
        >
          You are here
        </Badge>
      )}
    </div>
  );

  if (layout === "horizontal") {
    return (
      <li
        aria-current={active ? "step" : undefined}
        className="relative z-10 flex flex-col items-center gap-3 px-1"
      >
        {node}
        <div className="flex flex-col items-center text-center">{label}</div>
      </li>
    );
  }

  return (
    <li
      aria-current={active ? "step" : undefined}
      className="relative z-10 flex items-center gap-4"
    >
      {node}
      {label}
    </li>
  );
}

function JourneyPath({ stageIdx }: { stageIdx: number }) {
  const linePct = (stageIdx / (STAGES.length - 1)) * 100;

  return (
    <section
      aria-label="Journey stages"
      className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/60 to-background/40 p-6 md:p-8"
    >
      <div className="mb-6 flex flex-col gap-2 md:mb-8">
        <Eyebrow>Learning path</Eyebrow>
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Your stage on the journey
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Each stage reflects how many foundational modules you have completed.
          Keep going to grow from a curious beginner into a confident Sharia investor.
        </p>
      </div>

      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-7 right-7 top-7 h-[3px] -translate-y-1/2 rounded-full bg-border/80" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${linePct}%` }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="absolute left-7 top-7 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/40 via-primary/70 to-primary"
          />
          <ol className="relative flex justify-between">
            {STAGES.map((s, i) => (
              <StageNode
                key={s.label}
                stage={s}
                index={i}
                reached={i <= stageIdx}
                active={i === stageIdx}
                layout="horizontal"
              />
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden">
        <div className="relative">
          <div className="absolute bottom-7 left-7 top-7 w-[3px] -translate-x-1/2 rounded-full bg-border/80" />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${linePct}%` }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="absolute left-7 top-7 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/40 via-primary/70 to-primary"
          />
          <ol className="relative flex flex-col gap-7">
            {STAGES.map((s, i) => (
              <StageNode
                key={s.label}
                stage={s}
                index={i}
                reached={i <= stageIdx}
                active={i === stageIdx}
                layout="vertical"
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function KnowledgeRadar({
  completedModules,
}: {
  completedModules: string[];
}) {
  const data = LEARN_MODULES.map((m) => ({
    area: m.title,
    value: completedModules.includes(m.id) ? 100 : 25,
    fullMark: 100,
  }));

  const completed = completedModules.length;
  const total = LEARN_MODULES.length;
  const mastery = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="h-full gap-5 border-border/70 bg-card/80 p-6 md:p-7 shadow-lift">
      <CardContent className="flex h-full flex-col gap-5 px-0">
        <div className="flex flex-col gap-2">
          <Eyebrow>What you've covered</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Knowledge Areas
            </h3>
            <span className="text-xs font-medium text-muted-foreground">
              <span className="text-primary">
                <CountUp value={mastery} suffix="%" />
              </span>{" "}
              mastery
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Six pillars of Islamic financial literacy. Completed modules reach full
            confidence; others remain at awareness level until you explore them.
          </p>
        </div>

        <Separator />

        <div className="relative h-[260px] w-full sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              outerRadius="72%"
              cx="50%"
              cy="50%"
              margin={{ top: 12, right: 18, bottom: 12, left: 18 }}
            >
              <PolarGrid
                stroke="oklch(0.52 0.13 162 / 0.14)"
                strokeWidth={1}
              />
              <PolarAngleAxis
                dataKey="area"
                tick={{
                  fill: "oklch(0.4 0.015 160)",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
              <Radar
                name="Mastery"
                dataKey="value"
                stroke="oklch(0.52 0.13 162)"
                strokeWidth={2}
                fill="oklch(0.52 0.13 162)"
                fillOpacity={0.22}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
                dot={{
                  r: 3,
                  fill: "oklch(0.52 0.13 162)",
                  strokeWidth: 0,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.map((d) => (
            <div
              key={d.area}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  d.value >= 100 ? "bg-primary" : "bg-muted-foreground/40"
                )}
                aria-hidden
              />
              <span className="truncate text-[11px] font-medium text-muted-foreground">
                {d.area}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ModulesChecklist({
  completedModules,
  openedTerms,
  setView,
}: {
  completedModules: string[];
  openedTerms: string[];
  setView: (v: "learn") => void;
}) {
  return (
    <Card className="h-full gap-5 border-border/70 bg-card/80 p-6 md:p-7 shadow-lift">
      <CardContent className="flex h-full flex-col gap-5 px-0">
        <div className="flex flex-col gap-2">
          <Eyebrow>Module tracker</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Learning Modules
            </h3>
            <span className="text-xs font-medium text-muted-foreground">
              <span className="text-primary">{openedTerms.length}</span>/
              {GLOSSARY.length} glossary terms explored
            </span>
          </div>
        </div>

        <Separator />

        <ul className="flex flex-col gap-2">
          {LEARN_MODULES.map((m) => {
            const done = completedModules.includes(m.id);
            return (
              <li key={m.id}>
                <div
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                    done
                      ? "border-primary/20 bg-primary/[0.05]"
                      : "border-border/60 bg-background/40 hover:border-border hover:bg-secondary/40"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                      done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : m.number}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {m.title}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {m.summary}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={done ? "outline" : "default"}
                    onClick={() => setView("learn")}
                    data-cursor={done ? "Review" : "Continue"}
                    className="h-8 shrink-0 px-3 text-xs"
                  >
                    {done ? "Review" : "Continue"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main view                                                          */
/* ------------------------------------------------------------------ */

export function ProgressView() {
  const completedModules = useSantrivest((s) => s.completedModules);
  const openedTerms = useSantrivest((s) => s.openedTerms);
  const quizResult = useSantrivest((s) => s.quizResult);
  const simSessions = useSantrivest((s) => s.simSessions);
  const streak = useSantrivest((s) => s.streak);
  const researchPre = useSantrivest((s) => s.researchPre);
  const researchPost = useSantrivest((s) => s.researchPost);
  const reflections = useSantrivest((s) => s.reflections);
  const setView = useSantrivest((s) => s.setView);
  const reset = useSantrivest((s) => s.reset);

  const [resetOpen, setResetOpen] = React.useState(false);

  const stageIdx = stageIndexFromCompleted(completedModules.length);
  const lessonsPct =
    LEARN_MODULES.length > 0
      ? Math.round((completedModules.length / LEARN_MODULES.length) * 100)
      : 0;
  const quizPct = quizResult
    ? quizResult.total > 0
      ? Math.round((quizResult.score / quizResult.total) * 100)
      : 0
    : 0;

  const lastThreeSims = simSessions.slice(0, 3);

  const isZeroState =
    completedModules.length === 0 &&
    !quizResult &&
    simSessions.length === 0 &&
    openedTerms.length === 0;

  const handleReset = () => {
    reset();
    setResetOpen(false);
  };

  return (
    <ViewShell>
      <ViewHeader
        eyebrow="Your Journey"
        title={<>Your Financial Journey</>}
        subtitle="A clear map of what you've learned, what you've practiced, and where your financial confidence is growing — one step at a time."
        back="home"
        backLabel="Back to Home"
      />

      <ViewBody className="gap-8 md:gap-12">
        {/* ---------------- Empty state banner ---------------- */}
        {isZeroState && (
          <Reveal>
            <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.07] via-card to-card shadow-lift">
              <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:gap-7 md:p-8">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                  aria-hidden
                >
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Your journey starts here.
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Begin with the first learning module — Money Basics — and watch your
                    knowledge map fill in as you progress. Every lesson, every
                    simulation, every quiz contributes to your confidence.
                  </p>
                </div>
                <Magnetic strength={0.4}>
                  <Button
                    onClick={() => setView("learn")}
                    data-cursor="Start"
                    size="lg"
                    className="h-12 px-6"
                  >
                    Start Learning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Magnetic>
              </CardContent>
            </Card>
          </Reveal>
        )}

        {/* ---------------- Journey path ---------------- */}
        <Reveal>
          <JourneyPath stageIdx={stageIdx} />
        </Reveal>

        {/* ---------------- Stat cards ---------------- */}
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {/* Lessons */}
          <StatCard
            icon={BookOpen}
            iconClass="bg-primary/10 text-primary"
            label="Lessons"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                <CountUp value={completedModules.length} />
              </span>
              <span className="text-base font-medium text-muted-foreground">
                / {LEARN_MODULES.length}
              </span>
            </div>
            <Progress value={lessonsPct} className="h-1.5 bg-primary/15" />
            <span className="text-[11px] text-muted-foreground">
              {lessonsPct}% complete
            </span>
          </StatCard>

          {/* Quiz */}
          <StatCard
            icon={Brain}
            iconClass="bg-primary/10 text-primary"
            label="Quiz"
          >
            {quizResult ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">
                    <CountUp value={quizResult.score} />
                  </span>
                  <span className="text-base font-medium text-muted-foreground">
                    / {quizResult.total}
                  </span>
                </div>
                <Progress value={quizPct} className="h-1.5 bg-primary/15" />
                <span className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-primary">
                    <CountUp value={quizPct} suffix="%" />
                  </span>{" "}
                  accuracy
                </span>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight text-muted-foreground">
                    Not taken
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Test what you've learned across all six modules.
                </p>
                <Button
                  onClick={() => setView("quiz")}
                  data-cursor="Take"
                  variant="default"
                  size="sm"
                  className="mt-1 h-8 w-fit px-3 text-xs"
                >
                  Take quiz
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </StatCard>

          {/* Simulations */}
          <StatCard
            icon={FlaskConical}
            iconClass="bg-primary/10 text-primary"
            label="Simulations"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                <CountUp value={simSessions.length} />
              </span>
              <span className="text-[11px] text-muted-foreground">runs</span>
            </div>
            {lastThreeSims.length > 0 ? (
              <div className="scroll-thin -mr-1 max-h-20 overflow-y-auto pr-1">
                <ul className="flex flex-col gap-1.5">
                  {lastThreeSims.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-2 text-[11px]"
                    >
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                        <span className="truncate font-medium text-foreground">
                          {s.label}
                        </span>
                      </span>
                      <span className="shrink-0 text-muted-foreground">
                        {relativeDate(s.date)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Run budget, sukuk, or stock scenarios to apply what you've learned.
              </p>
            )}
          </StatCard>

          {/* Streak */}
          <StatCard
            icon={Flame}
            iconClass="bg-amber-400/15 text-amber-600"
            label="Streak"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-amber-600">
                <CountUp value={streak} />
              </span>
              <span className="text-base font-medium text-muted-foreground">
                {streak === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 w-3 rounded-full transition-colors",
                      i < Math.min(streak, 5)
                        ? "bg-amber-500"
                        : "bg-amber-500/15"
                    )}
                  />
                ))}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Keep your streak alive.
              </span>
            </div>
          </StatCard>
        </Stagger>

        {/* ---------------- Knowledge + Modules ---------------- */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal>
            <KnowledgeRadar completedModules={completedModules} />
          </Reveal>
          <Reveal delay={0.08}>
            <ModulesChecklist
              completedModules={completedModules}
              openedTerms={openedTerms}
              setView={setView}
            />
          </Reveal>
        </div>

        {/* ---------------- Badges / Achievements ---------------- */}
        <Reveal>
          <section aria-label="Achievements" className="rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
            <BadgeGrid />
          </section>
        </Reveal>

        {/* ---------------- Streak & Rewards ---------------- */}
        <Reveal>
          <section aria-label="Streak and rewards" className="rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
            <StreakRewards />
          </section>
        </Reveal>

        {/* ---------------- Quiz History ---------------- */}
        <Reveal>
          <section aria-label="Quiz history" className="rounded-2xl border border-border/70 bg-card/40 p-5 md:p-6">
            <QuizHistory />
          </section>
        </Reveal>

        {/* ---------------- Research + Reflection status ---------------- */}
        {(researchPre || researchPost || Object.keys(reflections).length > 0) && (
          <Reveal>
            <section
              aria-label="Research and reflection participation"
              className="overflow-hidden rounded-2xl border border-border/70 bg-card p-5 md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <Eyebrow>Reflection &amp; Research</Eyebrow>
                  <p className="text-sm text-muted-foreground">
                    Personal reflections and research contributions are stored locally on your device.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => setView("sharia")}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold transition-colors hover:bg-secondary",
                        Object.keys(reflections).length > 0
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      <PenLine className="h-3 w-3" />
                      {Object.keys(reflections).length} reflection{Object.keys(reflections).length !== 1 ? "s" : ""}
                    </button>
                    {researchPre && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                        Pre-test ✓
                      </span>
                    )}
                    {researchPost && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                        Post-test ✓
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setView("sharia")}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    <PenLine className="h-3.5 w-3.5" /> Add reflection
                  </button>
                  <button
                    onClick={() => setView("research")}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    Research Mode
                  </button>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* ---------------- Action area ---------------- */}
        <Reveal>
          <section
            aria-label="Quick actions"
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.05] via-card/40 to-background/30 p-6 md:p-8"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-2xl" aria-hidden />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <Eyebrow>Next steps</Eyebrow>
                <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  Keep your momentum going
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Pick up where you left off, challenge yourself with the quiz, or
                  put theory into practice with a simulation.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Magnetic strength={0.4}>
                  <Button
                    onClick={() => setView("learn")}
                    data-cursor="Continue"
                    size="lg"
                    className="h-12 px-6"
                  >
                    <BookOpen className="h-4 w-4" />
                    Continue Learning
                  </Button>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <Button
                    onClick={() => setView("quiz")}
                    data-cursor="Take"
                    variant="outline"
                    size="lg"
                    className="h-12 px-6"
                  >
                    <Brain className="h-4 w-4 text-primary" />
                    Take the Quiz
                  </Button>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <Button
                    onClick={() => setView("simulation")}
                    data-cursor="Try"
                    variant="outline"
                    size="lg"
                    className="h-12 px-6"
                  >
                    <FlaskConical className="h-4 w-4 text-primary" />
                    Try a Simulation
                  </Button>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <Button
                    onClick={() => setView("certificate")}
                    data-cursor="Open"
                    variant="outline"
                    size="lg"
                    className="h-12 px-6"
                  >
                    <Award className="h-4 w-4 text-amber-500" />
                    Certificate
                  </Button>
                </Magnetic>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Export + Reset row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Export your data
                </span>
                <ProgressExport />
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Start over
                </span>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span className="max-w-xs">
                    Clears lessons, quiz, simulations, and streak. Cannot be undone.
                  </span>
                </div>
                <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      data-cursor="Reset"
                      className="h-9 shrink-0 border-destructive/30 bg-destructive/[0.04] text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Reset all progress"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset progress
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset all your progress?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently clear your completed modules, opened
                        glossary terms, quiz result, simulation history, and learning
                        streak. The action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleReset}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Yes, reset everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ---------------- Closing note ---------------- */}
        <Reveal>
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/40 p-6 text-center md:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden>
              <Trophy className="h-5 w-5" />
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              "Knowledge is the foundation of every halal decision."
              Progress is not about perfection — it is about consistency. Every module,
              every practice, every correct answer compounds into lasting literacy.
            </p>
          </div>
        </Reveal>
      </ViewBody>
      <ContinueExploring current="progress" links={RELATED_LINKS.progress} />
    </ViewShell>
  );
}
