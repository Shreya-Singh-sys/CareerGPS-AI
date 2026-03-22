import { Settings2, Play } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNarrator } from "@/hooks/use-narrator";

const langOptions = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "ta", label: "Tamil" },
  { code: "bn", label: "Bangla" },
  { code: "ur", label: "Urdu" },
];

const NarratorSettings = () => {
  const {
    speed, pitch, volume, voiceName, narratorLang, availableVoices,
    setSpeed, setPitch, setVolume, setVoiceName, setNarratorLang, testVoice,
  } = useNarrator();

  const filteredVoices = availableVoices.filter((v) =>
    v.lang.startsWith(narratorLang === "en" ? "en" : narratorLang)
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Narrator settings"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-foreground">Narrator Settings</h4>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Language</label>
            <Select value={narratorLang} onValueChange={setNarratorLang}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {langOptions.map((l) => (
                  <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredVoices.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Voice</label>
              <Select value={voiceName} onValueChange={setVoiceName}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {filteredVoices.map((v) => (
                    <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-muted-foreground">Speed</label>
              <span className="text-xs text-foreground">{speed.toFixed(1)}x</span>
            </div>
            <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={0.5} max={2} step={0.1} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-muted-foreground">Pitch</label>
              <span className="text-xs text-foreground">{pitch.toFixed(1)}</span>
            </div>
            <Slider value={[pitch]} onValueChange={([v]) => setPitch(v)} min={0.5} max={2} step={0.1} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-muted-foreground">Volume</label>
              <span className="text-xs text-foreground">{Math.round(volume * 100)}%</span>
            </div>
            <Slider value={[volume]} onValueChange={([v]) => setVolume(v)} min={0} max={1} step={0.1} />
          </div>

          <Button variant="outline" size="sm" className="w-full gap-2" onClick={testVoice} aria-label="Test narrator voice">
            <Play className="h-3 w-3" />
            Test Voice
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NarratorSettings;
