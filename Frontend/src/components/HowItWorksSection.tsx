import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { Upload, Brain, Route, Briefcase, FileText, Zap, Map, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const steps = [
  {
    icon: Upload,
    step: "01",
    titleKey: "Upload & Input",
    descKey: "hiw_desc_1",
    visual: {
      items: ["Resume.pdf", "Skills Test", "Interests"],
      icons: [FileText, CheckCircle, Zap],
    },
  },
  {
    icon: Brain,
    step: "02",
    titleKey: "AI Analysis",
    descKey: "hiw_desc_2",
    visual: {
      bars: [
        { label: "Python", value: 85 },
        { label: "SQL", value: 60 },
        { label: "ML", value: 35 },
      ],
    },
  },
  {
    icon: Route,
    step: "03",
    titleKey: "Get Your Roadmap",
    descKey: "hiw_desc_3",
    visual: {
      timeline: ["Month 1-2", "Month 3-4", "Month 5-6"],
    },
  },
  {
    icon: Briefcase,
    step: "04",
    titleKey: "Become Job-Ready",
    descKey: "hiw_desc_4",
    visual: {
      score: 87,
    },
  },
];

const StepCard = ({ step, index }: { step: (typeof steps)[0]; index: number }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [4, -4]);
  const rotateY = useTransform(mouseX, [-100, 100], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="group relative cursor-pointer text-center"
    >
      {/* Expanded card on hover */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-transparent bg-card p-6 transition-colors duration-300 group-hover:border-primary/20 group-hover:shadow-[0_0_30px_hsl(217_91%_60%/0.1)]"
        animate={isHovered ? { y: -4 } : { y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow background */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/5"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Icon */}
        <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-primary"
            animate={isHovered ? { opacity: 0.2, scale: 1.2 } : { opacity: 0.1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-card shadow-md"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          >
            <motion.div animate={isHovered ? { rotate: [0, -15, 15, 0] } : {}} transition={{ duration: 0.5 }}>
              <step.icon className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
          <motion.span
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground"
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
          >
            {index + 1}
          </motion.span>
          {/* Pulse rings */}
          {isHovered && (
            <>
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary/20"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
            </>
          )}
        </div>

        <h3 className="relative font-display text-lg font-semibold text-foreground">
          {t(step.titleKey)}
        </h3>
        <p className="relative mt-2 text-sm text-muted-foreground">
          {t(step.descKey)}
        </p>

        {/* Visual panel that appears on hover */}
        <motion.div
          className="relative mt-4 overflow-hidden rounded-xl border border-primary/10 bg-muted/50"
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={isHovered ? { height: "auto", opacity: 1, marginTop: 16 } : { height: 0, opacity: 0, marginTop: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="p-4">
            {/* Step 1: File upload visual */}
            {index === 0 && (
              <div className="space-y-2">
                {step.visual.items?.map((item, i) => {
                  const translatedItem = t(item);
                  return (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isHovered ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.12 }}
                      className="flex items-center gap-2 rounded-lg bg-card p-2 text-left text-xs"
                    >
                      {step.visual.icons && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                          {(() => {
                            const Icon = step.visual.icons[i];
                            return <Icon className="h-3.5 w-3.5 text-primary" />;
                          })()}
                        </div>
                      )}
                      <span className="font-medium text-foreground">{translatedItem}</span>
                      <motion.div
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-success"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Step 2: Skill bars */}
            {index === 1 && (
              <div className="space-y-3">
                {step.visual.bars?.map((bar, i) => (
                  <div key={bar.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{bar.label}</span>
                      <span className="text-muted-foreground">{bar.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-border">
                      <motion.div
                        className={`h-full rounded-full ${
                          bar.value >= 70 ? "bg-success" : bar.value >= 50 ? "bg-warning" : "bg-destructive/70"
                        }`}
                        initial={{ width: 0 }}
                        animate={isHovered ? { width: `${bar.value}%` } : { width: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Timeline */}
            {index === 2 && (
              <div className="flex items-center justify-between gap-1">
                {step.visual.timeline?.map((month, i) => (
                  <motion.div
                    key={month}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isHovered ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-1 flex-col items-center"
                  >
                    <motion.div
                      className={`mb-1 h-2 w-2 rounded-full ${
                        i === 0 ? "bg-success" : i === 1 ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                      animate={i === 1 && isHovered ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <div className="h-0.5 w-full bg-gradient-to-r from-success via-primary to-muted-foreground/20" />
                    <span className="mt-1 text-[10px] text-muted-foreground">{t(month)}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Step 4: Score gauge */}
            {index === 3 && (
              <div className="flex flex-col items-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="hsl(var(--success))"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={175.9}
                      initial={{ strokeDashoffset: 175.9 }}
                      animate={isHovered ? { strokeDashoffset: 175.9 * (1 - (step.visual.score ?? 0) / 100) } : { strokeDashoffset: 175.9 }}
                      transition={{ duration: 1.2 }}
                    />
                  </svg>
                  <motion.span
                    className="absolute font-display text-lg font-bold text-success"
                    initial={{ opacity: 0 }}
                    animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                  >
                    {step.visual.score}%
                  </motion.span>
                </div>
                <span className="mt-1 text-[10px] font-medium text-muted-foreground">{t("Job Ready")}</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const { t } = useTranslation();
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 bg-muted/30" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            {t("How It Works")}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            {t("Your Career Journey")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("Four simple steps from skill confusion to structured career direction.")}
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          {/* Connection line */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 md:block" />

          {steps.map((step, index) => (
            <StepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
