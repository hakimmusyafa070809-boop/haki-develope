"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Check,
  ArrowRight,
  RotateCcw,
  Trophy,
  Sparkles,
  AlertCircle,
  Target,
  TrendingUp,
  Lightbulb,
  Timer,
  Zap,
} from "lucide-react";
import { getAllQuizQuestions, DIFFICULTY_META, type QuizQuestion } from "@/lib/educational-data";
import { useSantrivest } from "@/lib/store";
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

/* ------------------------------------------------------------------ */
/* Types & constants                                                  */
/* ------------------------------------------------------------------ */

type Phase = "start" | "quiz" | "results";
type Answers = Record<string, number>;
type Difficulty = "all" | "easy" | "medium" | "hard";

// Pool of all available questions (with difficulty applied)
const ALL_QUIZ_QUESTIONS = getAllQuizQuestions();

const QUIZ_CATEGORIES = [
  "Financial literacy",
  "Islamic finance",
  "Riba",
  "Gharar",
  "Maysir",
  "Sharia investment",
  "Risk",
  "Budgeting",
];

const EASE = [0.22, 1, 0.36, 1] as const;
const LETTERS = ["A", "B", "C", "D", "E", "F"];
const REVEAL_DELAY = 300; // ms between selection and reveal

/* ------------------------------------------------------------------ */
/* Main view                                                          */
/* ------------------------------------------------------------------ */

export function QuizView() {
  const quizResult = useSantrivest((s) => s.quizResult);
  const setQuizResult = useSantrivest((s) => s.setQuizResult);
  const addQuizHistory = useSantrivest((s) => s.addQuizHistory);
  const setView = useSantrivest((s) => s.setView);

  const [phase, setPhase] = useState<Phase>("start");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>("all");
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // seconds remaining for current question
  const startTimeRef = useRef<number>(0);

  // Filter questions based on selected category and difficulty
  const questions = useMemo(() => {
    let list = ALL_QUIZ_QUESTIONS;
    if (difficultyFilter !== "all") {
      list = list.filter((q) => q.difficulty === difficultyFilter);
    }
    if (categoryFilter !== "All") {
      list = list.filter((q) => q.category === categoryFilter);
    }
    return list;
  }, [categoryFilter, difficultyFilter]);

  const total = questions.length;
  // Time per question depends on difficulty
  const SECONDS_PER_QUESTION = difficultyFilter === "hard" ? 20 : 30;

  const finishQuiz = useCallback(() => {
    const score = questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0),
      0
    );
    const now = new Date().toISOString();
    const durationSec = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    setQuizResult({
      score,
      total,
      date: now,
      answers,
    });
    addQuizHistory({
      id: "qh-" + Date.now(),
      score,
      total,
      date: now,
      difficulty: difficultyFilter,
      category: categoryFilter,
      timedMode,
      durationSec,
    });
    setPhase("results");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [questions, answers, total, setQuizResult, addQuizHistory, difficultyFilter, categoryFilter, timedMode]);

  const start = useCallback(() => {
    setIndex(0);
    setAnswers({});
    setSelected(null);
    setRevealed(false);
    setPhase("quiz");
    startTimeRef.current = Date.now();
    if (timedMode) setTimeLeft(SECONDS_PER_QUESTION);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [timedMode, SECONDS_PER_QUESTION]);

  const selectOption = useCallback(
    (idx: number) => {
      if (revealed) return;
      const qid = questions[index].id;
      setSelected(idx);
      setAnswers((prev) => ({ ...prev, [qid]: idx }));
      window.setTimeout(() => setRevealed(true), REVEAL_DELAY);
    },
    [revealed, index, questions]
  );

  const next = useCallback(() => {
    const isLast = index === total - 1;
    if (isLast) {
      finishQuiz();
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
      if (timedMode) setTimeLeft(SECONDS_PER_QUESTION);
    }
  }, [index, total, timedMode, SECONDS_PER_QUESTION, finishQuiz]);

  // Countdown timer for timed mode
  useEffect(() => {
    if (!timedMode || phase !== "quiz" || revealed) return;
    if (timeLeft <= 0) {
      // Time's up — auto-reveal with no answer selected (deferred to avoid sync setState in effect)
      const r = window.setTimeout(() => setRevealed(true), 0);
      return () => window.clearTimeout(r);
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [timedMode, phase, revealed, timeLeft]);

  return (
    <ViewShell className="max-w-4xl">
      <ViewHeader
        eyebrow="Quiz"
        title={
          <>
            Scenario <span className="text-gradient-emerald">Quiz</span>
          </>
        }
        subtitle="Real-world scenarios on Islamic finance and money habits. Reflect, decide, and learn from each situation — this is not a memory test."
        back="home"
        backLabel="Back to Home"
      />
      <ViewBody>
        <AnimatePresence mode="wait">
          {phase === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <StartScreen
                onStart={start}
                lastResult={quizResult}
                onViewProgress={() => setView("progress")}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                totalQuestions={total}
                timedMode={timedMode}
                onToggleTimed={() => setTimedMode((t) => !t)}
                difficultyFilter={difficultyFilter}
                onDifficultyChange={setDifficultyFilter}
              />
            </motion.div>
          )}

          {phase === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <QuestionFlow
                index={index}
                total={total}
                selected={selected}
                revealed={revealed}
                onSelect={selectOption}
                onNext={next}
                question={questions[index]}
                timedMode={timedMode}
                timeLeft={timeLeft}
              />
            </motion.div>
          )}

          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <ResultsScreen
                answers={answers}
                questions={questions}
                onRetake={start}
                onBackToLearn={() => setView("learn")}
                onViewProgress={() => setView("progress")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ViewBody>
      <ContinueExploring current="quiz" links={RELATED_LINKS.quiz} />
    </ViewShell>
  );
}

/* ------------------------------------------------------------------ */
/* Start screen                                                       */
/* ------------------------------------------------------------------ */

function StartScreen({
  onStart,
  lastResult,
  onViewProgress,
  categoryFilter,
  onCategoryChange,
  totalQuestions,
  timedMode,
  onToggleTimed,
  difficultyFilter,
  onDifficultyChange,
}: {
  onStart: () => void;
  lastResult: { score: number; total: number; date: string } | null;
  onViewProgress: () => void;
  categoryFilter: string;
  onCategoryChange: (c: string) => void;
  totalQuestions: number;
  timedMode: boolean;
  onToggleTimed: () => void;
  difficultyFilter: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
}) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Hero */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-emerald-50/60 via-card to-amber-50/30 p-6 md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-amber-300/15 blur-3xl" />

          <div className="relative flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <Eyebrow>Reflection, not memorization</Eyebrow>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="max-w-2xl text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-4xl">
                Financial Literacy Quiz
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Each scenario asks you to think like a thoughtful Muslim
                managing wealth — recognizing riba, gharar, and maysir, and
                applying Sharia principles to everyday decisions.
              </p>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground">
                <Target className="h-3.5 w-3.5 text-primary" /> {totalQuestions} scenarios
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" /> ~{Math.max(2, Math.round(totalQuestions * 0.5))} minutes
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Instant feedback
              </span>
            </div>

            {/* Difficulty selector */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Difficulty
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {([
                  { key: "all" as Difficulty, label: "All levels", desc: "15 Q", color: "oklch(0.52 0.012 160)" },
                  { key: "easy" as Difficulty, label: DIFFICULTY_META.easy.label, desc: `${DIFFICULTY_META.easy.count} Q`, color: DIFFICULTY_META.easy.color },
                  { key: "medium" as Difficulty, label: DIFFICULTY_META.medium.label, desc: `${DIFFICULTY_META.medium.count} Q`, color: DIFFICULTY_META.medium.color },
                  { key: "hard" as Difficulty, label: DIFFICULTY_META.hard.label, desc: `${DIFFICULTY_META.hard.count} Q`, color: DIFFICULTY_META.hard.color },
                ]).map((d) => (
                  <button
                    key={d.key}
                    onClick={() => onDifficultyChange(d.key)}
                    aria-pressed={difficultyFilter === d.key}
                    data-cursor="Select"
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                      difficultyFilter === d.key
                        ? "border-foreground bg-foreground text-background"
                        : "border-border/60 bg-background/80 text-foreground hover:border-foreground/30"
                    )}
                  >
                    <span className="text-xs font-bold">{d.label}</span>
                    <span className={cn(
                      "text-[10px]",
                      difficultyFilter === d.key ? "text-background/70" : "text-muted-foreground"
                    )}>
                      {d.key === "all" ? "All questions" : d.key === "hard" ? "20s/Q" : "30s/Q"} · {d.desc}
                    </span>
                  </button>
                ))}
              </div>
              {difficultyFilter !== "all" && (
                <p className="text-[11px] text-muted-foreground">
                  {DIFFICULTY_META[difficultyFilter].description}
                </p>
              )}
            </div>

            {/* Category filter */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Focus area
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onCategoryChange("All")}
                  aria-pressed={categoryFilter === "All"}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    categoryFilter === "All"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-background/80 text-foreground hover:border-primary/40"
                  )}
                >
                  All categories
                </button>
                {QUIZ_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => onCategoryChange(c)}
                    aria-pressed={categoryFilter === c}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      categoryFilter === c
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-background/80 text-foreground hover:border-primary/40"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {categoryFilter !== "All" && (
                <p className="text-[11px] text-muted-foreground">
                  Focused quiz: {totalQuestions} question{totalQuestions !== 1 ? "s" : ""} in {categoryFilter}. Switch to &ldquo;All categories&rdquo; for the full set.
                </p>
              )}
            </div>

            {/* Topics covered */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Topics covered
              </p>
              <div className="flex flex-wrap gap-2">
                {QUIZ_CATEGORIES.map((c, i) => (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + i * 0.04,
                      duration: 0.5,
                      ease: EASE,
                    }}
                    className="rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-1 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.35}>
                <button
                  type="button"
                  onClick={onStart}
                  data-cursor="Start"
                  aria-label="Start the financial literacy quiz"
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Start Quiz
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Magnetic>
              {/* Timed mode toggle */}
              <button
                type="button"
                onClick={onToggleTimed}
                aria-pressed={timedMode}
                data-cursor="Toggle"
                className={cn(
                  "group inline-flex min-h-12 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  timedMode
                    ? "border-amber-400/50 bg-amber-50 text-amber-700"
                    : "border-border/70 bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                <Timer className={cn("h-4 w-4 transition-colors", timedMode && "text-amber-600")} />
                Timed mode
                <span
                  className={cn(
                    "ml-1 inline-flex h-4 w-7 items-center rounded-full px-0.5 transition-colors",
                    timedMode ? "bg-amber-500" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full bg-white transition-transform",
                      timedMode ? "translate-x-3" : "translate-x-0"
                    )}
                  />
                </span>
              </button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {timedMode
                  ? "30 seconds per question. Train quick, calm thinking."
                  : "You'll get an explanation after each answer — no pressure, no score shaming."}
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Last result */}
      {lastResult && (
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card p-6 md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <Eyebrow>Last attempt</Eyebrow>
                  <p className="mt-1.5 text-2xl font-bold text-foreground">
                    <CountUp value={lastResult.score} duration={1.2} />
                    <span className="text-muted-foreground">
                      {" "}
                      / {lastResult.total}
                    </span>
                    <span className="ml-2 align-middle text-sm font-semibold text-primary">
                      {Math.round((lastResult.score / lastResult.total) * 100)}%
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(lastResult.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Magnetic strength={0.25}>
                  <button
                    type="button"
                    onClick={onStart}
                    data-cursor="Retake"
                    aria-label="Retake the quiz"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-xs font-semibold text-background transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
                  </button>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <button
                    type="button"
                    onClick={onViewProgress}
                    data-cursor="Progress"
                    aria-label="View your overall progress"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    View progress
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* How it works */}
      <Reveal delay={0.15}>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Read the scenario",
              body: "Picture yourself in the situation. Decide what you'd actually do.",
            },
            {
              icon: Sparkles,
              title: "Get calm feedback",
              body: "We reveal the right answer with a short, clear explanation.",
            },
            {
              icon: TrendingUp,
              title: "See your pattern",
              body: "Final results show where you're strong and where to revisit.",
            },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + i * 0.06,
                duration: 0.5,
                ease: EASE,
              }}
              className="rounded-2xl border border-border/60 bg-background/60 p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Question flow                                                       */
/* ------------------------------------------------------------------ */

function QuestionFlow({
  index,
  total,
  selected,
  revealed,
  onSelect,
  onNext,
  question,
  timedMode,
  timeLeft,
}: {
  index: number;
  total: number;
  selected: number | null;
  revealed: boolean;
  onSelect: (idx: number) => void;
  onNext: () => void;
  question: { id: string; category: string; question: string; options: string[]; correct: number; explanation: string };
  timedMode: boolean;
  timeLeft: number;
}) {
  const q = question;
  if (!q) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Question
            </span>
            <span className="text-sm font-bold text-foreground">
              {String(index + 1).padStart(2, "0")}
              <span className="text-muted-foreground">
                {" "}
                / {String(total).padStart(2, "0")}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {timedMode && !revealed && (
              <motion.span
                key={timeLeft}
                initial={{ scale: timeLeft <= 5 ? 1.3 : 1, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tabular-nums",
                  timeLeft <= 5
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : timeLeft <= 10
                    ? "border-amber-400/40 bg-amber-50 text-amber-700"
                    : "border-border bg-card text-foreground"
                )}
              >
                <Timer className="h-3 w-3" />
                {String(Math.max(0, timeLeft)).padStart(2, "0")}s
              </motion.span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              {q.category}
            </span>
          </div>
        </div>
        <div
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Question ${index + 1} of ${total}`}
          className="h-1.5 w-full overflow-hidden rounded-full bg-border/60"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
            initial={false}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
      </div>

      {/* Question + options (AnimatePresence for question transitions) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col gap-5"
        >
          {/* Question card */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 md:p-7">
            <div className="flex flex-col gap-3">
              <Eyebrow>Scenario</Eyebrow>
              <h2 className="text-balance text-xl font-bold leading-snug text-foreground md:text-2xl">
                {q.question}
              </h2>
            </div>
          </div>

          {/* Options */}
          <div
            role="group"
            aria-label="Answer options"
            className="flex flex-col gap-3"
          >
            <Stagger className="flex flex-col gap-3" key={`stagger-${q.id}`}>
              {q.options.map((opt, i) => (
                <StaggerItem key={i} y={14}>
                  <OptionCard
                    label={LETTERS[i]}
                    text={opt}
                    selected={selected === i}
                    correct={q.correct === i}
                    revealed={revealed}
                    disabled={revealed}
                    onSelect={() => onSelect(i)}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <ExplanationCard
                  correct={selected === q.correct}
                  explanation={q.explanation}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next / See results */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center justify-between gap-3"
              >
                <p className="text-xs text-muted-foreground">
                  {selected === q.correct
                    ? "Well reasoned."
                    : "Noted — let's continue."}
                </p>
                <Magnetic strength={0.3}>
                  <button
                    type="button"
                    onClick={onNext}
                    data-cursor="Next"
                    aria-label={
                      index === total - 1
                        ? "See your quiz results"
                        : "Move to the next question"
                    }
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {index === total - 1 ? "See results" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Magnetic>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Option card                                                        */
/* ------------------------------------------------------------------ */

function OptionCard({
  label,
  text,
  selected,
  correct,
  revealed,
  disabled,
  onSelect,
}: {
  label: string;
  text: string;
  selected: boolean;
  correct: boolean;
  revealed: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const isCorrectReveal = revealed && correct;
  const isIncorrectReveal = revealed && selected && !correct;
  const isDimmed = revealed && !correct && !selected;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      data-cursor="Answer"
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.995 }}
      animate={
        isCorrectReveal
          ? { scale: [1, 1.015, 1], boxShadow: "0 18px 50px -28px oklch(0.52 0.13 162 / 0.55)" }
          : isIncorrectReveal
          ? { x: [0, -4, 4, -3, 3, 0] }
          : { scale: 1, x: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)" }
      }
      transition={
        isIncorrectReveal
          ? { duration: 0.45, ease: "easeInOut" }
          : { duration: 0.5, ease: EASE }
      }
      aria-pressed={selected}
      aria-label={`Option ${label}: ${text}${
        revealed
          ? correct
            ? " — correct answer"
            : selected
            ? " — your answer"
            : ""
          : ""
      }`}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left transition-colors md:p-5",
        "min-h-[60px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !revealed &&
          "border-border/70 hover:border-primary/40 hover:bg-primary/5",
        isCorrectReveal && "border-primary/60 bg-primary/10",
        isIncorrectReveal && "border-amber-400/60 bg-amber-50/70",
        isDimmed && "border-border/40 opacity-55",
        selected && !revealed && "border-primary/50 bg-primary/5"
      )}
    >
      {/* Letter / icon badge */}
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors",
          !revealed && "bg-secondary text-secondary-foreground",
          isCorrectReveal && "bg-primary text-primary-foreground",
          isIncorrectReveal && "bg-amber-400 text-amber-950",
          isDimmed && "bg-secondary/70 text-muted-foreground",
          selected && !revealed && "bg-primary text-primary-foreground"
        )}
      >
        {isCorrectReveal ? (
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 16, delay: 0.05 }}
          >
            <Check className="h-4 w-4" />
          </motion.span>
        ) : isIncorrectReveal ? (
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 16, delay: 0.05 }}
          >
            <AlertCircle className="h-4 w-4" />
          </motion.span>
        ) : (
          label
        )}
      </span>

      {/* Text */}
      <span
        className={cn(
          "flex-1 text-sm leading-relaxed md:text-base",
          isCorrectReveal
            ? "font-semibold text-foreground"
            : isIncorrectReveal
            ? "font-medium text-foreground"
            : "text-foreground"
        )}
      >
        {text}
      </span>

      {/* Correct badge */}
      {isCorrectReveal && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 14, delay: 0.12 }}
          className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary"
        >
          <Sparkles className="h-3 w-3" /> Correct
        </motion.span>
      )}

      {/* Selected indicator (pre-reveal) */}
      {selected && !revealed && (
        <motion.span
          layoutId={`selected-pill-${label}`}
          className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary"
        >
          Selected
        </motion.span>
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Explanation card                                                    */
/* ------------------------------------------------------------------ */

function ExplanationCard({
  correct,
  explanation,
}: {
  correct: boolean;
  explanation: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border p-5 md:p-6",
        correct
          ? "border-primary/30 bg-primary/5"
          : "border-amber-300/50 bg-amber-50/60"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              correct
                ? "bg-primary/15 text-primary"
                : "bg-amber-400/20 text-amber-600"
            )}
          >
            {correct ? (
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
              >
                <Check className="h-4 w-4" />
              </motion.span>
            ) : (
              <Lightbulb className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.18em]",
                correct ? "text-primary" : "text-amber-600"
              )}
            >
              {correct ? "That's the right call" : "Let's reflect on this"}
            </span>
            <p className="text-xs text-muted-foreground">
              {correct
                ? "You recognized the principle at work here."
                : "A gentle nudge in the right direction."}
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-foreground md:text-[15px]">
          {explanation}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Results screen                                                     */
/* ------------------------------------------------------------------ */

function ResultsScreen({
  answers,
  questions,
  onRetake,
  onBackToLearn,
  onViewProgress,
}: {
  answers: Answers;
  questions: { id: string; category: string; question: string; options: string[]; correct: number; explanation: string }[];
  onRetake: () => void;
  onBackToLearn: () => void;
  onViewProgress: () => void;
}) {
  const total = questions.length;

  const score = useMemo(
    () =>
      questions.reduce(
        (acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0),
        0
      ),
    [answers, questions]
  );
  const pct = Math.round((score / total) * 100);

  // Group by category
  const byCategory = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    for (const q of questions) {
      const cur = map.get(q.category) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (answers[q.id] === q.correct) cur.correct += 1;
      map.set(q.category, cur);
    }
    return Array.from(map.entries());
  }, [answers, questions]);

  const tone =
    pct >= 80
      ? {
          title: "Strong intuition",
          body: "You clearly grasp the foundations. Refine the edges and explore deeper scenarios in Sharia investment.",
        }
      : pct >= 60
      ? {
          title: "Building momentum",
          body: "You're reasoning well through most scenarios. A few principles below are worth revisiting.",
        }
      : pct >= 40
      ? {
          title: "Foundations forming",
          body: "You're recognizing the patterns. Every missed question here is a clear next step on your learning path.",
        }
      : {
          title: "A fresh start",
          body: "Every learner begins somewhere. Walk through the Learn modules and try again — intuition builds faster than you think.",
        };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Hero with score ring */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-emerald-50/60 via-card to-amber-50/30 p-6 md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-amber-300/15 blur-3xl" />

          <div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
            <ScoreRing pct={pct} />
            <div className="flex flex-col gap-3 md:gap-4">
              <Eyebrow>Your Financial Literacy Journey</Eyebrow>
              <h2 className="text-balance text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-4xl">
                {tone.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {tone.body}
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-foreground md:text-6xl">
                  <CountUp value={score} duration={1.6} />
                </span>
                <span className="text-2xl font-bold text-muted-foreground">
                  / {total}
                </span>
                <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                  <TrendingUp className="h-3.5 w-3.5" /> {pct}%
                </span>
              </div>

              <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                This score reflects your familiarity with these scenarios today
                — not your potential. Keep learning and try again.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Category breakdown */}
      <Reveal delay={0.1}>
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card p-6 md:p-7">
          <div className="mb-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold text-foreground md:text-lg">
                Breakdown by topic
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {byCategory.length} topics
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {byCategory.map(([cat, stats], i) => {
              const cpct = (stats.correct / stats.total) * 100;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.05,
                    duration: 0.5,
                    ease: EASE,
                  }}
                  className="rounded-2xl border border-border/60 bg-background/60 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {cat}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold",
                        cpct === 100
                          ? "text-primary"
                          : cpct >= 50
                          ? "text-foreground"
                          : "text-amber-600"
                      )}
                    >
                      {stats.correct}/{stats.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cpct}%` }}
                      transition={{
                        duration: 0.8,
                        ease: EASE,
                        delay: 0.15 + i * 0.05,
                      }}
                      className={cn(
                        "h-full rounded-full",
                        cpct === 100
                          ? "bg-gradient-to-r from-primary to-emerald-400"
                          : cpct >= 50
                          ? "bg-primary"
                          : "bg-amber-400"
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Actions */}
      <Reveal delay={0.15}>
        <div className="flex flex-wrap items-center gap-3">
          <Magnetic strength={0.3}>
            <button
              type="button"
              onClick={onRetake}
              data-cursor="Retake"
              aria-label="Retake the quiz from the beginning"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <RotateCcw className="h-4 w-4" /> Retake Quiz
            </button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={onBackToLearn}
              data-cursor="Learn"
              aria-label="Go back to the Learn modules"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Back to Learn
              <ArrowRight className="h-4 w-4" />
            </button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={onViewProgress}
              data-cursor="Progress"
              aria-label="View your overall progress"
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View Progress
              <ArrowRight className="h-4 w-4" />
            </button>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Animated score ring (SVG)                                          */
/* ------------------------------------------------------------------ */

function ScoreRing({ pct }: { pct: number }) {
  const size = 168;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Score ${pct} percent`}
      >
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.52 0.13 162)" />
            <stop offset="100%" stopColor="oklch(0.72 0.13 85)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="oklch(0.92 0.005 160)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
          className="text-4xl font-extrabold text-foreground"
        >
          <CountUp value={pct} duration={1.6} suffix="%" />
        </motion.div>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Score
        </span>
      </div>
    </div>
  );
}
