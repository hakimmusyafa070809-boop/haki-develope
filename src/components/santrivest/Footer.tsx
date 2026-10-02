"use client";

import { Scale, Heart, Sparkles, BookOpen, TrendingUp, Wallet, GraduationCap } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { NAV_ITEMS } from "@/lib/educational-data";
import { motion } from "framer-motion";

const PILLAR_LINKS = [
  { icon: GraduationCap, label: "Learn", view: "learn" as const, desc: "6 modules" },
  { icon: Wallet, label: "Finance", view: "finance" as const, desc: "Budget sim" },
  { icon: Scale, label: "Sharia", view: "sharia" as const, desc: "Riba · Gharar" },
  { icon: TrendingUp, label: "Investment", view: "investment" as const, desc: "Portfolio" },
];

export function Footer() {
  const setView = useSantrivest((s) => s.setView);
  return (
    <footer className="mt-auto border-t border-border/60 bg-gradient-to-b from-card/30 to-card/60 backdrop-blur">
      {/* Decorative top accent */}
      <div className="section-accent-line" />

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8">
                <svg viewBox="0 0 40 40" className="h-full w-full">
                  <defs>
                    <linearGradient id="footer-lg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="oklch(0.5 0.13 162)" />
                      <stop offset="100%" stopColor="oklch(0.7 0.12 150)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 2 L25 12 L36 8 L32 19 L38 25 L27 26 L25 38 L20 30 L15 38 L13 26 L2 25 L8 19 L4 8 L15 12 Z"
                    fill="url(#footer-lg)"
                    opacity="0.95"
                  />
                  <circle cx="20" cy="20" r="5" fill="oklch(0.99 0.005 95)" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-extrabold tracking-[0.18em] text-foreground">
                  SANTRIVEST
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                  Learn · Manage · Invest
                </span>
              </div>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Premium Islamic financial literacy &amp; Sharia investment education
              for santri of MAS Husnul Khotimah. Supporting SDG No. 8.
            </p>
            {/* SDG badge */}
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-[10px] font-extrabold text-background">
                8
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">
                Decent Work &amp; Economic Growth
              </span>
            </div>
          </div>

          {/* Quick pillars */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Quick Access
            </span>
            {PILLAR_LINKS.map((p) => (
              <button
                key={p.label}
                onClick={() => setView(p.view)}
                className="group flex items-center gap-2 text-left"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <p.icon className="h-3 w-3" strokeWidth={1.8} />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary">{p.label}</span>
                  <span className="text-[9px] text-muted-foreground">{p.desc}</span>
                </span>
              </button>
            ))}
          </div>

          {/* All views */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Explore
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {NAV_ITEMS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  className="link-underline w-fit text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Disclaimer
            </span>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Educational content only. All simulations use virtual money — no
              real transactions, advice, or guarantees. Always consult qualified
              scholars and licensed advisors.
            </p>
            <button
              onClick={() => setView("research")}
              className="link-underline mt-1 w-fit text-[10px] font-medium text-muted-foreground/60 hover:text-muted-foreground"
            >
              Research Mode
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-5 md:flex-row">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} SANTRIVEST · Learn. Manage. Invest. Grow.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary/60" />
              Built for a capable generation
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Heart className="h-3 w-3 fill-primary text-primary" />
              Barakah
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
