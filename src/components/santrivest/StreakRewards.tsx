"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Star, Zap, Crown, Sparkles } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { Reveal, Eyebrow, CountUp } from "./animations/primitives";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

const STREAK_MILESTONES = [
  { days: 3, label: "Kindled", icon: Sparkles, tier: "bronze" },
  { days: 7, label: "Consistent", icon: Flame, tier: "silver" },
  { days: 14, label: "Dedicated", icon: Zap, tier: "gold" },
  { days: 30, label: "Unshakable", icon: Crown, tier: "platinum" },
];

const TIER_COLORS: Record<string, { bg: string; soft: string; text: string }> = {
  bronze: { bg: "oklch(0.65 0.08 55)", soft: "oklch(0.65 0.08 55 / 0.12)", text: "oklch(0.5 0.08 55)" },
  silver: { bg: "oklch(0.6 0.02 250)", soft: "oklch(0.6 0.02 250 / 0.12)", text: "oklch(0.45 0.02 250)" },
  gold: { bg: "oklch(0.72 0.13 85)", soft: "oklch(0.72 0.13 85 / 0.14)", text: "oklch(0.5 0.1 75)" },
  platinum: { bg: "oklch(0.52 0.13 162)", soft: "oklch(0.52 0.13 162 / 0.14)", text: "oklch(0.4 0.13 162)" },
};

export function StreakRewards() {
  const streak = useSantrivest((s) => s.streak);
  const activityLog = useSantrivest((s) => s.activityLog);

  // Build last 7 days (Mon-Sun of current week)
  const weekData = useMemo(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // 0 = Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = dayKey(d);
      const active = activityLog.includes(key);
      const isToday = key === dayKey(today);
      return {
        weekday: WEEKDAYS[i],
        day: d.getDate(),
        active,
        isToday,
        key,
      };
    });
  }, [activityLog]);

  const activeDays = weekData.filter((d) => d.active).length;
  const weeklyPct = Math.round((activeDays / 7) * 100);

  // Find current + next milestone
  const currentMilestone = [...STREAK_MILESTONES].reverse().find((m) => streak >= m.days);
  const nextMilestone = STREAK_MILESTONES.find((m) => streak < m.days);
  const nextMilestoneProgress = nextMilestone
    ? Math.min(100, Math.round((streak / nextMilestone.days) * 100))
    : 100;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <Eyebrow>Streak &amp; Rewards</Eyebrow>
          <p className="text-2xl font-bold text-foreground">
            <CountUp value={streak} /> <span className="text-muted-foreground">day streak</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">This week</span>
          <span className="text-lg font-bold text-foreground tabular-nums">{activeDays}/7</span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-border/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${weeklyPct}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Weekly activity calendar */}
      <Reveal>
        <div className="rounded-2xl border border-border/70 bg-card p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {weekData.map((d, i) => (
              <motion.div
                key={d.key}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {d.weekday}
                </span>
                <div
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition-all",
                    d.active
                      ? "bg-gradient-to-br from-amber-400 to-primary text-white shadow-sm"
                      : d.isToday
                      ? "border-2 border-primary/40 bg-primary/[0.04] text-foreground"
                      : "bg-secondary text-muted-foreground/50"
                  )}
                >
                  {d.day}
                </div>
                {d.isToday && (
                  <span className="text-[9px] font-bold uppercase text-primary">Today</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Milestones */}
      <Reveal delay={0.08}>
        <div className="rounded-2xl border border-border/70 bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Milestones
            </span>
            {nextMilestone && (
              <span className="text-[11px] text-muted-foreground">
                {nextMilestone.days - streak} days to &ldquo;{nextMilestone.label}&rdquo;
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {STREAK_MILESTONES.map((m) => {
              const unlocked = streak >= m.days;
              const color = TIER_COLORS[m.tier];
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.days}
                  whileHover={unlocked ? { scale: 1.03 } : {}}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl border p-3 text-center transition-all",
                    unlocked ? "bg-card" : "bg-background/40 border-border/50"
                  )}
                  style={unlocked ? { borderColor: color.bg + "40" } : undefined}
                >
                  {unlocked && (
                    <div
                      className="pointer-events-none absolute -top-6 h-16 w-16 rounded-full blur-2xl"
                      style={{ background: color.soft }}
                      aria-hidden
                    />
                  )}
                  <div
                    className="relative flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: unlocked ? color.soft : "oklch(0.91 0.006 150 / 0.5)",
                    }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: unlocked ? color.bg : "oklch(0.52 0.012 160 / 0.4)" }}
                      strokeWidth={1.8}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-bold leading-tight",
                      unlocked ? "text-foreground" : "text-muted-foreground/60"
                    )}
                  >
                    {m.label}
                  </span>
                  <span
                    className="text-[9px] font-medium uppercase tracking-wide"
                    style={{ color: unlocked ? color.text : "oklch(0.52 0.012 160 / 0.4)" }}
                  >
                    {m.days} days
                  </span>
                </motion.div>
              );
            })}
          </div>
          {/* Progress to next milestone */}
          {nextMilestone && (
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextMilestoneProgress}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                {streak}/{nextMilestone.days}
              </span>
            </div>
          )}
        </div>
      </Reveal>

      {/* Current milestone badge */}
      {currentMilestone && (
        <Reveal delay={0.12}>
          <div
            className="flex items-center gap-3 rounded-2xl border p-4"
            style={{
              borderColor: TIER_COLORS[currentMilestone.tier].bg + "40",
              background: TIER_COLORS[currentMilestone.tier].soft,
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: "oklch(1 0 0 / 0.6)" }}
            >
              <Trophy
                className="h-5 w-5"
                style={{ color: TIER_COLORS[currentMilestone.tier].bg }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">
                {currentMilestone.label} · {currentMilestone.days}-day streak
              </span>
              <span className="text-xs text-muted-foreground">
                You&apos;ve reached a {TIER_COLORS[currentMilestone.tier].text === undefined ? "" : currentMilestone.tier} milestone. Keep going!
              </span>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
