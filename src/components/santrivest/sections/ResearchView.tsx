"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Check,
  ArrowRight,
  RotateCcw,
  Download,
  FileText,
  Users,
  Clock,
  Info,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { RESEARCH_STATEMENTS, LIKERT_LABELS } from "@/lib/educational-data";
import { useSantrivest, type ResearchPhase } from "@/lib/store";
import { ViewShell, ViewHeader, ViewBody, ContinueExploring, RELATED_LINKS } from "../ViewShell";
import {
  Reveal,
  Stagger,
  StaggerItem,
  CountUp,
  Magnetic,
  Eyebrow,
} from "../animations/primitives";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const INDICATOR_META: Record<
  string,
  { label: string; color: string; desc: string }
> = {
  Knowledge: { label: "Knowledge", color: "oklch(0.55 0.13 162)", desc: "Understanding of Islamic & conventional finance, products, principles" },
  Skills: { label: "Skills", color: "oklch(0.68 0.08 175)", desc: "Calculating income/expenses, budgeting, allocating, saving" },
  Beliefs: { label: "Beliefs", color: "oklch(0.6 0.1 200)", desc: "Why Sharia compliance matters; avoiding riba; evaluating products" },
  Attitudes: { label: "Attitudes", color: "oklch(0.72 0.13 85)", desc: "Thinking before spending; resisting promotions; avoiding impulse" },
  Behavior: { label: "Behavior", color: "oklch(0.65 0.12 320)", desc: "Financial planning, saving, future-oriented thinking" },
  Interest: { label: "Interest", color: "oklch(0.6 0.16 50)", desc: "What Sharia investment is; why invest; available options" },
  Motivation: { label: "Motivation", color: "oklch(0.55 0.1 280)", desc: "Future goals, independence, responsible wealth creation" },
};

function LikertScale({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            aria-label={`Rate ${n}: ${LIKERT_LABELS[n - 1]}`}
            className={cn(
              "flex h-11 items-center justify-center rounded-xl border text-sm font-bold transition-all",
              value === n
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary"
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Strongly disagree</span>
        <span>Neutral</span>
        <span>Strongly agree</span>
      </div>
    </div>
  );
}

function LikertForm({
  phase,
  onComplete,
}: {
  phase: ResearchPhase;
  onComplete: (responses: Record<string, number>) => void;
}) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(responses).length;
  const total = RESEARCH_STATEMENTS.length;
  const allAnswered = answeredCount === total;

  // group by indicator
  const grouped = useMemo(() => {
    const g: Record<string, typeof RESEARCH_STATEMENTS> = {};
    for (const s of RESEARCH_STATEMENTS) {
      (g[s.indicator] ||= []).push(s);
    }
    return g;
  }, []);

  const submit = () => {
    setSubmitted(true);
    onComplete(responses);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* progress */}
      <div className="sticky top-24 z-10 -mx-5 px-5 py-3 md:-mx-8 md:px-8">
        <div className="glass-strong flex items-center justify-between gap-4 rounded-2xl border border-border/60 px-4 py-3 shadow-lift">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
              {phase === "pre" ? "Pre-test" : "Post-test"}
            </span>
            <span className="text-xs text-muted-foreground">
              {answeredCount}/{total} answered
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-border sm:block">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
                animate={{ width: `${(answeredCount / total) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <button
              onClick={submit}
              disabled={!allAnswered || submitted}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                allAnswered && !submitted
                  ? "bg-foreground text-background hover:opacity-90"
                  : "cursor-not-allowed bg-secondary text-muted-foreground"
              )}
            >
              {submitted ? (
                <>
                  <Check className="h-3 w-3" /> Saved
                </>
              ) : (
                <>
                  Submit <ArrowRight className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* statements */}
      <Stagger className="flex flex-col gap-8">
        {Object.entries(grouped).map(([indicator, statements]) => {
          const meta = INDICATOR_META[indicator];
          return (
            <StaggerItem key={indicator}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: meta.color }}
                  />
                  <h3 className="text-sm font-bold text-foreground">{meta.label}</h3>
                  <span className="text-xs text-muted-foreground">· {meta.desc}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {statements.map((s) => (
                    <div
                      key={s.id}
                      className={cn(
                        "rounded-2xl border bg-card p-4 transition-all",
                        responses[s.id]
                          ? "border-primary/30"
                          : "border-border/70"
                      )}
                    >
                      <p className="mb-3 text-sm text-foreground">{s.text}</p>
                      <LikertScale
                        value={responses[s.id] || 0}
                        onChange={(v) =>
                          setResponses((prev) => ({ ...prev, [s.id]: v }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* bottom submit */}
      <div className="flex justify-end">
        <Magnetic strength={0.4}>
          <button
            onClick={submit}
            disabled={!allAnswered || submitted}
            data-cursor="Submit"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all",
              allAnswered && !submitted
                ? "bg-foreground text-background hover:opacity-90"
                : "cursor-not-allowed bg-secondary text-muted-foreground"
            )}
          >
            {submitted ? (
              <>
                <Check className="h-4 w-4" /> Responses saved
              </>
            ) : (
              <>
                Submit {phase === "pre" ? "pre-test" : "post-test"}{" "}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </Magnetic>
      </div>
    </div>
  );
}

function ResultsChart({
  responses,
  title,
}: {
  responses: Record<string, number>;
  title: string;
}) {
  const data = useMemo(() => {
    const byIndicator: Record<string, { sum: number; count: number }> = {};
    for (const s of RESEARCH_STATEMENTS) {
      const v = responses[s.id];
      if (!v) continue;
      byIndicator[s.indicator] ||= { sum: 0, count: 0 };
      byIndicator[s.indicator].sum += v;
      byIndicator[s.indicator].count += 1;
    }
    return Object.entries(byIndicator).map(([indicator, { sum, count }]) => ({
      indicator,
      avg: count ? +(sum / count).toFixed(2) : 0,
      color: INDICATOR_META[indicator]?.color || "oklch(0.5 0 0)",
    }));
  }, [responses]);

  const overall = data.length
    ? +(data.reduce((a, b) => a + b.avg, 0) / data.length).toFixed(2)
    : 0;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </span>
          <span className="text-2xl font-bold text-foreground">
            <CountUp value={overall} decimals={1} /> / 5
          </span>
          <span className="text-[11px] text-muted-foreground">average across indicators</span>
        </div>
        <TrendingUp className="h-5 w-5 text-primary" />
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.006 150)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fontSize: 10, fill: "oklch(0.52 0.012 160)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="indicator"
              tick={{ fontSize: 11, fill: "oklch(0.21 0.006 160)" }}
              width={84}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "oklch(0.52 0.13 162 / 0.06)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid oklch(0.91 0.006 150)",
                fontSize: 12,
              }}
              formatter={(v: number) => `${v} / 5`}
            />
            <Bar dataKey="avg" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={800}>
              {data.map((d) => (
                <Cell key={d.indicator} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ComparisonView({
  pre,
  post,
}: {
  pre: Record<string, number>;
  post: Record<string, number>;
}) {
  const data = useMemo(() => {
    const byIndicator: Record<string, { preSum: number; postSum: number; count: number }> = {};
    for (const s of RESEARCH_STATEMENTS) {
      const pv = pre[s.id];
      const ov = post[s.id];
      if (!pv || !ov) continue;
      byIndicator[s.indicator] ||= { preSum: 0, postSum: 0, count: 0 };
      byIndicator[s.indicator].preSum += pv;
      byIndicator[s.indicator].postSum += ov;
      byIndicator[s.indicator].count += 1;
    }
    return Object.entries(byIndicator).map(([indicator, v]) => ({
      indicator,
      pre: v.count ? +(v.preSum / v.count).toFixed(2) : 0,
      post: v.count ? +(v.postSum / v.count).toFixed(2) : 0,
      delta: v.count ? +((v.postSum - v.preSum) / v.count).toFixed(2) : 0,
    }));
  }, [pre, post]);

  const overallPre = data.length ? +(data.reduce((a, b) => a + b.pre, 0) / data.length).toFixed(2) : 0;
  const overallPost = data.length ? +(data.reduce((a, b) => a + b.post, 0) / data.length).toFixed(2) : 0;
  const delta = +(overallPost - overallPre).toFixed(2);

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-emerald-50/60 to-amber-50/30 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-2">
        <Eyebrow>Pre vs Post Comparison</Eyebrow>
        <h3 className="text-xl font-bold text-foreground">Indicator shift</h3>
        <p className="text-sm text-muted-foreground">
          A positive delta suggests growth in that indicator after using the platform.
        </p>
      </div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Pre-test</span>
          <p className="text-xl font-bold text-foreground">{overallPre}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Post-test</span>
          <p className="text-xl font-bold text-foreground">{overallPost}</p>
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/[0.06] p-3 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">Shift</span>
          <p className={cn("text-xl font-bold", delta >= 0 ? "text-primary" : "text-amber-600")}>
            {delta >= 0 ? "+" : ""}{delta}
          </p>
        </div>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.006 150)" vertical={false} />
            <XAxis
              dataKey="indicator"
              tick={{ fontSize: 10, fill: "oklch(0.52 0.012 160)" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fontSize: 10, fill: "oklch(0.52 0.012 160)" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              cursor={{ fill: "oklch(0.52 0.13 162 / 0.06)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid oklch(0.91 0.006 150)",
                fontSize: 12,
              }}
              formatter={(v: number, name: string) => [`${v} / 5`, name === "pre" ? "Pre-test" : "Post-test"]}
            />
            <Bar dataKey="pre" fill="oklch(0.91 0.006 150)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
            <Bar dataKey="post" fill="oklch(0.52 0.13 162)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-border" /> Pre-test
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Post-test
        </span>
      </div>
    </div>
  );
}

function exportCSV(pre: Record<string, number> | undefined, post: Record<string, number> | undefined) {
  const rows: string[] = [];
  rows.push("statement_id,indicator,statement_text,pre_response,post_response");
  for (const s of RESEARCH_STATEMENTS) {
    const preV = pre?.[s.id] ?? "";
    const postV = post?.[s.id] ?? "";
    // escape statement text (wrap in quotes, escape internal quotes)
    const text = `"${s.text.replace(/"/g, '""')}"`;
    rows.push(`${s.id},${s.indicator},${text},${preV},${postV}`);
  }
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `santrivest-research-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ResearchView() {
  const { researchPre, researchPost, setResearchResult } = useSantrivest();
  const [mode, setMode] = useState<"overview" | "pre" | "post">("overview");

  const startPre = () => setMode("pre");
  const startPost = () => setMode("post");

  return (
    <ViewShell>
      <ViewHeader
        eyebrow="Research Mode"
        title={
          <>
            Research &amp; <span className="text-gradient-emerald">Assessment</span>
          </>
        }
        subtitle="Pre-test and post-test instrument for researchers and teachers. Responses measure financial literacy indicators across knowledge, skills, beliefs, attitudes, behavior, interest, and motivation."
        back="home"
        backLabel="Back to Home"
      />
      <ViewBody className="gap-8">
        {/* info banner */}
        <Reveal>
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-400/30 bg-amber-50/50 p-4 md:flex-row md:items-start md:gap-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex flex-col gap-1.5 text-sm">
              <p className="font-semibold text-foreground">For researchers &amp; teachers</p>
              <p className="text-muted-foreground">
                This mode is intentionally discreet during normal learning. The Likert statements
                indirectly correspond to concepts the educational content builds understanding of.
                Students should encounter the questionnaire as a research activity, not a game.
              </p>
              <p className="text-xs text-muted-foreground">
                No personally identifiable information is collected. Responses are stored locally on
                this device only and can be exported as CSV.
              </p>
            </div>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {mode === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col gap-6"
            >
              {/* phase cards */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* pre-test */}
                <Reveal>
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                          <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <span className="text-sm font-bold text-foreground">Pre-test</span>
                      </div>
                      {researchPre && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <Check className="h-2.5 w-2.5" /> Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Administer <span className="font-semibold text-foreground">before</span> the
                      student begins learning. Establishes baseline literacy.
                    </p>
                    {researchPre && (
                      <p className="text-[11px] text-muted-foreground">
                        Last taken: {new Date(researchPre.date).toLocaleString("id-ID")}
                      </p>
                    )}
                    <div className="mt-auto flex gap-2 pt-2">
                      <button
                        onClick={startPre}
                        data-cursor="Open"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background"
                      >
                        {researchPre ? "Retake pre-test" : "Start pre-test"} <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </Reveal>

                {/* post-test */}
                <Reveal delay={0.06}>
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        </span>
                        <span className="text-sm font-bold text-foreground">Post-test</span>
                        </div>
                      {researchPost && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <Check className="h-2.5 w-2.5" /> Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Administer <span className="font-semibold text-foreground">after</span> the
                      student completes the learning modules and simulations. Measures growth.
                    </p>
                    {researchPost && (
                      <p className="text-[11px] text-muted-foreground">
                        Last taken: {new Date(researchPost.date).toLocaleString("id-ID")}
                      </p>
                    )}
                    <div className="mt-auto flex gap-2 pt-2">
                      <button
                        onClick={startPost}
                        data-cursor="Open"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background"
                      >
                        {researchPost ? "Retake post-test" : "Start post-test"} <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* stats */}
              <Reveal>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <StatCard icon={FileText} label="Statements" value={RESEARCH_STATEMENTS.length} />
                  <StatCard icon={Users} label="Indicators" value={Object.keys(INDICATOR_META).length} />
                  <StatCard icon={Clock} label="Est. time" value="8 min" />
                  <StatCard icon={Sparkles} label="Likert points" value={5} />
                </div>
              </Reveal>

              {/* results / comparison */}
              {(researchPre || researchPost) && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Eyebrow>Results</Eyebrow>
                    <button
                      onClick={() => exportCSV(researchPre?.responses, researchPost?.responses)}
                      data-cursor="Export"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                    >
                      <Download className="h-3 w-3" /> Export CSV
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {researchPre && <ResultsChart responses={researchPre.responses} title="Pre-test results" />}
                    {researchPost && <ResultsChart responses={researchPost.responses} title="Post-test results" />}
                  </div>
                  {researchPre && researchPost && (
                    <ComparisonView pre={researchPre.responses} post={researchPost.responses} />
                  )}
                </div>
              )}

              {/* indicators legend */}
              <Reveal>
                <div className="rounded-2xl border border-border/70 bg-card p-5">
                  <Eyebrow>Indicators Measured</Eyebrow>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {Object.entries(INDICATOR_META).map(([key, meta]) => (
                      <div key={key} className="flex items-start gap-2.5 rounded-xl bg-background/60 p-3">
                        <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: meta.color }} />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">{meta.label}</span>
                          <span className="text-[11px] text-muted-foreground">{meta.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </motion.div>
          )}

          {mode === "pre" && (
            <motion.div
              key="pre"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col gap-4"
            >
              <button
                onClick={() => setMode("overview")}
                className="flex w-fit items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to overview
              </button>
              <LikertForm
                phase="pre"
                onComplete={(r) => {
                  setResearchResult("pre", r);
                  setTimeout(() => setMode("overview"), 800);
                }}
              />
            </motion.div>
          )}

          {mode === "post" && (
            <motion.div
              key="post"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col gap-4"
            >
              <button
                onClick={() => setMode("overview")}
                className="flex w-fit items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to overview
              </button>
              <LikertForm
                phase="post"
                onComplete={(r) => {
                  setResearchResult("post", r);
                  setTimeout(() => setMode("overview"), 800);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ViewBody>
      <ContinueExploring current="progress" links={RELATED_LINKS.progress} />
    </ViewShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border/70 bg-card p-4">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xl font-bold text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
