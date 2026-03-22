import { motion } from "framer-motion";
import { Shield, Users, Wrench, Globe, Award, Building } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const impactItems = [
  { icon: Users, titleKey: "Blue-Collar & Vocational Support", descKey: "impact_desc_1" },
  { icon: Building, titleKey: "Government Dashboard", descKey: "impact_desc_2" },
  { icon: Globe, titleKey: "Tier-2/3 City Intelligence", descKey: "impact_desc_3" },
  { icon: Award, titleKey: "Skill India Alignment", descKey: "impact_desc_4" },
  { icon: Shield, titleKey: "Data Privacy & Ethics", descKey: "impact_desc_5" },
  { icon: Wrench, titleKey: "Skill-to-Job Direct Mapping", descKey: "impact_desc_6" },
];

const ImpactSection = () => {
  const { t } = useTranslation();
  return (
    <section id="impact" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="container relative mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <span className="inline-block rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/80">
            {t("National Impact")}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            {t("Transforming India's Workforce")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/60">
            {t("Beyond a tool — CareerGPS AI is a movement to bridge the skill–employment gap across India.")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {impactItems.map((item, index) => (
            <motion.div key={item.titleKey} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: index * 0.1 }}
              className="group rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm transition-all hover:bg-primary-foreground/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
                <item.icon className="h-6 w-6 text-primary-foreground/80" />
              </div>
              <h3 className="font-display text-lg font-semibold text-primary-foreground">{t(item.titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/60">{t(item.descKey)}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-16 text-center">
          <blockquote className="font-display text-2xl font-medium italic text-primary-foreground/80 md:text-3xl">
            "{t("Clarity replaces confusion in career decisions.")}"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;