// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import {
//   Target, Search, CheckCircle2, XCircle, ArrowRight,
//   BookOpen, ExternalLink, Lock, Unlock, ChevronDown, Sparkles,RotateCcw
// } from "lucide-react";
// import { useState } from "react";
// import { useTranslation } from "@/hooks/use-translation";

// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.5, delay },
// });

// const SkillGap = () => {
//   const [targetRole, setTargetRole] = useState("Data Analyst");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisData, setAnalysisData] = useState<any>(null);
//   const { t } = useTranslation();
// const handleAnalyze = async () => {
//     if (!targetRole) return;
//     setIsAnalyzing(true);

//     // Humne Resume analysis page par skills save ki thi, wahan se uthayenge
//     const userSkills = localStorage.getItem("userSkills") || "Basic skills from resume";

//     try {
//       const response = await fetch("http://localhost:5000/api/analysis/skill-gap", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ targetRole, userSkills }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setAnalysisData(data);
//       } else {
//         alert("Analysis failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Gap Error:", error);
//       alert("Server connection error.");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };
//   // const requiredSkills = [
//   //   { name: "Python", level: 90, userLevel: 85, has: true, priority: "met" },
//   //   { name: t("Advanced SQL"), level: 90, userLevel: 45, has: false, priority: "critical" },
//   //   { name: "Power BI", level: 85, userLevel: 20, has: false, priority: "critical" },
//   //   { name: t("Data Warehousing"), level: 75, userLevel: 30, has: false, priority: "moderate" },
//   //   { name: t("Statistics"), level: 80, userLevel: 65, has: true, priority: "met" },
//   //   { name: t("A/B Testing"), level: 60, userLevel: 15, has: false, priority: "optional" },
//   //   { name: t("Data Visualization"), level: 85, userLevel: 70, has: true, priority: "met" },
//   //   { name: t("Communication"), level: 70, userLevel: 60, has: true, priority: "met" },
//   // ];

//   const roadmapSteps = [
//     { step: 1, title: t("Advanced SQL"), duration: t("4 weeks"), status: "completed", description: t("Master complex queries, window functions, and optimization") },
//     { step: 2, title: "Power BI", duration: t("4 weeks"), status: "current", description: t("Build interactive dashboards and learn DAX") },
//     { step: 3, title: t("Data Visualization Projects"), duration: t("4 weeks"), status: "locked", description: t("Create portfolio-worthy data visualization projects") },
//     { step: 4, title: t("Portfolio Building"), duration: t("4 weeks"), status: "locked", description: t("Compile projects, polish resume, and prepare for interviews") },
//   ];

//   const roadmapProgress = 30;

//   const resources = [
//     { title: t("Advanced SQL Masterclass"), platform: "Udemy", url: "#", type: t("Course") },
//     { title: t("Power BI Complete Guide"), platform: "Coursera", url: "#", type: t("Course") },
//     { title: t("Data Visualization with Python"), platform: "YouTube", url: "#", type: t("Video") },
//     { title: t("SQL for Data Analysis"), platform: "Khan Academy", url: "#", type: t("Course") },
//   ];

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
//       <motion.div {...fadeUp()}>
//         <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
//           {t("Skill Gap &")} <span className="text-gradient-primary">{t("Roadmap")}</span>
//         </h1>
//         <p className="text-muted-foreground mt-1">{t("Analyze your skills and get a personalized growth plan")}</p>
//       </motion.div>

//       <motion.div {...fadeUp(0.1)}>
//         <Card className="border-0 shadow-lg bg-gradient-card">
//           <CardContent className="p-6">
//             <div className="flex flex-col sm:flex-row gap-4 items-end">
//               <div className="flex-1 space-y-2">
//                 <label className="text-sm font-medium text-foreground flex items-center gap-2">
//                   <Target className="h-4 w-4 text-primary" />
//                   {t("Target Role")}
//                 </label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     value={targetRole}
//                     onChange={(e) => setTargetRole(e.target.value)}
//                     placeholder={t("Search for your dream role...")}
//                     className="pl-10 h-12 text-base"
//                   />
//                 </div>
//               </div>
//               <Button className="bg-gradient-primary text-primary-foreground h-12 px-6"
//               onClick={handleAnalyze} 
//                 disabled={isAnalyzing || !targetRole}>
//                 {isAnalyzing ? <RotateCcw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
//                 {isAnalyzing ? t("Analyzing...") : t("Analyze Gap")}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       <motion.div {...fadeUp(0.2)}>
//         <Card className="border-0 shadow-lg bg-gradient-card">
//           <CardHeader>
//             <CardTitle className="text-lg font-display">
//               {t("Skill Comparison")} — <span className="text-primary">{targetRole}</span>
//             </CardTitle>
//             {/* <p className="text-sm text-muted-foreground">{t("Required skills vs. your current proficiency")} • {t("Roadmap Progress")}: {roadmapProgress}%</p> */}
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {analysisData.requiredSkills.map((skill: any, i: number) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 + i * 0.08 }}
//                 className="space-y-2"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     {skill.has ? (
//                       <CheckCircle2 className="h-4 w-4 text-success" />
//                     ) : (
//                       <XCircle className="h-4 w-4 text-destructive" />
//                     )}
//                     <span className="text-sm font-medium text-foreground">{skill.name}</span>
//                     {skill.priority === "critical" && (
//                       <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-destructive/10 text-destructive">{t("Critical")}</span>
//                     )}
//                     {/* // {skill.priority === "moderate" && ( */}
//                     {/* //   <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-warning/10 text-warning">{t("Moderate")}</span>
//                     // )}
//                     // {skill.priority === "optional" && ( */}
//                     {/* //   <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">{t("Optional")}</span>
//                     // )} */}
//                   </div>
//                   <span className="text-xs text-muted-foreground">{skill.userLevel}% / {skill.level}%</span>
//                 </div>
//                 <div className="relative h-3 rounded-full bg-muted overflow-hidden">
//                   <div
//                     className="absolute inset-y-0 left-0 rounded-full bg-destructive/15"
//                     style={{ width: `${skill.level}%` }}
//                   />
//                   <motion.div
//                     className={`absolute inset-y-0 left-0 rounded-full ${
//                       skill.has ? "bg-gradient-primary" : "bg-warning"
//                     }`}
//                     initial={{ width: 0 }}
//                     animate={{ width: `${skill.userLevel}%` }}
//                     transition={{ duration: 1 }}
//                   />
//                 </div>
//               </motion.div>
//             ))}
//           </CardContent>
//         </Card>
//       </motion.div>
//       <motion.div {...fadeUp(0.3)}>
//         <Card className="border-0 shadow-lg bg-gradient-card">
//           <CardHeader>
//             <CardTitle className="text-lg font-display flex items-center gap-2">
//               <BookOpen className="h-5 w-5 text-primary" />
//               {t("Your Personalized Roadmap")}
//             </CardTitle>
//             {/* <p className="text-sm text-muted-foreground">{t("Estimated completion")}: 16 {t("weeks")} · {t("Progress")}: {roadmapProgress}%</p> */}
//           </CardHeader>
//           <CardContent>
//             <div className="relative">
//               <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
//               <div className="space-y-1">
//                 {analysisData.roadmapSteps?.map((step: any, i: number) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0, x: -30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.4 + i * 0.1 }}
//                     className={`relative flex gap-4 p-4 rounded-xl transition-all duration-300 ${
//                       step.status === "current"
//                         ? "bg-primary/5 border border-primary/20"
//                         : step.status === "completed"
//                         ? "opacity-80"
//                         : "opacity-60"
//                     }`}
//                   >
//                     <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 "
//                     >
//                       {step.status === "completed" ? <CheckCircle2 className="text-success h-5 w-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                      
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h4 className="font-semibold text-foreground">
//                           {step.title}</h4>
//                           <p className="text-sm text-muted-foreground">{step.description}</p>
//                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
//                           step.status === "completed"
//                             ? "bg-success/10 text-success"
//                             : step.status === "current"
//                             ? "bg-primary/10 text-primary"
//                             : "bg-muted text-muted-foreground"
//                         }`}>
//                           {step.status === "current" ? t("In Progress") : step.status === "completed" ? t("Completed") : t("Locked")}
//                         </span>
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
//                       <span className="text-xs text-muted-foreground">{t("Duration")}: {step.duration}</span>
//                     </div>
//                     {step.status === "current" && (
//                       <Button size="sm" className="bg-gradient-primary text-primary-foreground shrink-0 self-center">
//                         {t("Continue")} <ArrowRight className="h-3 w-3 ml-1" />
//                       </Button>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       <motion.div {...fadeUp(0.4)}>
//         <Card className="border-0 shadow-lg bg-gradient-card">
//           <CardHeader>
//             <CardTitle className="text-lg font-display flex items-center gap-2">
//               <ExternalLink className="h-5 w-5 text-accent" />
//               {t("Recommended Resources")}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {resources.map((res, i) => (
//                 <motion.a
//                   key={i}
//                   href={res.url}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.5 + i * 0.08 }}
//                   className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
//                 >
//                   <div className="p-2 rounded-lg bg-primary/10">
//                     <BookOpen className="h-4 w-4 text-primary" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-foreground truncate">{res.title}</p>
//                     <p className="text-xs text-muted-foreground">{res.platform} · {res.type}</p>
//                   </div>
//                   <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
//                 </motion.a>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default SkillGap;

// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Target, Search, CheckCircle2, XCircle, BookOpen, ExternalLink, Sparkles, RotateCcw } from "lucide-react";
// import { useState } from "react";
// import { useTranslation } from "@/hooks/use-translation";

// const SkillGap = () => {
//   const [targetRole, setTargetRole] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisData, setAnalysisData] = useState<any>(null);
//   const { t } = useTranslation();

//   const handleAnalyze = async () => {
//     if (!targetRole) return;
//     setIsAnalyzing(true);
//     const userSkills = localStorage.getItem("userSkills") || "Basic Skills";

//     try {
//       const response = await fetch("http://localhost:5000/api/analysis/skill-gap", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ targetRole, userSkills }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setAnalysisData(data);
//       } else {
//         alert("Server returned error. Check Backend Terminal.");
//       }
//     } catch (error) {
//       alert("Backend connection failed!");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
//       <h1 className="text-3xl font-bold">{t("Skill Gap & Roadmap")}</h1>

//       {/* Input Section */}
//       <Card className="bg-gradient-card">
//         <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-end">
//           <div className="flex-1 space-y-2">
//             <label className="text-sm font-medium flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> {t("Target Role")}</label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder={t("e.g. Frontend Developer")} className="pl-10 h-12" />
//             </div>
//           </div>
//           <Button onClick={handleAnalyze} disabled={isAnalyzing || !targetRole} className="h-12 px-6 bg-gradient-primary">
//             {isAnalyzing ? <RotateCcw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
//             {isAnalyzing ? t("Analyzing...") : t("Analyze Gap")}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Results Section - SAFE RENDERING */}
//       {analysisData ? (
//         <div className="space-y-8">
//           {/* Skills Comparison */}
//           <Card>
//             <CardHeader><CardTitle>{t("Skill Comparison")}</CardTitle></CardHeader>
//             <CardContent className="space-y-4">
//               {/* Added safe array check */}
//               {(analysisData.requiredSkills || []).map((skill: any, i: number) => (
//                 <div key={i} className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="flex items-center gap-2">
//                         {skill.has ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
//                         {skill.name}
//                     </span>
//                     <span>{skill.userLevel || 0}% / {skill.level || 100}%</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${skill.userLevel || 0}%` }} />
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Roadmap */}
//           <Card>
//             <CardHeader><CardTitle>{t("Your Roadmap")}</CardTitle></CardHeader>
//             <CardContent className="space-y-4">
//               {(analysisData.roadmapSteps || []).map((step: any, i: number) => (
//                 <div key={i} className="flex gap-4 p-4 border rounded-xl">
//                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">{i + 1}</div>
//                   <div>
//                     <h4 className="font-semibold">{step.title}</h4>
//                     <p className="text-sm text-muted-foreground">{step.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>
//       ) : (
//         <div className="text-center py-20 text-muted-foreground">
//           <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
//           <p>Please enter a target role and click Analyze.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SkillGap;

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Target, Search, CheckCircle2, XCircle, ArrowRight, 
  BookOpen, ExternalLink, Lock, Sparkles, RotateCcw 
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const SkillGap = () => {
  const [targetRole, setTargetRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const { t } = useTranslation();

  const getResourceLink = (res: any) => {
  const query = encodeURIComponent(res.title + " " + (res.platform || ""));
  const type = res.type?.toLowerCase();
  const platform = res.platform?.toLowerCase();
  if (type === 'video' || platform === 'youtube') {
    return `https://www.youtube.com/results?search_query=${query}`;
  }

  // 2. Agar Course hai aur platform Udemy hai -> Direct Udemy
  if (type === 'course') {
    if (platform === 'udemy') {
      return `https://www.udemy.com/courses/search/?q=${query}`;
    }
    if (platform === 'coursera') {
      return `https://www.coursera.org/search?query=${query}`;
    }
    // Fallback for other courses
    return `https://www.google.com/search?q=${query}+online+course`;
  }

  // 3. Agar Book hai -> Direct Amazon ya Google Books
  if (type === 'book' || platform === 'amazon') {
    return `https://www.amazon.in/s?k=${query}+book`;
  }

  // 4. Default -> Google Search (Sabse aakhri rasta)
  return `https://www.google.com/search?q=${query}`;
};

  const handleAnalyze = async () => {
    if (!targetRole) return;
    setIsAnalyzing(true);
    const userSkills = localStorage.getItem("userSkills") || "Basic skills";

    try {
      const response = await fetch("http://localhost:5000/api/analysis/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, userSkills }),
      });
      const data = await response.json();
      if (response.ok) setAnalysisData(data);
    } catch (error) {
      alert("Connection failed!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fadeUp()}>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          {t("Skill Gap &")} <span className="text-gradient-primary">{t("Roadmap")}</span>
        </h1>
        <p className="text-muted-foreground mt-1">{t("Analyze your skills and get a personalized growth plan")}</p>
      </motion.div>

      {/* Target Role Input Card */}
      <motion.div {...fadeUp(0.1)}>
        <Card className="border-0 shadow-lg bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  {t("Target Role")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder={t("Search for your dream role...")}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-gradient-primary text-primary-foreground h-12 px-6">
                {isAnalyzing ? <RotateCcw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                {t("Analyze Gap")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {analysisData ? (
        <>
          {/* Skill Comparison Section */}
          <motion.div {...fadeUp(0.2)}>
            <Card className="border-0 shadow-lg bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg font-display">
                  {t("Skill Comparison")} — <span className="text-primary">{targetRole}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(analysisData.requiredSkills || []).map((skill: any, i: number) => (
                  <motion.div key={i} {...fadeUp(0.3 + i * 0.05)} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {skill.has ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        {skill.priority === "critical" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-destructive/10 text-destructive">{t("Critical")}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{skill.userLevel}% / {skill.level}%</span>
                    </div>
                    <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-destructive/15" style={{ width: `${skill.level}%` }} />
                      <motion.div
                        className={`absolute inset-y-0 left-0 rounded-full ${skill.has ? "bg-gradient-primary" : "bg-warning"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.userLevel}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Roadmap Timeline Section */}
<motion.div {...fadeUp(0.3)}>
  <Card className="border-0 shadow-lg bg-gradient-card">
    <CardHeader>
      <CardTitle className="text-lg font-display flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        {t("Your Personalized Roadmap")}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="relative">
        {/* Animated Vertical Line */}
        <motion.div 
          className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <div className="space-y-4">
          {(analysisData.roadmapSteps || []).map((step: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.2, // Har step 0.2s ke gap par aayega
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ scale: 1.02, x: 10 }} // Hover karne par move hoga
              className={`relative flex gap-4 p-5 rounded-2xl transition-all border ${
                step.status === "current" 
                ? "bg-primary/10 border-primary/30 shadow-glow-sm" 
                : "bg-muted/30 border-transparent"
              }`}
            >
              {/* Animated Circle Icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  step.status === "completed" 
                  ? "bg-success text-success-foreground" 
                  : step.status === "current"
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <span className="font-bold text-sm">{i + 1}</span>
                )}
              </motion.div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-foreground text-base">{step.title}</h4>
                  {step.status === "current" && (
                    <motion.span 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-primary text-primary-foreground font-bold"
                    >
                      ACTIVE
                    </motion.span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-background/50 rounded-md border border-border">
                    ⏱ {step.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
</motion.div>

          {/* Recommended Resources Grid */}
          <motion.div {...fadeUp(0.4)}>
  <Card className="border-0 shadow-lg bg-gradient-card">
    <CardHeader>
      <CardTitle className="text-lg font-display flex items-center gap-2">
        <ExternalLink className="h-5 w-5 text-accent" />
        {t("Recommended Resources")}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(analysisData.resources || []).map((res: any, i: number) => (
          <motion.a
  key={i}
  href={getResourceLink(res)} // Yahan hamara naya function call hoga
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md hover:bg-primary/5 transition-all group"
>
  <div className="p-2 rounded-lg bg-primary/10">
    {/* Dynamic Icon based on type */}
    {res.type?.toLowerCase() === 'book' ? <Lock className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
      {res.title}
    </p>
    <p className="text-xs text-muted-foreground">
      <span className="font-semibold text-primary/80">{res.type}</span> • {res.platform}
    </p>
  </div>
  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
</motion.a>
        ))}
      </div>
    </CardContent>
  </Card>
</motion.div>
        </>
      ) : (
        <div className="text-center py-20 opacity-50">
          <Search className="h-12 w-12 mx-auto mb-4" />
          <p>{t("Enter a target role and click Analyze to see your roadmap")}</p>
        </div>
      )}
    </div>
  );
};

export default SkillGap;