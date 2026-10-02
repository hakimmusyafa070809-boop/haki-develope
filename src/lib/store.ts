"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ViewId } from "./educational-data";

export interface QuizResult {
  score: number;
  total: number;
  date: string;
  answers: Record<string, number>;
}

export interface QuizHistoryEntry {
  id: string;
  score: number;
  total: number;
  date: string;
  difficulty: string; // "all" | "easy" | "medium" | "hard"
  category: string;   // "All" or specific category
  timedMode: boolean;
  durationSec: number; // total time taken
}

export interface SimSession {
  id: string;
  type: string;
  label: string;
  date: string;
  detail: string;
}

// Research Mode — pre-test / post-test Likert responses (spec #31)
export type ResearchPhase = "pre" | "post";
export interface ResearchResult {
  phase: ResearchPhase;
  date: string;
  responses: Record<string, number>; // statement id -> 1..5 Likert
}

interface SantrivestState {
  view: ViewId;
  setView: (v: ViewId) => void;

  // Learning
  completedModules: string[];
  completeModule: (id: string) => void;

  // Glossary opens
  openedTerms: string[];
  openTerm: (t: string) => void;

  // Quiz
  quizResult: QuizResult | null;
  setQuizResult: (r: QuizResult) => void;
  quizHistory: QuizHistoryEntry[];
  addQuizHistory: (e: QuizHistoryEntry) => void;
  lastModuleViewed: string | null;
  setLastModuleViewed: (id: string) => void;

  // Simulations
  simSessions: SimSession[];
  logSim: (s: SimSession) => void;

  // Needs vs wants
  needsWantsDone: boolean;
  setNeedsWantsDone: (b: boolean) => void;

  // Sharia checker
  checkerDone: boolean;
  setCheckerDone: (b: boolean) => void;

  // Research Mode (pre-test / post-test Likert)
  researchPre: ResearchResult | null;
  researchPost: ResearchResult | null;
  setResearchResult: (phase: ResearchPhase, responses: Record<string, number>) => void;

  // Reflection journal — keyed by scripture reference
  reflections: Record<string, string>;
  setReflection: (key: string, text: string) => void;

  // Streak
  lastVisit: string | null;
  streak: number;
  touchStreak: () => void;

  // Activity log — set of date strings (YYYY-MM-DD) when user was active
  activityLog: string[];
  logActivity: () => void;

  // Favorites — bookmarked glossary terms
  favorites: string[];
  toggleFavorite: (term: string) => void;

  reset: () => void;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

export const useSantrivest = create<SantrivestState>()(
  persist(
    (set, get) => ({
      view: "home",
      setView: (v) => {
        set({ view: v });
        get().touchStreak();
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      },

      completedModules: [],
      completeModule: (id) =>
        set((s) =>
          s.completedModules.includes(id)
            ? s
            : { completedModules: [...s.completedModules, id] }
        ),

      openedTerms: [],
      openTerm: (t) =>
        set((s) =>
          s.openedTerms.includes(t) ? s : { openedTerms: [...s.openedTerms, t] }
        ),

      quizResult: null,
      setQuizResult: (r) => set({ quizResult: r }),
      quizHistory: [],
      addQuizHistory: (e) =>
        set((s) => ({ quizHistory: [e, ...s.quizHistory].slice(0, 20) })),
      lastModuleViewed: null,
      setLastModuleViewed: (id) => set({ lastModuleViewed: id }),

      simSessions: [],
      logSim: (s) =>
        set((st) => ({ simSessions: [s, ...st.simSessions].slice(0, 30) })),

      needsWantsDone: false,
      setNeedsWantsDone: (b) => set({ needsWantsDone: b }),

      checkerDone: false,
      setCheckerDone: (b) => set({ checkerDone: b }),

      researchPre: null,
      researchPost: null,
      setResearchResult: (phase, responses) =>
        set({
          [phase === "pre" ? "researchPre" : "researchPost"]: {
            phase,
            date: new Date().toISOString(),
            responses,
          },
        } as Pick<SantrivestState, "researchPre" | "researchPost">),

      reflections: {},
      setReflection: (key, text) =>
        set((s) => ({ reflections: { ...s.reflections, [key]: text } })),

      lastVisit: null,
      streak: 1,
      touchStreak: () => {
        const today = todayStr();
        const last = get().lastVisit;
        if (last === today) return;
        if (!last) {
          set({
            lastVisit: today,
            streak: 1,
            activityLog: get().activityLog.includes(today)
              ? get().activityLog
              : [...get().activityLog, today].slice(-90),
          });
          return;
        }
        const diff = daysBetween(last, today);
        if (diff === 1) {
          set({
            lastVisit: today,
            streak: get().streak + 1,
            activityLog: get().activityLog.includes(today)
              ? get().activityLog
              : [...get().activityLog, today].slice(-90),
          });
        } else if (diff > 1) {
          set({
            lastVisit: today,
            streak: 1,
            activityLog: get().activityLog.includes(today)
              ? get().activityLog
              : [...get().activityLog, today].slice(-90),
          });
        } else {
          set({ lastVisit: today });
        }
      },

      activityLog: [],
      logActivity: () => {
        const today = todayStr();
        set((s) =>
          s.activityLog.includes(today)
            ? s
            : { activityLog: [...s.activityLog, today].slice(-90) }
        );
      },

      favorites: [],
      toggleFavorite: (term) =>
        set((s) =>
          s.favorites.includes(term)
            ? { favorites: s.favorites.filter((t) => t !== term) }
            : { favorites: [...s.favorites, term] }
        ),

      reset: () =>
        set({
          completedModules: [],
          openedTerms: [],
          quizResult: null,
          quizHistory: [],
          lastModuleViewed: null,
          simSessions: [],
          needsWantsDone: false,
          checkerDone: false,
          researchPre: null,
          researchPost: null,
          reflections: {},
          streak: 1,
          activityLog: [],
          favorites: [],
        }),
    }),
    {
      name: "santrivest-progress-v1",
      partialize: (s) => ({
        completedModules: s.completedModules,
        openedTerms: s.openedTerms,
        quizResult: s.quizResult,
        quizHistory: s.quizHistory,
        lastModuleViewed: s.lastModuleViewed,
        simSessions: s.simSessions,
        needsWantsDone: s.needsWantsDone,
        checkerDone: s.checkerDone,
        researchPre: s.researchPre,
        researchPost: s.researchPost,
        reflections: s.reflections,
        activityLog: s.activityLog,
        favorites: s.favorites,
        lastVisit: s.lastVisit,
        streak: s.streak,
      }),
    }
  )
);
