"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, BookOpen, Lightbulb, Target, ArrowRight, Sparkles, Lock, Clock, Layers } from "lucide-react";
import { LEARN_MODULES, GLOSSARY } from "@/lib/educational-data";
import { useSantrivest } from "@/lib/store";
import { ViewShell, ViewHeader, ViewBody, ContinueExploring, RELATED_LINKS } from "../ViewShell";
import { Reveal, Stagger, StaggerItem, Eyebrow, CountUp, Magnetic } from "../animations/primitives";
import { cn } from "@/lib/utils";

const STAGES = ["Beginner", "Explorer", "Planner", "Investor"];

// Estimate reading time: ~200 words/min, avg ~40 words per content block
function estimateReadingTime(contentCount: number): number {
  const wordsPerBlock = 40;
  const wpm = 200;
  return Math.max(1, Math.round((contentCount * wordsPerBlock) / wpm));
}

export function LearnView() {
  const completed = useSantrivest((s) => s.completedModules);
  const completeModule = useSantrivest((s) => s.completeModule);
  const lastModuleViewed = useSantrivest((s) => s.lastModuleViewed);
  const setLastModuleViewed = useSantrivest((s) => s.setLastModuleViewed);
  const setView = useSantrivest((s) => s.setView);
  const [active, setActive] = useState<string | null>(lastModuleViewed || LEARN_MODULES[0].id);

  const stageIndex = Math.min(STAGES.length - 1, Math.floor((completed.length / LEARN_MODULES.length) * STAGES.length));

  // Find the next uncompleted module for "Continue learning"
  const nextModule = LEARN_MODULES.find((m) => !completed.includes(m.id));

  // Track last viewed module when expanding
  const handleSetActive = (id: string | null) => {
    setActive(id);
    if (id) setLastModuleViewed(id);
  };

  return (
    <ViewShell>
      <ViewHeader
        eyebrow="Learning Pathway"
        title={
          <>
            Master <span className="text-gradient-emerald">Your Money</span>
          </>
        }
        subtitle="Six modules take you from understanding money to investing responsibly. Each concept follows: Learn → See → Try → Reflect → Apply."
      />

      <ViewBody className="gap-10">
        {/* Continue where you left off */}
        {nextModule && (
          <Reveal>
            <button
              onClick={() => handleSetActive(nextModule.id)}
              data-cursor="Continue"
              className="group flex w-full items-center gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-emerald-50/70 to-amber-50/30 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lift md:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Continue where you left off
                </span>
                <span className="text-sm font-bold text-foreground md:text-base">
                  Module {nextModule.number} · {nextModule.title}
                </span>
                <span className="text-xs text-muted-foreground">{nextModule.summary}</span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </Reveal>
        )}
        {!nextModule && completed.length === LEARN_MODULES.length && (
          <Reveal>
            <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-emerald-50/70 to-amber-50/30 p-4 md:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Check className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Pathway complete
                </span>
                <span className="text-sm font-bold text-foreground md:text-base">
                  You've completed all {LEARN_MODULES.length} modules. Mazallah!
                </span>
                <span className="text-xs text-muted-foreground">
                  Revisit any module to refresh your understanding, or test yourself with the quiz.
                </span>
              </div>
            </div>
          </Reveal>
        )}

        {/* Progress path */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-emerald-50/60 via-card to-amber-50/30 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Eyebrow>Your Journey</Eyebrow>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {STAGES[stageIndex]} <span className="text-muted-foreground">·</span>{" "}
                  <CountUp value={completed.length} />/{LEARN_MODULES.length} modules
                </p>
              </div>
              <div className="flex items-center gap-2">
                {STAGES.map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      i <= stageIndex
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {i < stageIndex ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-border/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completed.length / LEARN_MODULES.length) * 100}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
              />
            </div>
          </div>
        </Reveal>

        {/* Modules */}
        <div className="flex flex-col gap-4">
          {LEARN_MODULES.map((m, idx) => {
            const done = completed.includes(m.id);
            const isOpen = active === m.id;
            const prevDone = idx === 0 || completed.includes(LEARN_MODULES[idx - 1].id);
            return (
              <Reveal key={m.id} delay={idx * 0.04}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card transition-all",
                    isOpen ? "border-primary/40 shadow-lift" : "border-border/70 hover:border-border"
                  )}
                >
                  <button
                    onClick={() => handleSetActive(isOpen ? null : m.id)}
                    data-cursor="Open"
                    className="flex w-full items-center gap-4 p-5 text-left md:gap-6 md:p-6"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold transition-colors md:h-14 md:w-14",
                        done
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {done ? <Check className="h-5 w-5" /> : m.number}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground md:text-xl">{m.title}</h3>
                        {!prevDone && !done && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            <Lock className="h-2.5 w-2.5" /> Locked
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />
                          {estimateReadingTime(m.content.length)} min read
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          <Layers className="h-2.5 w-2.5" />
                          {m.topics.length} topics
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{m.summary}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {m.topics.slice(0, 4).map((t) => (
                          <span key={t} className="rounded-md bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {t}
                          </span>
                        ))}
                        {m.topics.length > 4 && (
                          <span className="rounded-md bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            +{m.topics.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border/60 p-5 md:p-6">
                          <div className="grid gap-3 md:grid-cols-2">
                            {m.content.map((c, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 + i * 0.05 }}
                                className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/60 p-4"
                              >
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  {i === 0 && <BookOpen className="h-4 w-4 text-primary" />}
                                  {i === m.content.length - 1 && <Target className="h-4 w-4 text-amber-500" />}
                                  {i > 0 && i < m.content.length - 1 && <Lightbulb className="h-4 w-4 text-primary" />}
                                  <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                                    {i === 0 ? "Simple Explanation" : i === m.content.length - 1 ? "Try It Yourself" : "Why It Matters"}
                                  </span>
                                </div>
                                <h4 className="text-base font-bold text-foreground">{c.heading}</h4>
                                <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                                {c.tip && (
                                  <div className="mt-1 flex gap-2 rounded-lg bg-amber-50/70 p-2.5 text-xs text-foreground">
                                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                    <span>{c.tip}</span>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-1.5">
                              {m.topics.map((t) => (
                                <span key={t} className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => completeModule(m.id)}
                              data-cursor="Done"
                              disabled={done}
                              className={cn(
                                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all",
                                done
                                  ? "cursor-default bg-primary/10 text-primary"
                                  : "bg-foreground text-background hover:opacity-90"
                              )}
                            >
                              {done ? (
                                <>
                                  <Check className="h-3.5 w-3.5" /> Completed
                                </>
                              ) : (
                                <>
                                  Mark as complete <ArrowRight className="h-3.5 w-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Glossary teaser */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <Eyebrow>Interactive Glossary</Eyebrow>
                <h3 className="text-2xl font-bold text-foreground">Look up any Islamic finance term</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  From Riba to Murabahah — search and learn {GLOSSARY.length} key terms with real examples.
                </p>
              </div>
              <Magnetic>
                <button
                  onClick={() => setView("sharia")}
                  data-cursor="Open"
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-xs font-semibold text-background"
                >
                  Open glossary <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Magnetic>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {GLOSSARY.slice(0, 8).map((t) => (
                <span
                  key={t.term}
                  className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  {t.term} {t.arabic && <span className="font-arabic text-primary/70">{t.arabic}</span>}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </ViewBody>
      <ContinueExploring current="learn" links={RELATED_LINKS.learn} />
    </ViewShell>
  );
}
