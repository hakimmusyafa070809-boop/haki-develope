"use client";

import { useMemo } from "react";
import { Download, FileJson, FileText, Star } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { LEARN_MODULES, GLOSSARY, QUIZ_QUESTIONS, QUIZ_QUESTIONS_EXTRA, RESEARCH_STATEMENTS } from "@/lib/educational-data";

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString();
  } catch {
    return iso;
  }
}

export function ProgressExport() {
  const completedModules = useSantrivest((s) => s.completedModules);
  const openedTerms = useSantrivest((s) => s.openedTerms);
  const quizResult = useSantrivest((s) => s.quizResult);
  const simSessions = useSantrivest((s) => s.simSessions);
  const favorites = useSantrivest((s) => s.favorites);
  const reflections = useSantrivest((s) => s.reflections);
  const researchPre = useSantrivest((s) => s.researchPre);
  const researchPost = useSantrivest((s) => s.researchPost);
  const streak = useSantrivest((s) => s.streak);
  const activityLog = useSantrivest((s) => s.activityLog);

  const exportData = useMemo(
    () => ({
      platform: "SANTRIVEST",
      exportedAt: new Date().toISOString(),
      summary: {
        completedModules: completedModules.length,
        totalModules: LEARN_MODULES.length,
        glossaryTermsExplored: openedTerms.length,
        totalGlossaryTerms: GLOSSARY.length,
        quizScore: quizResult?.score ?? 0,
        quizTotal: quizResult?.total ?? 0,
        quizPct: quizResult ? Math.round((quizResult.score / quizResult.total) * 100) : 0,
        simulationsRun: simSessions.length,
        favoritesCount: favorites.length,
        reflectionsCount: Object.keys(reflections).length,
        streakDays: streak,
        activeDays: activityLog.length,
      },
      completedModules: completedModules.map((id) => {
        const m = LEARN_MODULES.find((x) => x.id === id);
        return m ? { id, number: m.number, title: m.title } : { id };
      }),
      glossaryExplored: openedTerms,
      favorites,
      quizResult: quizResult
        ? {
            score: quizResult.score,
            total: quizResult.total,
            date: formatDate(quizResult.date),
            answers: quizResult.answers,
          }
        : null,
      quizQuestionsPool: [...QUIZ_QUESTIONS, ...QUIZ_QUESTIONS_EXTRA].map((q) => ({
        id: q.id,
        category: q.category,
        question: q.question,
        correctAnswer: q.options[q.correct],
        userAnswer: quizResult?.answers[q.id] !== undefined ? q.options[quizResult.answers[q.id]] : null,
        isCorrect: quizResult?.answers[q.id] === q.correct,
      })),
      simulationSessions: simSessions.map((s) => ({
        ...s,
        date: formatDate(s.date),
      })),
      reflections: Object.entries(reflections).map(([key, text]) => ({
        scriptureReference: key,
        reflection: text,
      })),
      research: {
        pre: researchPre
          ? {
              date: formatDate(researchPre.date),
              responses: researchPre.responses,
            }
          : null,
        post: researchPost
          ? {
              date: formatDate(researchPost.date),
              responses: researchPost.responses,
            }
          : null,
        statements: RESEARCH_STATEMENTS.map((s) => ({
          id: s.id,
          indicator: s.indicator,
          statement: s.text,
        })),
      },
      activityLog,
    }),
    [
      completedModules,
      openedTerms,
      quizResult,
      simSessions,
      favorites,
      reflections,
      researchPre,
      researchPost,
      streak,
      activityLog,
    ]
  );

  const exportJSON = () => {
    const content = JSON.stringify(exportData, null, 2);
    downloadFile(
      content,
      `santrivest-progress-${new Date().toISOString().slice(0, 10)}.json`,
      "application/json;charset=utf-8;"
    );
  };

  const exportCSV = () => {
    const rows: string[] = [];
    // Header
    rows.push("category,item_id,item_detail,status,value,date");
    // Modules
    for (const m of LEARN_MODULES) {
      const done = completedModules.includes(m.id);
      rows.push(`module,${m.id},"${m.title.replace(/"/g, '""')}",${done ? "completed" : "not_completed"},,`);
    }
    // Glossary terms
    for (const g of GLOSSARY) {
      const explored = openedTerms.includes(g.term);
      const fav = favorites.includes(g.term);
      rows.push(`glossary,${g.term},"${g.short.replace(/"/g, '""')}",${explored ? "explored" : "not_explored"},${fav ? "favorited" : ""},`);
    }
    // Quiz
    if (quizResult) {
      rows.push(`quiz,result,,"completed",${quizResult.score}/${quizResult.total},${formatDate(quizResult.date)}`);
      for (const q of [...QUIZ_QUESTIONS, ...QUIZ_QUESTIONS_EXTRA]) {
        const ua = quizResult.answers[q.id];
        const correct = ua === q.correct;
        if (ua !== undefined) {
          rows.push(`quiz_answer,${q.id},"${q.question.replace(/"/g, '""').slice(0, 60)}",${correct ? "correct" : "incorrect"},${q.options[ua].slice(0, 40)},`);
        }
      }
    }
    // Simulations
    for (const s of simSessions) {
      rows.push(`simulation,${s.id},"${s.label.replace(/"/g, '""')}",completed,${s.detail},${formatDate(s.date)}`);
    }
    // Reflections
    for (const [key, text] of Object.entries(reflections)) {
      rows.push(`reflection,${key},"${text.replace(/"/g, '""').slice(0, 80)}",written,,`);
    }
    // Research
    if (researchPre) rows.push(`research,pre_test,,"completed",,${formatDate(researchPre.date)}`);
    if (researchPost) rows.push(`research,post_test,,"completed",,${formatDate(researchPost.date)}`);
    // Streak
    rows.push(`streak,current,,"active",${streak} days,`);

    downloadFile(
      rows.join("\n"),
      `santrivest-progress-${new Date().toISOString().slice(0, 10)}.csv`,
      "text/csv;charset=utf-8;"
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={exportJSON}
        data-cursor="Export"
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        <FileJson className="h-3.5 w-3.5 text-primary" />
        Export JSON
      </button>
      <button
        onClick={exportCSV}
        data-cursor="Export"
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        <FileText className="h-3.5 w-3.5 text-amber-500" />
        Export CSV
      </button>
    </div>
  );
}
