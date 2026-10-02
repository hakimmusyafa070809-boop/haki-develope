"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Download,
  Printer,
  Sparkles,
  Check,
  Lock,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Brain,
  FlaskConical,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { LEARN_MODULES } from "@/lib/educational-data";
import { ViewShell, ViewHeader, ViewBody, ContinueExploring, RELATED_LINKS } from "../ViewShell";
import { Reveal, Stagger, StaggerItem, CountUp, Magnetic, Eyebrow } from "../animations/primitives";
import { cn } from "@/lib/utils";

export function CertificateView() {
  const completedModules = useSantrivest((s) => s.completedModules);
  const quizResult = useSantrivest((s) => s.quizResult);
  const simSessions = useSantrivest((s) => s.simSessions);
  const openedTerms = useSantrivest((s) => s.openedTerms);
  const setView = useSantrivest((s) => s.setView);
  const [studentName, setStudentName] = useState("");

  const modulesDone = completedModules.length;
  const modulesTotal = LEARN_MODULES.length;
  const quizScore = quizResult?.score ?? 0;
  const quizTotal = quizResult?.total ?? 0;
  const quizPct = quizTotal > 0 ? Math.round((quizScore / quizTotal) * 100) : 0;
  const simsCount = simSessions.length;

  // Eligibility: at least 4/6 modules + quiz taken
  const isEligible = modulesDone >= 4 && quizResult !== null;
  const isFullyComplete = modulesDone === modulesTotal && quizResult !== null;

  const completedModuleDetails = useMemo(
    () =>
      LEARN_MODULES.filter((m) => completedModules.includes(m.id)).map((m) => ({
        number: m.number,
        title: m.title,
      })),
    [completedModules]
  );

  const certDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const certId = useMemo(() => {
    // Stable ID based on completion
    const seed = completedModules.join("") + (quizResult?.score ?? 0);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return "SV-" + Math.abs(hash).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  }, [completedModules, quizResult]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <ViewShell>
      <ViewHeader
        eyebrow="Achievement"
        title={
          <>
            Your <span className="text-gradient-emerald">Certificate</span>
          </>
        }
        subtitle="Complete learning modules and the quiz to earn a printable certificate of financial literacy — a record of your journey, not a license."
        back="progress"
        backLabel="Back to Progress"
      />
      <ViewBody className="gap-8">
        {/* Eligibility status */}
        <Reveal>
          <div
            className={cn(
              "flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between md:p-6",
              isEligible
                ? "border-primary/30 bg-gradient-to-br from-emerald-50/60 to-amber-50/30"
                : "border-border/70 bg-card"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                  isEligible ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                )}
              >
                {isEligible ? <Award className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-foreground">
                  {isFullyComplete
                    ? "Fully complete — certificate ready"
                    : isEligible
                    ? "Eligible for certificate"
                    : "Certificate locked"}
                </span>
                <p className="text-xs text-muted-foreground">
                  {isEligible
                    ? "You can generate and print your certificate below."
                    : `Complete at least 4 of ${modulesTotal} learning modules and take the quiz to unlock.`}
                </p>
              </div>
            </div>
            {!isEligible && (
              <Magnetic strength={0.4}>
                <button
                  onClick={() => setView("learn")}
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background"
                >
                  Continue learning <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Magnetic>
            )}
          </div>
        </Reveal>

        {/* Progress checklist */}
        <Reveal>
          <div className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
            <Eyebrow>Requirements</Eyebrow>
            <Stagger className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <RequirementCard
                icon={BookOpen}
                label="Modules"
                value={`${modulesDone}/${modulesTotal}`}
                done={modulesDone >= 4}
              />
              <RequirementCard
                icon={Brain}
                label="Quiz taken"
                value={quizResult ? `${quizPct}%` : "—"}
                done={!!quizResult}
              />
              <RequirementCard
                icon={FlaskConical}
                label="Simulations"
                value={`${simsCount}`}
                done={simsCount >= 1}
                optional
              />
              <RequirementCard
                icon={Sparkles}
                label="Terms explored"
                value={`${openedTerms.length}`}
                done={openedTerms.length >= 5}
                optional
              />
            </Stagger>
          </div>
        </Reveal>

        {/* Name input + certificate */}
        {isEligible && (
          <>
            <Reveal>
              <div className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
                <Eyebrow>Your name</Eyebrow>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the name to display on your certificate.
                </p>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ahmad Fatih"
                  maxLength={40}
                  className="mt-3 w-full max-w-md rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={handlePrint}
                    data-cursor="Print"
                    className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-xs font-semibold text-background transition-all hover:opacity-90"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Certificate */}
            <Reveal delay={0.1}>
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                id="certificate-print-area"
                className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-primary/30 bg-white p-8 shadow-lift md:p-12"
              >
                {/* Decorative border */}
                <div className="pointer-events-none absolute inset-2 rounded-xl border border-primary/15" />
                <div className="pointer-events-none absolute inset-3 rounded-lg border border-amber-400/15" />

                {/* Corner stars */}
                {[
                  "left-3 top-3",
                  "right-3 top-3",
                  "left-3 bottom-3",
                  "right-3 bottom-3",
                ].map((pos) => (
                  <svg
                    key={pos}
                    viewBox="0 0 24 24"
                    className={cn("absolute h-5 w-5 text-primary/30", pos)}
                    aria-hidden
                  >
                    <path
                      d="M12 1 L14.5 7 L21 7 L16 11 L18 17 L12 13.5 L6 17 L8 11 L3 7 L9.5 7 Z"
                      fill="currentColor"
                    />
                  </svg>
                ))}

                <div className="relative flex flex-col items-center gap-6 text-center">
                  {/* Header */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-primary" />
                      <span className="text-sm font-extrabold tracking-[0.3em] text-foreground">
                        SANTRIVEST
                      </span>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                      Islamic Financial Literacy &amp; Sharia Investment Education
                    </span>
                  </div>

                  <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                      Certificate of Completion
                    </span>
                    <h2 className="font-arabic text-2xl text-primary/80" dir="rtl">
                      بسم الله الرحمن الرحيم
                    </h2>
                    <p className="text-[11px] italic text-muted-foreground">
                      In the name of Allah, the Most Gracious, the Most Merciful
                    </p>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">This certificate is proudly presented to</p>
                    <p className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                      {studentName.trim() || "Santri of MAS Husnul Khotimah"}
                    </p>
                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                      for successfully completing the SANTRIVEST financial literacy pathway —
                      demonstrating understanding of Islamic finance principles, personal budgeting,
                      and responsible Sharia investment concepts.
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid w-full max-w-md grid-cols-3 gap-3">
                    <CertStat label="Modules" value={`${modulesDone}/${modulesTotal}`} />
                    <CertStat label="Quiz score" value={quizResult ? `${quizPct}%` : "—"} />
                    <CertStat label="Simulations" value={`${simsCount}`} />
                  </div>

                  {/* Modules list */}
                  {completedModuleDetails.length > 0 && (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Modules completed
                      </span>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {completedModuleDetails.map((m) => (
                          <span
                            key={m.number}
                            className="rounded-full border border-primary/20 bg-primary/[0.04] px-2.5 py-1 text-[10px] font-medium text-foreground"
                          >
                            {m.number} · {m.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 flex w-full max-w-md items-end justify-between gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-px w-32 bg-foreground/40" />
                      <span className="text-[10px] font-semibold text-muted-foreground">Date</span>
                      <span className="text-xs font-bold text-foreground">{certDate}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <ShieldCheck className="h-8 w-8 text-primary/60" />
                      <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                        Cert ID
                      </span>
                      <span className="text-[10px] font-bold text-foreground">{certId}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-px w-32 bg-foreground/40" />
                      <span className="text-[10px] font-semibold text-muted-foreground">SANTRIVEST</span>
                      <span className="text-xs font-bold text-foreground">SDG 8</span>
                    </div>
                  </div>

                  <p className="mt-2 max-w-lg text-[10px] leading-relaxed text-muted-foreground/70">
                    Educational recognition only. This certificate does not constitute a financial
                    license, professional qualification, or investment advice. All simulations used
                    virtual money.
                  </p>
                </div>
              </motion.div>
            </Reveal>
          </>
        )}

        {!isEligible && (
          <Reveal>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/70 bg-card/40 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                <Award className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-foreground">Your certificate awaits</p>
                <p className="max-w-sm text-xs text-muted-foreground">
                  Keep learning. Once you complete 4+ modules and take the quiz, your personalized
                  certificate will appear here, ready to print or save as PDF.
                </p>
              </div>
              <Magnetic strength={0.4}>
                <button
                  onClick={() => setView("learn")}
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-xs font-semibold text-background"
                >
                  Go to Learn <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Magnetic>
            </div>
          </Reveal>
        )}
      </ViewBody>
      <ContinueExploring current="progress" links={RELATED_LINKS.progress} />

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-print-area,
          #certificate-print-area * {
            visibility: visible;
          }
          #certificate-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            border: 2px solid oklch(0.52 0.13 162 / 0.3);
            box-shadow: none;
            border-radius: 0;
          }
          @page {
            size: A4 landscape;
            margin: 0.5in;
          }
        }
      `}</style>
    </ViewShell>
  );
}

function RequirementCard({
  icon: Icon,
  label,
  value,
  done,
  optional,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  done: boolean;
  optional?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-3 transition-colors",
        done ? "border-primary/30 bg-primary/[0.03]" : "border-border/60 bg-background/40"
      )}
    >
      <div className="flex items-center justify-between">
        <Icon className={cn("h-4 w-4", done ? "text-primary" : "text-muted-foreground")} />
        {done ? (
          <Check className="h-3.5 w-3.5 text-primary" />
        ) : optional ? (
          <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[8px] font-bold uppercase text-muted-foreground">
            Opt
          </span>
        ) : null}
      </div>
      <span className="text-lg font-bold text-foreground">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}

function CertStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-primary/15 bg-primary/[0.03] py-3">
      <span className="text-xl font-extrabold text-foreground">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}
