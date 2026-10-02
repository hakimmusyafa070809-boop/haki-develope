"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus, Clock, Timer, Layers } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { Reveal, Eyebrow, CountUp } from "./animations/primitives";
import { cn } from "@/lib/utils";

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  easy: { bg: "oklch(0.55 0.13 162 / 0.1)", text: "oklch(0.4 0.13 162)", label: "Easy" },
  medium: { bg: "oklch(0.72 0.13 85 / 0.12)", text: "oklch(0.5 0.1 75)", label: "Medium" },
  hard: { bg: "oklch(0.58 0.21 27 / 0.1)", text: "oklch(0.5 0.21 27)", label: "Hard" },
  all: { bg: "bg-secondary", text: "text-muted-foreground", label: "All" },
};

export function QuizHistory() {
  const history = useSantrivest((s) => s.quizHistory);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const totalAttempts = history.length;
    const avgPct = Math.round(
      history.reduce((acc, h) => acc + (h.total > 0 ? (h.score / h.total) * 100 : 0), 0) / totalAttempts
    );
    const best = history.reduce((best, h) => {
      const pct = h.total > 0 ? (h.score / h.total) * 100 : 0;
      const bestPct = best.total > 0 ? (best.score / best.total) * 100 : 0;
      return pct > bestPct ? h : best;
    }, history[0]);
    const bestPct = best.total > 0 ? Math.round((best.score / best.total) * 100) : 0;
    // Trend: compare last 2 attempts
    let trend: "up" | "down" | "same" = "same";
    if (history.length >= 2) {
      const last = history[0];
      const prev = history[1];
      const lastPct = last.total > 0 ? (last.score / last.total) * 100 : 0;
      const prevPct = prev.total > 0 ? (prev.score / prev.total) * 100 : 0;
      if (lastPct > prevPct + 1) trend = "up";
      else if (lastPct < prevPct - 1) trend = "down";
    }
    return { totalAttempts, avgPct, best, bestPct, trend };
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/40 p-6 text-center">
        <Brain className="h-7 w-7 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">No quiz attempts yet</p>
        <p className="text-xs text-muted-foreground">
          Take the quiz to start tracking your progress over time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <Eyebrow>Quiz History</Eyebrow>
          <p className="text-2xl font-bold text-foreground">
            <CountUp value={stats!.totalAttempts} />{" "}
            <span className="text-muted-foreground">attempts</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Stats */}
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Avg</span>
            <span className="text-sm font-bold text-foreground tabular-nums">{stats!.avgPct}%</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/[0.06] px-3 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">Best</span>
            <span className="text-sm font-bold text-primary tabular-nums">{stats!.bestPct}%</span>
          </div>
          {/* Trend */}
          {stats!.trend !== "same" && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-lg border px-3 py-1.5",
                stats!.trend === "up"
                  ? "border-primary/30 bg-primary/[0.06]"
                  : "border-amber-400/30 bg-amber-50/60"
              )}
            >
              {stats!.trend === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-amber-600" />
              )}
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide",
                  stats!.trend === "up" ? "text-primary" : "text-amber-600"
                )}
              >
                {stats!.trend === "up" ? "Improving" : "Review"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* History list */}
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
          {/* Header row */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 border-b border-border/60 bg-secondary/40 px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground md:px-4">
            <span className="w-8 text-center">Score</span>
            <span>Config</span>
            <span className="hidden md:inline">Date</span>
            <span className="hidden md:inline">Time</span>
            <span className="text-right">Pct</span>
          </div>
          {/* Entries */}
          <div className="flex flex-col">
            {history.slice(0, 8).map((h, i) => {
              const pct = h.total > 0 ? Math.round((h.score / h.total) * 100) : 0;
              const diffStyle = DIFFICULTY_STYLES[h.difficulty] || DIFFICULTY_STYLES.all;
              const isBest = h.id === stats!.best.id;
              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 border-b border-border/40 px-3 py-2.5 transition-colors last:border-b-0 hover:bg-primary/[0.02] md:px-4",
                    i % 2 === 1 && "bg-background/30",
                    isBest && "bg-primary/[0.04]"
                  )}
                >
                  {/* Score */}
                  <div className="flex w-8 items-center justify-center">
                    <span
                      className={cn(
                        "text-xs font-bold tabular-nums",
                        pct >= 80 ? "text-primary" : pct >= 50 ? "text-foreground" : "text-amber-600"
                      )}
                    >
                      {h.score}/{h.total}
                    </span>
                  </div>
                  {/* Config */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                      style={
                        h.difficulty === "all"
                          ? { borderColor: "oklch(0.91 0.006 150)", color: "oklch(0.52 0.012 160)", background: "oklch(0.97 0 0)" }
                          : { borderColor: (diffStyle as any).bg?.replace?.(/0\.\d+/, "0.4") || "border", color: (diffStyle as any).text || "text-muted-foreground", background: (diffStyle as any).bg || "bg-secondary" }
                      }
                    >
                      {diffStyle.label}
                    </span>
                    {h.category !== "All" && (
                      <span className="rounded-full border border-border/60 bg-background px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {h.category}
                      </span>
                    )}
                    {h.timedMode && (
                      <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-400/40 bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                        <Timer className="h-2.5 w-2.5" /> Timed
                      </span>
                    )}
                    {isBest && (
                      <span className="inline-flex items-center gap-0.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                        <Layers className="h-2.5 w-2.5" /> Best
                      </span>
                    )}
                  </div>
                  {/* Date */}
                  <span className="hidden text-[10px] text-muted-foreground md:inline">
                    {formatDate(h.date)}
                  </span>
                  {/* Duration */}
                  <span className="hidden items-center gap-1 text-[10px] text-muted-foreground md:flex">
                    <Clock className="h-2.5 w-2.5" />
                    {formatDuration(h.durationSec)}
                  </span>
                  {/* Pct */}
                  <span className="text-right text-xs font-bold tabular-nums text-foreground">
                    {pct}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {history.length > 8 && (
        <p className="text-center text-[11px] text-muted-foreground">
          Showing 8 most recent of {history.length} total attempts
        </p>
      )}
    </div>
  );
}
