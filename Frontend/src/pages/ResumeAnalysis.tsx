import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Upload, CheckCircle2, AlertCircle, ArrowRight,
  Sparkles, Award, TrendingUp, Eye, Download
} from "lucide-react";
// import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useUserData } from "@/hooks/use-user-data";
import { jsPDF } from "jspdf";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const ResumeAnalysis = () => {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [file, setFile] = useState<File | null>(null); // File state
  
  const [dynamicSkills, setDynamicSkills] = useState<any[]>([]);
  const [dynamicAtsScore, setDynamicAtsScore] = useState(0);
  const [dynamicInsights, setDynamicInsights] = useState<string[]>([]);
  const [dynamicImprovements, setDynamicImprovements] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { userData, addSkills, setResumeAnalyzed } = useUserData();
  const [optimizedResume, setOptimizedResume] = useState<string>("");
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [rawResumeText, setRawResumeText] = useState<string>("");
  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  try {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setAnalyzed(false);
    setAnalyzing(true);
    setFile(selectedFile); // Isse file name update ho jayega UI mein
    setDynamicSkills([]);
    setDynamicAtsScore(0);
    setRawResumeText("");

    // Sabse pehle email check karein
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email");
    console.log("LocalStorage Check - Email found:", userEmail);

    if (!userEmail) {
      alert("Error: Email not found in LocalStorage. Please Login again.");
      return;
    }

    // UI state update karein
    setUploaded(true);
    setAnalyzing(true);

    const formData = new FormData();
    // ORDER MATTERS: Email pehle, file baad mein
    formData.append("email", userEmail); 
    formData.append("resume", selectedFile);

    console.log("Sending request to backend...");

    const response = await fetch("http://localhost:5000/api/analysis/upload-resume", {
      method: "POST",
      body: formData, // Browser khud boundary set karega, header mat lagana
    });

    const data = await response.json();
    console.log("Server Response:", data);

    if (response.ok && data.analysis) {
      // Backend data ko local states mein bhariye
      setDynamicSkills(data.analysis.skills || []);
      setDynamicAtsScore(data.analysis.atsScore || 0);
      setDynamicInsights(data.analysis.insights || []);
      setDynamicImprovements(data.analysis.improvements || []);
      setRawResumeText(data.resumeText || "");
      const skillsString = data.analysis.skills.map((s: any) => s.name).join(", ");
      localStorage.setItem("userSkills", skillsString); // Naya state for raw resume text
      localStorage.setItem("userSkills", data.analysis.skills.map(s => s.name).join(", "));
      setAnalyzed(true);
      setResumeAnalyzed(true);
    } else {
      console.error("Analysis error:", data.message);
      alert("Database error: " + data.message);
      setUploaded(false);
    }
  } catch (error) {
    console.error("Critical Frontend Error:", error);
    alert("Connection error! Check if server is running on port 5000");
    setUploaded(false);
  } finally {
    setAnalyzing(false);
  }
};

  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = event.target.files?.[0];
  //   const userEmail = localStorage.getItem("userEmail");
  //   if (!selectedFile) return;
  //   if (!userEmail) {
  //   alert("User email not found. Please log in again.");
  //   console.log("Current LocalStorage:", localStorage); // Debugging
  //   return;
  // }
  //   setFile(selectedFile);
  //   setUploaded(true);
  //   setAnalyzing(true);

  //   const formData = new FormData();
  //   formData.append("email", userEmail);
  //   formData.append("resume", selectedFile);
  //   console.log("Sending data for email:", userEmail);

  //   try {
  //     console.log("Fetching from backend...");
  //     const response = await fetch("http://localhost:5000/api/analysis/upload-resume", {
  //       method: "POST",
  //       body: formData, // FormData use karna zaroori hai file ke liye
  //     });

  //     const data = await response.json();
  //     if (response.ok && data.analysis) {
  //     // Backend data ko local states mein set karein
  //     setDynamicSkills(data.analysis.skills || []);
  //     setDynamicAtsScore(data.analysis.atsScore || 0);
  //     setDynamicInsights(data.analysis.insights || []);
  //     setDynamicImprovements(data.analysis.improvements || []);
      
  //     setAnalyzed(true);
  //     setResumeAnalyzed(true);
  //     // Global context update
  //       addSkills(data.analysis.skills.map((s: any) => ({
  //         name: s.name,
  //         level: s.level,
  //         proficiency: 70,
  //         verified: true,
  //         source: "resume"
  //       })));
  //     } else {
  //       alert(data.message || "User data not found in DB");
  //       setUploaded(false);
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //     alert("Backend se connection nahi ho paya!");
  //     setUploaded(false);
  //   } finally {
  //     setAnalyzing(false); // Loading har haal mein band hogi
  //   }
  // };
    // Global UserData update karein
//     addSkills(data.analysis.skills.map((s: any) => ({
//         name: s.name,
//         level: s.level,
//         proficiency: s.level === "Advanced" ? 85 : 60,
//         verified: s.verified,
//         source: "resume"
//       })));
//     } else {
//       alert(data.message || "Analysis failed");
//     }
//   } catch (error) {
//     console.error("Connection Error:", error);
//     alert("Could not connect to backend server.");
//   } finally {
//     setAnalyzing(false);
//   }
// };

  //     if (response.ok) {
  //       // setAnalyzing(false);
  //       setAnalyzed(true);
  //       console.log("Analysis Data:", data);
  //       setResumeAnalyzed(true);
  //       // Backend se aaye real skills add karein (agar backend ready hai)
  //       if (data.analysis?.skills) {
  //          addSkills(data.analysis.skills);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     setAnalyzing(false);
  //     alert("Backend connection failed!");
  //   }
  // };


  const handleUpload = () => {
    setUploaded(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      setResumeAnalyzed(true);
      addSkills(dynamicSkills.map(s => ({
        name: s.name,
        level: s.level,
        proficiency: s.level === t("Advanced") ? 85 : s.level === t("Intermediate") ? 55 : 35,
        verified: s.verified,
        source: "resume" as const,
      })));
    }, 2500);
  };

  // 1. AI Auto-Optimize Function
  const handleAutoOptimize = async () => {
    console.log("Current State of rawResumeText:", rawResumeText);
    // Agar text empty hai toh debug karein
    if (!rawResumeText) {
        alert("Resume text not found. Please re-upload your resume.");
        return;
    }
    
    setAnalyzing(true);
    try {
        const response = await fetch("http://localhost:5000/api/analysis/optimize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                resumeText: rawResumeText, 
                jobDescription: "" 
            }),
        });
        const data = await response.json();
        if(response.ok) {
            setOptimizedResume(data.optimizedText);
            setShowOptimizeModal(true);
        }else{
          alert(data.message)
        }
    } catch (error) {
        console.error("Optimization Error:", error);
    } finally {
        setAnalyzing(false);
    }
};

  // 2. Download Function
  // const downloadOptimizedResume = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(12);
  //   // Optimized text ko PDF mein add karein
  //   const splitText = doc.splitTextToSize(optimizedResume || "No content", 180);
  //   doc.text(splitText, 10, 10);
  //   doc.save("Optimized_Resume.pdf");
  // };

  const downloadOptimizedResume = () => {
  if (!optimizedResume) return;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20; // Margin top

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(33, 150, 243); // Professional Blue Color
  doc.text("AI OPTIMIZED RESUME", pageWidth / 2, currentY, { align: "center" });
  
  currentY += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, currentY, pageWidth - 15, currentY); // Horizontal Line
  
  currentY += 15;

  // --- Content Body ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40); // Dark Gray for text

  // AI Optimized Resume ko line-by-line split karein
  const splitText = doc.splitTextToSize(optimizedResume, pageWidth - 30);
  
  // PDF mein text add karein (Auto-paging handle karne ke liye loop)
  splitText.forEach((line: string) => {
    if (currentY > 280) { // New page check
      doc.addPage();
      currentY = 20;
    }
    
    // Agar line kisi section ki heading lag rahi ho (e.g. "Experience:", "Skills:")
    if (line.includes(":") && line.length < 30) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(line, 15, currentY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
    } else {
      doc.text(line, 15, currentY);
    }
    
    currentY += 7; // Line spacing
  });

  // --- Footer ---
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Generated by CareerGPS AI", pageWidth / 2, 290, { align: "center" });

  doc.save("Professional_Resume_CareerGPS.pdf");
};

  const extractedSkills = [
    { name: "Python", level: t("Advanced"), verified: true },
    { name: "SQL", level: t("Intermediate"), verified: true },
    { name: "Excel", level: t("Intermediate"), verified: true },
    { name: "Pandas", level: t("Intermediate"), verified: true },
    { name: t("Data Visualization"), level: t("Intermediate"), verified: false },
    { name: t("Statistics"), level: t("Basic"), verified: false },
  ];

  const atsScore = 74;

  const resumeInsights = [
    t("Strong analytical foundation with Python and Excel."),
    t("Needs improvement in advanced SQL and BI tools."),
  ];

  const improvements = [
    { tip: t("Add Power BI to your skills section"), impact: "High", icon: "🔧" },
    { tip: t("Add quantified achievements (numbers, metrics)"), impact: "High", icon: "📊" },
    { tip: t("Include relevant SQL projects"), impact: "Medium", icon: "💾" },
    { tip: t("Optimize keywords for Data Analyst role"), impact: "High", icon: "🎯" },
    { tip: t("Add a professional summary section"), impact: "Medium", icon: "📝" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <input 
        type="file" 
        id="resume-upload"
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange} 
      />
      <motion.div {...fadeUp()}>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          {t("Resume")} <span className="text-gradient-primary">{t("Analysis")}</span>
        </h1>
        <p className="text-muted-foreground mt-1">{t("Upload your resume and get AI-powered insights")}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div {...fadeUp(0.1)}>
          <Card className="h-full border-0 shadow-lg bg-gradient-card overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {!uploaded ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-2xl hover:border-primary/40 transition-colors duration-300 cursor-pointer group"
                    onClick={onUploadClick}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="p-4 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors"
                    >
                      <Upload className="h-10 w-10 text-primary" />
                    </motion.div>
                    <p className="text-lg font-semibold text-foreground">{t("Drop your resume here")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("or click to browse • PDF, DOC, DOCX")}</p>
                    <Button className="mt-6 bg-gradient-primary text-primary-foreground hover:opacity-90">
                      {t("Select File")}
                    </Button>
                  </motion.div>
                ) : analyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="p-4 rounded-2xl bg-primary/10 mb-4"
                    >
                      <Sparkles className="h-10 w-10 text-primary" />
                    </motion.div>
                    <p className="text-lg font-semibold text-foreground">{t("AI is analyzing your resume...")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("Extracting skills, scoring ATS compatibility")}</p>
                    <div className="w-64 mt-6 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="p-3 rounded-xl bg-success/10">
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-foreground">{t("Resume Analyzed Successfully")}</p>
                      <p className="text-sm text-muted-foreground">{file ? file.name : t("Uploaded Resume")}</p>
                      <p className="text-xs text-muted-foreground">
      {file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF Format"}
    </p>
                    </div>
                    <Button variant="outline" size="sm" 
                    onClick={() => document.getElementById('resume-upload')?.click()}>
                      {t("Upload New")}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

      </div>


      <AnimatePresence>
        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <motion.div {...fadeUp(0.1)} className="lg:col-span-2">
                <Card className="h-full border-0 shadow-lg bg-gradient-card overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-warning/5 rounded-full translate-y-12 -translate-x-12" />
                  <CardHeader>
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-warning/10">
                        <Eye className="h-5 w-5 text-warning" />
                      </div>
                      {t("ATS Score")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex justify-center">
                      <div className="relative w-36 h-36">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                          <motion.circle
                            cx="60" cy="60" r="50" fill="none"
                            stroke="hsl(var(--warning))" strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - atsScore / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span
                            className="text-3xl font-display font-bold text-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {dynamicAtsScore}%
                          </motion.span>
                          <span className="text-xs text-muted-foreground">{t("ATS Compatible")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {t("Resume Match Score")}: {dynamicAtsScore}%
                      </span>
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="text-xs font-semibold text-foreground">{t("Insights")}:</p>
                      {resumeInsights.map((insight, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {insight}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...fadeUp(0.15)} className="lg:col-span-3">
                <Card className="h-full border-0 shadow-lg bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-display flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      {t("Extracted Skills")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dynamicSkills.slice(0,10).map((skill, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.08 }}
                          className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center gap-2">
                            {skill.verified ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-warning" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground">{skill.name}</p>
                              <p className="text-xs text-muted-foreground">{skill.level}</p>
                            </div>
                          </div>
                          {skill.verified && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">{t("Verified")}</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div {...fadeUp(0.2)}>
              <Card className="border-0 shadow-lg bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    {t("Improvement Tips")}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{t("Follow these tips to boost your ATS score")}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Dynamic Data rendering (Top 5 only, for cleaner UI) */}
                  {dynamicImprovements.length > 0 ? (
                    dynamicImprovements.slice(0, 5).map((item: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300 group/tip cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon || "💡"}</span>
                        <span className="text-sm font-medium text-foreground">{item.tip}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        item.impact === "High"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}>
                        {t(item.impact + " Impact")}
                      </span>
                    </motion.div>
                  ))
                  ) : (
                  <p className="text-sm text-muted-foreground italic">No specific improvements suggested by AI.</p>
                )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4">
              <div className="flex flex-wrap gap-4 mt-8">
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 group">
                <Button 
        onClick={downloadOptimizedResume} 
        disabled={!optimizedResume}
        className="bg-gradient-primary text-primary-foreground hover:opacity-90 group"
      ></Button>
                <Download className="h-4 w-4 mr-2" />
                {t("Download Optimized Resume")}
              </Button>
              <Button variant="outline" className="group" onClick={handleAutoOptimize}>
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                {t("AI Auto-Optimize")}
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
          </div> 
          {/* Preview Modal (Before vs After) - Add logic here */}
    {showOptimizeModal && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border shadow-2xl rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
    >
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> AI Resume Optimization
        </h2>
        <Button variant="ghost" size="icon" onClick={() => setShowOptimizeModal(false)}>✕</Button>
      </div>

      <div className="p-6 overflow-y-auto grid md:grid-cols-2 gap-6">
        {/* Left: Original */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Original Content</label>
          <div className="p-4 rounded-lg bg-muted text-sm font-mono whitespace-pre-wrap h-[400px] overflow-y-auto border">
            {rawResumeText}
          </div>
        </div>

        {/* Right: AI Optimized */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-primary">AI Optimized Version</label>
          <div className="p-4 rounded-lg bg-primary/5 text-sm font-mono whitespace-pre-wrap h-[400px] overflow-y-auto border border-primary/20">
            {optimizedResume}
          </div>
        </div>
      </div>
      <div className="p-6 border-t bg-muted/30 flex justify-end gap-3">
        <Button variant="outline" onClick={() => setShowOptimizeModal(false)}>Discard</Button>
        <Button onClick={downloadOptimizedResume} className="bg-gradient-primary">
          <Download className="h-4 w-4 mr-2" /> Download Optimized PDF
        </Button>
      </div>
    </motion.div>
  </div>
)}
      
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeAnalysis;
