"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { useSantrivest } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  term,
  size = "md",
  className,
}: {
  term: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const favorites = useSantrivest((s) => s.favorites);
  const toggleFavorite = useSantrivest((s) => s.toggleFavorite);
  const isFavorited = favorites.includes(term);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(term);
  };

  const sizeClasses = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      data-cursor={isFavorited ? "Remove" : "Save"}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? `Remove ${term} from favorites` : `Add ${term} to favorites`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg border transition-all",
        sizeClasses,
        isFavorited
          ? "border-amber-400/40 bg-amber-50 text-amber-600"
          : "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isFavorited ? (
          <motion.span
            key="filled"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <Star className={cn(iconSize, "fill-amber-500 text-amber-500")} />
          </motion.span>
        ) : (
          <motion.span
            key="empty"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Star className={iconSize} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
