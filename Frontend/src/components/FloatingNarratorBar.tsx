import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNarrator } from "@/hooks/use-narrator";

const FloatingNarratorBar = () => {
  const { isNarrating, isPaused, speed, pause, resume, stop } = useNarrator();

  return (
    <AnimatePresence>
      {isNarrating && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 rounded-2xl border border-border bg-card/95 backdrop-blur-xl px-5 py-3 shadow-lg"
          role="status"
          aria-live="polite"
          aria-label="Narrator controls"
        >
          <Volume2 className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            Reading Page Content
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={isPaused ? resume : pause}
              aria-label={isPaused ? "Resume narration" : "Pause narration"}
              className="h-8 px-3"
            >
              {isPaused ? <Play className="h-3.5 w-3.5 mr-1" /> : <Pause className="h-3.5 w-3.5 mr-1" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={stop}
              aria-label="Stop narration"
              className="h-8 px-3"
            >
              <Square className="h-3.5 w-3.5 mr-1" />
              Stop
            </Button>
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            Speed: {speed}x
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNarratorBar;
