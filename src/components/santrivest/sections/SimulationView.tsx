"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Calendar,
  ArrowRight,
  Play,
  RotateCcw,
  Scale,
  Coins,
  Sparkles,
  Info,
  Check,
  X,
  Target,
  ShieldCheck,
  HandCoins,
  Gem,
} from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { ViewShell, ViewHeader, ViewBody, ConceptBlock, ContinueExploring, RELATED_LINKS } from "../ViewShell";
import {
  Reveal,
  Stagger,
  StaggerItem,
  CountUp,
  Magnetic,
  Eyebrow,
} from "../animations/primitives";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ============================================================
   SECTION 1 — THE FUTURE YOU
============================================================ */

const MILESTONES = [
  { year: 0, label: "Today" },
  { year: 1, label: "1 year" },
  { year: 3, label: "3 years" },
  { year: 5, label: "5 years" },
  { year: 10, label: "10 years" },
];

function futureValue(start: number, monthly: number, annualRate: number, years: number) {
  const r = annualRate / 100;
  if (r === 0) return start + monthly * 12 * years;
  const t = years;
  return start * Math.pow(1 + r, t) + monthly * 12 * ((Math.pow(1 + r, t) - 1) / r);
}

function FutureYou() {
  const { logSim } = useSantrivest();
  const { toast } = useToast();
  const [capital, setCapital] = useState(1000000);
  const [monthly, setMonthly] = useState(200000);
  const [growth, setGrowth] = useState(8);

  const chartData = useMemo(() => {
    const pts = [];
    for (let y = 0; y <= 10; y += 0.5) {
      pts.push({
        year: y,
        value: Math.round(futureValue(capital, monthly, growth, y)),
        principal: Math.round(capital + monthly * 12 * y),
      });
    }
    return pts;
  }, [capital, monthly, growth]);

  const milestoneValues = MILESTONES.map((m) => ({
    ...m,
    value: Math.round(futureValue(capital, monthly, growth, m.year)),
    principal: Math.round(capital + monthly * 12 * m.year),
  }));

  const tenYr = milestoneValues[milestoneValues.length - 1];
  const growthContrib = tenYr.value - tenYr.principal;

  const save = () => {
    logSim({
      id: "future-" + Date.now(),
      type: "Future You",
      label: "Future projection",
      date: new Date().toISOString(),
      detail: `10yr ≈ Rp ${tenYr.value.toLocaleString("id-ID")}`,
    });
    toast({
      title: "Snapshot saved",
      description: `10-year projection ≈ Rp ${tenYr.value.toLocaleString("id-ID")}`,
    });
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Eyebrow>A Story Moment</Eyebrow>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">The Future You</h2>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Today&apos;s decisions shape tomorrow&apos;s value. Adjust the levers and watch your future
          respond.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-50/60 p-3 text-xs text-amber-700">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Projections are simulations, not guarantees. Real returns vary with markets and risk.
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Controls */}
        <Reveal className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Levers
          </span>
          <div className="mt-4 flex flex-col gap-5">
            <Lever
              label="Starting capital"
              value={capital}
              min={100000}
              max={5000000}
              step={100000}
              onChange={setCapital}
              format={(v) => `Rp ${(v / 1000000).toFixed(1)}M`}
            />
            <Lever
              label="Monthly savings"
              value={monthly}
              min={0}
              max={1000000}
              step={50000}
              onChange={setMonthly}
              format={(v) => `Rp ${(v / 1000).toFixed(0)}k`}
            />
            <Lever
              label="Hypothetical annual growth"
              value={growth}
              min={0}
              max={20}
              step={1}
              onChange={setGrowth}
              format={(v) => `${v}%`}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 bg-background/60 p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Principal (10yr)
              </span>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                Rp {tenYr.principal.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Growth contributed
              </span>
              <p className="mt-0.5 text-sm font-bold text-primary">
                Rp {growthContrib.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <Magnetic strength={0.4} className="mt-4 block">
            <button
              onClick={save}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background"
            >
              <Target className="h-3.5 w-3.5" /> Save snapshot
            </button>
          </Magnetic>
        </Reveal>

        {/* Chart */}
        <Reveal delay={0.08} className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Projected value
            </span>
            <span className="text-lg font-extrabold text-foreground">
              <CountUp value={tenYr.value} prefix="Rp " />
            </span>
          </div>
          <div className="h-[220px] w-full md:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="fvArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.52 0.13 162)" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="oklch(0.52 0.13 162)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.006 150)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "oklch(0.52 0.012 160)" }}
                  tickFormatter={(v) => `${v}y`}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "oklch(0.52 0.012 160)" }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                />
                <Tooltip
                  formatter={(v: number) => `Rp ${v.toLocaleString("id-ID")}`}
                  labelFormatter={(l) => `Year ${l}`}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid oklch(0.91 0.006 150)",
                    fontSize: 12,
                  }}
                />
                <ReferenceLine x={1} stroke="oklch(0.72 0.13 85 / 0.4)" strokeDasharray="4 4" />
                <ReferenceLine x={5} stroke="oklch(0.72 0.13 85 / 0.4)" strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.52 0.13 162)"
                  strokeWidth={2.5}
                  fill="url(#fvArea)"
                  isAnimationActive
                  animationDuration={700}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* milestones */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="hidden items-center md:flex">
              <div className="relative h-px flex-1 bg-border">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-amber-400"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {milestoneValues.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <div className="relative flex h-3 w-3 items-center justify-center">
                    <motion.span
                      animate={{ boxShadow: "0 0 0 0 oklch(0.52 0.13 162 / 0.4)" }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-2.5 w-2.5 rounded-full bg-primary"
                    />
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {m.label}
                  </span>
                  <span className="text-[10px] font-bold text-foreground">
                    Rp {(m.value / 1000000).toFixed(1)}M
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-emerald-50/60 to-amber-50/30 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">
              <span className="font-bold">Time is the investor&apos;s friend.</span> The earlier you
              start, the more growth compounds — but all returns here are hypothetical. In 10 years
              you could have{" "}
              <span className="font-bold text-primary">
                Rp {tenYr.value.toLocaleString("id-ID")}
              </span>
              , of which{" "}
              <span className="font-bold text-amber-600">
                Rp {growthContrib.toLocaleString("id-ID")}
              </span>{" "}
              comes from growth alone.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Lever({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-primary">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="santrivest-range h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, oklch(0.52 0.13 162) 0%, oklch(0.52 0.13 162) ${pct}%, oklch(0.91 0.006 150) ${pct}%, oklch(0.91 0.006 150) 100%)`,
        }}
      />
    </div>
  );
}

/* ============================================================
   SECTION 2 — TRADE OR RIBA?
============================================================ */

const COMPARE_ROWS = [
  { feature: "Backed by a real asset?", trade: "Yes", riba: "No" },
  { feature: "Effort &amp; risk involved?", trade: "Yes", riba: "No" },
  { feature: "Money generates money directly?", trade: "No", riba: "Yes" },
  { feature: "Permitted in Islam?", trade: "Halal", riba: "Haram" },
];

function FlowNode({
  icon: Icon,
  label,
  sublabel,
  color,
  active,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  color: string;
  active: boolean;
}) {
  return (
    <motion.div
      animate={{ scale: active ? 1.05 : 1, opacity: active ? 1 : 0.85 }}
      className="flex flex-col items-center gap-1.5 text-center"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl border"
        style={{ borderColor: color + "55", background: color + "12" }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-foreground">{label}</span>
        {sublabel && <span className="text-[10px] text-muted-foreground">{sublabel}</span>}
      </div>
    </motion.div>
  );
}

function FlowArrow({ active, delay }: { active: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0.2 }}
      animate={{ opacity: active ? 1 : 0.2 }}
      transition={{ delay }}
      className="flex items-center"
    >
      <svg width="34" height="10" viewBox="0 0 34 10">
        <motion.line
          x1="0"
          y1="5"
          x2="28"
          y2="5"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted-foreground"
          strokeDasharray="3 3"
        />
        <path d="M28 1 L33 5 L28 9 Z" fill="currentColor" className="text-muted-foreground" />
      </svg>
    </motion.div>
  );
}

function TradeVsRiba() {
  const [runTrade, setRunTrade] = useState(0);
  const [runRiba, setRunRiba] = useState(0);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Eyebrow>Compare</Eyebrow>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">Trade or Riba?</h2>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          See the conceptual difference between permitted trade and prohibited interest — visually.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* TRADE */}
        <Reveal className="rounded-2xl border border-primary/30 bg-card p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <HandCoins className="h-4 w-4 text-primary" />
              </span>
              <span className="text-sm font-bold text-foreground">Trade</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Halal
              </span>
            </div>
            <Magnetic strength={0.4}>
              <button
                onClick={() => setRunTrade((r) => r + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground"
              >
                <Play className="h-3 w-3" /> Run
              </button>
            </Magnetic>
          </div>

          <div className="flex items-center justify-between gap-1 py-4">
            <FlowNode icon={Coins} label="Capital" sublabel="Rp1,000,000" color="oklch(0.52 0.13 162)" active={runTrade > 0} />
            <FlowArrow active={runTrade > 0} delay={0.2} />
            <FlowNode icon={Gem} label="Buy goods" sublabel="Real asset" color="oklch(0.68 0.08 175)" active={runTrade > 0} />
            <FlowArrow active={runTrade > 0} delay={0.4} />
            <FlowNode icon={Coins} label="Sell" sublabel="Rp1,200,000" color="oklch(0.6 0.16 50)" active={runTrade > 0} />
          </div>

          <AnimatePresence mode="wait">
            {runTrade > 0 && (
              <motion.div
                key={runTrade}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-primary/[0.06] p-3 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  Profit <span className="font-bold text-primary">Rp200,000</span> from real exchange
                  of goods + effort + risk.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            You buy an item for Rp1,000,000 and sell it for Rp1,200,000. The Rp200,000 profit comes
            from trading a real good, with effort and risk shared.
          </p>
        </Reveal>

        {/* RIBA */}
        <Reveal delay={0.08} className="rounded-2xl border border-amber-400/30 bg-card p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/15">
                <Scale className="h-4 w-4 text-amber-600" />
              </span>
              <span className="text-sm font-bold text-foreground">Loan + Interest</span>
              <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                Riba · Haram
              </span>
            </div>
            <Magnetic strength={0.4}>
              <button
                onClick={() => setRunRiba((r) => r + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground"
              >
                <Play className="h-3 w-3" /> Run
              </button>
            </Magnetic>
          </div>

          <div className="flex items-center justify-between gap-1 py-4">
            <FlowNode icon={Coins} label="Capital" sublabel="Rp1,000,000" color="oklch(0.72 0.13 85)" active={runRiba > 0} />
            <FlowArrow active={runRiba > 0} delay={0.2} />
            <FlowNode icon={Clock} label="Lend" sublabel="Time passes" color="oklch(0.6 0.1 200)" active={runRiba > 0} />
            <FlowArrow active={runRiba > 0} delay={0.4} />
            <FlowNode icon={Coins} label="Repay" sublabel="Rp1,200,000" color="oklch(0.6 0.16 50)" active={runRiba > 0} />
          </div>

          <AnimatePresence mode="wait">
            {runRiba > 0 && (
              <motion.div
                key={runRiba}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-amber-50/70 p-3 text-center"
              >
                <p className="text-xs text-amber-700">
                  Interest <span className="font-bold">Rp200,000</span> charged purely for lending
                  time — no real economic activity.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            You lend Rp1,000,000 and demand Rp1,200,000 in return. The Rp200,000 is interest charged
            purely for time — money generating money without real economic activity.
          </p>
        </Reveal>
      </div>

      {/* Comparison table */}
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
          <div className="grid grid-cols-3 border-b border-border/60 bg-secondary/40 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            <div className="p-3">Question</div>
            <div className="p-3 text-primary">Trade</div>
            <div className="p-3 text-amber-700">Riba</div>
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-3 text-xs",
                i % 2 === 1 && "bg-background/40"
              )}
            >
              <div className="p-3 font-medium text-foreground">{row.feature}</div>
              <div className="p-3 font-semibold text-primary">{row.trade}</div>
              <div className="p-3 font-semibold text-amber-700">{row.riba}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-emerald-50/50 to-amber-50/30 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">
              <span className="font-bold">Not every increase is riba.</span> Profit from legitimate
              trade is permitted. Riba is specifically interest on a loan where money creates money
              without real economic activity.{" "}
              <span className="font-medium text-muted-foreground">
                — &ldquo;Allah has permitted trade and forbidden riba.&rdquo; (Al-Baqarah 2:275)
              </span>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   MAIN
============================================================ */

export function SimulationView() {
  return (
    <ViewShell>
      <ViewHeader
        eyebrow="Interactive Simulations"
        title={
          <>
            See Money <span className="text-gradient-emerald">In Motion</span>
          </>
        }
        subtitle="Two storytelling simulations: project your future self, and visually compare trade with interest."
        back="home"
        backLabel="Back to Home"
      />
      <ViewBody className="gap-12">
        <FutureYou />
        <TradeVsRiba />
      </ViewBody>
      <ContinueExploring current="simulation" links={RELATED_LINKS.simulation} />
    </ViewShell>
  );
}
