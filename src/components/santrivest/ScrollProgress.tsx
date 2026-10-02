"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollProgress() {
  const [showTop, setShowTop] = useState(false);
  const scrollY = useMotionValue(0);
  const progress = useSpring(useTransform(scrollY, (y) => y), { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollY.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowTop(scrollTop > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollY]);

  return (
    <>
      {/* top progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[101] h-0.5 origin-left bg-gradient-to-r from-primary via-primary to-amber-400"
        style={{ scaleX: useTransform(progress, (v) => v / 100) }}
      />

      {/* back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-cursor="Top"
            aria-label="Back to top"
            className="fixed bottom-24 right-4 z-[101] flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-lift backdrop-blur transition-all hover:border-primary/40 hover:text-primary md:bottom-6 lg:right-6"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
