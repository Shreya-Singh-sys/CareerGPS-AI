import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";

const floatingCards = [
  { icon: Sparkles, label: "AI Skill Analysis", delay: 0, x: -60, y: -30 },
  { icon: TrendingUp, label: "Job Demand Live", delay: 0.2, x: 60, y: -50 },
  { icon: Target, label: "Career Roadmap", delay: 0.4, x: 0, y: 40 },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-info/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto flex flex-col items-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
        >
          <Sparkles className="h-4 w-4" />
          {t("AI-Powered Career Intelligence Platform")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl"
        >
          {t("From Skill-Gap to")}{" "}
          <span className="text-gradient-primary">{t("Job-Fit")}</span>
          <br />
          {t("Powered by AI")}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-base font-normal text-muted-foreground tracking-normal leading-normal"
          >
            {t("Works for both skilled professionals and non-resume workers")}
          </motion.p>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          {t("hero_subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
            {t("Analyze My Skills")}
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
          <Button variant="heroOutline" size="xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            {t("See How It Works")}
          </Button>
        </motion.div>

        {/* AI Career Copilot Mention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/5 px-5 py-3"
        >
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{t("AI Career Copilot")}</p>
            <p className="text-xs text-muted-foreground">{t("Ask questions about skills, career paths, job trends, and learning roadmaps.")}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-4"
        >
          <Button variant="outline" size="lg" onClick={() => navigate("/smart-entry")}
            className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all">
            {t("Try Demo")}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-8 md:gap-16"
        >
          {[
            { value: "50K+", labelKey: "Skills Mapped" },
            { value: "12K+", labelKey: "Career Paths" },
            { value: "95%", labelKey: "Job-Fit Accuracy" },
          ].map((stat) => (
            <div key={stat.labelKey} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Floating cards */}
        <div className="relative mt-16 h-[300px] w-full max-w-3xl md:h-[350px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute inset-x-4 top-0 rounded-2xl border border-border bg-card p-6 shadow-lg md:inset-x-16"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-2 text-xs text-muted-foreground">CareerGPS {t("Dashboard")}</span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg bg-muted p-4">
                <div className="text-xs text-muted-foreground">{t("Job Readiness Score")}</div>
                <div className="mt-1 font-display text-2xl font-bold text-foreground">72%</div>
                <div className="mt-2 h-2 rounded-full bg-border">
                  <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ duration: 1.5, delay: 1 }} className="h-full rounded-full bg-gradient-primary" />
                </div>
              </div>
              <div className="flex-1 rounded-lg bg-muted p-4">
                <div className="text-xs text-muted-foreground">{t("Skills Mapped")}</div>
                <div className="mt-1 font-display text-2xl font-bold text-foreground">8/12</div>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 1 + i * 0.05 }}
                      className={`h-6 flex-1 rounded-sm ${i < 8 ? "bg-gradient-primary" : "bg-border"}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {["Python", "SQL", "React", "ML Basics", "Statistics"].map((skill) => (
                <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{skill}</span>
              ))}
            </div>
          </motion.div>

          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + card.delay }}
              className="absolute hidden md:block"
              style={{
                right: i === 1 ? "0" : undefined,
                left: i === 0 ? "0" : i === 2 ? "50%" : undefined,
                bottom: i === 2 ? "0" : "auto",
                top: i !== 2 ? "0" : undefined,
                transform: i === 2 ? "translateX(-50%)" : undefined,
              }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-md"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <card.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{card.label}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
