import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Rocket, Target, Clock, Sparkles, CheckCircle2, ArrowRight,
  BookOpen, Briefcase, Award, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

interface TimelineStep {
  month: string;
  title: string;
  description: string;
  type: "learn" | "build" | "apply" | "milestone";
  skills: string[];
}

const generateTimeline = (goal: string, skills: string, months: number): TimelineStep[] => {
  const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const totalSteps = Math.min(months, 8);
  const templates: TimelineStep[] = [
    { month: "Month 1", title: "Foundation Building", description: `Master core concepts for ${goal}. Assess current skill gaps and create a structured study plan.`, type: "learn", skills: skillList.slice(0, 2) },
    { month: "Month 2", title: "Skill Deep Dive", description: "Focus on the most critical technical skills with hands-on practice and projects.", type: "learn", skills: skillList.slice(0, 3) },
    { month: `Month ${Math.ceil(totalSteps * 0.35)}`, title: "First Portfolio Project", description: `Build a real-world project demonstrating your ${goal} capabilities.`, type: "build", skills: skillList.slice(1, 4) },
    { month: `Month ${Math.ceil(totalSteps * 0.5)}`, title: "Advanced Techniques", description: "Level up with advanced concepts, best practices, and industry patterns.", type: "learn", skills: skillList.slice(2) },
    { month: `Month ${Math.ceil(totalSteps * 0.6)}`, title: "Capstone Project", description: "Create an end-to-end project that showcases all learned skills.", type: "build", skills: skillList },
    { month: `Month ${Math.ceil(totalSteps * 0.75)}`, title: "Resume & Portfolio Polish", description: "Optimize resume for ATS, build portfolio site, prepare interview answers.", type: "milestone", skills: [] },
    { month: `Month ${Math.ceil(totalSteps * 0.85)}`, title: "Interview Prep & Networking", description: "Practice mock interviews, attend meetups, connect with industry professionals.", type: "apply", skills: [] },
    { month: `Month ${totalSteps}`, title: `Land ${goal} Role`, description: "Apply strategically, negotiate offers, and transition into your new career!", type: "milestone", skills: [] },
  ];
  return templates.slice(0, totalSteps);
};

const typeConfig = {
  learn: { icon: BookOpen, color: "text-info", bg: "bg-info/10" },
  build: { icon: Briefcase, color: "text-accent", bg: "bg-accent/10" },
  apply: { icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
  milestone: { icon: Award, color: "text-success", bg: "bg-success/10" },
};

const CareerSimulator = () => {
  const [goal, setGoal] = useState("Data Analyst");
  const [skills, setSkills] = useState("Python, SQL, Excel, Power BI, Statistics");
  const [months, setMonths] = useState("6");
  const [timeline, setTimeline] = useState<TimelineStep[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const { t } = useTranslation();

  // const handleGenerate = () => {
  //   setGenerating(true);
  //   setTimeline(null);
  //   setTimeout(() => {
  //     setTimeline(generateTimeline(goal, skills, parseInt(months) || 6));
  //     setGenerating(false);
  //   }, 1500);
  // };
  const handleGenerate = async () => {
    // 1. Resume Analysis se saved skills uthao (Jo humne pichle step mein save kiye the)
    // Agar aapne localStorage ya Context mein save kiya hai:
    if (!goal.trim()) return;

  // LocalStorage se resume wali skills uthao
    const currentSkills = localStorage.getItem("userSkills") || "Not provided";
    setGenerating(true);
    setTimeline(null);

    try {
      const response = await fetch("http://localhost:5000/api/analysis/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goal,
          currentSkills: currentSkills, // Resume se aayi hui skills
          targetSkills: skills,       // Jo user ne input box mein dali hain
          months: months
        }),
      });

      const data = await response.json();
      if (Array.isArray(data)) {
      setTimeline(data);
    } else if (data.roadmap && Array.isArray(data.roadmap)) {
      setTimeline(data.roadmap);
    } else if (data.timeline && Array.isArray(data.timeline)) {
      setTimeline(data.timeline);
    } else {
      // Emergency fallback: Find any array inside the object
      const foundArray = Object.values(data).find(val => Array.isArray(val));
      setTimeline(foundArray || []);
    }
      if (response.ok) {
        setTimeline(data);
      } else {
        console.error("Simulation Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div {...fadeUp()}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">
          {t("Career")} <span className="text-gradient-primary">{t("Simulator")}</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {t("Input your goal, skills, and timeline — get a personalized career roadmap")}
        </p>
      </motion.div>

      {/* Input Card */}
      <motion.div {...fadeUp(0.1)}>
        <Card className="border-0 shadow-lg glass-card overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              {t("Simulation Parameters")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-primary" /> {t("Career Goal")}
                </label>
                <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Data Analyst" className="h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {t("Time Frame (months)")}
                </label>
                <Input value={months} onChange={(e) => setMonths(e.target.value)} type="number" min="2" max="24" className="h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> {t("Skills to Develop (comma-separated)")}
              </label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Python, SQL, Excel" className="h-11" />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating || !goal.trim()}
              className="w-full sm:w-auto bg-gradient-primary text-primary-foreground hover:opacity-90 h-11 px-8"
            >
              {generating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="h-4 w-4 mr-2" />
                </motion.div>
              ) : (
                <Rocket className="h-4 w-4 mr-2" />
              )}
              {generating ? t("Generating...") : t("Simulate Career Path")}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Timeline */}
      <AnimatePresence>
        {timeline && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg glass-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  Your Simulated Path to <span className="text-primary">{goal}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{months} month timeline · {skills.split(",").length} skills to develop</p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <motion.div
                    className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-primary via-accent to-success"
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                  <div className="space-y-1">
                    {timeline.map((step, i) => {
                      const config = typeConfig[step.type] || typeConfig.learn;
                      const Icon = config.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.12 }}
                          className="relative flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{typeof step.month === 'object' ? JSON.stringify(step.month) : step.month}</span>
                              <h4 className="font-semibold text-foreground">{typeof step.title === 'object' ? JSON.stringify(step.title) : step.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{typeof step.description === 'object' ? JSON.stringify(step.description) : step.description}</p>
                            {step.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {step.skills.map((s) => (
                                  <span key={s} className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">{typeof s === 'object' ? JSON.stringify(s) : s}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerSimulator;
