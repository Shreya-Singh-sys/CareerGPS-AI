import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  UserCircle, FileText, Award, QrCode, Clock, Download,
  CheckCircle2, Star, MapPin, Phone, Mail, ArrowRight,
  Shield, Briefcase, GraduationCap, Wrench, Target
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useUserData } from "@/hooks/use-user-data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const Profile = () => {
  const { t } = useTranslation();
  const { userData } = useUserData();

  const badges = [
    { name: t("Basic Electronics"), icon: Wrench, verified: true, date: t("Jan 2025") },
    { name: t("Solar Fundamentals"), icon: Star, verified: true, date: t("Feb 2025") },
    { name: t("Safety Protocols"), icon: Shield, verified: false, date: t("In Progress") },
    { name: t("Multimeter Expert"), icon: CheckCircle2, verified: true, date: t("Dec 2024") },
    { name: t("Wiring Specialist"), icon: Wrench, verified: true, date: t("Nov 2024") },
    { name: t("First Aid Certified"), icon: Shield, verified: true, date: t("Oct 2024") },
  ];

  const timeline = [
    { year: "2025", title: t("Solar Energy Training"), org: t("CareerGPS Platform"), type: "training", description: t("Completed solar fundamentals and panel installation modules") },
    { year: "2024", title: t("Electrician Helper"), org: t("Metro Electric Services"), type: "work", description: t("Assisted with residential and commercial wiring projects") },
    { year: "2023", title: t("ITI Diploma - Electrician"), org: t("Govt. ITI Mumbai"), type: "education", description: t("2-year diploma in electrical trade with distinction") },
    { year: "2022", title: t("Construction Worker"), org: t("BuildWell Constructions"), type: "work", description: t("General construction with focus on electrical fittings") },
  ];

  const completedSteps = userData.roadmapSteps.filter(s => s.status === "completed").length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div {...fadeUp()}>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          {t("Digital")} <span className="text-gradient-primary">{t("Profile")}</span>
        </h1>
        <p className="text-muted-foreground mt-1">{t("Your verified identity and career portfolio")}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...fadeUp(0.1)} className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-card overflow-hidden">
            <div className="h-20 bg-gradient-primary relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-full bg-card border-4 border-card flex items-center justify-center shadow-lg">
                  <UserCircle className="h-14 w-14 text-primary" />
                </div>
              </div>
            </div>
            <CardContent className="pt-14 pb-6 text-center">
              <h3 className="text-xl font-display font-bold text-foreground">{userData.name}</h3>
              <p className="text-sm text-primary font-medium mt-0.5">{t("Aspiring")} {userData.targetRole}</p>
              <div className="flex flex-col gap-1.5 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center justify-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {userData.location}</span>
                <span className="flex items-center justify-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {userData.phone}</span>
                <span className="flex items-center justify-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {userData.email}</span>
              </div>
              <div className="flex gap-2 mt-5 justify-center">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  {t("Edit Profile")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Career Readiness */}
          <Card className="border-0 shadow-lg bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t("Career Readiness")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                    <motion.circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - userData.careerReadiness / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-display font-bold text-foreground">{userData.careerReadiness}%</span>
                    <span className="text-[10px] text-muted-foreground">{t("Job Ready")}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{t("Target:")}: <span className="font-semibold text-foreground">{userData.targetRole}</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("ATS Score")}: <span className="font-semibold text-foreground">{userData.atsScore}%</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                {t("QR Code Profile")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-40 h-40 bg-foreground rounded-xl p-3 flex items-center justify-center"
              >
                <div className="w-full h-full bg-card rounded-lg grid grid-cols-7 grid-rows-7 gap-0.5 p-2">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
              <p className="text-xs text-muted-foreground text-center">
                {t("Show this QR to employers for instant profile verification")}
              </p>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                {t("Download QR")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div {...fadeUp(0.2)}>
            <Card className="border-0 shadow-lg bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  {t("AI Resume Builder")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t("Auto-generated from your skills and training")}</p>
              </CardHeader>
              <CardContent>
                <div className="p-5 rounded-xl border-2 border-dashed border-border bg-muted/30 text-center space-y-3">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FileText className="h-12 w-12 text-primary/40 mx-auto" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("Your AI-Generated Resume is Ready")}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("Based on")} {userData.skills.filter(s => s.verified).length} {t("verified skills and")} {timeline.filter(i => i.type === "work").length} {t("work experiences")}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button className="bg-gradient-primary text-primary-foreground gap-1.5">
                      <Download className="h-4 w-4" />
                      {t("Download PDF")}
                    </Button>
                    <Button variant="outline" className="gap-1.5">
                      {t("Preview Resume")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills from context */}
          <motion.div {...fadeUp(0.25)}>
            <Card className="border-0 shadow-lg bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  {t("Skills")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {userData.skills.length} {t("skills")} · {userData.skills.filter(s => s.verified).length} {t("verified")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userData.skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {skill.verified ? (
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        ) : (
                          <Star className="h-4 w-4 text-warning shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">{t(skill.level)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, delay: 0.4 + i * 0.06 }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-7 text-right">{skill.proficiency}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {userData.missingSkills.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                    <p className="text-xs font-semibold text-foreground mb-2">{t("Missing Skills for")} {userData.targetRole}:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {userData.missingSkills.map((skill) => (
                        <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Roadmap Progress */}
          <motion.div {...fadeUp(0.3)}>
            <Card className="border-0 shadow-lg bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Briefcase className="h-5 w-5 text-info" />
                  </div>
                  {t("Learning Roadmap")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("Progress")}: {userData.roadmapProgress}% · {completedSteps} {t("of")} {userData.roadmapSteps.length} {t("completed")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Progress value={userData.roadmapProgress} className="h-2" />
                </div>
                <div className="space-y-3">
                  {userData.roadmapSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        step.status === "completed"
                          ? "bg-success text-success-foreground"
                          : step.status === "current"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {step.status === "completed" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <span className="text-xs font-bold">{step.step}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${step.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>
                          {t(step.title)}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        step.status === "completed" ? "bg-success/10 text-success" :
                        step.status === "current" ? "bg-primary/10 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {step.status === "completed" ? t("Done") : step.status === "current" ? t("In Progress") : t("Locked")}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Experience Timeline - kept as-is */}
          <motion.div {...fadeUp(0.4)}>
            <Card className="border-0 shadow-lg bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Clock className="h-5 w-5 text-info" />
                  </div>
                  {t("Experience Timeline")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {timeline.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex gap-4 relative"
                      >
                        <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          item.type === "training"
                            ? "bg-accent text-accent-foreground"
                            : item.type === "education"
                            ? "bg-info text-info-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}>
                          {item.type === "training" ? <GraduationCap className="h-4 w-4" /> :
                           item.type === "education" ? <GraduationCap className="h-4 w-4" /> :
                           <Briefcase className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.year}</span>
                            <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.org}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
