import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, ArrowRight, RotateCcw, CheckCircle2, Target, Brain, MessageSquare, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useSearchParams } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const ROLES = [
  "Data Analyst", "Software Engineer", "Carpenter", "Electrician", "Plumber",
  "Driver", "Chef", "Nurse", "Teacher", "Marketing Manager",
  "Sales Executive", "Web Developer", "Mechanic", "Accountant",
];

interface QuestionSet {
  question: string;
  sampleFeedback: {
    correctness: number;
    confidence: number;
    clarity: number;
    improvements: string;
  };
}

const MOCK_QUESTIONS: Record<string, QuestionSet[]> = {
  default: [
    {
      question: "Tell me about yourself and why you're interested in this role.",
      sampleFeedback: { correctness: 75, confidence: 70, clarity: 80, improvements: "Include specific achievements and quantify your impact. Tailor your answer to the role requirements." },
    },
    {
      question: "What is your greatest strength and how does it help in this role?",
      sampleFeedback: { correctness: 80, confidence: 75, clarity: 85, improvements: "Provide a concrete example demonstrating this strength in action." },
    },
    {
      question: "Describe a challenging situation you faced and how you resolved it.",
      sampleFeedback: { correctness: 70, confidence: 65, clarity: 75, improvements: "Use the STAR method (Situation, Task, Action, Result) for better structure." },
    },
  ],
  "Data Analyst": [
    {
      question: "How would you handle missing data in a large dataset?",
      sampleFeedback: { correctness: 80, confidence: 75, clarity: 85, improvements: "Mention specific techniques like imputation, deletion, or interpolation. Discuss trade-offs." },
    },
    {
      question: "Explain a time you used data to influence a business decision.",
      sampleFeedback: { correctness: 75, confidence: 70, clarity: 80, improvements: "Quantify the impact of your analysis. Mention tools and methodology used." },
    },
    {
      question: "What's the difference between correlation and causation? Give an example.",
      sampleFeedback: { correctness: 85, confidence: 80, clarity: 90, improvements: "Use a real-world example to illustrate. Mention statistical tests for causation." },
    },
  ],
  "Software Engineer": [
    {
      question: "Explain the difference between REST and GraphQL APIs.",
      sampleFeedback: { correctness: 85, confidence: 80, clarity: 85, improvements: "Discuss use cases where each excels. Mention performance considerations." },
    },
    {
      question: "How do you approach debugging a production issue?",
      sampleFeedback: { correctness: 80, confidence: 75, clarity: 80, improvements: "Describe a systematic approach: logs, reproduction, root cause analysis, fix, and prevention." },
    },
    {
      question: "Describe your experience with version control and code reviews.",
      sampleFeedback: { correctness: 75, confidence: 70, clarity: 85, improvements: "Mention branching strategies and how you handle merge conflicts." },
    },
  ],
  "Carpenter": [
    {
      question: "What safety precautions do you take when using power tools?",
      sampleFeedback: { correctness: 85, confidence: 80, clarity: 90, improvements: "Mention specific PPE and tool-specific safety protocols." },
    },
    {
      question: "How do you read and interpret blueprints?",
      sampleFeedback: { correctness: 80, confidence: 75, clarity: 80, improvements: "Discuss symbols, scale, and how you handle discrepancies." },
    },
    {
      question: "Describe a project where you had to work with tight deadlines.",
      sampleFeedback: { correctness: 75, confidence: 70, clarity: 75, improvements: "Explain how you prioritized tasks and maintained quality under pressure." },
    },
  ],
};

const getQuestions = (role: string): QuestionSet[] => {
  return MOCK_QUESTIONS[role] || MOCK_QUESTIONS.default;
};

const MockInterview = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "";

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [started, setStarted] = useState(!!initialRole);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [finished, setFinished] = useState(false);
  const [roleSearch, setRoleSearch] = useState(initialRole);
  const [questions, setQuestions] = useState<QuestionSet[]>([]); // Static ki jagah state use karein
  const [isGenerating, setIsGenerating] = useState(false);
  const [realTimeFeedback, setRealTimeFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // const questions = getQuestions(selectedRole);
  const currentQuestion = questions && questions.length > 0 ? questions[currentQ] : null;
  if (started && !currentQuestion && !isGenerating) {
  return <div>Loading questions or error occurred...</div>;
}
  const handleStart = async () => {
  const roleToUse = roleSearch || selectedRole;
  if (!roleToUse) return;

  setIsGenerating(true);
  setQuestions([]); // Purani questions clear karein

  try {
    const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: roleToUse }),
    });

    if (response.status === 404) {
      throw new Error("Route not found on server. Check backend routes.");
    }

    const data = await response.json();
    
    if (response.ok && Array.isArray(data) && data.length > 0) {
      setQuestions(data);
      setStarted(true);
    } else {
      alert("AI response format issue. Please try again.");
      setStarted(false); // Crash se bachne ke liye
    }
  } catch (error: any) {
    console.error("Frontend Error:", error);
    alert(error.message || "Connection failed");
    setStarted(false); // Crash se bachne ke liye
  } finally {
    setIsGenerating(false);
  }

  // const handleStart = async () => {
  //   const roleToUse = roleSearch || selectedRole;
  //   if (!roleToUse) return;
  //   setIsGenerating(true);
  //   try {
  //   const response = await fetch("http://localhost:5000/api/analysis/generate-questions", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ role: roleToUse }),
  //   });
  //   const data = await response.json();
  //   if (Array.isArray(data) && data.length > 0) {
  //     setQuestions(data);
  //     setSelectedRole(roleToUse);
  //     setStarted(true);
  //   } else {
  //     throw new Error("Invalid questions format received");
  //   }
  // } catch (error) {
  //   console.error("Frontend Error:", error);
  //   alert("AI busy hai ya data format galat hai. Please try again!");
  // } finally {
  //   setIsGenerating(false);
  // }
    setStarted(true);
    setCurrentQ(0);
    setSubmitted(false);
    setFinished(false);
    setAnswer("");
  };

  // const handleSubmitAnswer = () => {
  //   if (!answer.trim()) return;
  //   setSubmitted(true);
  // };
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setIsAnalyzing(true);
    try {
        const response = await fetch("http://localhost:5000/api/analysis/analyze-answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: currentQuestion.question,
                answer: answer,
                role: selectedRole
            }),
        });

        const data = await response.json();
        if (response.ok) {
            setRealTimeFeedback(data); // Sample ki jagah real data set karein
            setSubmitted(true);
        }
    } catch (error) {
        alert("Feedback generation failed. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
};

// Next button click par feedback reset karein
const handleNext = () => {
    if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setAnswer("");
        setSubmitted(false);
        setRealTimeFeedback(null); // Reset feedback for next question
    } else {
        setFinished(true);
    }
};

  // const handleNext = () => {
  //   if (currentQ < questions.length - 1) {
  //     setCurrentQ((prev) => prev + 1);
  //     setAnswer("");
  //     setSubmitted(false);
  //   } else {
  //     setFinished(true);
  //   }
  // };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQ(0);
    setAnswer("");
    setSubmitted(false);
    setFinished(false);
    setSelectedRole("");
    setRoleSearch("");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setAnswer((prev) => prev + (prev ? " " : "") + "Based on my experience, I would approach this by analyzing the situation carefully and applying best practices...");
        setIsRecording(false);
      }, 2000);
    }
  };

  const filteredRoles = ROLES.filter((r) =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const MetricBar = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div {...fadeUp()}>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          {t("Mock")} <span className="text-gradient-primary">{t("Interview")}</span>
        </h1>
        <p className="text-muted-foreground mt-1">{t("Practice interviews with AI-powered feedback")}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div key="select" {...fadeUp(0.1)}>
            <Card className="border-0 shadow-lg bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {t("Select a Role")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={roleSearch}
                  onChange={(e) => { setRoleSearch(e.target.value); setSelectedRole(""); }}
                  placeholder={t("Type any role (e.g. Space Engineer, Yoga Instructor)....")}
                  className="h-11"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {filteredRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => { setSelectedRole(role); setRoleSearch(role); }}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        selectedRole === role
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-muted text-foreground hover:bg-muted/80 border border-transparent"
                      }`}
                    >
                      {t(role)}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleStart}
                  disabled={isGenerating || !roleSearch}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11"
                >
                  {isGenerating ? <motion.div animate={{rotate:360}}><RotateCcw className="h-4 w-4"/></motion.div> : t("Start Interview")} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : finished ? (
          <motion.div key="finished" {...fadeUp(0.1)} className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-card">
              <CardContent className="p-8 text-center space-y-4">
                <div className="p-4 rounded-full bg-success/10 w-fit mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">{t("Interview Complete!")}</h2>
                <p className="text-muted-foreground">{t("You completed all")} {questions.length} {t("questions for")} {selectedRole}</p>
                <Button onClick={handleRestart} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" /> {t("Try Another Role")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="interview" {...fadeUp(0.1)} className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {t("Question")} {currentQ + 1}/{questions.length} · {selectedRole}
              </Badge>
            </div>

            <Card className="border-0 shadow-lg bg-gradient-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-foreground">{t(currentQuestion.question)}</p>
                </div>

                {!submitted ? (
                  <div className="space-y-3">
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={t("Type your answer here...")}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!answer.trim()}
                        className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                      >
                        {t("Submit Answer")} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        onClick={toggleRecording}
                        variant="outline"
                        className={isRecording ? "border-destructive text-destructive" : ""}
                      >
                        {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                        {isRecording ? t("Stop") : t("Voice")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" /> {t("AI Analysis Result")}
                      </p>
                      <div className="space-y-3">
                        <MetricBar label={t("Correctness")} value={realTimeFeedback.correctness} />
                        <MetricBar label={t("Confidence")} value={realTimeFeedback.confidence} />
                        <MetricBar label={t("Clarity")} value={realTimeFeedback.clarity} />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-sm font-medium text-foreground mb-1">{t("How to Improve")}</p>
                      <p className="text-sm text-muted-foreground">{realTimeFeedback.improvements}</p>
                    </div>
                    <Button onClick={handleNext} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                      {currentQ < questions.length - 1 ? t("Next Question") : t("Finish Interview")}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button onClick={handleSubmitAnswer} disabled={isAnalyzing || !answer.trim()}>
                      {isAnalyzing ? "AI is Thinking..." : t("Submit Answer")}
                      </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MockInterview;
