import { Volume2, VolumeX } from "lucide-react";
import { useNarrator } from "@/hooks/use-narrator";

const NavbarReadPage = () => {
  const { isNarrating, play, stop } = useNarrator();

  return (
    <button
      onClick={isNarrating ? stop : play}
      className={`flex items-center justify-center h-9 w-9 rounded-lg transition-colors ${
        isNarrating
          ? "text-destructive bg-destructive/10 hover:bg-destructive/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
      aria-label={isNarrating ? "Stop reading page" : "Read page aloud"}
    >
      {isNarrating ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
};

export default NavbarReadPage;
