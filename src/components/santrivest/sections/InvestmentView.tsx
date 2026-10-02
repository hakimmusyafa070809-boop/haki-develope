"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Play,
  RotateCcw,
  Coins,
  Gem,
  BarChart3,
  LineChart as LineChartIcon,
  Brain,
  Check,
  X,
  Info,
  Sparkles,
  Scale,
  Zap,
} from "lucide-react";

import { ViewShell, ViewHeader, ViewBody, ContinueExploring, RELATED_LINKS } from "../ViewShell";
import {
  Reveal,
  Stagger,
  StaggerItem,
  CountUp,
  Magnetic,
  TiltCard,
  Eyebrow,
  SectionHeading,
} from "../animations/primitives";
import { useSantrivest } from "@/lib/store";
import { SIM_ASSETS, type SimAsset } from "@/lib/educational-data";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

/* ---------------- helpers ---------------- */

const STARTING_CAPITAL = 1_000_000;
const MONTHS = 12;

/** Box-Muller standard normal random number. */
function randNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function formatRupiah(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

const ASSET_ICON: Record<string, typeof Wallet> = {
  cash: Wallet,
  sukuk: ShieldCheck,
  gold: Gem,
  fund: BarChart3,
  stock: LineChartIcon,
};

/* ============================================================
 * SECTION 1 — INVESTMENT SIMULATOR
 * ========================================================== */

interface SimResult {
  series: { month: number; value: number }[];
  finalValue: number;
  returnPct: number;
}

function SimulatorSection() {
  const logSim = useSantrivest((s) => s.logSim);

  const [allocations, setAllocations] = useState<Record<string, number>>({
    cash: 40,
    sukuk: 30,
    gold: 10,
    fund: 10,
    stock: 10,
  });
  const [result, setResult] = useState<SimResult | null>(null);
  const [runKey, setRunKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const total = useMemo(
    () => Object.values(allocations).reduce((a, b) => a + b, 0),
    [allocations]
  );
  const isValid = total === 100;

  const weightedReturn = useMemo(
    () =>
      SIM_ASSETS.reduce(
        (sum, a) => sum + (a.expectedReturn * (allocations[a.id] || 0)) / 100,
        0
      ),
    [allocations]
  );
  const weightedRisk = useMemo(
    () =>
      SIM_ASSETS.reduce(
        (sum, a) => sum + (a.risk * (allocations[a.id] || 0)) / 100,
        0
      ),
    [allocations]
  );
  const activeCount = useMemo(
    () => SIM_ASSETS.filter((a) => (allocations[a.id] || 0) > 0).length,
    [allocations]
  );
  const allCash =
    activeCount === 1 && (allocations.cash || 0) === 100;

  function setAllocation(id: string, value: number) {
    setAllocations((prev) => ({ ...prev, [id]: value }));
    // Changing the allocation invalidates a previous run.
    if (result) setResult(null);
  }

  function runSim() {
    if (!isValid) return;
    setIsRunning(true);

    // Simulate per-asset value month by month, then sum into a portfolio.
    const assetValues: Record<string, number[]> = {};
    for (const a of SIM_ASSETS) {
      const weight = (allocations[a.id] || 0) / 100;
      const startVal = STARTING_CAPITAL * weight;
      const monthlyReturn = Math.pow(1 + a.expectedReturn / 100, 1 / 12) - 1;
      const vals: number[] = [startVal];
      for (let m = 1; m <= MONTHS; m++) {
        const noise =
          a.volatility > 0 ? (a.volatility / 100) * randNormal() : 0;
        const prev = vals[m - 1];
        const next = prev * (1 + monthlyReturn + noise);
        vals.push(Math.max(0, next));
      }
      assetValues[a.id] = vals;
    }
    const series = Array.from({ length: MONTHS + 1 }, (_, m) => ({
      month: m,
      value: SIM_ASSETS.reduce(
        (s, a) => s + (assetValues[a.id]?.[m] || 0),
        0
      ),
    }));
    const finalValue = series[series.length - 1].value;
    const returnPct = ((finalValue - STARTING_CAPITAL) / STARTING_CAPITAL) * 100;

    setResult({ series, finalValue, returnPct });
    setRunKey((k) => k + 1);
    logSim({
      id: "invest-" + Date.now(),
      type: "Investment",
      label: "Portfolio simulated",
      date: new Date().toISOString(),
      detail: `Return ${returnPct.toFixed(1)}%`,
    });

    // small delay for "running" micro-interaction
    window.setTimeout(() => setIsRunning(false), 350);
  }

  return (
    <section id="simulator" className="scroll-mt-28">
      <SectionHeading
        eyebrow="Try It Yourself"
        title={
          <>
            Investment <span className="text-gradient-emerald">Simulator</span>
          </>
        }
        subtitle="Build a virtual portfolio from five Sharia asset classes and watch how it might grow — or shrink — over a year."
      />

      {/* Disclaimer */}
      <Reveal delay={0.05}>
        <Alert className="mt-8 border-amber-300/60 bg-amber-50/60 text-foreground">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900">
            Educational simulation — not financial advice
          </AlertTitle>
          <AlertDescription className="text-amber-900/80">
            Virtual money only. Simulated returns are educational, randomised,
            and never guaranteed. No real transactions occur and nothing here
            is personal financial or Sharia advice. Always consult qualified
            scholars and licensed advisors before any real decision.
          </AlertDescription>
        </Alert>
      </Reveal>

      {/* Starting capital */}
      <Reveal delay={0.1}>
        <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-emerald-50/60 via-card to-amber-50/30 p-6 md:p-7">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                Starting Virtual Capital
              </span>
            </div>
            <p className="mt-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              <CountUp value={STARTING_CAPITAL} prefix="Rp " duration={1.8} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Allocated across {activeCount} asset{activeCount === 1 ? "" : "s"} ·
              you decide the mix.
            </p>
          </Card>

          <Card className="border-border/70 p-6 md:p-7">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Portfolio Snapshot
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "border-transparent",
                  isValid
                    ? "bg-primary/10 text-primary"
                    : "bg-amber-100/80 text-amber-800"
                )}
              >
                {isValid ? "Balanced" : "Unallocated"}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Stat
                label="Expected return"
                value={weightedReturn.toFixed(1)}
                suffix="%"
                accent="emerald"
              />
              <Stat
                label="Weighted risk"
                value={weightedRisk.toFixed(1)}
                suffix="/5"
                accent="gold"
              />
              <Stat
                label="Diversified"
                value={String(activeCount)}
                suffix={`/5`}
                accent="emerald"
              />
            </div>
          </Card>
        </div>
      </Reveal>

      {/* Allocation grid */}
      <Reveal delay={0.12}>
        <div className="mt-6 overflow-hidden rounded-3xl border border-border/70 bg-card p-5 md:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Allocate Your Capital</Eyebrow>
              <p className="mt-2 text-sm text-muted-foreground">
                Drag each slider to set how much of your capital goes into each
                asset. Total must equal 100%.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total
              </span>
              <motion.span
                key={total}
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold tabular-nums",
                  isValid
                    ? "bg-primary/10 text-primary"
                    : "bg-amber-100/80 text-amber-800"
                )}
              >
                {total}%
                {isValid ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
              </motion.span>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-3 lg:grid-cols-2">
            {SIM_ASSETS.map((asset, i) => (
              <AssetRow
                key={asset.id}
                asset={asset}
                value={allocations[asset.id] || 0}
                onChange={(v) => setAllocation(asset.id, v)}
                index={i}
              />
            ))}
          </div>

          {!isValid && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50/80 px-4 py-3 text-sm text-amber-900"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Allocate exactly 100% to run the simulation.{" "}
              <span className="font-semibold">Currently {total}%.</span>
            </motion.div>
          )}

          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              All assets screened for Sharia compliance principles.
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {result && (
                <Magnetic strength={0.35}>
                  <button
                    onClick={() => setResult(null)}
                    data-cursor="Reset"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                </Magnetic>
              )}
              <Magnetic strength={0.4}>
                <button
                  onClick={runSim}
                  disabled={!isValid || isRunning}
                  data-cursor="Run"
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all",
                    !isValid || isRunning
                      ? "cursor-not-allowed bg-muted text-muted-foreground"
                      : "bg-foreground text-background hover:gap-3"
                  )}
                >
                  <Play className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  {result ? "Run again" : "Run simulation"}
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={runKey}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 overflow-hidden rounded-3xl border border-border/70 bg-card p-5 md:p-7"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>12-Month Outcome</Eyebrow>
                <p className="mt-2 text-sm text-muted-foreground">
                  Each run uses a new random path — notice how volatility
                  changes the destination.
                </p>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Final value
                  </span>
                  <span className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                    <CountUp
                      value={result.finalValue}
                      prefix="Rp "
                      duration={1.6}
                    />
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Total return
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-2xl font-extrabold tracking-tight md:text-3xl",
                      result.returnPct >= 0
                        ? "text-primary"
                        : "text-amber-700"
                    )}
                  >
                    {result.returnPct >= 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    <CountUp
                      value={result.returnPct}
                      decimals={1}
                      duration={1.6}
                      suffix="%"
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 h-[260px] w-full md:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={result.series}
                  margin={{ top: 10, right: 8, bottom: 4, left: 8 }}
                >
                  <defs>
                    <linearGradient
                      id="portfolioArea"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    strokeOpacity={0.5}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickFormatter={(v) => `M${v}`}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={64}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickFormatter={(v) =>
                      "Rp " + Math.round(v / 1000) + "k"
                    }
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--chart-2)", strokeWidth: 1 }}
                    content={<PortfolioTooltip />}
                  />
                  <ReferenceLine
                    y={STARTING_CAPITAL}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-2)"
                    strokeWidth={2.5}
                    fill="url(#portfolioArea)"
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "var(--chart-2)",
                      stroke: "var(--background)",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-4">
                <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-semibold">Teaching note.</span>{" "}
                  {allCash
                    ? "Cash holds value but doesn't grow. Diversification across assets manages risk."
                    : "Higher potential return usually involves higher risk. Notice the volatility along the way."}
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-amber-50/60 p-4">
                <Info className="h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-semibold">Why two paths differ.</span>{" "}
                  Try <span className="font-semibold">Run again</span> — the
                  same portfolio can land in a different place. That is
                  volatility: the real, unavoidable experience of investing.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PortfolioTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload as { month: number; value: number };
  return (
    <div className="rounded-xl border border-border/70 bg-card px-3 py-2 shadow-lift">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Month {point.month}
      </div>
      <div className="mt-0.5 text-sm font-bold text-foreground">
        {formatRupiah(point.value)}
      </div>
    </div>
  );
}

function AssetRow({
  asset,
  value,
  onChange,
  index,
}: {
  asset: SimAsset;
  value: number;
  onChange: (v: number) => void;
  index: number;
}) {
  const Icon = ASSET_ICON[asset.id] || Coins;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.5 }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 transition-colors hover:border-border"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: asset.color + "1f" }}
          >
            <Icon
              className="h-4 w-4"
              strokeWidth={1.8}
              style={{ color: asset.color }}
            />
          </div>
          <div className="min-w-0 flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">
                {asset.name}
              </span>
              <Badge
                variant="outline"
                className="border-transparent bg-secondary text-secondary-foreground text-[10px]"
              >
                {asset.type}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "border-transparent text-[10px]",
                  asset.shariaStatus === "Halal"
                    ? "bg-primary/10 text-primary"
                    : "bg-amber-100/80 text-amber-800"
                )}
              >
                {asset.shariaStatus === "Halal" ? (
                  <ShieldCheck className="h-3 w-3" />
                ) : (
                  <Scale className="h-3 w-3" />
                )}
                {asset.shariaStatus}
              </Badge>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {asset.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-base font-bold tabular-nums text-foreground">
            {value}%
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {formatRupiah((STARTING_CAPITAL * value) / 100)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: asset.color }}
        />
        <Slider
          value={[value]}
          min={0}
          max={100}
          step={5}
          onValueChange={(v) => onChange(v[0])}
          aria-label={`${asset.name} allocation percentage`}
          className="flex-1"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-primary" />
          {asset.expectedReturn}% / yr
        </span>
        <span className="inline-flex items-center gap-1">
          <Zap className="h-3 w-3 text-amber-500" />
          Risk
          <span className="inline-flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i < asset.risk ? "bg-amber-500" : "bg-border"
                )}
              />
            ))}
          </span>
        </span>
        <span className="inline-flex items-center gap-1">
          <BarChart3 className="h-3 w-3 text-muted-foreground" />
          σ {asset.volatility}% / mo
        </span>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent: "emerald" | "gold";
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "mt-1 text-xl font-bold tabular-nums",
          accent === "emerald" ? "text-primary" : "text-amber-700"
        )}
      >
        {value}
        {suffix && <span className="text-sm font-medium">{suffix}</span>}
      </span>
    </div>
  );
}

/* ============================================================
 * SECTION 2 — SHARIA INVESTMENT CHECKER
 * ========================================================== */

type AnswerValue = "positive" | "neutral" | "negative";

interface CheckerOption {
  label: string;
  value: AnswerValue;
  hint?: string;
}

interface CheckerStep {
  question: string;
  context: string;
  options: CheckerOption[];
  guidance: Record<AnswerValue, string>;
}

const CHECKER_STEPS: CheckerStep[] = [
  {
    question: "What is the underlying business?",
    context:
      "Before anything else, understand exactly what the company actually does — its products, services, and how it earns money.",
    options: [
      { label: "I understand it clearly", value: "positive" },
      { label: "Vaguely", value: "neutral" },
      { label: "Not really", value: "negative" },
    ],
    guidance: {
      positive:
        "Knowing the business is the foundation of any responsible investment.",
      neutral:
        "Vague understanding invites risk. Read the prospectus, ask a teacher, or look for a simpler alternative.",
      negative:
        "If you can't explain what the business does, don't invest yet. Clarity first.",
    },
  },
  {
    question: "Does the business operate in permissible activities?",
    context:
      "Sharia excludes alcohol, gambling, conventional interest (riba), pork, adult entertainment, and similar activities.",
    options: [
      { label: "Yes, fully permissible", value: "positive" },
      { label: "Mostly, with minor concerns", value: "neutral" },
      { label: "No, it involves haram", value: "negative" },
    ],
    guidance: {
      positive:
        "Permissible activity is the first filter of Sharia investing.",
      neutral:
        "Even small impermissible portions can disqualify an investment — verify the screening ratio.",
      negative:
        "An impermissible core business makes the investment off-limits regardless of expected return.",
    },
  },
  {
    question: "Does the investment meet Sharia screening criteria?",
    context:
      "Scholars apply quantitative screens — debt-to-asset ratio, impermissible income thresholds, and others — to keep investments within Sharia bounds.",
    options: [
      { label: "Yes, it passes the screens", value: "positive" },
      { label: "I'm not sure", value: "neutral" },
      { label: "No, it fails a screen", value: "negative" },
    ],
    guidance: {
      positive:
        "Passing recognized Sharia screens gives you structural compliance, not just intention.",
      neutral:
        "If you can't verify, look for a certified Sharia-screened fund instead.",
      negative:
        "Failing a quantitative screen is a clear stop signal, even if the business sounds permissible.",
    },
  },
  {
    question: "Do you understand the risk?",
    context:
      "Every investment carries risk — of loss, of liquidity, of volatility. You should be able to name the main risks before committing.",
    options: [
      { label: "Yes, I can name them", value: "positive" },
      { label: "Somewhat", value: "neutral" },
      { label: "No", value: "negative" },
    ],
    guidance: {
      positive:
        "Naming the risk means you can decide whether it's a risk worth taking.",
      neutral:
        "Unclear risk is unacceptable. Clarify it first, or pick a lower-risk asset.",
      negative:
        "Never invest in something whose risks you cannot describe in one sentence.",
    },
  },
  {
    question: "Do you understand the product itself?",
    context:
      "Sukuk, stocks, funds, and gold work differently. Each has its own contract, fees, and rights. Don't invest in what you don't understand.",
    options: [
      { label: "Yes, I understand the contract", value: "positive" },
      { label: "Partially", value: "neutral" },
      { label: "No", value: "negative" },
    ],
    guidance: {
      positive:
        "Understanding the contract protects you from hidden surprises.",
      neutral:
        "A product you partly understand is partly a gamble. Learn the rest first.",
      negative:
        "If the product is opaque, walk away — no matter how attractive the return.",
    },
  },
  {
    question: "Are you investing based on analysis, not FOMO?",
    context:
      "Fear Of Missing Out is the most common reason young investors lose money. Decision should come from analysis, not pressure from friends or trending news.",
    options: [
      { label: "Yes, I have a reason", value: "positive" },
      { label: "Mixed feelings", value: "neutral" },
      { label: "Honestly, mostly hype", value: "negative" },
    ],
    guidance: {
      positive:
        "Analysis-based decisions survive volatility. FOMO-based decisions don't.",
      neutral:
        "Mixed motivation usually leads to panic selling later. Pause and reflect.",
      negative:
        "If the only reason is 'everyone is buying' — that's exactly the moment to stop.",
    },
  },
];

function CheckerSection() {
  const setCheckerDone = useSantrivest((s) => s.setCheckerDone);
  const checkerDone = useSantrivest((s) => s.checkerDone);
  const logSim = useSantrivest((s) => s.logSim);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>([]);
  const [picked, setPicked] = useState<AnswerValue | null>(null);

  const total = CHECKER_STEPS.length;
  const progressPct = (step / total) * 100;
  const current = CHECKER_STEPS[step];

  function choose(v: AnswerValue) {
    if (picked) return;
    setPicked(v);
  }

  function next() {
    if (!picked) return;
    const newAnswers = [...answers, picked];
    setAnswers(newAnswers);

    if (step + 1 < total) {
      setStep(step + 1);
      setPicked(null);
    } else {
      // compute final
      const anyNonPositive = newAnswers.some((a) => a !== "positive");
      const result = anyNonPositive
        ? "Stop & Investigate"
        : "Ready to Learn More";
      setCheckerDone(true);
      logSim({
        id: "checker-" + Date.now(),
        type: "Checker",
        label: "Sharia checker completed",
        date: new Date().toISOString(),
        detail: result,
      });
      setStep(total); // mark finished
    }
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setPicked(null);
  }

  const finished = step >= total;
  const anyNonPositive = answers.some((a) => a !== "positive");
  const resultLabel = anyNonPositive ? "Stop & Investigate" : "Ready to Learn More";

  return (
    <section id="checker" className="mt-20 scroll-mt-28 md:mt-28">
      <SectionHeading
        eyebrow="Before You Invest"
        title={
          <>
            Sharia Investment{" "}
            <span className="text-gradient-gold">Checker</span>
          </>
        }
        subtitle="A decision tree to guide your thinking — not personalized financial advice."
      />

      <Reveal delay={0.05}>
        <Card className="mt-8 overflow-hidden border-border/70 bg-card p-5 md:p-8">
          {/* progress + step count */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Decision Tree
                </div>
                <div className="text-sm font-bold text-foreground">
                  {finished
                    ? "Completed"
                    : `Question ${Math.min(step + 1, total)} of ${total}`}
                </div>
              </div>
            </div>
            {checkerDone && !finished && (
              <Badge
                variant="outline"
                className="border-transparent bg-primary/10 text-primary"
              >
                <Check className="h-3 w-3" />
                Previously completed
              </Badge>
            )}
          </div>

          <div className="mt-5">
            <Progress value={finished ? 100 : progressPct} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background">
                    {step + 1}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold leading-snug text-foreground md:text-2xl">
                      {current.question}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {current.context}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                  {current.options.map((opt) => {
                    const active = picked === opt.value;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => choose(opt.value)}
                        data-cursor="Pick"
                        disabled={!!picked && !active}
                        aria-pressed={active}
                        className={cn(
                          "group flex min-h-[60px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
                          active
                            ? "border-primary bg-primary/5 shadow-lift"
                            : "border-border/70 bg-background/60 hover:border-border hover:bg-secondary/40",
                          picked && !active && "opacity-50"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground"
                          )}
                        >
                          {active ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            String.fromCharCode(65 + current.options.indexOf(opt))
                          )}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {picked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div
                        className={cn(
                          "flex items-start gap-3 rounded-2xl p-4 text-sm",
                          picked === "positive"
                            ? "bg-primary/5 text-foreground"
                            : picked === "neutral"
                              ? "bg-amber-50/70 text-foreground"
                              : "bg-amber-100/70 text-amber-900"
                        )}
                      >
                        {picked === "positive" ? (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <Info className="h-4 w-4 shrink-0 text-amber-600" />
                        )}
                        <p className="leading-relaxed">
                          {current.guidance[picked]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={restart}
                    data-cursor="Restart"
                    disabled={step === 0 && !picked}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restart
                  </button>
                  <Magnetic strength={0.35}>
                    <button
                      onClick={next}
                      disabled={!picked}
                      data-cursor="Next"
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all",
                        picked
                          ? "bg-foreground text-background hover:gap-3"
                          : "cursor-not-allowed bg-muted text-muted-foreground"
                      )}
                    >
                      {step + 1 === total ? "See result" : "Next"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </Magnetic>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <div
                  className={cn(
                    "overflow-hidden rounded-3xl border p-6 md:p-8",
                    anyNonPositive
                      ? "border-amber-300/60 bg-amber-50/60"
                      : "border-primary/40 bg-emerald-50/60"
                  )}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                          anyNonPositive
                            ? "bg-amber-100 text-amber-700"
                            : "bg-primary/15 text-primary"
                        )}
                      >
                        {anyNonPositive ? (
                          <AlertTriangle className="h-6 w-6" />
                        ) : (
                          <ShieldCheck className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Your result
                        </div>
                        <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                          {resultLabel}
                        </h3>
                      </div>
                    </div>
                    <Magnetic strength={0.35}>
                      <button
                        onClick={restart}
                        data-cursor="Restart"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restart checker
                      </button>
                    </Magnetic>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-card/70 p-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <Brain className="h-3.5 w-3.5 text-primary" />
                        What this means
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-foreground">
                        {anyNonPositive
                          ? "At least one answer signals uncertainty or non-compliance. Pause. Investigate. Ask a qualified scholar or trusted teacher. There is no rush — your capital can wait, your principles cannot."
                          : "Your answers reflect a thoughtful, informed, and compliant approach. This is a good foundation to keep learning — ideally with a mentor or through a Sharia-screened fund before making any real decision."}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-card/70 p-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <ArrowRight className="h-3.5 w-3.5 text-primary" />
                        Next steps
                      </div>
                      <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                        {anyNonPositive ? (
                          <>
                            <li className="flex gap-2">
                              <span className="text-amber-600">·</span>
                              Re-read the prospectus or fund factsheet.
                            </li>
                            <li className="flex gap-2">
                              <span className="text-amber-600">·</span>
                              Check a recognised Sharia screen (e.g. OIC or
                              MSCI Islamic).
                            </li>
                            <li className="flex gap-2">
                              <span className="text-amber-600">·</span>
                              Ask a teacher or qualified scholar before
                              proceeding.
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex gap-2">
                              <span className="text-primary">·</span>
                              Keep learning — knowledge compounds.
                            </li>
                            <li className="flex gap-2">
                              <span className="text-primary">·</span>
                              Start small and track your decisions.
                            </li>
                            <li className="flex gap-2">
                              <span className="text-primary">·</span>
                              Consult a licensed advisor for real money.
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-5 text-[11px] text-muted-foreground">
                    This checker is an educational decision tree — not a fatwa,
                    not personal financial advice, and not a substitute for
                    qualified scholarly guidance.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </Reveal>
    </section>
  );
}

/* ============================================================
 * SECTION 3 — FOMO SIMULATION
 * ========================================================== */

interface FomoOption {
  id: "A" | "B" | "C" | "D";
  label: string;
  verdict: "risky" | "correct" | "very-risky" | "neutral";
  explanation: string;
}

const FOMO_OPTIONS: FomoOption[] = [
  {
    id: "A",
    label: "Buy immediately",
    verdict: "risky",
    explanation:
      "This is herd behaviour. You're buying because others are buying — not because you understand the asset. Prices driven by hype can fall faster than they rose.",
  },
  {
    id: "B",
    label: "Investigate first",
    verdict: "correct",
    explanation:
      "Correct. Read the business, check the screens, understand the risk. A 25% jump is a signal to be careful, not a reason to rush in.",
  },
  {
    id: "C",
    label: "Borrow money to buy",
    verdict: "very-risky",
    explanation:
      "Borrowing to invest amplifies losses. If the price falls — and hype-driven prices often do — you owe money you didn't have. This is one of the fastest paths to financial harm, and is generally discouraged in Sharia finance.",
  },
  {
    id: "D",
    label: "Ignore everything",
    verdict: "neutral",
    explanation:
      "Sometimes valid — not every opportunity is yours. But ignoring all information isn't investing; it's just leaving learning on the table.",
  },
];

const GLOSSARY_CHIPS = [
  { term: "Herd behaviour", def: "Doing what the crowd does, ignoring your own analysis." },
  { term: "FOMO", def: "Fear Of Missing Out — chasing gains because others seem to be winning." },
  { term: "Confirmation bias", def: "Seeking only the news that supports what you already want to do." },
  { term: "Loss aversion", def: "Feeling losses about twice as intensely as equal gains." },
  { term: "Overconfidence", def: "Believing you can time the market better than you actually can." },
];

const FOMO_RISE = Array.from({ length: 10 }, (_, i) => ({
  day: i + 1,
  price: 100 * Math.pow(1 + 0.025, i), // ~25% rise
}));

const FOMO_CRASH = [
  ...FOMO_RISE.map((p) => ({ ...p, crash: p.price })),
  { day: 11, price: 100 * Math.pow(1.025, 9), crash: 100 * Math.pow(1.025, 9) * 0.78 },
  { day: 12, price: 100 * Math.pow(1.025, 9), crash: 100 * Math.pow(1.025, 9) * 0.62 },
  { day: 13, price: 100 * Math.pow(1.025, 9), crash: 100 * Math.pow(1.025, 9) * 0.48 },
  { day: 14, price: 100 * Math.pow(1.025, 9), crash: 100 * Math.pow(1.025, 9) * 0.42 },
];

function FomoSection() {
  const [choice, setChoice] = useState<FomoOption | null>(null);
  const [revealed, setRevealed] = useState(false);

  function pick(opt: FomoOption) {
    if (choice) return;
    setChoice(opt);
  }

  function tryAgain() {
    setChoice(null);
    setRevealed(false);
  }

  return (
    <section id="fomo" className="mt-20 scroll-mt-28 md:mt-28">
      <SectionHeading
        eyebrow="Behavioral Finance"
        title={
          <>
            FOMO <span className="text-gradient-emerald">Simulation</span>
          </>
        }
        subtitle="A fictional stock suddenly rises 25%. Friends say “Buy now! Everyone is making money!” What do you do?"
      />

      <Reveal delay={0.05}>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* Scenario card */}
          <Card className="overflow-hidden border-border/70 bg-card p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Fictional Stock · 10 days
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    PT Hype Sentosa (HOAX)
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-transparent bg-primary/10 text-primary"
              >
                <TrendingUp className="h-3 w-3" />
                +25%
              </Badge>
            </div>

            <div className="mt-4 h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revealed ? FOMO_CRASH : FOMO_RISE}
                  margin={{ top: 8, right: 8, bottom: 4, left: 8 }}
                >
                  <defs>
                    <linearGradient id="fomoUp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="fomoDown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickFormatter={(v) => `D${v}`}
                  />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    cursor={{ stroke: "var(--chart-2)", strokeWidth: 1 }}
                    content={({ active, payload }: any) => {
                      if (!active || !payload || !payload.length) return null;
                      const p = payload[0].payload;
                      const price = revealed ? p.crash : p.price;
                      return (
                        <div className="rounded-xl border border-border/70 bg-card px-3 py-2 shadow-lift">
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Day {p.day}
                          </div>
                          <div className="text-sm font-bold text-foreground">
                            Rp {Math.round(price).toLocaleString("id-ID")}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={revealed ? "crash" : "price"}
                    stroke={revealed ? "var(--destructive)" : "var(--chart-1)"}
                    strokeWidth={2.5}
                    fill={revealed ? "url(#fomoDown)" : "url(#fomoUp)"}
                    isAnimationActive
                    animationDuration={900}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed text-foreground">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span>
                Friends in your group chat:{" "}
                <span className="font-semibold">
                  “Don't miss out, bro. It's going to 2x by next week.”
                </span>
              </span>
            </div>
          </Card>

          {/* Choices + reveal */}
          <Card className="overflow-hidden border-border/70 bg-card p-5 md:p-7">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Brain className="h-3.5 w-3.5 text-primary" />
              Your decision
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {FOMO_OPTIONS.map((opt) => {
                const active = choice?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => pick(opt)}
                    disabled={!!choice && !active}
                    data-cursor="Pick"
                    aria-pressed={active}
                    className={cn(
                      "flex min-h-[58px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
                      active
                        ? "border-primary bg-primary/5 shadow-lift"
                        : "border-border/70 bg-background/60 hover:border-border hover:bg-secondary/40",
                      choice && !active && "opacity-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {opt.id}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {choice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 overflow-hidden"
                >
                  <div
                    className={cn(
                      "flex items-start gap-3 rounded-2xl p-4 text-sm",
                      choice.verdict === "correct"
                        ? "bg-primary/5 text-foreground"
                        : choice.verdict === "very-risky"
                          ? "bg-amber-100/70 text-amber-900"
                          : "bg-amber-50/70 text-foreground"
                    )}
                  >
                    {choice.verdict === "correct" ? (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    )}
                    <p className="leading-relaxed">{choice.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {choice && !revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <Magnetic strength={0.35}>
                    <button
                      onClick={() => setRevealed(true)}
                      data-cursor="Try"
                      className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-xs font-semibold text-background transition-all hover:gap-3"
                    >
                      See what happened next
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </Magnetic>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-destructive">
                    <TrendingDown className="h-3.5 w-3.5" />
                    What happened next
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    The stock crashed. Within four days it lost more than half
                    its value. Those who bought at the top were left holding
                    heavy losses — the very definition of herd behaviour
                    punished by the market.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Hype-driven prices often reverse fast. The lesson isn't
                    “never buy” — it's <span className="font-semibold">never
                    buy only because of hype.</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </Reveal>

      {/* Glossary chips */}
      <Reveal delay={0.1}>
        <div className="mt-5 overflow-hidden rounded-3xl border border-border/70 bg-card p-5 md:p-7">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Concepts in this scenario
          </div>
          <Stagger className="mt-4 flex flex-wrap gap-2">
            {GLOSSARY_CHIPS.map((g) => (
              <StaggerItem key={g.term}>
                <span
                  title={g.def}
                  className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                  {g.term}
                </span>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              These behavioural biases affect every investor — even
              professionals. Naming them is the first defence against them.
            </p>
            <Magnetic strength={0.35}>
              <button
                onClick={tryAgain}
                data-cursor="Try"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try again
              </button>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
 * SECTION 4 — INVESTMENT GLOSSARY QUICK-REFERENCE
 * ========================================================== */

const INVESTMENT_TERMS = [
  {
    term: "Sukuk",
    arabic: "صكوك",
    short: "Sharia-compliant investment certificates backed by real assets.",
    detail: "Sukuk represent ownership in a tangible asset or its usufruct. Returns come from the asset's performance — not from interest. The Islamic alternative to conventional bonds.",
    color: "oklch(0.52 0.13 162)",
  },
  {
    term: "Sharia Stock",
    short: "Shares in a Sharia-screened company.",
    detail: "Equity in a company whose business is permissible and that passes Sharia financial screening (low debt ratio, low interest income, permissible core activity).",
    color: "oklch(0.6 0.16 50)",
  },
  {
    term: "Islamic Mutual Fund",
    short: "Diversified fund of Sharia-screened assets.",
    detail: "Pools investor money and invests only in Sharia-compliant securities. Good for beginners — managed, diversified, accessible with small amounts.",
    color: "oklch(0.68 0.08 175)",
  },
  {
    term: "Gold",
    short: "Traditional store of value.",
    detail: "A physical commodity that historically preserves purchasing power. In Islam, gold transactions follow specific rules (hand-to-hand exchange). Good for long-term protection.",
    color: "oklch(0.72 0.13 85)",
  },
  {
    term: "Murabahah",
    arabic: "مرابحة",
    short: "Cost-plus sale — transparent profit.",
    detail: "The seller discloses cost and adds an openly agreed profit margin. Used in Islamic banking as a halal alternative to interest-based financing.",
    color: "oklch(0.55 0.13 162)",
  },
  {
    term: "Mudharabah",
    arabic: "مضاربة",
    short: "Profit-sharing partnership.",
    detail: "One party provides capital, the other provides effort. Profits are shared by agreed ratio; losses borne by the capital provider unless negligence.",
    color: "oklch(0.65 0.12 320)",
  },
  {
    term: "Ijarah",
    arabic: "إجارة",
    short: "Lease — rent for use of an asset.",
    detail: "The owner rents a tangible asset to another for an agreed period and rent. The Islamic equivalent of leasing.",
    color: "oklch(0.6 0.1 200)",
  },
  {
    term: "Sharia Screening",
    short: "Assessing if an investment is Sharia-compliant.",
    detail: "A two-part check: (1) core business must be permissible, (2) financial ratios (debt, interest income, impermissible income) must be below thresholds.",
    color: "oklch(0.58 0.21 27)",
  },
];

function InvestmentGlossarySection() {
  return (
    <section aria-labelledby="invest-glossary-title" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Quick Reference"
        title={
          <>
            Investment <span className="text-gradient-emerald">Glossary</span>
          </>
        }
        subtitle="The key terms you need to understand Sharia-compliant investment — at a glance."
      />

      <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {INVESTMENT_TERMS.map((t) => (
          <StaggerItem key={t.term}>
            <div className="bento-card hover-glow group relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-border/70 bg-card p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: t.color + "33" }}
                aria-hidden
              />
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-foreground">{t.term}</span>
                {t.arabic && (
                  <span className="font-arabic text-base text-primary/80">{t.arabic}</span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{t.short}</p>
              <p className="mt-auto pt-1 text-[11px] leading-relaxed text-muted-foreground/80">
                {t.detail}
              </p>
              <div
                className="mt-1 h-0.5 w-8 origin-left rounded-full transition-transform duration-500 group-hover:scale-x-150"
                style={{ background: t.color }}
              />
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ============================================================
 * ROOT VIEW
 * ========================================================== */

export function InvestmentView() {
  return (
    <ViewShell>
      <ViewHeader
        eyebrow="Sharia Investment"
        title={
          <>
            Try Investing,{" "}
            <span className="text-gradient-emerald">Responsibly.</span>
          </>
        }
        subtitle="Simulate a Sharia-screened portfolio, walk through a pre-investment decision tree, and feel what FOMO actually costs — all with virtual money."
        back="home"
        backLabel="Back to Home"
      />
      <ViewBody className="gap-4">
        <SimulatorSection />
        <CheckerSection />
        <FomoSection />
        <InvestmentGlossarySection />
      </ViewBody>
      <ContinueExploring current="investment" links={RELATED_LINKS.investment} />
    </ViewShell>
  );
}
