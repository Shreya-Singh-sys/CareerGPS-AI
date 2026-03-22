import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, BarChart3, Target, Map, Briefcase, Rocket, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";

const steps = [
  {
    step: 1,
    titleKey: "Upload Resume or Enter Skills",
    descKey: "Start by uploading your resume or manually entering your skills and proficiency levels.",
    icon: FileText,
  },
  {
    step: 2,
    titleKey: "View Skill Analysis",
    descKey: "Our AI analyzes your skills and maps them against current industry requirements.",
    icon: BarChart3,
  },
  {
    step: 3,
    titleKey: "Understand Skill Gaps",
    descKey: "Identify where your skills fall short compared to your target roles and industry benchmarks.",
    icon: Target,
  },
  {
    step: 4,
    titleKey: "Follow the Learning Roadmap",
    descKey: "Get a personalized learning path with recommended courses, projects, and certifications.",
    icon: Map,
  },
  {
    step: 5,
    titleKey: "Explore Job Matches",
    descKey: "Discover job opportunities that align with your current and developing skill set.",
    icon: Briefcase,
  },
  {
    step: 6,
    titleKey: "Use Career Simulator",
    descKey: "Simulate different career paths and see how skill changes impact your opportunities.",
    icon: Rocket,
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const Tutorial = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div {...fadeUp()}>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          {t("Getting")} <span className="text-gradient-primary">{t("Started")}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("Follow these steps to get the most out of CareerGPS AI")}
        </p>
      </motion.div>

      <div className="relative space-y-6">
        {/* Vertical timeline line */}
        <div className="absolute left-[27px] top-4 bottom-24 w-0.5 bg-border hidden sm:block" />

        {steps.map((item, i) => (
          <motion.div key={item.step} {...fadeUp(0.1 + i * 0.08)}>
            <Card className="border-0 shadow-lg bg-gradient-card overflow-hidden relative">
              <CardContent className="p-6 flex items-start gap-5">
                <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-[54px] h-[54px] rounded-2xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary mb-1">
                    {t("Step")} {item.step}
                  </p>
                  <h3 className="text-lg font-display font-semibold text-foreground">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(item.descKey)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp(0.6)} className="flex justify-center pt-4">
        <Button
          variant="hero"
          size="xl"
          onClick={() => navigate("/resume")}
          className="group"
        >
          {t("Start Resume Analysis")}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Tutorial;
