import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import {
  Brain,
  Route,
  BarChart3,
  FileSearch,
  MessageSquare,
  Compass,
  Gauge,
  BookOpen,
  Map,
  ArrowRight,
  Accessibility,
} from "lucide-react";

const features = [
  { icon: Brain, titleKey: "AI Skill Gap Analyzer", descKey: "feat_desc_1", color: "primary", statKey: "15K+ analyses" },
  { icon: Route, titleKey: "Personalized Learning Roadmap", descKey: "feat_desc_2", color: "accent", statKey: "6-month paths" },
  { icon: BarChart3, titleKey: "Live Job Demand Analyzer", descKey: "feat_desc_3", color: "info", statKey: "Live data" },
  { icon: FileSearch, titleKey: "Resume + ATS Analyzer", descKey: "feat_desc_4", color: "warning", statKey: "ATS optimized" },
  { icon: MessageSquare, titleKey: "AI Mock Interview Coach", descKey: "feat_desc_5", color: "success", statKey: "500+ questions" },
  { icon: Compass, titleKey: "Career Path Predictor", descKey: "feat_desc_6", color: "primary", statKey: "AI-powered" },
  { icon: Gauge, titleKey: "Job Readiness Score", descKey: "feat_desc_7", color: "accent", statKey: "Real-time score" },
  { icon: BookOpen, titleKey: "Learning Resource Mapper", descKey: "feat_desc_8", color: "info", statKey: "10K+ resources" },
  { icon: Map, titleKey: "Career GPS Engine", descKey: "feat_desc_9", color: "warning", statKey: "⭐ USP" },
  { icon: Accessibility, titleKey: "Accessible AI Career Guidance", descKey: "feat_desc_10", color: "success", statKey: "Inclusive" },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string; gradient: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", glow: "group-hover:shadow-[0_0_30px_hsl(217_91%_60%/0.15)]", gradient: "from-primary/20 to-primary/5" },
  accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20", glow: "group-hover:shadow-[0_0_30px_hsl(172_66%_50%/0.15)]", gradient: "from-accent/20 to-accent/5" },
  info: { bg: "bg-info/10", text: "text-info", border: "border-info/20", glow: "group-hover:shadow-[0_0_30px_hsl(199_89%_48%/0.15)]", gradient: "from-info/20 to-info/5" },
  warning: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20", glow: "group-hover:shadow-[0_0_30px_hsl(38_92%_50%/0.15)]", gradient: "from-warning/20 to-warning/5" },
  success: { bg: "bg-success/10", text: "text-success", border: "border-success/20", glow: "group-hover:shadow-[0_0_30px_hsl(142_71%_45%/0.15)]", gradient: "from-success/20 to-success/5" },
};

const FeatureCard = ({ feature, index }: { feature: (typeof features)[0]; index: number }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const colors = colorMap[feature.color];
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [5, -5]);
  const rotateY = useTransform(mouseX, [-150, 150], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); setIsHovered(false); };

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, type: "spring", stiffness: 100 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border ${colors.border} bg-card p-6 transition-all duration-500 hover:-translate-y-2 ${colors.glow}`}>
      <motion.div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
      <motion.div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${colors.bg} blur-2xl`}
        animate={isHovered ? { scale: 1.8, opacity: 0.6 } : { scale: 1, opacity: 0.2 }} transition={{ duration: 0.5 }} />
      <motion.div className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, hsl(var(--${feature.color}) / 0.5), transparent)` }}
        initial={{ opacity: 0, x: "-100%" }} animate={isHovered ? { opacity: 1, x: "100%" } : { opacity: 0, x: "-100%" }}
        transition={{ duration: 0.8 }} />
      <div className="relative z-10">
        <div className="relative mb-5">
          <motion.div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} transition-all duration-300`}
            whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
            <feature.icon className={`h-7 w-7 ${colors.text}`} />
          </motion.div>
          <motion.div className={`absolute inset-0 h-14 w-14 rounded-2xl border-2 ${colors.border}`}
            animate={isHovered ? { scale: [1, 1.3, 1.3], opacity: [0.5, 0, 0] } : {}}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }} />
        </div>
        <motion.span className={`mb-3 inline-block rounded-full ${colors.bg} px-3 py-1 text-xs font-semibold ${colors.text}`}
          initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: index * 0.08 + 0.3 }}>
          {t(feature.statKey)}
        </motion.span>
        <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-gradient-primary">
          {t(feature.titleKey)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t(feature.descKey)}
        </p>
        <motion.div className={`mt-4 flex items-center gap-1 text-sm font-medium ${colors.text}`}
          initial={{ opacity: 0, x: -10 }} animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
          {t("Explore")}
          <motion.div animate={isHovered ? { x: [0, 4, 0] } : {}} transition={{ duration: 0.8, repeat: Infinity }}>
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-3 right-3 flex gap-1 opacity-20 transition-opacity group-hover:opacity-40">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-foreground"
            animate={isHovered ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.6, delay: i * 0.15 }} />
        ))}
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const { t } = useTranslation();
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <motion.span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            whileInView={{ scale: [0.9, 1] }} viewport={{ once: true }}>
            {t("Core Features")}
          </motion.span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground md:text-5xl">{t("Intelligence Modules")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("features_subtitle")}</p>
        </motion.div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.titleKey} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;