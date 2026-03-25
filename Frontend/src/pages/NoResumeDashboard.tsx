// import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Flame, BookOpen,
//   ArrowRight, Star, Clock, CheckCircle2, Sparkles,
//   Target, Briefcase, Brain, FileText, BarChart3,
//   ChevronRight, Award, AlertCircle
// } from "lucide-react";
// import { useState, useEffect, useRef, useCallback, type MouseEvent as ReactMouseEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
//   ResponsiveContainer
// } from "recharts";
// import ThemeToggle from "@/components/ThemeToggle";
// import { useTranslation } from "@/hooks/use-translation";
// import { useUserData } from "@/hooks/use-user-data";

// /* ─── 3D Tilt Card wrapper ─── */
// const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
//   const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

//   const handleMouse = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
//     const rect = ref.current?.getBoundingClientRect();
//     if (!rect) return;
//     x.set((e.clientX - rect.left) / rect.width - 0.5);
//     y.set((e.clientY - rect.top) / rect.height - 0.5);
//   }, [x, y]);

//   const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

//   return (
//     <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave}
//       style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={`perspective-1000 ${className}`}>
//       {children}
//     </motion.div>
//   );
// };

// const Shimmer = () => (
//   <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
//     <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12"
//       initial={{ x: "-100%" }} animate={{ x: "200%" }}
//       transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }} />
//   </div>
// );

// const FloatingParticles = () => (
//   <div className="absolute inset-0 overflow-hidden pointer-events-none">
//     {[...Array(6)].map((_, i) => (
//       <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-primary/20"
//         style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
//         animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
//         transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }} />
//     ))}
//   </div>
// );

// const PulsingIcon = ({ children, color }: { children: React.ReactNode; color: string }) => (
//   <div className="relative">
//     <motion.div className={`absolute inset-0 rounded-lg ${color} blur-sm`}
//       animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
//       transition={{ duration: 2, repeat: Infinity }} />
//     <div className={`relative p-2 rounded-lg ${color}`}>{children}</div>
//   </div>
// );

// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 24 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
// });

// const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
// const child = {
//   initial: { opacity: 0, y: 20, scale: 0.97 },
//   animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
// };

// /* ─── Radar chart data ─── */
// const radarData = [
//   { skill: "Python", level: 85, fullMark: 100 },
//   { skill: "SQL", level: 45, fullMark: 100 },
//   { skill: "Statistics", level: 65, fullMark: 100 },
//   { skill: "Machine Learning", level: 35, fullMark: 100 },
//   { skill: "Data Viz", level: 70, fullMark: 100 },
//   { skill: "Communication", level: 60, fullMark: 100 },
// ];


// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { userData } = useUserData();
//   const [jobReadiness, setJobReadiness] = useState(0);
//   const [atsScore, setAtsScore] = useState(0);
//   const targetReadiness = userData.careerReadiness;
//   const targetAts = userData.atsScore;

//   useEffect(() => {
//     const t1 = setTimeout(() => setJobReadiness(targetReadiness), 300);
//     const t2 = setTimeout(() => setAtsScore(targetAts), 500);
//     return () => { clearTimeout(t1); clearTimeout(t2); };
//   }, []);

//   const missingSkills = userData.missingSkills;

//   const colorCycle = ["from-primary to-info", "from-warning to-orange-400", "from-primary to-accent", "from-accent to-info"];
//   const skillProgress = userData.skills.slice(0, 4).map((s, i) => ({
//     name: s.name,
//     value: s.proficiency,
//     color: colorCycle[i % colorCycle.length],
//   }));

//   const roadmap = [
//     { week: t("Month 1"), title: t("Advanced SQL"), status: "completed" },
//     { week: t("Month 2"), title: t("Power BI"), status: "current" },
//     { week: t("Month 3"), title: t("Data Visualization Projects"), status: "upcoming" },
//     { week: t("Month 4"), title: t("Portfolio Building"), status: "upcoming" },
//   ];

//   const jobMatches = [
//     { title: "Data Analyst", company: "Flipkart", salary: "₹9 LPA", match: 82 },
//     { title: "BI Analyst", company: "Amazon", salary: "₹11 LPA", match: 76 },
//     { title: "Jr. Data Scientist", company: "Zomato", salary: "₹12 LPA", match: 71 },
//     { title: "Product Data Analyst", company: "Swiggy", salary: "₹10 LPA", match: 78 },
//   ];

//   const atsSuggestions = [
//     t("Add SQL project to your resume"),
//     t("Mention Power BI experience"),
//     t("Add metrics in work experience"),
//   ];

//   const streakDays = [true, true, true, true, true, false, false];
//   const dayLabels = [t("Mon"), t("Tue"), t("Wed"), t("Thu"), t("Fri"), t("Sat"), t("Sun")];

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
//       {/* ───── TOP BANNER ───── */}
//       <motion.div {...fadeUp()} className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-2.5 text-center">
//         <p className="text-sm font-medium text-primary">
//           🇮🇳 {t("Built for India's Workforce")}
//         </p>
//       </motion.div>

//       {/* ───── HEADER ───── */}
//       <motion.div {...fadeUp(0.05)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//         <div>
//           <motion.h1
//             className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground"
//             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
//           >
//             {t("Welcome back,")} <span className="text-gradient-primary">{userData.name}</span>
//           </motion.h1>
//           {/* Role + Location ribbon */}
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
//             className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-muted/60 border border-border text-xs font-medium text-muted-foreground"
//           >
//             <Briefcase className="h-3 w-3" />
//             {t("Job Role")}: <span className="text-foreground">{userData.targetRole}</span>
//             {userData.location && (
//               <>
//                 <span className="mx-1 text-border">|</span>
//                 {t("Location")}: <span className="text-foreground">{userData.location}</span>
//               </>
//             )}
//           </motion.div>
//           <motion.p className="text-muted-foreground mt-1.5 text-sm sm:text-base"
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
//             {t("Your AI Career Progress")} · <span className="text-primary font-medium">{userData.targetRole} {t("Track")}</span>
//           </motion.p>
//         </div>
//         <div className="flex items-center gap-3">
//           <ThemeToggle />
//           <motion.div
//             initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
//             transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
//             className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning cursor-pointer hover:bg-warning/20 hover:scale-105 transition-all duration-300"
//           >
//             <Flame className="h-5 w-5" />
//             <span className="text-sm font-semibold">{t("7 Day Streak!")}</span>
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* ───── TOP CARDS ───── */}
//       <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         {/* Job Readiness Score */}
//         <motion.div variants={child}>
//           <TiltCard>
//             <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative group hover:shadow-2xl transition-all duration-500">
//               <Shimmer />
//               <FloatingParticles />
//               <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 group-hover:bg-primary/10 transition-all duration-700" />
//               <CardHeader className="pb-2 relative z-10">
//                 <CardTitle className="text-sm sm:text-base font-display flex items-center gap-2">
//                   <PulsingIcon color="bg-primary/10"><Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" /></PulsingIcon>
//                   {t("Job Readiness Score")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 relative z-10">
//                 <div className="flex justify-center">
//                   <div className="relative w-28 h-28 sm:w-32 sm:h-32">
//                     <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
//                       <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
//                       <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#gaugeGradient)" strokeWidth="10" strokeLinecap="round"
//                         strokeDasharray={`${2 * Math.PI * 50}`}
//                         initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
//                         animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - jobReadiness / 100) }}
//                         transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }} />
//                       <defs>
//                         <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                           <stop offset="0%" stopColor="hsl(234 68% 60%)" />
//                           <stop offset="100%" stopColor="hsl(174 58% 46%)" />
//                         </linearGradient>
//                       </defs>
//                     </svg>
//                     <div className="absolute inset-0 flex flex-col items-center justify-center">
//                       <motion.span className="text-xl sm:text-2xl font-display font-bold text-foreground"
//                         initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
//                         {jobReadiness}%
//                       </motion.span>
//                       <span className="text-[10px] text-muted-foreground">{t("Job Ready")}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-center space-y-1">
//                   <p className="text-xs sm:text-sm text-muted-foreground">{t("Target:")} <span className="font-semibold text-foreground">{t("Data Analyst")}</span></p>
//                   <p className="text-xs text-muted-foreground">{t("3 skills needed to reach 90%")}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TiltCard>
//         </motion.div>

//         {/* AI Skill Gap */}
//         <motion.div variants={child}>
//           <TiltCard>
//             <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative group hover:shadow-2xl transition-all duration-500">
//               <Shimmer />
//               <div className="absolute top-0 right-0 w-28 h-28 bg-accent/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 group-hover:bg-accent/10 transition-all duration-700" />
//               <CardHeader className="pb-2 relative z-10">
//                 <CardTitle className="text-sm sm:text-base font-display flex items-center gap-2">
//                   <PulsingIcon color="bg-accent/10"><Brain className="h-4 w-4 sm:h-5 sm:w-5 text-accent" /></PulsingIcon>
//                   {t("AI Skill Gap")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 relative z-10">
//                 <p className="text-sm font-medium text-foreground">{t("Missing Skills:")}</p>
//                 <div className="flex flex-wrap gap-2">
//                   {missingSkills.map((skill, i) => (
//                     <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
//                       className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/8 border border-destructive/15 text-sm text-foreground hover:bg-destructive/15 transition-colors cursor-pointer">
//                       <AlertCircle className="h-3.5 w-3.5 text-destructive" />
//                       {skill}
//                     </motion.span>
//                   ))}
//                 </div>
//                 <Button onClick={() => navigate("/skill-gap")}
//                   className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 group/btn hover:shadow-glow transition-all duration-300">
//                   {t("Generate Learning Plan")} <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
//                 </Button>
//               </CardContent>
//             </Card>
//           </TiltCard>
//         </motion.div>

//         {/* Job Fit */}
//         <motion.div variants={child} className="sm:col-span-2 lg:col-span-1">
//           <TiltCard>
//             <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative group hover:shadow-2xl transition-all duration-500">
//               <Shimmer />
//               <div className="absolute top-0 right-0 w-28 h-28 bg-success/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 group-hover:bg-success/10 transition-all duration-700" />
//               <CardHeader className="pb-2 relative z-10">
//                 <CardTitle className="text-sm sm:text-base font-display flex items-center gap-2">
//                   <PulsingIcon color="bg-success/10"><Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-success" /></PulsingIcon>
//                   {t("Job Fit Opportunities")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 relative z-10">
//                 <div className="text-center py-2">
//                   <motion.p className="text-3xl sm:text-4xl font-display font-bold text-foreground"
//                     initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
//                     transition={{ delay: 0.5, type: "spring", stiffness: 200 }}>85</motion.p>
//                   <p className="text-sm text-muted-foreground">{t("Jobs Matched")}</p>
//                 </div>
//                 <motion.div className="p-3 rounded-xl bg-success/5 border border-success/10"
//                   whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
//                   <p className="text-xs text-muted-foreground">{t("Top Match")}</p>
//                   <p className="text-sm font-semibold text-foreground">{t("Data Analyst")} — <span className="text-success">92%</span></p>
//                 </motion.div>
//                 <Button onClick={() => navigate("/jobs")} variant="outline" className="w-full group/btn hover:shadow-md transition-all duration-300">
//                   {t("View Jobs")} <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
//                 </Button>
//               </CardContent>
//             </Card>
//           </TiltCard>
//         </motion.div>
//       </motion.div>

//       {/* ───── RADAR CHART + SKILL PROGRESS ───── */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         {/* Radar Skill Chart */}
//         <motion.div {...fadeUp(0.15)}>
//           <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative hover:shadow-2xl transition-all duration-500">
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
//                 <PulsingIcon color="bg-primary/10"><Star className="h-5 w-5 text-primary" /></PulsingIcon>
//                 {t("Skill Radar")}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={280}>
//                 <RadarChart data={radarData}>
//                   <PolarGrid stroke="hsl(var(--border))" />
//                   <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
//                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
//                   <Radar name="Your Skills" dataKey="level" stroke="hsl(234, 68%, 60%)" fill="hsl(234, 68%, 60%)" fillOpacity={0.2} strokeWidth={2} />
//                 </RadarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Skill Progress Bars */}
//         <motion.div {...fadeUp(0.2)}>
//           <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative hover:shadow-2xl transition-all duration-500">
//             <Shimmer />
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
//                 <PulsingIcon color="bg-primary/10"><BarChart3 className="h-5 w-5 text-primary" /></PulsingIcon>
//                 {t("Your Skill Progress")}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 sm:space-y-5">
//               {skillProgress.map((skill, i) => (
//                 <motion.div key={skill.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3 + i * 0.12 }} className="space-y-2 group/skill">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium text-foreground group-hover/skill:text-primary transition-colors">{skill.name}</span>
//                     <motion.span className="text-sm font-bold text-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.15 }}>
//                       {skill.value}%
//                     </motion.span>
//                   </div>
//                   <div className="h-3 rounded-full bg-muted overflow-hidden relative">
//                     <motion.div className={`h-full rounded-full bg-gradient-to-r ${skill.color} relative`}
//                       initial={{ width: 0 }} animate={{ width: `${skill.value}%` }}
//                       transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: "easeOut" }}>
//                       <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
//                         animate={{ x: ["-100%", "200%"] }}
//                         transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: i * 0.5 }} />
//                     </motion.div>
//                   </div>
//                 </motion.div>
//               ))}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* ───── ROADMAP + JOB MATCHES ───── */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         {/* Roadmap */}
//         <motion.div {...fadeUp(0.25)}>
//           <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative group hover:shadow-2xl transition-all duration-500">
//             <FloatingParticles />
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
//                 <PulsingIcon color="bg-accent/10"><Sparkles className="h-5 w-5 text-accent" /></PulsingIcon>
//                 {t("Your Career Roadmap")}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="relative pl-8 space-y-4 sm:space-y-6">
//                 <motion.div className="absolute left-3 top-2 w-0.5 bg-gradient-to-b from-success via-primary to-muted"
//                   initial={{ height: 0 }} animate={{ height: "calc(100% - 16px)" }} transition={{ duration: 1.5, delay: 0.3 }} />
//                 {roadmap.map((step, i) => (
//                   <motion.div key={step.week} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.5 + i * 0.2 }} className="relative">
//                     <motion.div
//                       className={`absolute -left-5 top-1 w-4 h-4 rounded-full border-2 ${
//                         step.status === "completed" ? "bg-success border-success"
//                         : step.status === "current" ? "bg-primary border-primary" : "bg-muted border-border"
//                       }`}
//                       animate={step.status === "current" ? { scale: [1, 1.3, 1] } : {}}
//                       transition={{ duration: 2, repeat: Infinity }}>
//                       {step.status === "completed" && <CheckCircle2 className="h-3 w-3 text-success-foreground absolute -top-0.5 -left-0.5" />}
//                     </motion.div>
//                     <motion.div
//                       className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
//                         step.status === "current" ? "border-primary/30 bg-primary/5 shadow-md"
//                         : step.status === "completed" ? "border-success/20 bg-success/5" : "border-border bg-muted/30"
//                       }`}
//                       whileHover={{ scale: 1.02, x: 4 }}>
//                       <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{step.week}</p>
//                       <p className={`text-sm font-medium mt-1 ${step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}>{step.title}</p>
//                       {step.status === "completed" && <span className="text-xs text-success font-medium">{t("Completed")}</span>}
//                       {step.status === "current" && (
//                         <motion.span className="text-xs text-primary font-medium inline-flex items-center gap-1"
//                           animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>{t("In Progress")}</motion.span>
//                       )}
//                     </motion.div>
//                   </motion.div>
//                 ))}
//               </div>
//               <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:mt-6">
//                 <Button onClick={() => navigate("/skill-gap")} variant="outline"
//                   className="flex-1 group hover:shadow-md transition-all duration-300">
//                   {t("View Full Roadmap")} <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//                 <Button onClick={() => navigate("/skill-gap")}
//                   className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90 group hover:shadow-glow transition-all duration-300">
//                   <BookOpen className="h-4 w-4 mr-1" /> {t("Continue Learning")}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Job Matches */}
//         <motion.div {...fadeUp(0.3)}>
//           <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative hover:shadow-2xl transition-all duration-500">
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
//                 <PulsingIcon color="bg-success/10"><Briefcase className="h-5 w-5 text-success" /></PulsingIcon>
//                 {t("AI Job Matches")}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {jobMatches.map((job, i) => (
//                 <motion.div key={job.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 + i * 0.1 }} whileHover={{ scale: 1.02, y: -2 }}
//                   className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group/job cursor-pointer gap-3">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h4 className="font-semibold text-foreground text-sm sm:text-base">{job.title}</h4>
//                       <motion.span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${job.match >= 90 ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
//                         {job.match}% Match
//                       </motion.span>
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
//                     <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden w-32">
//                       <motion.div className="h-full rounded-full bg-gradient-primary"
//                         initial={{ width: 0 }} animate={{ width: `${job.match}%` }}
//                         transition={{ duration: 1, delay: 0.5 + i * 0.1 }} />
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-medium text-foreground">{job.salary}</p>
//                     <Button size="sm" className="mt-1 bg-gradient-primary text-primary-foreground hover:opacity-90 shrink-0">{t("Apply")}</Button>
//                   </div>
//                 </motion.div>
//               ))}
//               <Button onClick={() => navigate("/jobs")} variant="outline"
//                 className="w-full mt-2 group hover:shadow-md transition-all duration-300">
//                 {t("View All Jobs")} <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* ───── ATS SCORE + LEARNING STREAK ───── */}
//       <div className={`grid grid-cols-1 ${userData.resumeAnalyzed ? 'lg:grid-cols-2' : ''} gap-4 sm:gap-6`}>
//         {/* ATS Score - only for resume-based users */}
//         {userData.resumeAnalyzed && (
//         <motion.div {...fadeUp(0.4)}>
//           <TiltCard>
//             <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative hover:shadow-2xl transition-all duration-500">
//               <Shimmer />
//               <CardHeader className="relative z-10">
//               <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
//                   <PulsingIcon color="bg-info/10"><FileText className="h-5 w-5 text-info" /></PulsingIcon>
//                   {t("Resume Score")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-5 relative z-10">
//                 <div className="flex justify-center">
//                   <div className="relative w-24 h-24 sm:w-28 sm:h-28">
//                     <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
//                       <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
//                       <motion.circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--warning))" strokeWidth="10" strokeLinecap="round"
//                         strokeDasharray={`${2 * Math.PI * 50}`}
//                         initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
//                         animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - atsScore / 100) }}
//                         transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} />
//                     </svg>
//                     <div className="absolute inset-0 flex flex-col items-center justify-center">
//                       <motion.span className="text-lg sm:text-xl font-display font-bold text-foreground"
//                         initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: "spring" }}>
//                         {atsScore}%
//                       </motion.span>
//                       <span className="text-[10px] text-muted-foreground">{t("ATS Score")}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-semibold text-foreground">{t("Suggestions:")}</p>
//                   {atsSuggestions.map((s, i) => (
//                     <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.7 + i * 0.1 }} whileHover={{ x: 4 }}
//                       className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
//                       <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" /><span>{s}</span>
//                     </motion.div>
//                   ))}
//                 </div>
//                 <Button onClick={() => navigate("/resume")} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 hover:shadow-glow transition-all duration-300 group/btn">
//                   {t("Optimize Resume")} <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
//                 </Button>
//               </CardContent>
//             </Card>
//           </TiltCard>
//         </motion.div>
//         )}

//         {/* Learning Streak */}
//         <motion.div {...fadeUp(0.45)}>
//           <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative hover:shadow-2xl transition-all duration-500">
//             <FloatingParticles />
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
//                 <PulsingIcon color="bg-warning/10"><Flame className="h-5 w-5 text-warning" /></PulsingIcon>
//                 {t("Learning Streak")} 🔥
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-5">
//                 <div className="flex justify-between gap-1 sm:gap-2">
//                   {dayLabels.map((day, i) => (
//                     <motion.div key={day} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
//                       transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 200 }} className="flex flex-col items-center gap-1.5">
//                       <motion.div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
//                         streakDays[i] ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
//                       }`} whileHover={{ scale: 1.2, rotate: 10 }}>
//                         {streakDays[i] ? <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Clock className="h-3 w-3 sm:h-4 sm:w-4" />}
//                       </motion.div>
//                       <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">{day}</span>
//                     </motion.div>
//                   ))}
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">{t("Weekly Goal")}</span>
//                     <span className="font-semibold text-foreground">6 / 10 hours</span>
//                   </div>
//                   <div className="h-3 rounded-full bg-muted overflow-hidden">
//                     <motion.div className="h-full rounded-full bg-gradient-primary"
//                       initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }} />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-3 pt-2">
//                   {[{ label: t("This Week"), value: "6h", icon: Clock }, { label: t("Courses"), value: "3", icon: BookOpen }, { label: t("Badges"), value: "5", icon: Award }].map((stat) => (
//                     <motion.div key={stat.label} whileHover={{ scale: 1.05, y: -2 }}
//                       className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 cursor-pointer">
//                       <stat.icon className="h-4 w-4 mx-auto text-primary mb-1" />
//                       <p className="text-lg font-display font-bold text-foreground">{stat.value}</p>
//                       <p className="text-[10px] text-muted-foreground">{stat.label}</p>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* ───── BOTTOM TEXT ───── */}
//       <motion.div {...fadeUp(0.5)} className="text-center pt-2 pb-4">
//         <p className="text-sm text-muted-foreground">
//           {t("Built for India's entire workforce - not just graduates")}
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Flame, BookOpen,
  ArrowRight, Star, Clock, CheckCircle2, Sparkles,
  Briefcase, Brain, BarChart3,
  Award, AlertCircle
} from "lucide-react";
import {useEffect, useState, useRef, useCallback, type MouseEvent as ReactMouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import ThemeToggle from "@/components/ThemeToggle";
import { useTranslation } from "@/hooks/use-translation";
import { useUserData } from "@/hooks/use-user-data";
const savedData = localStorage.getItem("careerInsights");
const parsedData = savedData ? JSON.parse(savedData) : null;

/* ─── 3D Tilt Card wrapper ─── */
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={`perspective-1000 ${className}`}>
      {children}
    </motion.div>
  );
};

const Shimmer = () => (
  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12"
      initial={{ x: "-100%" }} animate={{ x: "200%" }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }} />
  </div>
);

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-primary/20"
        style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
        animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }} />
    ))}
  </div>
);

const PulsingIcon = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <div className="relative">
    <motion.div className={`absolute inset-0 rounded-lg ${color} blur-sm`}
      animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }} />
    <div className={`relative p-2 rounded-lg ${color}`}>{children}</div>
  </div>
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// const radarData = [
//   { skill: "Python", level: 85, fullMark: 100 },
//   { skill: "SQL", level: 45, fullMark: 100 },
//   { skill: "Statistics", level: 65, fullMark: 100 },
//   { skill: "Machine Learning", level: 35, fullMark: 100 },
//   { skill: "Data Viz", level: 70, fullMark: 100 },
//   { skill: "Communication", level: 60, fullMark: 100 },
// ];

// const radarData = (parsedData?.skills || [
//     { name: "Python", proficiency: 80 },
//     { name: "SQL", proficiency: 60 },
//     { name: "Communication", proficiency: 70 },
//     { name: "Analysis", proficiency: 50 },
//     { name: "Tools", proficiency: 65 }
//   ]).map((s: any) => ({
//     skill: s.name || s.skill, // Kuch models 'skill' bhejte hain kuch 'name'
//     level: s.proficiency || s.level || 50,
//     fullMark: 100
//   }));
const NoResumeDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userData } = useUserData();

  const missingSkills = userData.missingSkills || [];
  const colorCycle = ["from-primary to-info", "from-warning to-orange-400", "from-primary to-accent", "from-accent to-info"];
  
  const skillProgress = (userData.skills || []).slice(0, 4).map((s, i) => ({
    name: s.name,
    value: s.proficiency,
    color: colorCycle[i % colorCycle.length],
  }));
  const [realData, setRealData] = useState<any>(null);
  const radarData = (parsedData?.skills || [
    { name: "Python", proficiency: 80 },
    { name: "SQL", proficiency: 60 },
    { name: "Communication", proficiency: 70 },
    { name: "Analysis", proficiency: 50 },
    { name: "Tools", proficiency: 65 }
  ]).map((s: any) => ({
    skill: s.name || s.skill, // Kuch models 'skill' bhejte hain kuch 'name'
    level: s.proficiency || s.level || 50,
    fullMark: 100
  }));

  useEffect(() => {
    const savedData = localStorage.getItem("careerInsights");
    if (savedData) {
      setRealData(JSON.parse(savedData));
    }
  }, []);

  // Agar data load nahi hua toh loading dikhao
  if (!realData) return <div className="p-20 text-center">Loading Insights...</div>;

  // ─── MAPPING REAL DATA ───
  // 1. Radar Chart Data (User ki skills ke basis pe)
//   const radarData = realData.skills?.map((s: any) => ({
//     skill: s.name,
//     level: s.proficiency || 50,
//     fullMark: 100
//   })) || [];

  // 2. Missing Skills (Jo form se aaye)
//   const missingSkills = realData.missingSkills || [];

  // 3. Skill Progress Bars
//   const colorCycle = ["from-primary to-info", "from-warning to-orange-400", "from-primary to-accent", "from-accent to-info"];
//   const skillProgress = (realData.skills || []).slice(0, 4).map((s: any, i: number) => ({
//     name: s.name,
//     value: s.proficiency || 0,
//     color: colorCycle[i % colorCycle.length],
//   }));

  const roadmap = [
    { week: t("Month 1"), title: t("Advanced SQL"), status: "completed" },
    { week: t("Month 2"), title: t("Power BI"), status: "current" },
    { week: t("Month 3"), title: t("Data Visualization Projects"), status: "upcoming" },
    { week: t("Month 4"), title: t("Portfolio Building"), status: "upcoming" },
  ];

  const streakDays = [true, true, true, true, true, false, false];
  const dayLabels = [t("Mon"), t("Tue"), t("Wed"), t("Thu"), t("Fri"), t("Sat"), t("Sun")];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* ───── TOP BANNER ───── */}
      <motion.div {...fadeUp()} className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-2.5 text-center">
        <p className="text-sm font-medium text-primary">
          🇮🇳 {t("Personalized Career Path Based on Your Profile")}
        </p>
      </motion.div>

      {/* ───── HEADER ───── */}
      <motion.div {...fadeUp(0.05)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <motion.h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">
            {t("Welcome back,")} <span className="text-gradient-primary">{userData.name}</span>
          </motion.h1>
          <motion.div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-muted/60 border border-border text-xs font-medium text-muted-foreground">
            <Briefcase className="h-3 w-3" />
            {t("Target Role")}: <span className="text-foreground">{userData.targetRole}</span>
          </motion.div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning">
            <Flame className="h-5 w-5" />
            <span className="text-sm font-semibold">Streak: 7 Days</span>
          </div>
        </div>
      </motion.div>

      {/* ───── MAIN CONTENT: RADAR & SKILL GAP ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Radar Skill Chart */}
        <motion.div {...fadeUp(0.1)}>
          <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
                <PulsingIcon color="bg-primary/10"><Star className="h-5 w-5 text-primary" /></PulsingIcon>
                {t("Skill Radar")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Your Skills" dataKey="level" stroke="hsl(234, 68%, 60%)" fill="hsl(234, 68%, 60%)" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Skill Gap - Focused Version */}
        <motion.div {...fadeUp(0.15)}>
          <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative group">
            <Shimmer />
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
                <PulsingIcon color="bg-accent/10"><Brain className="h-5 w-5 text-accent" /></PulsingIcon>
                {t("AI Skill Gap Analysis")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">{t("Skills you need to learn:")}</p>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, i) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-sm text-foreground">
                      <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <Button onClick={() => navigate("/skill-gap")} className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                {t("Create Learning Plan")} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ───── SECONDARY CONTENT: SKILL PROGRESS & ROADMAP ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Skill Progress Bars */}
        <motion.div {...fadeUp(0.2)}>
          <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
                <PulsingIcon color="bg-primary/10"><BarChart3 className="h-5 w-5 text-primary" /></PulsingIcon>
                {t("Proficiency Level")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {skillProgress.map((skill, i) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    <span className="text-sm font-bold">{skill.value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      initial={{ width: 0 }} animate={{ width: `${skill.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Roadmap */}
        <motion.div {...fadeUp(0.25)}>
          <Card className="h-full border-0 shadow-lg glass-card overflow-hidden relative group">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
                <PulsingIcon color="bg-accent/10"><Sparkles className="h-5 w-5 text-accent" /></PulsingIcon>
                {t("Career Roadmap")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roadmap.map((step, i) => (
                <div key={step.week} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${step.status === 'completed' ? 'bg-success' : step.status === 'current' ? 'bg-primary' : 'bg-muted'}`} />
                    {i !== roadmap.length - 1 && <div className="w-0.5 h-full bg-border my-1" />}
                  </div>
                  <div className={`flex-1 p-3 rounded-lg border ${step.status === 'current' ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 border-border'}`}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{step.week}</p>
                    <p className="text-sm font-medium">{step.title}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ───── BOTTOM SECTION: STREAK ───── */}
      <motion.div {...fadeUp(0.3)}>
        <Card className="border-0 shadow-lg glass-card overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-display flex items-center gap-2">
              <PulsingIcon color="bg-warning/10"><Flame className="h-5 w-5 text-warning" /></PulsingIcon>
              {t("Learning Streak")} 🔥
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-2 max-w-2xl mx-auto mb-6">
              {dayLabels.map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ${streakDays[i] ? "bg-gradient-primary text-white shadow-glow" : "bg-muted text-muted-foreground"}`}>
                    {streakDays[i] ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[{ label: t("Hours Done"), value: "6h", icon: Clock }, { label: t("Courses"), value: "3", icon: BookOpen }, { label: t("Badges"), value: "5", icon: Award }].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl bg-muted/30">
                  <stat.icon className="h-4 w-4 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default NoResumeDashboard;
