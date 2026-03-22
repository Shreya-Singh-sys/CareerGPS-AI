import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, MapPin, IndianRupee, Briefcase, ChevronRight, Star } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

  const skillData = [
    { name: "Python", level: 85, demand: t("High"), trending: true },
    { name: "SQL", level: 70, demand: t("High"), trending: true },
    { name: t("Machine Learning"), level: 45, demand: t("Very High"), trending: true },
    { name: t("Data Visualization"), level: 60, demand: t("Medium"), trending: false },
    { name: t("Statistics"), level: 55, demand: t("High"), trending: false },
    { name: "Deep Learning", level: 25, demand: t("Very High"), trending: true },
  ];

  const jobMatches = [
    { role: t("Data Analyst"), match: 78, salary: "₹6-10 LPA", location: t("Bangalore") + ", " + t("Delhi"), openings: 2340 },
    { role: t("ML Engineer"), match: 52, salary: "₹12-20 LPA", location: t("Bangalore") + ", " + t("Hyderabad"), openings: 1120 },
    { role: t("Business Analyst"), match: 85, salary: "₹5-9 LPA", location: t("Mumbai") + ", " + t("Pune"), openings: 3200 },
    { role: t("Data Scientist"), match: 45, salary: "₹10-18 LPA", location: t("Bangalore") + ", Remote", openings: 980 },
  ];

  const roadmapSteps = [
    { month: t("Month 1-2"), tasks: [t("Complete SQL Mastery"), t("Python for Data Science"), t("Statistics Fundamentals")], status: "done" },
    { month: t("Month 3-4"), tasks: [t("Machine Learning Basics"), t("Scikit-Learn Projects"), t("Kaggle Competitions")], status: "current" },
    { month: t("Month 5-6"), tasks: [t("Deep Learning Intro"), t("Portfolio Projects"), t("Interview Prep")], status: "upcoming" },
  ];

  const tabs = [t("Skill Analysis"), t("Job Matches"), t("Career Roadmap"), t("Market Trends")];

  return (
    <section id="dashboard" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <span className="inline-block rounded-full bg-info/10 px-4 py-1.5 text-sm font-medium text-info">
            {t("Live Dashboard")}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            {t("Your Career Command Center")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("Everything you need to navigate your career, in one intelligent dashboard.")}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }} className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="flex border-b border-border bg-muted/30">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${activeTab === i ? "border-b-2 border-primary bg-card text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex-1 rounded-xl border border-border p-6">
                    <div className="text-sm text-muted-foreground">{t("Job Readiness Score")}</div>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="font-display text-5xl font-bold text-gradient-primary">62%</span>
                      <span className="mb-2 text-sm text-success">{t("+8% this month")}</span>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-muted">
                      <motion.div initial={{ width: 0 }} animate={{ width: "62%" }} transition={{ duration: 1.2, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-primary" />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {t("For")} <span className="font-medium text-foreground">{t("Data Analyst")}</span> {t("roles")}
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl border border-border p-6">
                    <div className="text-sm text-muted-foreground">{t("Skills Overview")}</div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="font-display text-2xl font-bold text-success">8</div>
                        <div className="text-xs text-muted-foreground">{t("Matched")}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-display text-2xl font-bold text-warning">3</div>
                        <div className="text-xs text-muted-foreground">{t("In Progress")}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-display text-2xl font-bold text-destructive">4</div>
                        <div className="text-xs text-muted-foreground">{t("Missing")}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {skillData.map((skill, i) => (
                    <div key={skill.name} className="flex items-center gap-4">
                      <span className="w-36 text-sm font-medium text-foreground">{skill.name}</span>
                      <div className="flex-1">
                        <div className="h-2.5 rounded-full bg-muted">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`h-full rounded-full ${skill.level >= 70 ? "bg-success" : skill.level >= 50 ? "bg-warning" : "bg-destructive/70"}`} />
                        </div>
                      </div>
                      <span className="w-10 text-right text-sm font-medium text-foreground">{skill.level}%</span>
                      {skill.trending && <TrendingUp className="h-4 w-4 text-success" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {jobMatches.map((job, i) => (
                  <motion.div key={job.role} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="group flex items-center justify-between rounded-xl border border-border p-5 transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-foreground">{job.role}</h4>
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{job.salary}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${job.match >= 75 ? "text-success" : job.match >= 50 ? "text-warning" : "text-destructive"}`}>
                          {job.match}% {t("Match")}
                        </div>
                        <div className="text-xs text-muted-foreground">{job.openings.toLocaleString()} {t("openings")}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="text-center">
                  <h3 className="font-display text-lg font-semibold text-foreground">{t("Your 6-Month Data Analyst Roadmap")}</h3>
                  <p className="text-sm text-muted-foreground">{t("Personalized learning path based on your skill gaps")}</p>
                </div>
                <div className="relative space-y-6">
                  <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-border md:left-8" />
                  {roadmapSteps.map((step, i) => (
                    <motion.div key={step.month} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                      className="relative flex gap-4 pl-4 md:gap-6 md:pl-6">
                      <div className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full ${
                        step.status === "done" ? "bg-success" : step.status === "current" ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/30"}`}>
                        {step.status === "done" && <Star className="h-3 w-3 text-success-foreground" />}
                      </div>
                      <div className={`flex-1 rounded-xl border p-5 ${step.status === "current" ? "border-primary/30 bg-primary/5" : "border-border"}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-foreground">{step.month}</span>
                          {step.status === "current" && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{t("Current")}</span>
                          )}
                        </div>
                        <ul className="mt-3 space-y-2">
                          {step.tasks.map((task) => (
                            <li key={task} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className={`h-1.5 w-1.5 rounded-full ${step.status === "done" ? "bg-success" : "bg-primary"}`} />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: t("Data Analyst"), trend: "+23%", city: t("Bangalore") },
                    { label: t("Full Stack Dev"), trend: "+18%", city: "Remote" },
                    { label: t("ML Engineer"), trend: "+35%", city: t("Hyderabad") },
                    { label: t("DevOps"), trend: "+15%", city: t("Pune") },
                  ].map((item, i) => (
                    <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="rounded-xl border border-border p-4">
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-lg font-bold text-success">{item.trend}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {t("Top:")} {item.city}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="rounded-xl border border-border p-6">
                  <h4 className="mb-4 font-display font-semibold text-foreground">{t("Skill Demand Trends")}</h4>
                  <div className="flex items-end gap-3">
                    {[
                      { skill: "Python", value: 92 }, { skill: "SQL", value: 88 }, { skill: "React", value: 78 },
                      { skill: "AWS", value: 72 }, { skill: "ML", value: 85 }, { skill: "Docker", value: 65 },
                      { skill: "TypeScript", value: 74 }, { skill: "Power BI", value: 58 },
                    ].map((item, i) => (
                      <div key={item.skill} className="flex flex-1 flex-col items-center gap-2">
                        <motion.div initial={{ height: 0 }} whileInView={{ height: `${item.value * 1.5}px` }} viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.05 }} className="w-full rounded-t-md bg-gradient-primary" />
                        <span className="text-[10px] text-muted-foreground">{item.skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;