"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { FloatingNav } from "@/components/santrivest/FloatingNav";
import { CustomCursor } from "@/components/santrivest/CustomCursor";
import { useSantrivest } from "@/lib/store";
import { HomeView } from "@/components/santrivest/sections/HomeView";
import { Footer } from "@/components/santrivest/Footer";
import { ScrollProgress } from "@/components/santrivest/ScrollProgress";

// Loading skeleton shown while lazy chunks are fetched
function ViewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-28 md:px-8 md:pt-36">
      <div className="flex flex-col gap-5 border-b border-border/60 pb-8">
        <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
        <div className="h-12 w-2/3 animate-pulse rounded-lg bg-secondary" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-secondary/60" />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div className="h-32 animate-pulse rounded-2xl bg-secondary/40" />
        <div className="h-32 animate-pulse rounded-2xl bg-secondary/40" />
        <div className="h-32 animate-pulse rounded-2xl bg-secondary/40" />
      </div>
    </div>
  );
}

// Lazy-load all non-home views to reduce initial bundle size and memory pressure.
// Each view only compiles when the user navigates to it — prevents OOM on the dev server.
// NOTE: options must be inline object literals (Next.js Turbopack requirement).
const LearnView = dynamic(() => import("@/components/santrivest/sections/LearnView").then(m => m.LearnView), { ssr: false, loading: () => <ViewSkeleton /> });
const FinanceView = dynamic(() => import("@/components/santrivest/sections/FinanceView").then(m => m.FinanceView), { ssr: false, loading: () => <ViewSkeleton /> });
const ShariaView = dynamic(() => import("@/components/santrivest/sections/ShariaView").then(m => m.ShariaView), { ssr: false, loading: () => <ViewSkeleton /> });
const InvestmentView = dynamic(() => import("@/components/santrivest/sections/InvestmentView").then(m => m.InvestmentView), { ssr: false, loading: () => <ViewSkeleton /> });
const SimulationView = dynamic(() => import("@/components/santrivest/sections/SimulationView").then(m => m.SimulationView), { ssr: false, loading: () => <ViewSkeleton /> });
const QuizView = dynamic(() => import("@/components/santrivest/sections/QuizView").then(m => m.QuizView), { ssr: false, loading: () => <ViewSkeleton /> });
const ProgressView = dynamic(() => import("@/components/santrivest/sections/ProgressView").then(m => m.ProgressView), { ssr: false, loading: () => <ViewSkeleton /> });
const ResearchView = dynamic(() => import("@/components/santrivest/sections/ResearchView").then(m => m.ResearchView), { ssr: false, loading: () => <ViewSkeleton /> });
const CertificateView = dynamic(() => import("@/components/santrivest/sections/CertificateView").then(m => m.CertificateView), { ssr: false, loading: () => <ViewSkeleton /> });

const VIEWS: Record<string, ComponentType> = {
  home: HomeView,
  learn: LearnView,
  finance: FinanceView,
  sharia: ShariaView,
  investment: InvestmentView,
  simulation: SimulationView,
  quiz: QuizView,
  progress: ProgressView,
  research: ResearchView,
  certificate: CertificateView,
};

export default function Page() {
  const view = useSantrivest((s) => s.view);
  const ViewComponent = VIEWS[view] || HomeView;

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <ScrollProgress />
      <CustomCursor />
      <FloatingNav />

      <main className="flex-1 pb-28 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* light sweep overlay */}
            <motion.div
              aria-hidden
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none fixed inset-0 z-[80] hidden md:block"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, oklch(0.99 0.005 95 / 0.55) 50%, transparent 70%)",
              }}
            />
            <ViewComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
