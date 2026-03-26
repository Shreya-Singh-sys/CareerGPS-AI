

import { useState, useRef, useCallback, useEffect } from "react"; // Added useEffect
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowRight, ArrowLeft, User, Briefcase, Sparkles, MapPin, 
  GraduationCap, Clock, Building2, Check, Target, 
  TrendingUp, BookOpen, DollarSign, Camera, X, RotateCcw,
  Mic, MicOff, Waves // Added new icons
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useUserData } from "@/hooks/use-user-data";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ... (PROFESSIONS, CATEGORIES, etc. same rahenge)
const PROFESSIONS = ["Data Analyst", "Software Engineer", "Carpenter", "Electrician", "Plumber", "Driver", "Helper", "Teacher", "Nurse", "Accountant", "Marketing Manager", "Graphic Designer", "Web Developer", "Mechanic", "Chef", "Security Guard", "Delivery Executive", "Warehouse Associate", "Sales Executive", "HR Manager", "Content Writer", "Customer Support", "Pharmacist", "Lab Technician", "Civil Engineer", "Architect"];
const PROFESSION_CATEGORIES = ["Technology", "Business", "Trades", "Healthcare", "Creative", "Education", "Student", "Other"];
const EDUCATION_LEVELS = ["High School", "Diploma", "Bachelor's", "Master's", "PhD"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];
const EXPERIENCE_OPTIONS = ["0-1 year", "1-3 Years", "3-5 Years", "5+ Years"];
const COMMON_SKILLS: Record<string, string[]> = { "Technology": ["Python", "JavaScript", "SQL", "React", "Data Analysis", "Cloud Computing", "Git", "Machine Learning"], "Business": ["Excel", "Communication", "Project Management", "CRM", "Negotiation", "Analytics", "Marketing", "Sales"], "Trades": ["Welding", "Wiring", "Blueprint Reading", "Power Tools", "Safety Standards", "Plumbing", "HVAC", "Carpentry"], "Healthcare": ["Patient Care", "Medical Records", "First Aid", "Medication Management", "Lab Analysis", "Counseling"], "Creative": ["Photoshop", "Illustrator", "UI Design", "Typography", "Video Editing", "Content Writing", "Copywriting"], "Education": ["Curriculum Design", "Classroom Management", "Assessment", "EdTech", "Communication", "Mentoring"], "Student": ["Communication", "Teamwork", "Problem Solving", "Microsoft Office", "Research", "Time Management"], "Other": ["Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership", "Adaptability"] };
const LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
const STEPS = [{ num: 1, label: "Enter Details" }, { num: 2, label: "AI Analysis" }, { num: 3, label: "Career Insights" }];

const NoResumePage = () => {
  const { t } = useTranslation();
  const { userData, updateUserData, addSkills } = useUserData();
  const navigate = useNavigate();

  // --- CAMERA STATES ---
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  // --- VOICE STATES ---
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  // --- FORM STATES ---
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState(userData.name || "");
  const [profession, setProfession] = useState("");
  const [profSearch, setProfSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [locSearch, setLocSearch] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // --- VOICE LOGIC (Web Speech API) ---
  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Supporting Indian English
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      extractDataFromVoice(currentTranscript.toLowerCase());
    };

    recognition.start();
  };

  // Basic AI logic to fill fields based on voice
  const extractDataFromVoice = (text: string) => {
    // Name Extraction
    if (text.includes("my name is") || text.includes("i am")) {
      const parts = text.split(/is|am/);
      if (parts[1]) setName(parts[1].trim());
    }
    // Profession Extraction
    PROFESSIONS.forEach(p => {
      if (text.includes(p.toLowerCase())) {
        setProfession(p);
        setProfSearch(p);
      }
    });
    // Location Extraction
    LOCATIONS.forEach(l => {
      if (text.includes(l.toLowerCase())) {
        setLocation(l);
        setLocSearch(l);
      }
    });
  };

  // --- CAMERA LOGIC ---
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      console.log("Image Captured. Extracting data...");
    }
  }, [webcamRef]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const addCustomSkill = () => {
    const s = skillInput.trim();
    if (s && !selectedSkills.includes(s)) {
      setSelectedSkills((prev) => [...prev, s]);
      setSkillInput("");
    }
  };

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setCurrentStep(2);
    setLoadingMsg(0);
    try {
      const response = await fetch("http://localhost:5000/api/analysis/manual-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, jobRole: profession || profSearch, skills: selectedSkills, experience, education, location: location || locSearch, jobType }),
      });
      const data = await response.json();
      setAnalysisResult(data);
      for (let i = 0; i < 3; i++) { setTimeout(() => setLoadingMsg(i), i * 800); }
      setTimeout(() => setCurrentStep(3), 2500);
    } catch (error) {
      console.error("Error:", error);
      setCurrentStep(1);
    }
  };

  const handleViewDashboard = () => {
    if (!analysisResult) return;
    localStorage.setItem("userEntryType", "no-resume");
    localStorage.setItem("careerInsights", JSON.stringify(analysisResult));
    updateUserData({ name: name.trim(), targetRole: analysisResult.targetRole || profession || profSearch, location: location || locSearch, resumeAnalyzed: true });
    window.location.href = "/dashboard";
  };

  const isFormValid = name.trim() !== "" && (profession !== "" || profSearch !== "") && experience !== "" && (location !== "" || locSearch !== "");
  const filteredProfs = PROFESSIONS.filter((p) => p.toLowerCase().includes(profSearch.toLowerCase()));
  const suggestedSkills = COMMON_SKILLS[category] || COMMON_SKILLS["Other"];
  const loadingMessages = [t("Analyzing your profile..."), t("Matching jobs..."), t("Building roadmap...")];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background p-4">
      {/* Background Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20 bg-primary blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>

      <motion.button onClick={() => navigate("/smart-entry")} className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("Back")}
      </motion.button>

      <div className="relative z-10 w-full max-w-lg">
        {/* Step Indicator */}
        <div className="flex items-center justify-between px-2 pb-6">
          {STEPS.map((step) => (
            <div key={step.num} className="flex items-center gap-1.5 flex-1">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step.num ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                {currentStep > step.num ? <Check className="h-4 w-4" /> : step.num}
              </div>
              <span className={`text-[10px] md:text-xs font-medium ${currentStep >= step.num ? "text-primary" : "text-muted-foreground"}`}>{t(step.label)}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-3xl border bg-card/90 backdrop-blur-2xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">{t("Quick Profile")}</h1>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={() => setShowCamera(true)} className="gap-2 border-primary/20 hover:bg-primary/5 rounded-xl">
                    <Camera className="h-4 w-4 text-primary" /> {t("Scan")}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("Full Name")}</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Category")}</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{PROFESSION_CATEGORIES.map(c => <SelectItem key={c} value={c}>{t(c)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("Target Job Role")}</Label>
                  <Input value={profSearch} onChange={(e) => {setProfSearch(e.target.value); setProfession("");}} placeholder="e.g. Electrician" className="rounded-xl h-11" />
                  {profSearch && profession === "" && (
                    <ScrollArea className="h-24 border rounded-xl mt-1 bg-background/50 overflow-hidden">
                      {filteredProfs.map(p => <div key={p} className="p-2 text-sm hover:bg-primary/10 cursor-pointer" onClick={() => {setProfession(p); setProfSearch(p);}}>{p}</div>)}
                    </ScrollArea>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> {t("Skills")}</Label>
                  <div className="flex gap-2">
                    <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())} placeholder="Add skill..." className="rounded-xl h-11" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {suggestedSkills.slice(0, 5).map(s => (
                      <Badge key={s} variant={selectedSkills.includes(s) ? "default" : "outline"} className="cursor-pointer rounded-lg px-3 py-1" onClick={() => toggleSkill(s)}>{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("Experience")}</Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{EXPERIENCE_OPTIONS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Location")}</Label>
                    <Input value={locSearch} onChange={(e) => {setLocSearch(e.target.value); setLocation("");}} placeholder="City" className="rounded-xl h-11" />
                  </div>
                </div>

                <Button onClick={handleGenerate} disabled={!isFormValid} className="w-full h-12 font-bold gap-2 rounded-xl bg-primary hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                  <Sparkles className="h-5 w-5" /> {t("Generate Career Insights")} <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
             <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "var(--gradient-primary)" }}>
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <div className="space-y-2">
                  {loadingMessages.map((msg, i) => (
                    <p key={i} className={`text-sm font-medium transition-opacity ${loadingMsg >= i ? "opacity-100" : "opacity-30"}`}>{msg}</p>
                  ))}
                </div>
             </div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border bg-card/80 backdrop-blur-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">{t("Your Career Snapshot")}</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                 {/* Snapshots items (Target role, Salary etc) */}
                 <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Target className="h-5 w-5 text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">{t("Target Role")}</p>
                  <p className="font-bold text-sm truncate">{analysisResult?.targetRole || profession || "Not Specified"}</p>
                </div>
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                  <DollarSign className="h-5 w-5 text-green-500 mb-1" />
                  <p className="text-xs text-muted-foreground">{t("Expected Salary")}</p>
                  <p className="font-bold text-sm">{analysisResult?.marketData?.salaryRange || "₹4-7 LPA"}</p>
                </div>
              </div>
              <Button onClick={handleViewDashboard} className="w-full h-12 font-bold gap-2" style={{ background: "var(--gradient-primary)" }}>
                {t("Go to Dashboard")} <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- LIVE CAMERA + VOICE MODAL --- */}
      <AnimatePresence>
        {showCamera && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
              
              <div className="p-6 flex justify-between items-center bg-card border-b border-white/5">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> {t("AI Smart Scan")}</h3>
                    <p className="text-[10px] text-muted-foreground">Scan ID or Speak your details</p>
                </div>
                <button onClick={() => setShowCamera(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="h-6 w-6" /></button>
              </div>

              {/* LIVE WEBCAM */}
              <div className="aspect-[4/3] bg-black relative">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "user" }}
                />
                
                {/* Visual Feedback for Voice */}
                <AnimatePresence>
                    {isListening && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-primary/20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                            <div className="flex gap-1 mb-4">
                                {[1,2,3,4,5].map(i => (
                                    <motion.div key={i} animate={{ height: [10, 30, 10] }} transition={{ repeat: Infinity, duration: 0.5, delay: i*0.1 }} className="w-1.5 bg-white rounded-full" />
                                ))}
                            </div>
                            <p className="text-white font-bold text-lg drop-shadow-md">Listening...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>

              {/* VOICE CONTROLS */}
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-center">
                    <Button 
                        onClick={startVoiceRecording} 
                        className={`h-20 w-20 rounded-full transition-all duration-500 ${isListening ? 'bg-red-500 scale-110 shadow-red-500/50' : 'bg-primary shadow-primary/30'} shadow-2xl`}
                    >
                        {isListening ? <Waves className="h-8 w-8 animate-pulse" /> : <Mic className="h-8 w-8" />}
                    </Button>
                </div>

                <div className="text-center">
                    <h4 className="font-bold text-sm mb-1">{isListening ? "I'm listening..." : "Tap to Speak"}</h4>
                    <p className="text-xs text-muted-foreground px-4">"Mera naam [Name] hai aur main [Job] dhoond raha hoon..."</p>
                </div>

                {transcript && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted/50 p-4 rounded-2xl border border-white/5">
                        <p className="text-xs italic text-primary font-medium">Extracted: "{transcript}"</p>
                    </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                    <Button onClick={capture} variant="outline" className="flex-1 h-12 rounded-xl gap-2 border-primary/20">
                        <Camera className="h-4 w-4" /> {t("Take Photo")}
                    </Button>
                    <Button onClick={() => setShowCamera(false)} className="flex-1 h-12 rounded-xl bg-primary text-white font-bold">
                        {t("Done")}
                    </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoResumePage;


