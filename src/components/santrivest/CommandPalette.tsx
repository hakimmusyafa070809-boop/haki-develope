"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  GraduationCap,
  Wallet,
  Scale,
  TrendingUp,
  FlaskConical,
  Brain,
  BarChart3,
  Award,
  ClipboardList,
  CornerDownLeft,
  X,
} from "lucide-react";
import { useSantrivest } from "@/lib/store";
import type { ViewId } from "@/lib/educational-data";
import { GLOSSARY, LEARN_MODULES, SCRIPTURES } from "@/lib/educational-data";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  label: string;
  hint: string;
  view: ViewId;
  icon: React.ElementType;
  keywords: string[];
}

const VIEW_ICONS: Record<ViewId, React.ElementType> = {
  home: Home,
  learn: GraduationCap,
  finance: Wallet,
  sharia: Scale,
  investment: TrendingUp,
  simulation: FlaskConical,
  quiz: Brain,
  progress: BarChart3,
  research: ClipboardList,
  certificate: Award,
};

const VIEW_LABELS: Record<ViewId, string> = {
  home: "Home",
  learn: "Learn",
  finance: "Finance",
  sharia: "Sharia",
  investment: "Investment",
  simulation: "Simulation",
  quiz: "Quiz",
  progress: "Progress",
  research: "Research Mode",
  certificate: "Certificate",
};

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // Views
  (Object.keys(VIEW_LABELS) as ViewId[]).forEach((v) => {
    items.push({
      id: `view-${v}`,
      label: VIEW_LABELS[v],
      hint: "Go to view",
      view: v,
      icon: VIEW_ICONS[v],
      keywords: [VIEW_LABELS[v].toLowerCase(), "view", "navigate", "page"],
    });
  });

  // Learning modules
  LEARN_MODULES.forEach((m) => {
    items.push({
      id: `module-${m.id}`,
      label: m.title,
      hint: `Learn · Module ${m.number}`,
      view: "learn",
      icon: GraduationCap,
      keywords: [m.title.toLowerCase(), "learn", "module", ...m.topics.map((t) => t.toLowerCase())],
    });
  });

  // Glossary terms
  GLOSSARY.forEach((t) => {
    items.push({
      id: `term-${t.term}`,
      label: t.term,
      hint: `Glossary · ${t.short.slice(0, 40)}`,
      view: "sharia",
      icon: Scale,
      keywords: [t.term.toLowerCase(), t.arabic || "", t.short.toLowerCase(), t.category.toLowerCase(), "glossary", "term"],
    });
  });

  // Scriptures
  SCRIPTURES.forEach((s) => {
    items.push({
      id: `scripture-${s.reference}`,
      label: s.reference,
      hint: `Quran · ${s.theme}`,
      view: "sharia",
      icon: Scale,
      keywords: [s.reference.toLowerCase(), s.surahName.toLowerCase(), s.theme.toLowerCase(), "quran", "verse"],
    });
  });

  return items;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const setView = useSantrivest((s) => s.setView);

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 8);
    const q = query.toLowerCase();
    return searchIndex
      .filter((item) => {
        return (
          item.label.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
        );
      })
      .slice(0, 10);
  }, [query, searchIndex]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus input when opened; reset state when closed (deferred to avoid sync setState in effect)
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    const r = window.setTimeout(() => {
      setQuery("");
      setActiveIndex(0);
    }, 0);
    return () => window.clearTimeout(r);
  }, [open]);

  // Reset active index when results change (deferred)
  useEffect(() => {
    const r = window.setTimeout(() => setActiveIndex(0), 0);
    return () => window.clearTimeout(r);
  }, [query]);

  const selectItem = (item: SearchItem) => {
    setView(item.view);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) {
        selectItem(results[activeIndex]);
      }
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        data-cursor="Search"
        aria-label="Open search (Ctrl+K)"
        className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:flex"
      >
        <Search className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-start justify-center bg-background/60 px-4 pt-[15vh] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lift"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search views, modules, glossary, verses…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Close search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Results */}
              <div className="scroll-thin max-h-[50vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="px-3 py-8 text-center">
                    <Search className="mx-auto h-6 w-6 text-muted-foreground/40" />
                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Try a view name, module topic, or glossary term.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {results.map((item, i) => {
                      const Icon = item.icon;
                      const isActive = i === activeIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => selectItem(item)}
                          onMouseEnter={() => setActiveIndex(i)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                            isActive ? "bg-secondary" : "hover:bg-secondary/60"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                              isActive ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                          </span>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-semibold text-foreground">
                              {item.label}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {item.hint}
                            </span>
                          </div>
                          {isActive && (
                            <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-background/40 px-4 py-2.5 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[9px]">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[9px]">↵</kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[9px]">esc</kbd>
                    close
                  </span>
                </div>
                <span>{results.length} results</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
