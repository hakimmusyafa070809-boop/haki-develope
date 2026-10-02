"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string>("");
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-desktop");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      const interactive = el.closest(
        "a,button,[data-cursor],input,textarea,select,[role='button'],[role='tab']"
      ) as HTMLElement | null;
      setHovering(!!interactive);
      setLabel(interactive?.getAttribute("data-cursor") || "");
    };
    const downH = () => setDown(true);
    const upH = () => setDown(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", downH);
    window.addEventListener("mouseup", upH);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", downH);
      window.removeEventListener("mouseup", upH);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <motion.div
        style={{ x: sx, y: sy }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            scale: down ? 0.7 : hovering ? 0.4 : 1,
            backgroundColor: hovering
              ? "oklch(0.52 0.13 162)"
              : "oklch(0.21 0.006 160)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="h-2 w-2 rounded-full"
        />
      </motion.div>
      <motion.div
        style={{ x, y }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: hovering ? 56 : 34,
            height: hovering ? 56 : 34,
            borderColor: hovering
              ? "oklch(0.52 0.13 162 / 0.7)"
              : "oklch(0.21 0.006 160 / 0.25)",
            opacity: hovering ? 1 : 0.6,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="flex items-center justify-center rounded-full border"
        >
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "oklch(0.45 0.13 162)" }}
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
