"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Save, Check, RotateCcw, ChevronDown } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Interactive reflection journal prompt.
 * Lets the student write a personal reflection keyed by a scripture reference.
 * Reflections persist to localStorage via the Zustand store.
 * Respectful — does not gamify the scripture itself, only the reflection act.
 */
export function ReflectionJournal({
  journalKey,
  prompt,
}: {
  journalKey: string;
  prompt: string;
}) {
  const text = useSantrivest((s) => s.reflections[journalKey] || "");
  const setReflection = useSantrivest((s) => s.setReflection);
  const [draft, setDraft] = useState(text);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Sync draft when external text changes (e.g., after reset)
  useEffect(() => {
    setDraft(text);
  }, [text]);

  const handleSave = () => {
    setReflection(journalKey, draft.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setDraft("");
    setReflection(journalKey, "");
  };

  const hasContent = text.trim().length > 0;
  const charCount = draft.length;

  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-3.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          <PenLine className="h-3 w-3" />
          My reflection
          {hasContent && (
            <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
              <Check className="h-2.5 w-2.5" /> Saved
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <p className="mb-2 text-xs italic leading-relaxed text-muted-foreground">
                {prompt}
              </p>
              <textarea
                ref={taRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write your reflection here… (no one else will see this — it stays on your device)"
                maxLength={500}
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {charCount}/500 · stored locally
                </span>
                <div className="flex gap-1.5">
                  {hasContent && (
                    <button
                      onClick={handleClear}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <RotateCcw className="h-2.5 w-2.5" /> Clear
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={draft.trim().length === 0}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all",
                      draft.trim().length === 0
                        ? "cursor-not-allowed bg-secondary text-muted-foreground"
                        : saved
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground text-background hover:opacity-90"
                    )}
                  >
                    {saved ? (
                      <>
                        <Check className="h-2.5 w-2.5" /> Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-2.5 w-2.5" /> Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show saved reflection preview when collapsed */}
      {!open && hasContent && (
        <p className="mt-2 line-clamp-2 text-xs italic leading-relaxed text-muted-foreground">
          &ldquo;{text}&rdquo;
        </p>
      )}
    </div>
  );
}
