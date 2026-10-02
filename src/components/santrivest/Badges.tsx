"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  FlaskConical,
  Scale,
  TrendingUp,
  Wallet,
  Trophy,
  Flame,
  Sparkles,
  Target,
  ShieldCheck,
  PenLine,
  GraduationCap,
  Award,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { LEARN_MODULES, GLOSSARY, RESEARCH_STATEMENTS } from "@/lib/educational-data";
import { Reveal, Stagger, StaggerItem, Eyebrow, CountUp } from "./animations/primitives";
import { cn } from "@/lib/utils";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tier: "bronze" | "silver" | "gold" | "platinum";
  category: string;
  unlocked: boolean;
  progress?: { current: number; target: number };
  unlockedAt?: string;
}

const TIER_STYLES = {
  bronze: {
    bg: "oklch(0.65 0.08 55)",
    soft: "oklch(0.65 0.08 55 / 0.1)",
    border: "oklch(0.65 0.08 55 / 0.3)",
    label: "Bronze",
  },
  silver: {
    bg: "oklch(0.6 0.02 250)",
    soft: "oklch(0.6 0.02 250 / 0.1)",
    border: "oklch(0.6 0.02 250 / 0.3)",
    label: "Silver",
  },
  gold: {
    bg: "oklch(0.72 0.13 85)",
    soft: "oklch(0.72 0.13 85 / 0.12)",
    border: "oklch(0.72 0.13 85 / 0.4)",
    label: "Gold",
  },
  platinum: {
    bg: "oklch(0.52 0.13 162)",
    soft: "oklch(0.52 0.13 162 / 0.12)",
    border: "oklch(0.52 0.13 162 / 0.4)",
    label: "Platinum",
  },
};

export function useBadges(): Badge[] {
  const completedModules = useSantrivest((s) => s.completedModules);
  const quizResult = useSantrivest((s) => s.quizResult);
  const simSessions = useSantrivest((s) => s.simSessions);
  const openedTerms = useSantrivest((s) => s.openedTerms);
  const needsWantsDone = useSantrivest((s) => s.needsWantsDone);
  const checkerDone = useSantrivest((s) => s.checkerDone);
  const reflections = useSantrivest((s) => s.reflections);
  const researchPre = useSantrivest((s) => s.researchPre);
  const researchPost = useSantrivest((s) => s.researchPost);
  const streak = useSantrivest((s) => s.streak);

  return useMemo(() => {
    const modulesCount = completedModules.length;
    const modulesTotal = LEARN_MODULES.length;
    const quizScore = quizResult?.score ?? 0;
    const quizTotal = quizResult?.total ?? 0;
    const quizPct = quizTotal > 0 ? (quizScore / quizTotal) * 100 : 0;
    const simsCount = simSessions.length;
    const termsCount = openedTerms.length;
    const termsTotal = GLOSSARY.length;
    const reflectionsCount = Object.keys(reflections).length;
    const researchDone = !!(researchPre || researchPost);

    const badges: Badge[] = [
      // Learning path badges
      {
        id: "first-step",
        name: "First Step",
        description: "Complete your first learning module",
        icon: BookOpen,
        tier: "bronze",
        category: "Learning",
        unlocked: modulesCount >= 1,
        progress: { current: Math.min(modulesCount, 1), target: 1 },
      },
      {
        id: "scholar",
        name: "Scholar",
        description: "Complete all 6 learning modules",
        icon: GraduationCap,
        tier: "gold",
        category: "Learning",
        unlocked: modulesCount >= modulesTotal,
        progress: { current: modulesCount, target: modulesTotal },
      },
      // Quiz badges
      {
        id: "quiz-novice",
        name: "Quiz Novice",
        description: "Complete your first quiz",
        icon: Brain,
        tier: "bronze",
        category: "Quiz",
        unlocked: !!quizResult,
        progress: { current: quizResult ? 1 : 0, target: 1 },
      },
      {
        id: "quiz-master",
        name: "Quiz Master",
        description: "Score 80% or higher on the quiz",
        icon: Trophy,
        tier: "gold",
        category: "Quiz",
        unlocked: quizPct >= 80,
        progress: { current: Math.round(quizPct), target: 80 },
      },
      {
        id: "perfect-score",
        name: "Perfect Score",
        description: "Answer every quiz question correctly",
        icon: Target,
        tier: "platinum",
        category: "Quiz",
        unlocked: quizTotal > 0 && quizScore === quizTotal,
        progress: { current: quizScore, target: quizTotal || 15 },
      },
      // Simulation badges
      {
        id: "experimenter",
        name: "Experimenter",
        description: "Run your first simulation",
        icon: FlaskConical,
        tier: "bronze",
        category: "Simulation",
        unlocked: simsCount >= 1,
        progress: { current: Math.min(simsCount, 1), target: 1 },
      },
      {
        id: "practitioner",
        name: "Practitioner",
        description: "Run 5 different simulations",
        icon: FlaskConical,
        tier: "silver",
        category: "Simulation",
        unlocked: simsCount >= 5,
        progress: { current: Math.min(simsCount, 5), target: 5 },
      },
      // Finance badges
      {
        id: "budgeter",
        name: "Budgeter",
        description: "Complete the Needs vs Wants activity",
        icon: Wallet,
        tier: "bronze",
        category: "Finance",
        unlocked: needsWantsDone,
        progress: { current: needsWantsDone ? 1 : 0, target: 1 },
      },
      // Sharia badges
      {
        id: "sharia-guardian",
        name: "Sharia Guardian",
        description: "Complete the Sharia Investment Checker",
        icon: ShieldCheck,
        tier: "silver",
        category: "Sharia",
        unlocked: checkerDone,
        progress: { current: checkerDone ? 1 : 0, target: 1 },
      },
      {
        id: "glossary-explorer",
        name: "Glossary Explorer",
        description: `Explore ${Math.min(5, termsTotal)} Islamic finance terms`,
        icon: Scale,
        tier: "bronze",
        category: "Sharia",
        unlocked: termsCount >= 5,
        progress: { current: Math.min(termsCount, 5), target: 5 },
      },
      {
        id: "term-master",
        name: "Term Master",
        description: `Explore all ${termsTotal} glossary terms`,
        icon: BookOpen,
        tier: "gold",
        category: "Sharia",
        unlocked: termsCount >= termsTotal,
        progress: { current: termsCount, target: termsTotal },
      },
      // Reflection badges
      {
        id: "reflector",
        name: "Reflector",
        description: "Write your first Quranic reflection",
        icon: PenLine,
        tier: "silver",
        category: "Reflection",
        unlocked: reflectionsCount >= 1,
        progress: { current: Math.min(reflectionsCount, 1), target: 1 },
      },
      {
        id: "deep-thinker",
        name: "Deep Thinker",
        description: "Write reflections on 3 different verses",
        icon: PenLine,
        tier: "gold",
        category: "Reflection",
        unlocked: reflectionsCount >= 3,
        progress: { current: Math.min(reflectionsCount, 3), target: 3 },
      },
      // Streak badges
      {
        id: "consistent",
        name: "Consistent",
        description: "Maintain a 3-day learning streak",
        icon: Flame,
        tier: "silver",
        category: "Streak",
        unlocked: streak >= 3,
        progress: { current: Math.min(streak, 3), target: 3 },
      },
      {
        id: "dedicated",
        name: "Dedicated",
        description: "Maintain a 7-day learning streak",
        icon: Flame,
        tier: "gold",
        category: "Streak",
        unlocked: streak >= 7,
        progress: { current: Math.min(streak, 7), target: 7 },
      },
      // Research badges
      {
        id: "research-participant",
        name: "Research Participant",
        description: "Complete a pre-test or post-test",
        icon: Sparkles,
        tier: "silver",
        category: "Research",
        unlocked: researchDone,
        progress: { current: researchDone ? 1 : 0, target: 1 },
      },
      // Ultimate badge
      {
        id: "financially-literate",
        name: "Financially Literate",
        description: "Unlock the certificate of completion",
        icon: Award,
        tier: "platinum",
        category: "Mastery",
        unlocked: modulesCount >= 4 && !!quizResult,
        progress: {
          current: Math.min(modulesCount, 4) + (quizResult ? 1 : 0),
          target: 5,
        },
      },
    ];

    return badges;
  }, [
    completedModules,
    quizResult,
    simSessions,
    openedTerms,
    needsWantsDone,
    checkerDone,
    reflections,
    researchPre,
    researchPost,
    streak,
  ]);
}

export function BadgeGrid({ compact = false }: { compact?: boolean }) {
  const badges = useBadges();
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  const visibleBadges = compact ? badges.filter((b) => b.unlocked).slice(0, 6) : badges;

  return (
    <div className="flex flex-col gap-5">
      {/* Header summary */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <Eyebrow>Achievements</Eyebrow>
          <p className="text-2xl font-bold text-foreground">
            <CountUp value={unlockedCount} />
            <span className="text-muted-foreground"> / {totalCount} badges unlocked</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-border/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="text-xs font-bold text-foreground tabular-nums">{pct}%</span>
        </div>
      </div>

      {compact && unlockedCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 p-6 text-center">
          <Trophy className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm font-semibold text-foreground">No badges yet</p>
          <p className="text-xs text-muted-foreground">
            Complete modules, quizzes, and simulations to unlock achievements.
          </p>
        </div>
      ) : (
        <Stagger className={cn("grid gap-3", compact ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4")}>
          {visibleBadges.map((badge) => {
            const tier = TIER_STYLES[badge.tier];
            const Icon = badge.icon;
            return (
              <StaggerItem key={badge.id}>
                <motion.div
                  whileHover={badge.unlocked ? { scale: 1.03, y: -2 } : {}}
                  className={cn(
                    "group relative flex flex-col items-center gap-2.5 overflow-hidden rounded-2xl border p-4 text-center transition-all",
                    badge.unlocked
                      ? "bg-card"
                      : "border-border/50 bg-card/40"
                  )}
                  style={
                    badge.unlocked
                      ? { borderColor: tier.border }
                      : undefined
                  }
                >
                  {/* Glow for unlocked */}
                  {badge.unlocked && (
                    <div
                      className="pointer-events-none absolute -top-8 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full blur-2xl"
                      style={{ background: tier.soft }}
                      aria-hidden
                    />
                  )}
                  {/* Icon */}
                  <div className="relative">
                    {badge.unlocked ? (
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ background: tier.soft }}
                      >
                        <Icon className="h-5 w-5" style={{ color: tier.bg }} strokeWidth={1.8} />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                        <Lock className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  {/* Name */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={cn(
                        "text-xs font-bold leading-tight",
                        badge.unlocked ? "text-foreground" : "text-muted-foreground/70"
                      )}
                    >
                      {badge.name}
                    </span>
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wide"
                      style={{ color: badge.unlocked ? tier.bg : "oklch(0.52 0.012 160 / 0.5)" }}
                    >
                      {tier.label}
                    </span>
                  </div>
                  {/* Description (only in full view) */}
                  {!compact && (
                    <p className="text-[10px] leading-relaxed text-muted-foreground">
                      {badge.description}
                    </p>
                  )}
                  {/* Progress (for locked badges) */}
                  {!badge.unlocked && badge.progress && !compact && (
                    <div className="mt-auto w-full">
                      <div className="h-1 w-full overflow-hidden rounded-full bg-border/50">
                        <div
                          className="h-full rounded-full bg-muted-foreground/40"
                          style={{
                            width: `${Math.min(100, (badge.progress.current / badge.progress.target) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="mt-1 block text-[9px] tabular-nums text-muted-foreground">
                        {badge.progress.current} / {badge.progress.target}
                      </span>
                    </div>
                  )}
                  {/* Tier ribbon for unlocked */}
                  {badge.unlocked && (
                    <div
                      className="absolute right-0 top-0 h-8 w-8 opacity-20"
                      style={{
                        background: `linear-gradient(135deg, transparent 50%, ${tier.bg} 50%)`,
                      }}
                      aria-hidden
                    />
                  )}
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}

      {/* Tier legend (full view) */}
      {!compact && (
        <Reveal>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Tiers:
            </span>
            {Object.entries(TIER_STYLES).map(([key, tier]) => (
              <span key={key} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: tier.bg }} />
                {tier.label}
              </span>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
