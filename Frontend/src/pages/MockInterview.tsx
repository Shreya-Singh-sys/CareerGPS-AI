
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, MicOff, ArrowRight, RotateCcw, CheckCircle2, Target, Brain, 
  MessageSquare, ChevronRight, Star, Lightbulb, Video, Settings, X, Loader2, Award, Languages, BarChart3
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useSearchParams } from "react-router-dom";

// Upgraded Modal Component (Larger and Better Design)
const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative z-50 border border-white/10"
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"><X className="h-6 w-6" /></button>
        {children}
      </motion.div>
    </div>
  );
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const ROLES = ["Data Analyst", "Software Engineer", "Carpenter", "Electrician", "Plumber", "Driver", "Chef", "Nurse", "Teacher", "Marketing Manager", "Sales Executive", "Web Developer", "Mechanic", "Accountant"];
const SKILLS = ["React", "JavaScript", "Python", "SQL", "Project Management", "Customer Service", "Communication", "Problem Solving", "Digital Marketing", "Cooking", "Driving Rules"];

interface QuestionSet {
  question: string;
  idealAnswer: string;
  sampleFeedback: {
    correctness: number;
    confidence: number;
    clarity: number;
    improvements: string;
  };
}

// Voice Indicator Animation Component
const VoiceIndicator = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <motion.div
      initial={{ scale: 1, opacity: 0.5 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
      className="absolute h-full w-full bg-red-500 rounded-full"
    />
    <motion.div
      initial={{ scale: 1, opacity: 0.8 }}
      animate={{ scale: 1.8, opacity: 0 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
      className="absolute h-full w-full bg-red-400 rounded-full"
    />
  </div>
);

const MockInterview = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "";
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- ROLE STATES ---
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [roleSearch, setRoleSearch] = useState(initialRole);
  const [questions, setQuestions] = useState<QuestionSet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [realTimeFeedback, setRealTimeFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showIdealRole, setShowIdealRole] = useState(false);

  // --- SKILL STATES ---
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [skillStarted, setSkillStarted] = useState(false);
  const [currentSkillQ, setCurrentSkillQ] = useState(0);
  const [skillAnswer, setSkillAnswer] = useState("");
  const [skillSubmitted, setSkillSubmitted] = useState(false);
  const [skillQuestions, setSkillQuestions] = useState<QuestionSet[]>([]);
  const [isSkillGenerating, setIsSkillGenerating] = useState(false);
  const [skillFeedback, setSkillFeedback] = useState<any>(null);
  const [isSkillAnalyzing, setIsSkillAnalyzing] = useState(false);
  const [showIdealSkill, setShowIdealSkill] = useState(false);

  // --- LIVE INTERVIEW STATES ---
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveStarted, setLiveStarted] = useState(false);
  const [liveConfig, setLiveConfig] = useState({ role: "", difficulty: "Mid-Level", language: "English" });
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [liveQuestions, setLiveQuestions] = useState<QuestionSet[]>([]);
  const [currentLiveQ, setCurrentLiveQ] = useState(0);
  const [showFinalReport, setShowFinalReport] = useState(false);


  // --- COMMON VOICE LOGIC ---
  const startListening = (target: "role" | "skill" | "live") => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (target === "role") setAnswer(transcript);
      else if (target === "skill") setSkillAnswer(transcript);
      else setAnswer(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // --- ROLE LOGIC ---
  // const fetchAIQuestions = async (roleToUse: string) => {
  //   if (!roleToUse) return;
  //   setIsGenerating(true);
  //   try {
  //     const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ role: roleToUse }),
  //     });
  //     const data = await response.json();
  //     if (response.ok && Array.isArray(data)) {
  //       setQuestions(data);
  //       setStarted(true);
  //     }
  //   } finally { setIsGenerating(false); }
  // };
  const fetchAIQuestions = async (roleToUse: string) => {
  if (!roleToUse) return;
  setIsGenerating(true);
  try {
    const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: roleToUse, difficulty: "Mid-Level", language: "English" }),
    });
    const data = await response.json();
    
    // Check if data is really an array
    if (Array.isArray(data) && data.length > 0) {
      setQuestions(data);
      setStarted(true);
    } else {
      console.error("Failed to load questions:", data.error);
      alert("AI failed to generate questions. Please try again.");
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  } finally { setIsGenerating(false); }
};
  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !questions[currentQ]) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("http://localhost:5000/api/analysis/analyze-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questions[currentQ].question, answer, role: selectedRole }),
      });
      const data = await response.json();
      if (response.ok) { setRealTimeFeedback(data); setSubmitted(true); }
    } finally { setIsAnalyzing(false); }
  };

  // --- SKILL LOGIC ---
  const fetchSkillQuestions = async (skillToUse: string) => {
    if (!skillToUse) return;
    setIsSkillGenerating(true);
    try {
      const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: `Specialist in ${skillToUse}` }),
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setSkillQuestions(data);
        setSkillStarted(true);
      }
    } finally { setIsSkillGenerating(false); }
  };

  const handleSkillSubmit = async () => {
    if (!skillAnswer.trim() || !skillQuestions[currentSkillQ]) return;
    setIsSkillAnalyzing(true);
    try {
      const response = await fetch("http://localhost:5000/api/analysis/analyze-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: skillQuestions[currentSkillQ].question, answer: skillAnswer, role: selectedSkill }),
      });
      const data = await response.json();
      if (response.ok) { setSkillFeedback(data); setSkillSubmitted(true); }
    } finally { setIsSkillAnalyzing(false); }
  };

  // --- LIVE LOGIC ---
  const startLiveInterview = async () => {
    setIsLiveLoading(true);
    setShowLiveModal(false);
    try {
      const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            role: liveConfig.role, 
            difficulty: liveConfig.difficulty,
            language: liveConfig.language 
        }),
      });
      const data = await response.json();
      setLiveQuestions(data);
      setLiveStarted(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } finally { setIsLiveLoading(false); }
  };

  const MetricBar = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div 
          className="h-full rounded-full bg-gradient-primary" 
          initial={false}
          animate={{ width: `${value}%` }} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          layout 
        />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-12 relative">
      
      {/* 1. LIVE INTERVIEW TRIGGER */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowLiveModal(true)} className="bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 text-white rounded-full px-6 shadow-lg gap-2">
          <Video className="h-4 w-4 animate-pulse" /> Live AI Interview
        </Button>
      </div>

      {/* 2. ROLE-BASED SECTION */}
      <section className="space-y-8">
        <motion.div {...fadeUp()}>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
            {t("Mock")} <span className="text-gradient-primary">{t("Interview")}</span>
          </h1>
          {selectedRole && <Badge variant="outline" className="mt-2 text-primary border-primary/20">Role: {selectedRole}</Badge>}
        </motion.div>

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div key="loading" className="text-center py-20"><RotateCcw className="h-10 w-10 animate-spin mx-auto text-primary" /><p className="mt-4">Crafting questions...</p></motion.div>
          ) : !started ? (
            <motion.div key="select" {...fadeUp(0.1)}>
              <Card className="border-0 shadow-lg bg-gradient-card">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> {t("Select a Role")}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input value={roleSearch} onChange={(e) => { setRoleSearch(e.target.value); setSelectedRole(""); }} placeholder="Type any role..." />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {ROLES.filter(r => r.toLowerCase().includes(roleSearch.toLowerCase())).map((role) => (
                      <button key={role} onClick={() => { setSelectedRole(role); setRoleSearch(role); }} className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedRole === role ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted hover:bg-muted/80"}`}>{role}</button>
                    ))}
                  </div>
                  <Button onClick={() => fetchAIQuestions(roleSearch || selectedRole)} disabled={!roleSearch} className="w-full bg-gradient-primary h-11">{t("Start Interview")} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="interview" {...fadeUp(0.1)} className="space-y-6">
              <Badge variant="secondary">Question {currentQ + 1}/{questions.length}</Badge>
              <Card className="border-0 shadow-lg bg-gradient-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3"><MessageSquare className="text-primary mt-1" /><p className="text-lg font-medium">{questions[currentQ]?.question}</p></div>
                  {!submitted ? (
                    <div className="space-y-3">
                      <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} placeholder="Type or use voice..." />
                      <div className="flex gap-2">
                        <Button onClick={handleSubmitAnswer} disabled={isAnalyzing || !answer.trim()} className="bg-gradient-primary">{isAnalyzing ? "Analyzing..." : "Submit Answer"}</Button>
                        <div className="relative inline-flex">
                          {isListening && <VoiceIndicator />}
                          <Button 
                            onClick={() => startListening("role")} 
                            variant={isListening ? "destructive" : "outline"} 
                            className={`gap-2 relative z-10 transition-all duration-300 ${isListening ? 'scale-110 shadow-lg' : ''}`}
                          >
                            <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} /> 
                            {isListening ? "Listening..." : "Voice"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        {realTimeFeedback && ["correctness", "confidence", "clarity"].map((m) => <MetricBar key={m} label={m} value={realTimeFeedback[m]} />)}
                      </div>
                      <p className="text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg">{realTimeFeedback?.improvements}</p>
                      
                      {showIdealRole && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 mb-4 overflow-hidden">
                           <p className="text-sm font-semibold text-yellow-700 flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4" /> Ideal Answer:</p>
                           <p className="text-sm text-muted-foreground italic">{questions[currentQ]?.idealAnswer}</p>
                        </motion.div>
                      )}

                      <div className="flex justify-between items-center gap-4">
                        <Button variant="outline" onClick={() => setShowIdealRole(!showIdealRole)} className="flex-1 border-yellow-500/50 text-yellow-700">
                           {showIdealRole ? "Hide Ideal Answer" : "Compare with Ideal Answer"}
                        </Button>
                        <Button onClick={() => { if (currentQ < questions.length - 1) { setCurrentQ(q => q + 1); setAnswer(""); setSubmitted(false); setShowIdealRole(false); } else { setStarted(false); } }} className="bg-gradient-primary flex-1">Next</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <hr className="opacity-10" />

      {/* 3. SKILL-BASED SECTION */}
      <section className="space-y-8 pb-10">
        <motion.div {...fadeUp()}>
          <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            Skill-Wise <span className="text-gradient-primary">Assessment</span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSkillGenerating ? (
            <motion.div key="skill-loading" className="text-center py-10"><RotateCcw className="h-8 w-8 animate-spin mx-auto text-primary" /></motion.div>
          ) : !skillStarted ? (
            <motion.div key="skill-select" {...fadeUp()}>
              <Card className="border border-primary/10 shadow-md bg-card/50">
                <CardContent className="p-6 space-y-4">
                  <Input value={skillSearch} onChange={(e) => { setSkillSearch(e.target.value); setSelectedSkill(""); }} placeholder="Search skill..." />
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).map((skill) => (
                      <Badge key={skill} onClick={() => { setSelectedSkill(skill); setSkillSearch(skill); }} className={`cursor-pointer ${selectedSkill === skill ? "bg-primary text-white" : "bg-muted"}`} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <Button onClick={() => fetchSkillQuestions(skillSearch || selectedSkill)} disabled={!skillSearch} className="w-full bg-slate-900 text-white">Test My Skill</Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="skill-test" {...fadeUp()} className="space-y-4">
              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Skill: {selectedSkill}</Badge>
              <Card className="border-2 border-primary/5 shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <p className="text-lg font-semibold">{skillQuestions[currentSkillQ]?.question}</p>
                  {!skillSubmitted ? (
                    <div className="space-y-3">
                      <Textarea value={skillAnswer} onChange={(e) => setSkillAnswer(e.target.value)} placeholder="Explain in detail..." />
                      <div className="flex gap-2">
                        <Button onClick={handleSkillSubmit} disabled={isSkillAnalyzing || !skillAnswer.trim()}>{isSkillAnalyzing ? "Evaluating..." : "Check Knowledge"}</Button>
                        <div className="relative inline-flex">
                          {isListening && <VoiceIndicator />}
                          <Button 
                            onClick={() => startListening("skill")} 
                            variant={isListening ? "destructive" : "outline"} 
                            size="icon" 
                            className={`relative z-10 ${isListening ? 'scale-110' : ''}`}
                          >
                            <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-lg border">
                        {skillFeedback && ["correctness", "clarity"].map((m) => <MetricBar key={m} label={m} value={skillFeedback[m]} />)}
                        <p className="mt-4 text-sm italic">"{skillFeedback?.improvements}"</p>
                      </div>
                      
                      {showIdealSkill && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 mb-4 overflow-hidden">
                           <p className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4" /> Ideal Answer:</p>
                           <p className="text-sm text-muted-foreground italic">{skillQuestions[currentSkillQ]?.idealAnswer}</p>
                        </motion.div>
                      )}

                      <div className="flex justify-between items-center gap-4">
                        <Button variant="outline" onClick={() => setShowIdealSkill(!showIdealSkill)} className="flex-1 border-blue-500/50 text-blue-700">
                           {showIdealSkill ? "Hide Ideal" : "Compare with Ideal Answer"}
                        </Button>
                        <Button onClick={() => { if (currentSkillQ < skillQuestions.length - 1) { setCurrentSkillQ(q => q + 1); setSkillAnswer(""); setSkillSubmitted(false); setShowIdealSkill(false); } else { setSkillStarted(false); } }} className="w-full flex-1">Next Question</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. UPGRADED LIVE INTERVIEW MODAL (Bigger size + Language) */}
      <Modal isOpen={showLiveModal} onClose={() => setShowLiveModal(false)}>
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="text-primary h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Setup Live Session</h2>
            <p className="text-muted-foreground">Customize your real-time AI interview environment</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                <Target className="h-4 w-4 text-primary" /> Professional Role
              </label>
              <Input 
                className="h-12 rounded-xl border-2 focus:border-primary transition-all" 
                placeholder="e.g. Senior Java Developer" 
                onChange={(e) => setLiveConfig({...liveConfig, role: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                  <BarChart3 className="h-4 w-4 text-primary" /> Difficulty Level
                </label>
                <select 
                  className="w-full h-12 rounded-xl border-2 bg-background px-3 focus:border-primary outline-none transition-all" 
                  onChange={(e) => setLiveConfig({...liveConfig, difficulty: e.target.value})}
                >
                  <option>Beginner</option>
                  <option selected>Mid-Level</option>
                  <option>Expert / Senior</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                  <Languages className="h-4 w-4 text-primary" /> Interview Language
                </label>
                <select 
                  className="w-full h-12 rounded-xl border-2 bg-background px-3 focus:border-primary outline-none transition-all" 
                  onChange={(e) => setLiveConfig({...liveConfig, language: e.target.value})}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>
            </div>
          </div>

          <Button 
            onClick={startLiveInterview} 
            className="w-full h-14 rounded-2xl bg-primary text-lg font-bold shadow-xl hover:shadow-primary/20 transition-all mt-4"
          >
            Start Real-Time Session <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Modal>

      <AnimatePresence>
        {liveStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video shadow-2xl"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" /></div>
              <div className="space-y-6">
                <Badge className="bg-primary">Question {currentLiveQ + 1} of 10</Badge>
                <h2 className="text-2xl font-semibold">{liveQuestions[currentLiveQ]?.question}</h2>
                <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Speak or type..." rows={6} />
                <div className="flex gap-4">
                  <div className="relative inline-flex flex-1">
                    {isListening && <VoiceIndicator />}
                    <Button 
                      onClick={() => startListening("live")} 
                      variant={isListening ? "destructive" : "secondary"} 
                      className={`w-full h-14 relative z-10 transition-all ${isListening ? 'scale-105' : ''}`}
                    >
                      <Mic className={isListening ? 'animate-pulse' : ''} />
                    </Button>
                  </div>
                  <Button onClick={() => { if (currentLiveQ < 9) setCurrentLiveQ(q => q + 1); else { setLiveStarted(false); setShowFinalReport(true); } setAnswer(""); }} className="flex-1 bg-gradient-primary h-14">Next Question</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* {showFinalReport && (
        <div className="fixed inset-0 z-[70] bg-background p-10 overflow-y-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Award className="h-16 w-16 text-yellow-500 mx-auto" />
            <h1 className="text-4xl font-bold">Interview Completed!</h1>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-6 font-bold text-2xl text-primary">85% Correct</Card>
              <Card className="p-6 font-bold text-2xl text-green-500">90% Confidence</Card>
              <Card className="p-6 font-bold text-2xl text-blue-500">Gold Badge</Card>
            </div>
            <Button onClick={() => setShowFinalReport(false)} className="w-full h-12">Close Report</Button>
          </div>
        </div>
      )} */}
      {showFinalReport && (
        <div className="fixed inset-0 z-[70] bg-background p-4 sm:p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header Summary */}
            <div className="text-center space-y-4">
              <Award className="h-16 w-16 text-yellow-500 mx-auto animate-bounce" />
              <h1 className="text-4xl font-bold tracking-tight">Interview Performance Report</h1>
              <p className="text-muted-foreground">Review your answers against AI-generated benchmarks</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Average Accuracy</p>
                  <p className="text-3xl font-bold text-primary">85%</p>
                </Card>
                <Card className="p-6 bg-green-500/5 border-green-500/20">
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Confidence Score</p>
                  <p className="text-3xl font-bold text-green-600">92%</p>
                </Card>
                <Card className="p-6 bg-blue-500/5 border-blue-500/20">
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Status</p>
                  <p className="text-3xl font-bold text-blue-600">Qualified</p>
                </Card>
              </div>
            </div>

            {/* Row-wise Analysis Table */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" /> 
                Detailed Q&A Analysis
              </h2>
              
              <div className="border rounded-2xl overflow-hidden shadow-sm">
                <div className="hidden md:grid grid-cols-12 bg-muted/50 p-4 font-bold text-sm uppercase tracking-wider text-muted-foreground">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Interview Question</div>
                  <div className="col-span-6">Ideal Benchmarks & Insights</div>
                </div>

                <div className="divide-y divide-border">
                  {(liveQuestions.length > 0 ? liveQuestions : questions).map((q, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 gap-4 hover:bg-muted/20 transition-colors">
                      {/* Question Number */}
                      <div className="col-span-1 font-bold text-primary text-lg">
                        {index + 1}.
                      </div>

                      {/* Question Content */}
                      <div className="col-span-11 md:col-span-5 space-y-2">
                        <p className="font-semibold text-lg leading-tight">{q.question}</p>
                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700">
                          <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Your Context:</p>
                          <p className="text-sm italic">Analysis based on the role of {liveConfig.role || selectedRole}.</p>
                        </div>
                      </div>

                      {/* Ideal Answer Content */}
                      <div className="col-span-11 md:col-start-7 md:col-span-6 space-y-4">
                        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400 font-bold text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            IDEAL AI RESPONSE
                          </div>
                          <p className="text-sm leading-relaxed text-foreground/80">
                            {q.idealAnswer}
                          </p>
                        </div>

                        {/* Optional Logic for feedback per question if you have it */}
                        <div className="flex items-center gap-3">
                           <Badge variant="outline" className="text-[10px] py-0">Logic: Structured</Badge>
                           <Badge variant="outline" className="text-[10px] py-0">Tone: Professional</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pb-10">
              <Button onClick={() => setShowFinalReport(false)} size="lg" className="px-12 h-14 rounded-full shadow-xl">
                Finish & Go Back
              </Button>
            </div>
          </div>
        </div>
      )}
      {isLiveLoading && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center text-white">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" /><p>AI Interviewer is arriving...</p>
        </div>
      )}
    </div>
  );
};

export default MockInterview;




// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Mic, MicOff, ArrowRight, RotateCcw, CheckCircle2, Target, Brain, 
//   MessageSquare, ChevronRight, Star, Lightbulb, Video, Settings, X, Loader2, Award, Languages, BarChart3
// } from "lucide-react";
// import { useTranslation } from "@/hooks/use-translation";
// import { useSearchParams } from "react-router-dom";

// // Upgraded Modal Component
// const Modal = ({ isOpen, onClose, children }: any) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <motion.div 
//         initial={{ opacity: 0 }} 
//         animate={{ opacity: 1 }} 
//         onClick={onClose}
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm"
//       />
//       <motion.div 
//         initial={{ scale: 0.9, opacity: 0, y: 20 }} 
//         animate={{ scale: 1, opacity: 1, y: 0 }} 
//         className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative z-50 border border-white/10"
//       >
//         <button onClick={onClose} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"><X className="h-6 w-6" /></button>
//         {children}
//       </motion.div>
//     </div>
//   );
// };

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.5, delay },
// });

// const ROLES = ["Data Analyst", "Software Engineer", "Carpenter", "Electrician", "Plumber", "Driver", "Chef", "Nurse", "Teacher", "Marketing Manager", "Sales Executive", "Web Developer", "Mechanic", "Accountant"];
// const SKILLS = ["React", "JavaScript", "Python", "SQL", "Project Management", "Customer Service", "Communication", "Problem Solving", "Digital Marketing", "Cooking", "Driving Rules"];

// interface QuestionSet {
//   question: string;
//   idealAnswer: string;
//   sampleFeedback?: {
//     correctness: number;
//     confidence: number;
//     clarity: number;
//     improvements: string;
//   };
// }

// const VoiceIndicator = () => (
//   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//     <motion.div
//       initial={{ scale: 1, opacity: 0.5 }}
//       animate={{ scale: 2.2, opacity: 0 }}
//       transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
//       className="absolute h-full w-full bg-red-500 rounded-full"
//     />
//     <motion.div
//       initial={{ scale: 1, opacity: 0.8 }}
//       animate={{ scale: 1.8, opacity: 0 }}
//       transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
//       className="absolute h-full w-full bg-red-400 rounded-full"
//     />
//   </div>
// );

// const MockInterview = () => {
//   const { t } = useTranslation();
//   const [searchParams] = useSearchParams();
//   const initialRole = searchParams.get("role") || "";
//   const videoRef = useRef<HTMLVideoElement>(null);

//   // --- NEW STATE FOR HISTORY ---
//   const [interviewHistory, setInterviewHistory] = useState<any[]>([]);

//   // --- ROLE STATES ---
//   const [selectedRole, setSelectedRole] = useState(initialRole);
//   const [started, setStarted] = useState(false);
//   const [currentQ, setCurrentQ] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [roleSearch, setRoleSearch] = useState(initialRole);
//   const [questions, setQuestions] = useState<QuestionSet[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [realTimeFeedback, setRealTimeFeedback] = useState<any>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [showIdealRole, setShowIdealRole] = useState(false);

//   // --- SKILL STATES ---
//   const [selectedSkill, setSelectedSkill] = useState("");
//   const [skillSearch, setSkillSearch] = useState("");
//   const [skillStarted, setSkillStarted] = useState(false);
//   const [currentSkillQ, setCurrentSkillQ] = useState(0);
//   const [skillAnswer, setSkillAnswer] = useState("");
//   const [skillSubmitted, setSkillSubmitted] = useState(false);
//   const [skillQuestions, setSkillQuestions] = useState<QuestionSet[]>([]);
//   const [isSkillGenerating, setIsSkillGenerating] = useState(false);
//   const [skillFeedback, setSkillFeedback] = useState<any>(null);
//   const [isSkillAnalyzing, setIsSkillAnalyzing] = useState(false);
//   const [showIdealSkill, setShowIdealSkill] = useState(false);

//   // --- LIVE INTERVIEW STATES ---
//   const [showLiveModal, setShowLiveModal] = useState(false);
//   const [liveStarted, setLiveStarted] = useState(false);
//   const [liveConfig, setLiveConfig] = useState({ role: "", difficulty: "Mid-Level", language: "English" });
//   const [isLiveLoading, setIsLiveLoading] = useState(false);
//   const [liveQuestions, setLiveQuestions] = useState<QuestionSet[]>([]);
//   const [currentLiveQ, setCurrentLiveQ] = useState(0);
//   const [showFinalReport, setShowFinalReport] = useState(false);

//   const startListening = (target: "role" | "skill" | "live") => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-IN';
//     recognition.onstart = () => setIsListening(true);
//     recognition.onresult = (event: any) => {
//       const transcript = event.results[0][0].transcript;
//       if (target === "role") setAnswer(transcript);
//       else if (target === "skill") setSkillAnswer(transcript);
//       else setAnswer(transcript);
//       setIsListening(false);
//     };
//     recognition.onerror = () => setIsListening(false);
//     recognition.onend = () => setIsListening(false);
//     recognition.start();
//   };

//   const fetchAIQuestions = async (roleToUse: string) => {
//     if (!roleToUse) return;
//     setIsGenerating(true);
//     setInterviewHistory([]); // Clear history for new session
//     try {
//       const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ role: roleToUse, difficulty: "Mid-Level", language: "English" }),
//       });
//       const data = await response.json();
//       if (response.ok && Array.isArray(data)) {
//         setQuestions(data);
//         setStarted(true);
//       }
//     } finally { setIsGenerating(false); }
//   };
  
//   const handleSubmitAnswer = async () => {
//     if (!answer.trim() || !questions[currentQ]) return;
//     setIsAnalyzing(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/analysis/analyze-answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: questions[currentQ].question, answer, role: selectedRole }),
//       });
//       const data = await response.json();
//       if (response.ok) { 
//         setRealTimeFeedback(data); 
//         setSubmitted(true);
//         // Save to History
//         setInterviewHistory(prev => [...prev, {
//             question: questions[currentQ].question,
//             userAnswer: answer,
//             idealAnswer: questions[currentQ].idealAnswer,
//             feedback: data
//         }]);
//       }
//     } finally { setIsAnalyzing(false); }
//   };

//   const fetchSkillQuestions = async (skillToUse: string) => {
//     if (!skillToUse) return;
//     setIsSkillGenerating(true);
//     setInterviewHistory([]);
//     try {
//       const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ role: `Specialist in ${skillToUse}`, difficulty: "Mid-Level", language: "English" }),
//       });
//       const data = await response.json();
//       if (response.ok && Array.isArray(data)) {
//         setSkillQuestions(data);
//         setSkillStarted(true);
//       }
//     } finally { setIsSkillGenerating(false); }
//   };

//   const handleSkillSubmit = async () => {
//     if (!skillAnswer.trim() || !skillQuestions[currentSkillQ]) return;
//     setIsSkillAnalyzing(true);
//     try {
//       const response = await fetch("http://localhost:5000/api/analysis/analyze-answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: skillQuestions[currentSkillQ].question, answer: skillAnswer, role: selectedSkill }),
//       });
//       const data = await response.json();
//       if (response.ok) { 
//         setSkillFeedback(data); 
//         setSkillSubmitted(true); 
//         setInterviewHistory(prev => [...prev, {
//             question: skillQuestions[currentSkillQ].question,
//             userAnswer: skillAnswer,
//             idealAnswer: skillQuestions[currentSkillQ].idealAnswer,
//             feedback: data
//         }]);
//       }
//     } finally { setIsSkillAnalyzing(false); }
//   };

//   const startLiveInterview = async () => {
//     setIsLiveLoading(true);
//     setShowLiveModal(false);
//     setInterviewHistory([]);
//     try {
//       const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//             role: liveConfig.role, 
//             difficulty: liveConfig.difficulty,
//             language: liveConfig.language 
//         }),
//       });
//       const data = await response.json();
//       setLiveQuestions(data);
//       setLiveStarted(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } finally { setIsLiveLoading(false); }
//   };

//   // --- UPDATED LIVE SUBMIT LOGIC ---
//   const handleNextLiveQuestion = async () => {
//     if (!answer.trim()) return;
//     setIsLiveLoading(true); // Re-use loader for analysis
//     try {
//       const response = await fetch("http://localhost:5000/api/analysis/analyze-answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           question: liveQuestions[currentLiveQ].question, 
//           answer, 
//           role: liveConfig.role 
//         }),
//       });
//       const data = await response.json();
      
//       setInterviewHistory(prev => [...prev, {
//         question: liveQuestions[currentLiveQ].question,
//         userAnswer: answer,
//         idealAnswer: liveQuestions[currentLiveQ].idealAnswer,
//         feedback: data
//       }]);

//       if (currentLiveQ < liveQuestions.length - 1) {
//         setCurrentLiveQ(q => q + 1);
//         setAnswer("");
//       } else {
//         setLiveStarted(false);
//         setShowFinalReport(true);
//       }
//     } finally {
//       setIsLiveLoading(false);
//     }
//   };

//   const MetricBar = ({ label, value }: { label: string; value: number }) => (
//     <div className="space-y-1">
//       <div className="flex justify-between text-sm">
//         <span className="text-muted-foreground">{label}</span>
//         <span className="font-semibold text-foreground">{value}%</span>
//       </div>
//       <div className="h-2 rounded-full bg-muted overflow-hidden">
//         <motion.div 
//           className="h-full rounded-full bg-gradient-primary" 
//           initial={false}
//           animate={{ width: `${value}%` }} 
//           transition={{ duration: 0.8, ease: "easeOut" }} 
//           layout 
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-12 relative">
      
//       <div className="flex justify-end mb-4">
//         <Button onClick={() => setShowLiveModal(true)} className="bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 text-white rounded-full px-6 shadow-lg gap-2">
//           <Video className="h-4 w-4 animate-pulse" /> Live AI Interview
//         </Button>
//       </div>

//       <section className="space-y-8">
//         <motion.div {...fadeUp()}>
//           <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
//             {t("Mock")} <span className="text-gradient-primary">{t("Interview")}</span>
//           </h1>
//           {selectedRole && <Badge variant="outline" className="mt-2 text-primary border-primary/20">Role: {selectedRole}</Badge>}
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {isGenerating ? (
//             <motion.div key="loading" className="text-center py-20"><RotateCcw className="h-10 w-10 animate-spin mx-auto text-primary" /><p className="mt-4">Crafting questions...</p></motion.div>
//           ) : !started ? (
//             <motion.div key="select" {...fadeUp(0.1)}>
//               <Card className="border-0 shadow-lg bg-gradient-card">
//                 <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> {t("Select a Role")}</CardTitle></CardHeader>
//                 <CardContent className="space-y-4">
//                   <Input value={roleSearch} onChange={(e) => { setRoleSearch(e.target.value); setSelectedRole(""); }} placeholder="Type any role..." />
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
//                     {ROLES.filter(r => r.toLowerCase().includes(roleSearch.toLowerCase())).map((role) => (
//                       <button key={role} onClick={() => { setSelectedRole(role); setRoleSearch(role); }} className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedRole === role ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted hover:bg-muted/80"}`}>{role}</button>
//                     ))}
//                   </div>
//                   <Button onClick={() => fetchAIQuestions(roleSearch || selectedRole)} disabled={!roleSearch} className="w-full bg-gradient-primary h-11">{t("Start Interview")} <ArrowRight className="ml-2 h-4 w-4" /></Button>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ) : (
//             <motion.div key="interview" {...fadeUp(0.1)} className="space-y-6">
//               <Badge variant="secondary">Question {currentQ + 1}/{questions.length}</Badge>
//               <Card className="border-0 shadow-lg bg-gradient-card">
//                 <CardContent className="p-6 space-y-4">
//                   <div className="flex items-start gap-3"><MessageSquare className="text-primary mt-1" /><p className="text-lg font-medium">{questions[currentQ]?.question}</p></div>
//                   {!submitted ? (
//                     <div className="space-y-3">
//                       <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} placeholder="Type or use voice..." />
//                       <div className="flex gap-2">
//                         <Button onClick={handleSubmitAnswer} disabled={isAnalyzing || !answer.trim()} className="bg-gradient-primary">{isAnalyzing ? "Analyzing..." : "Submit Answer"}</Button>
//                         <div className="relative inline-flex">
//                           {isListening && <VoiceIndicator />}
//                           <Button 
//                             onClick={() => startListening("role")} 
//                             variant={isListening ? "destructive" : "outline"} 
//                             className={`gap-2 relative z-10 transition-all duration-300 ${isListening ? 'scale-110 shadow-lg' : ''}`}
//                           >
//                             <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} /> 
//                             {isListening ? "Listening..." : "Voice"}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="p-4 rounded-xl bg-muted/50">
//                         {realTimeFeedback && ["correctness", "confidence", "clarity"].map((m) => <MetricBar key={m} label={m} value={realTimeFeedback[m]} />)}
//                       </div>
//                       <p className="text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg">{realTimeFeedback?.improvements}</p>
                      
//                       {showIdealRole && (
//                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 mb-4 overflow-hidden">
//                            <p className="text-sm font-semibold text-yellow-700 flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4" /> Ideal Answer:</p>
//                            <p className="text-sm text-muted-foreground italic">{questions[currentQ]?.idealAnswer}</p>
//                         </motion.div>
//                       )}

//                       <div className="flex justify-between items-center gap-4">
//                         <Button variant="outline" onClick={() => setShowIdealRole(!showIdealRole)} className="flex-1 border-yellow-500/50 text-yellow-700">
//                            {showIdealRole ? "Hide Ideal Answer" : "Compare with Ideal Answer"}
//                         </Button>
//                         <Button onClick={() => { if (currentQ < questions.length - 1) { setCurrentQ(q => q + 1); setAnswer(""); setSubmitted(false); setShowIdealRole(false); } else { setStarted(false); setShowFinalReport(true); } }} className="bg-gradient-primary flex-1">Next</Button>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </section>

//       <hr className="opacity-10" />

//       <section className="space-y-8 pb-10">
//         <motion.div {...fadeUp()}>
//           <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
//             <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
//             Skill-Wise <span className="text-gradient-primary">Assessment</span>
//           </h2>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {isSkillGenerating ? (
//             <motion.div key="skill-loading" className="text-center py-10"><RotateCcw className="h-8 w-8 animate-spin mx-auto text-primary" /></motion.div>
//           ) : !skillStarted ? (
//             <motion.div key="skill-select" {...fadeUp()}>
//               <Card className="border border-primary/10 shadow-md bg-card/50">
//                 <CardContent className="p-6 space-y-4">
//                   <Input value={skillSearch} onChange={(e) => { setSkillSearch(e.target.value); setSelectedSkill(""); }} placeholder="Search skill..." />
//                   <div className="flex flex-wrap gap-2">
//                     {SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).map((skill) => (
//                       <Badge key={skill} onClick={() => { setSelectedSkill(skill); setSkillSearch(skill); }} className={`cursor-pointer ${selectedSkill === skill ? "bg-primary text-white" : "bg-muted"}`} variant="secondary">{skill}</Badge>
//                     ))}
//                   </div>
//                   <Button onClick={() => fetchSkillQuestions(skillSearch || selectedSkill)} disabled={!skillSearch} className="w-full bg-slate-900 text-white">Test My Skill</Button>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ) : (
//             <motion.div key="skill-test" {...fadeUp()} className="space-y-4">
//               <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Skill: {selectedSkill}</Badge>
//               <Card className="border-2 border-primary/5 shadow-xl">
//                 <CardContent className="p-6 space-y-4">
//                   <p className="text-lg font-semibold">{skillQuestions[currentSkillQ]?.question}</p>
//                   {!skillSubmitted ? (
//                     <div className="space-y-3">
//                       <Textarea value={skillAnswer} onChange={(e) => setSkillAnswer(e.target.value)} placeholder="Explain in detail..." />
//                       <div className="flex gap-2">
//                         <Button onClick={handleSkillSubmit} disabled={isSkillAnalyzing || !skillAnswer.trim()}>{isSkillAnalyzing ? "Evaluating..." : "Check Knowledge"}</Button>
//                         <div className="relative inline-flex">
//                           {isListening && <VoiceIndicator />}
//                           <Button 
//                             onClick={() => startListening("skill")} 
//                             variant={isListening ? "destructive" : "outline"} 
//                             size="icon" 
//                             className={`relative z-10 ${isListening ? 'scale-110' : ''}`}
//                           >
//                             <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div className="bg-slate-50 p-4 rounded-lg border">
//                         {skillFeedback && ["correctness", "clarity"].map((m) => <MetricBar key={m} label={m} value={skillFeedback[m]} />)}
//                         <p className="mt-4 text-sm italic">"{skillFeedback?.improvements}"</p>
//                       </div>
                      
//                       {showIdealSkill && (
//                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 mb-4 overflow-hidden">
//                            <p className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4" /> Ideal Answer:</p>
//                            <p className="text-sm text-muted-foreground italic">{skillQuestions[currentSkillQ]?.idealAnswer}</p>
//                         </motion.div>
//                       )}

//                       <div className="flex justify-between items-center gap-4">
//                         <Button variant="outline" onClick={() => setShowIdealSkill(!showIdealSkill)} className="flex-1 border-blue-500/50 text-blue-700">
//                            {showIdealSkill ? "Hide Ideal" : "Compare with Ideal Answer"}
//                         </Button>
//                         <Button onClick={() => { if (currentSkillQ < skillQuestions.length - 1) { setCurrentSkillQ(q => q + 1); setSkillAnswer(""); setSkillSubmitted(false); setShowIdealSkill(false); } else { setSkillStarted(false); setShowFinalReport(true); } }} className="w-full flex-1">Next Question</Button>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </section>

//       <Modal isOpen={showLiveModal} onClose={() => setShowLiveModal(false)}>
//         <div className="space-y-8">
//           <div className="text-center space-y-2">
//             <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
//               <Settings className="text-primary h-8 w-8" />
//             </div>
//             <h2 className="text-3xl font-bold tracking-tight">Setup Live Session</h2>
//             <p className="text-muted-foreground">Customize your real-time AI interview environment</p>
//           </div>

//           <div className="grid grid-cols-1 gap-6">
//             <div className="space-y-3">
//               <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
//                 <Target className="h-4 w-4 text-primary" /> Professional Role
//               </label>
//               <Input 
//                 className="h-12 rounded-xl border-2 focus:border-primary transition-all" 
//                 placeholder="e.g. Senior Java Developer" 
//                 onChange={(e) => setLiveConfig({...liveConfig, role: e.target.value})} 
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
//                   <BarChart3 className="h-4 w-4 text-primary" /> Difficulty Level
//                 </label>
//                 <select 
//                   className="w-full h-12 rounded-xl border-2 bg-background px-3 focus:border-primary outline-none transition-all" 
//                   onChange={(e) => setLiveConfig({...liveConfig, difficulty: e.target.value})}
//                 >
//                   <option>Beginner</option>
//                   <option selected>Mid-Level</option>
//                   <option>Expert / Senior</option>
//                 </select>
//               </div>

//               <div className="space-y-3">
//                 <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
//                   <Languages className="h-4 w-4 text-primary" /> Interview Language
//                 </label>
//                 <select 
//                   className="w-full h-12 rounded-xl border-2 bg-background px-3 focus:border-primary outline-none transition-all" 
//                   onChange={(e) => setLiveConfig({...liveConfig, language: e.target.value})}
//                 >
//                   <option value="English">English</option>
//                   <option value="Hindi">Hindi</option>
//                   <option value="Hinglish">Hinglish</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <Button 
//             onClick={startLiveInterview} 
//             className="w-full h-14 rounded-2xl bg-primary text-lg font-bold shadow-xl hover:shadow-primary/20 transition-all mt-4"
//           >
//             Start Real-Time Session <ArrowRight className="ml-2 h-5 w-5" />
//           </Button>
//         </div>
//       </Modal>

//       <AnimatePresence>
//         {liveStarted && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center p-4">
//             <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
//               <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video shadow-2xl"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" /></div>
//               <div className="space-y-6">
//                 <Badge className="bg-primary">Question {currentLiveQ + 1} of {liveQuestions.length}</Badge>
//                 <h2 className="text-2xl font-semibold">{liveQuestions[currentLiveQ]?.question}</h2>
//                 <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Speak or type..." rows={6} />
//                 <div className="flex gap-4">
//                   <div className="relative inline-flex flex-1">
//                     {isListening && <VoiceIndicator />}
//                     <Button 
//                       onClick={() => startListening("live")} 
//                       variant={isListening ? "destructive" : "secondary"} 
//                       className={`w-full h-14 relative z-10 transition-all ${isListening ? 'scale-105' : ''}`}
//                     >
//                       <Mic className={isListening ? 'animate-pulse' : ''} />
//                     </Button>
//                   </div>
//                   <Button onClick={handleNextLiveQuestion} className="flex-1 bg-gradient-primary h-14">
//                     {currentLiveQ < liveQuestions.length - 1 ? "Next Question" : "Finish Interview"}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {showFinalReport && (
//         <div className="fixed inset-0 z-[70] bg-background p-4 sm:p-10 overflow-y-auto">
//           <div className="max-w-5xl mx-auto space-y-8">
//             <div className="text-center space-y-4">
//               <Award className="h-16 w-16 text-yellow-500 mx-auto animate-bounce" />
//               <h1 className="text-4xl font-bold tracking-tight">Interview Performance Report</h1>
//               <p className="text-muted-foreground">Review your answers against AI-generated benchmarks</p>
              
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
//                 <Card className="p-6 bg-primary/5 border-primary/20">
//                   <p className="text-sm text-muted-foreground uppercase font-semibold">Average Accuracy</p>
//                   <p className="text-3xl font-bold text-primary">
//                     {interviewHistory.length > 0 
//                       ? Math.round(interviewHistory.reduce((acc, curr) => acc + curr.feedback.correctness, 0) / interviewHistory.length) 
//                       : 0}%
//                   </p>
//                 </Card>
//                 <Card className="p-6 bg-green-500/5 border-green-500/20">
//                   <p className="text-sm text-muted-foreground uppercase font-semibold">Confidence Score</p>
//                   <p className="text-3xl font-bold text-green-600">
//                   {interviewHistory.length > 0 
//                       ? Math.round(interviewHistory.reduce((acc, curr) => acc + (curr.feedback.confidence || 0), 0) / interviewHistory.length) 
//                       : 0}%
//                   </p>
//                 </Card>
//                 <Card className="p-6 bg-blue-500/5 border-blue-500/20">
//                   <p className="text-sm text-muted-foreground uppercase font-semibold">Status</p>
//                   <p className="text-3xl font-bold text-blue-600">Completed</p>
//                 </Card>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold flex items-center gap-2">
//                 <MessageSquare className="h-6 w-6 text-primary" /> 
//                 Detailed Q&A Analysis
//               </h2>
              
//               <div className="border rounded-2xl overflow-hidden shadow-sm">
//                 <div className="hidden md:grid grid-cols-12 bg-muted/50 p-4 font-bold text-sm uppercase tracking-wider text-muted-foreground">
//                   <div className="col-span-1">#</div>
//                   <div className="col-span-5">Interview Question</div>
//                   <div className="col-span-6">Ideal Benchmarks & Insights</div>
//                 </div>

//                 <div className="divide-y divide-border">
//                   {interviewHistory.map((item, index) => (
//                     <div key={index} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 gap-4 hover:bg-muted/20 transition-colors">
//                       <div className="col-span-1 font-bold text-primary text-lg">
//                         {index + 1}.
//                       </div>

//                       <div className="col-span-11 md:col-span-5 space-y-2">
//                         <p className="font-semibold text-lg leading-tight">{item.question}</p>
//                         <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100">
//                           <p className="text-xs font-bold uppercase text-red-600 mb-1">Your Answer:</p>
//                           <p className="text-sm">{item.userAnswer}</p>
//                         </div>
//                       </div>

//                       <div className="col-span-11 md:col-start-7 md:col-span-6 space-y-4">
//                         <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
//                           <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400 font-bold text-sm">
//                             <CheckCircle2 className="h-4 w-4" />
//                             IDEAL AI RESPONSE
//                           </div>
//                           <p className="text-sm leading-relaxed text-foreground/80">
//                             {item.idealAnswer}
//                           </p>
//                         </div>

//                         <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
//                            <p className="text-xs font-bold text-blue-700 uppercase mb-1">AI Feedback:</p>
//                            <p className="text-sm italic">"{item.feedback.improvements}"</p>
//                            <div className="flex gap-2 mt-2">
//                               <Badge className="bg-blue-100 text-blue-700">Accuracy: {item.feedback.correctness}%</Badge>
//                               <Badge className="bg-blue-100 text-blue-700">Clarity: {item.feedback.clarity}%</Badge>
//                            </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-center pb-10">
//               <Button onClick={() => setShowFinalReport(false)} size="lg" className="px-12 h-14 rounded-full shadow-xl">
//                 Finish & Go Back
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//       {isLiveLoading && (
//         <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center text-white">
//           <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" /><p>AI is analyzing your session...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MockInterview;