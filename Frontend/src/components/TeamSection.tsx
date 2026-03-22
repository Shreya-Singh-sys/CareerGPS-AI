import { motion } from "framer-motion";
import { Compass, Brain, Code, Lightbulb } from "lucide-react";

const team = [
  {
    name: "Vishwa Prakash",
    role: "Team Leader & Product Strategist",
    description: "Defines product vision and career guidance framework. Leads research on employability gaps.",
    icon: Compass,
  },
  {
    name: "Shreya Singh",
    role: "AI/ML & Recommendation Engine Lead",
    description: "Develops skill-gap detection models and job matching logic. Works on LLM prompts.",
    icon: Brain,
  },
  {
    name: "Bhargavi Bhadani",
    role: "Backend & Data Pipeline Lead",
    description: "Architecting backend systems, data processing pipelines, and API integrations.",
    icon: Lightbulb,
  },
  {
    name: "Kshitij Jha",
    role: "Frontend UX & User Experience Lead",
    description: "Designs career dashboard and user journey. Ensures mobile-first, student-friendly experience.",
    icon: Code,
  },
];

const TeamSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full bg-warning/10 px-4 py-1.5 text-sm font-medium text-warning">
            Our Team
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            The Minds Behind CareerGPS
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
                <member.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
