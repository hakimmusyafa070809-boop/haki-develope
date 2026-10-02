"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Wallet,
  Apple,
  GraduationCap,
  Smartphone,
  BookOpen,
  Gamepad2,
  Bus,
  Gem,
  Footprints,
  Candy,
  Check,
  X,
  RefreshCw,
  PiggyBank,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Heart,
  ArrowRight,
  Info,
  RotateCcw,
} from "lucide-react";
import { NEED_WANT_ITEMS, type NeedWantItem } from "@/lib/educational-data";
import { useSantrivest } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
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

/* ============================================================
   SECTION 1 — NEEDS VS WANTS DRAG & DROP
============================================================ */

const ICON_MAP: Record<string, React.ElementType> = {
  food: Apple,
  school: GraduationCap,
  "phone-upgrade": Smartphone,
  snacks: Candy,
  shoes: Footprints,
  books: BookOpen,
  gaming: Gamepad2,
  transport: Bus,
  luxury: Gem,
};

function DraggableItem({ item }: { item: NeedWantItem }) {
  const Icon = ICON_MAP[item.id] || Wallet;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <motion.button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      className="flex cursor-grab touch-none select-none items-center gap-2.5 rounded-xl border border-border/70 bg-card px-3.5 py-2.5 text-left shadow-sm transition-shadow hover:shadow-lift active:cursor-grabbing"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-base">
        {item.icon}
      </span>
      <span className="text-xs font-semibold text-foreground">{item.label}</span>
    </motion.button>
  );
}

function DropZone({
  zone,
  items,
  feedback,
}: {
  zone: "need" | "want";
  items: { item: NeedWantItem; correct: boolean; placed: boolean }[];
  feedback: Record<string, { correct: boolean; message: string }>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: zone });
  const isNeed = zone === "need";
  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        borderColor: isOver
          ? isNeed
            ? "oklch(0.52 0.13 162 / 0.8)"
            : "oklch(0.72 0.13 85 / 0.8)"
          : undefined,
        backgroundColor: isOver
          ? isNeed
            ? "oklch(0.52 0.13 162 / 0.06)"
            : "oklch(0.72 0.13 85 / 0.06)"
          : undefined,
      }}
      className={cn(
        "flex min-h-[200px] flex-col gap-2.5 rounded-2xl border-2 border-dashed p-4 transition-colors",
        isNeed ? "border-primary/30 bg-primary/[0.03]" : "border-amber-400/30 bg-amber-50/40"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-[0.18em]",
            isNeed ? "text-primary" : "text-amber-600"
          )}
        >
          {isNeed ? "Need" : "Want"}
        </span>
        <span className="rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {items.length} placed
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {items.map(({ item, correct }) => {
            const fb = feedback[item.id];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold",
                  correct
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-amber-400/50 bg-amber-50 text-amber-700"
                )}
              >
                <span>{item.icon}</span>
                {item.label}
                {correct ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <span className="text-xs text-muted-foreground/60">Drop items here…</span>
        )}
      </div>
    </motion.div>
  );
}

function NeedsVsWants() {
  const items = NEED_WANT_ITEMS;
  const { setNeedsWantsDone, logSim } = useSantrivest();
  const { toast } = useToast();
  const [placements, setPlacements] = useState<Record<string, "need" | "want" | null>>(
    Object.fromEntries(items.map((i) => [i.id, null]))
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const itemId = String(active.id);
    const zone = String(over.id) as "need" | "want";
    setPlacements((prev) => ({ ...prev, [itemId]: zone }));
  };

  const placed = Object.entries(placements).filter(([, z]) => z) as [string, "need" | "want"][];
  const allPlaced = placed.length === items.length;

  const feedback = useMemo(() => {
    const fb: Record<string, { correct: boolean; message: string }> = {};
    for (const [id, zone] of placed) {
      const item = items.find((i) => i.id === id)!;
      if (item.default === "depends") {
        fb[id] = {
          correct: true,
          message: `Context matters — ${item.hint}`,
        };
      } else {
        const correct = zone === item.default;
        fb[id] = {
          correct,
          message: correct
            ? `${item.hint}`
            : `Consider: ${item.hint}`,
        };
      }
    }
    return fb;
  }, [placed, items]);

  const correctCount = Object.values(feedback).filter((f) => f.correct).length;

  const reset = () => {
    setPlacements(Object.fromEntries(items.map((i) => [i.id, null])));
  };

  const onComplete = () => {
    setNeedsWantsDone(true);
    logSim({
      id: "needs-wants-" + Date.now(),
      type: "Needs vs Wants",
      label: "Needs vs Wants sorted",
      date: new Date().toISOString(),
      detail: `${correctCount}/${items.length} correct`,
    });
    toast({
      title: "Well done!",
      description: `You sorted ${correctCount}/${items.length} thoughtfully.`,
    });
  };

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Eyebrow>Drag &amp; Drop</Eyebrow>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">Needs vs Wants</h2>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Not every item is universally a need or a want — context matters. Drag each item into the
          zone you think fits.
        </p>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <DropZone zone="need" items={placed.filter(([, z]) => z === "need").map(([id]) => ({ item: items.find((i) => i.id === id)!, correct: feedback[id]?.correct ?? true, placed: true }))} feedback={feedback} />
          <DropZone zone="want" items={placed.filter(([, z]) => z === "want").map(([id]) => ({ item: items.find((i) => i.id === id)!, correct: feedback[id]?.correct ?? true, placed: true }))} feedback={feedback} />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Items to sort
            </span>
            <span className="text-xs text-muted-foreground">
              {placed.length}/{items.length} placed
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <AnimatePresence mode="popLayout">
              {items
                .filter((i) => !placements[i.id])
                .map((item) => (
                  <DraggableItem key={item.id} item={item} />
                ))}
            </AnimatePresence>
          </div>
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-primary/40 bg-card px-3.5 py-2.5 shadow-lift">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-base">
                {activeItem.icon}
              </span>
              <span className="text-xs font-semibold text-foreground">{activeItem.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* feedback list */}
      {placed.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {placed.map(([id]) => {
            const item = items.find((i) => i.id === id)!;
            const fb = feedback[id];
            return (
              <div
                key={id}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border p-3 text-xs",
                  fb.correct
                    ? "border-primary/30 bg-primary/[0.04] text-foreground"
                    : "border-amber-400/40 bg-amber-50/60 text-foreground"
                )}
              >
                {fb.correct ? (
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                ) : (
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                )}
                <span>
                  <span className="font-semibold">{item.label}:</span> {fb.message}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {allPlaced && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-emerald-50/70 to-amber-50/40 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  You placed all items — {correctCount}/{items.length} aligned with defaults.
                </p>
                <p className="text-xs text-muted-foreground">
                  Remember: a need is necessary to live &amp; learn; a want is nice to have. Context
                  can change which is which.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background"
              >
                <Check className="h-3.5 w-3.5" /> Save result
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Play again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============================================================
   SECTION 2 — PERSONAL BUDGET SIMULATOR
============================================================ */

const BUDGET_CATS = [
  { id: "food", label: "Food", icon: Apple, color: "oklch(0.55 0.13 162)", default: 400000, max: 700000 },
  { id: "transport", label: "Transportation", icon: Bus, color: "oklch(0.68 0.08 175)", default: 100000, max: 400000 },
  { id: "personal", label: "Personal needs", icon: GraduationCap, color: "oklch(0.65 0.06 150)", default: 100000, max: 400000 },
  { id: "savings", label: "Savings", icon: PiggyBank, color: "oklch(0.72 0.13 85)", default: 150000, max: 600000 },
  { id: "emergency", label: "Emergency reserve", icon: ShieldAlert, color: "oklch(0.6 0.1 200)", default: 100000, max: 500000 },
  { id: "investment", label: "Investment learning", icon: TrendingUp, color: "oklch(0.6 0.16 50)", default: 50000, max: 500000 },
  { id: "charity", label: "Charity", icon: Heart, color: "oklch(0.65 0.12 320)", default: 50000, max: 300000 },
  { id: "entertainment", label: "Entertainment", icon: Gamepad2, color: "oklch(0.62 0.04 280)", default: 50000, max: 400000 },
];

const INCOME = 1000000;

function BudgetSimulator() {
  const [alloc, setAlloc] = useState<Record<string, number>>(
    Object.fromEntries(BUDGET_CATS.map((c) => [c.id, c.default]))
  );
  const { logSim } = useSantrivest();
  const { toast } = useToast();

  const total = Object.values(alloc).reduce((a, b) => a + b, 0);
  const remaining = INCOME - total;
  const savingsRate = ((alloc.savings + alloc.emergency + alloc.investment) / INCOME) * 100;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(40 + savingsRate * 1.2 + (alloc.charity > 0 ? 5 : 0) + (alloc.emergency > 0 ? 5 : 0) - (alloc.entertainment > 150000 ? 10 : 0) - (remaining < 0 ? 20 : 0))
    )
  );

  const yearProjection = (alloc.savings + alloc.emergency + alloc.investment) * 12;

  const pieData = BUDGET_CATS.map((c) => ({ name: c.label, value: alloc[c.id], color: c.color })).filter((d) => d.value > 0);

  const setVal = (id: string, v: number) => setAlloc((p) => ({ ...p, [id]: v }));

  const save = () => {
    logSim({
      id: "budget-" + Date.now(),
      type: "Budget",
      label: "Budget simulated",
      date: new Date().toISOString(),
      detail: `Savings rate ${savingsRate.toFixed(0)}%, health ${score}/100`,
    });
    toast({
      title: "Budget saved",
      description: `Savings rate ${savingsRate.toFixed(0)}% · Health ${score}/100`,
    });
  };

  const reset = () =>
    setAlloc(Object.fromEntries(BUDGET_CATS.map((c) => [c.id, c.default])));

  const feedback =
    score < 50
      ? "Your savings rate is low — try to set aside a bit more."
      : score < 75
      ? "Good foundation — keep building."
      : "Strong plan — your future self will thank you.";

  const ringCircumference = 2 * Math.PI * 36;
  const ringOffset = ringCircumference * (1 - score / 100);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Eyebrow>Try It Yourself</Eyebrow>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">Personal Budget Simulator</h2>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Monthly allowance Rp1,000,000. Decide where each rupiah goes — and watch your financial
          health respond.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        {/* Controls */}
        <Reveal className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Allocation
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-bold",
                remaining < 0
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              )}
            >
              Rp {total.toLocaleString("id-ID")} / {INCOME.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {BUDGET_CATS.map((c) => {
              const Icon = c.icon;
              const pct = Math.round((alloc[c.id] / INCOME) * 100);
              return (
                <div key={c.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{ background: c.color + "1f" }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: c.color }} />
                      </span>
                      <span className="text-xs font-semibold text-foreground">{c.label}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      Rp {(alloc[c.id] / 1000).toFixed(0)}k
                      <span className="ml-1 font-normal text-muted-foreground">· {pct}%</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={c.max}
                    step={50000}
                    value={alloc[c.id]}
                    onChange={(e) => setVal(c.id, Number(e.target.value))}
                    aria-label={c.label}
                    className="santrivest-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border"
                    style={{
                      background: `linear-gradient(to right, ${c.color} 0%, ${c.color} ${(alloc[c.id] / c.max) * 100}%, oklch(0.91 0.006 150) ${(alloc[c.id] / c.max) * 100}%, oklch(0.91 0.006 150) 100%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {remaining < 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50/80 p-3 text-xs text-amber-700">
              <Info className="h-3.5 w-3.5 shrink-0" />
              You&apos;ve allocated more than your income. Adjust to keep a balanced plan.
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Magnetic strength={0.4}>
              <button
                onClick={save}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background"
              >
                <Check className="h-3.5 w-3.5" /> Save simulation
              </button>
            </Magnetic>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </Reveal>

        {/* Dashboard */}
        <Reveal delay={0.08} className="flex flex-col gap-4">
          {/* pie + remaining */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Allocation map
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-bold",
                  remaining < 0
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                )}
              >
                {remaining >= 0 ? "Rp " : "−Rp "}
                {Math.abs(remaining).toLocaleString("id-ID")} left
              </span>
            </div>
            <div className="mt-3 h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={2}
                    isAnimationActive
                    animationDuration={600}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.color} stroke="oklch(1 0 0)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `Rp ${v.toLocaleString("id-ID")}`}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid oklch(0.91 0.006 150)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          {/* health score */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0">
                <svg viewBox="0 0 96 96" className="h-full w-full -rotate-90">
                  <circle cx="48" cy="48" r="36" fill="none" stroke="oklch(0.91 0.006 150)" strokeWidth="7" />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="36"
                    fill="none"
                    stroke="oklch(0.52 0.13 162)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    animate={{ strokeDashoffset: ringOffset }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-foreground">
                    <CountUp value={score} />
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                    / 100
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Financial Health
                </span>
                <p className="text-sm font-semibold text-foreground">{feedback}</p>
                <div className="mt-1 flex items-center gap-4 text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">
                      <CountUp value={savingsRate} decimals={0} suffix="%" />
                    </span>
                    <span className="text-muted-foreground">Savings rate</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-primary">
                      Rp {(yearProjection / 1000).toFixed(0)}k
                    </span>
                    <span className="text-muted-foreground">In 12 months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 3 — PRACTICAL CASE STUDIES
============================================================ */

interface CaseStudy {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: { text: string; correct: boolean; feedback: string }[];
  icon: string;
  category: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-1",
    title: "The Rp2,000,000 windfall",
    scenario:
      "Ahmad receives an unexpected Rp2,000,000 from a relative. He already has a budget and an emergency fund. What should he do first?",
    question: "What is the most responsible first step?",
    options: [
      {
        text: "Buy the smartphone he's been wanting",
        correct: false,
        feedback: "Tempting, but this is a want — not a need. Windfalls are best used to strengthen your financial foundation first.",
      },
      {
        text: "Split it: 50% savings, 30% halal investment learning, 20% charity/needs",
        correct: true,
        feedback: "Excellent. Balancing savings, learning, and charity aligns with both financial prudence and Islamic ethics of sharing.",
      },
      {
        text: "Keep it all in cash under the mattress",
        correct: false,
        feedback: "Cash is safe but loses value to inflation over time. Investing part of it responsibly helps it grow.",
      },
      {
        text: "Lend it to a friend with 10% interest",
        correct: false,
        feedback: "Charging interest is riba — prohibited. Lend without interest as a good deed, or invest responsibly instead.",
      },
    ],
    icon: "Wallet",
    category: "Windfall",
  },
  {
    id: "case-2",
    title: "The friend's 'amazing' investment tip",
    scenario:
      "A friend says: 'Buy this stock now — everyone is making 30% in a week!' The stock has risen sharply with no clear reason.",
    question: "What should you do?",
    options: [
      {
        text: "Buy immediately — don't miss out",
        correct: false,
        feedback: "This is FOMO (fear of missing out). Herd behavior is how many lose money. The rise may be speculation, not value.",
      },
      {
        text: "Investigate first: check the company, its Sharia compliance, and the reason for the rise",
        correct: true,
        feedback: "Correct. Responsible investing means understanding before acting. Check fundamentals and Sharia screening before deciding.",
      },
      {
        text: "Borrow money to buy more",
        correct: false,
        feedback: "Borrowing to invest amplifies risk and may involve riba. Never invest money you can't afford to lose, especially borrowed money.",
      },
      {
        text: "Ignore it completely",
        correct: false,
        feedback: "Ignoring all opportunities isn't investing either. Investigate calmly — sometimes opportunities are real, but verify first.",
      },
    ],
    icon: "Users",
    category: "FOMO",
  },
  {
    id: "case-3",
    title: "Monthly allowance: Rp1,000,000",
    scenario:
      "Fatima receives Rp1,000,000 monthly. Her food costs Rp400,000, transport Rp100,000, and she wants to save for a laptop for her studies.",
    question: "What budget allocation supports her goal?",
    options: [
      {
        text: "Food 400k, transport 100k, snacks 200k, entertainment 200k, savings 100k",
        correct: false,
        feedback: "This leaves little for savings. Her laptop goal will take very long. Reduce wants to accelerate the goal.",
      },
      {
        text: "Food 400k, transport 100k, needs 100k, savings 250k, charity 50k, entertainment 100k",
        correct: true,
        feedback: "Strong plan. 25% savings rate, balanced needs/wants, and charity included. The laptop goal is achievable in ~6 months.",
      },
      {
        text: "Food 500k, transport 150k, entertainment 350k, savings 0",
        correct: false,
        feedback: "Zero savings means no progress toward the laptop — and no buffer for emergencies. Always pay yourself first.",
      },
      {
        text: "Borrow for the laptop and repay with interest",
        correct: false,
        feedback: "Interest-based borrowing is riba. Save and buy, or use Sharia-compliant financing like Murabahah if available.",
      },
    ],
    icon: "PiggyBank",
    category: "Budgeting",
  },
  {
    id: "case-4",
    title: "The 'halal' label on a product",
    scenario:
      "A financial product claims to be 'Sharia-compliant' but the brochure mentions a 'guaranteed fixed return of 8% per year'.",
    question: "What should you think?",
    options: [
      {
        text: "It's halal — the label says so",
        correct: false,
        feedback: "Labels alone aren't enough. A guaranteed fixed return on a loan-like product resembles riba. Investigate the structure.",
      },
      {
        text: "Investigate the underlying contract — is it backed by real assets or is it a loan with fixed return?",
        correct: true,
        feedback: "Correct. True Sharia compliance depends on the structure, not just the label. Ask about the akad (contract) and asset backing.",
      },
      {
        text: "Invest because the return is guaranteed",
        correct: false,
        feedback: "A guaranteed fixed return on money (without real economic activity) is the hallmark of riba, not halal investment.",
      },
      {
        text: "It doesn't matter as long as you profit",
        correct: false,
        feedback: "In Islam, how you earn matters as much as how much. The source of income must be halal.",
      },
    ],
    icon: "Scale",
    category: "Sharia",
  },
];

const CASE_ICONS: Record<string, React.ElementType> = {
  Wallet,
  Users,
  PiggyBank,
  Scale,
};

function CaseStudies() {
  const [revealedId, setRevealedId] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Eyebrow>Real-World Scenarios</Eyebrow>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">Practical Case Studies</h2>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Apply what you've learned to realistic financial decisions. Choose an answer for each scenario and see the reasoning.
        </p>
      </div>

      <Stagger className="grid gap-4 md:grid-cols-2">
        {CASE_STUDIES.map((cs) => {
          const Icon = CASE_ICONS[cs.icon] || Wallet;
          const isRevealed = revealedId === cs.id;
          return (
            <StaggerItem key={cs.id}>
              <div className="bento-card relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 transition-all duration-500 hover:border-primary/30 hover:shadow-lift">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="rounded-full border border-border/60 bg-background px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                      {cs.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-foreground">{cs.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cs.scenario}</p>
                <p className="mt-3 text-xs font-semibold text-foreground">{cs.question}</p>

                <div className="mt-3 flex flex-col gap-2">
                  {cs.options.map((opt, i) => {
                    const showFeedback = isRevealed;
                    return (
                      <button
                        key={i}
                        onClick={() => setRevealedId(cs.id)}
                        disabled={isRevealed}
                        className={cn(
                          "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-all",
                          !showFeedback && "border-border/60 bg-background/60 hover:border-primary/30 hover:bg-primary/[0.03]",
                          showFeedback && opt.correct && "border-primary/40 bg-primary/[0.06]",
                          showFeedback && !opt.correct && "border-border/60 bg-background/40 opacity-60"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                            showFeedback && opt.correct
                              ? "bg-primary text-primary-foreground"
                              : showFeedback
                              ? "bg-secondary text-muted-foreground"
                              : "border border-border text-muted-foreground"
                          )}
                        >
                          {showFeedback && opt.correct ? "✓" : String.fromCharCode(65 + i)}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-foreground">{opt.text}</span>
                          {showFeedback && (
                            <span className="text-[11px] leading-relaxed text-muted-foreground">{opt.feedback}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!isRevealed && (
                  <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
                    Tap any option to reveal the answer
                  </p>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

/* ============================================================
   MAIN VIEW
============================================================ */

export function FinanceView() {
  return (
    <ViewShell>
      <ViewHeader
        eyebrow="Personal Finance"
        title={
          <>
            Manage Money, <span className="text-gradient-emerald">Build Habits</span>
          </>
        }
        subtitle="Practice distinguishing needs from wants, and design a santri budget that turns income into intention."
        back="home"
        backLabel="Back to Home"
      />
      <ViewBody className="gap-12">
        <NeedsVsWants />
        <BudgetSimulator />
        <CaseStudies />
      </ViewBody>
      <ContinueExploring current="finance" links={RELATED_LINKS.finance} />
    </ViewShell>
  );
}
