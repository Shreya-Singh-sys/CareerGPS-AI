import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListChecks, Plus, X, ChevronDown, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";

const AVAILABLE_SKILLS = [
  "Python", "SQL", "Data Analysis", "Machine Learning",
  "Excel", "Cloud Computing", "JavaScript", "React",
  "Tableau", "Power BI", "Statistics", "Deep Learning",
  "NLP", "Docker", "AWS", "Git",
];

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
type Proficiency = typeof PROFICIENCY_LEVELS[number];

interface SelectedSkill {
  name: string;
  proficiency: Proficiency;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

interface ManualSkillEntryProps {
  onGenerate: (skills: SelectedSkill[]) => void;
}

const ManualSkillEntry = ({ onGenerate }: ManualSkillEntryProps) => {
  const { t } = useTranslation();
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const availableToAdd = AVAILABLE_SKILLS.filter(
    (s) => !selectedSkills.some((sel) => sel.name === s)
  );

  const addSkill = (name: string) => {
    setSelectedSkills((prev) => [...prev, { name, proficiency: "Intermediate" }]);
    setDropdownOpen(false);
  };

  const removeSkill = (name: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.name !== name));
  };

  const updateProficiency = (name: string, proficiency: Proficiency) => {
    setSelectedSkills((prev) =>
      prev.map((s) => (s.name === name ? { ...s, proficiency } : s))
    );
  };

  const handleGenerate = () => {
    if (selectedSkills.length === 0) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      onGenerate(selectedSkills);
    }, 2500);
  };

  const proficiencyColor = (p: Proficiency) => {
    switch (p) {
      case "Beginner": return "bg-muted text-muted-foreground";
      case "Intermediate": return "bg-primary/10 text-primary";
      case "Advanced": return "bg-success/10 text-success";
      case "Expert": return "bg-warning/10 text-warning";
    }
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-gradient-card overflow-hidden relative flex flex-col">
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-16 -translate-x-16" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <ListChecks className="h-5 w-5 text-accent" />
          </div>
          {t("Manual Skill Entry")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("For users who do not yet have a resume, manually select your skills and proficiency.")}
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 relative z-10">
        {/* Skill dropdown */}
        <div ref={dropdownRef} className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={availableToAdd.length === 0}
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {availableToAdd.length > 0 ? t("Add a skill") : t("All skills added")}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </Button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto"
              >
                {availableToAdd.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    {t(skill)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected skills list */}
        <div className="flex-1 space-y-2 min-h-[120px]">
          <AnimatePresence>
            {selectedSkills.map((skill) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/20 transition-all duration-300"
              >
                <span className="text-sm font-medium text-foreground flex-1">{t(skill.name)}</span>
                <div className="flex gap-1">
                  {PROFICIENCY_LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => updateProficiency(skill.name, level)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${
                        skill.proficiency === level
                          ? proficiencyColor(level)
                          : "bg-transparent text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {t(level)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => removeSkill(skill.name)}
                  className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {selectedSkills.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ListChecks className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">{t("Select skills from the dropdown above")}</p>
            </div>
          )}
        </div>

        {/* Selected count badge */}
        {selectedSkills.length > 0 && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {selectedSkills.length} {t("skills selected")}
            </Badge>
          </div>
        )}

        {/* Generate button */}
        <Button
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 group"
          disabled={selectedSkills.length === 0 || generating}
          onClick={handleGenerate}
        >
          {generating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              {t("Generating...")}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {t("Generate Skill Profile")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManualSkillEntry;
