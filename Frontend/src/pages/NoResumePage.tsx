import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, ArrowLeft, User, Briefcase, Sparkles, MapPin, GraduationCap, Clock, Building2, Check, Target, TrendingUp, BookOpen, DollarSign } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useUserData } from "@/hooks/use-user-data";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PROFESSIONS = [
  "Data Analyst", "Software Engineer", "Carpenter", "Electrician", "Plumber",
  "Driver", "Helper", "Teacher", "Nurse", "Accountant", "Marketing Manager",
  "Graphic Designer", "Web Developer", "Mechanic", "Chef", "Security Guard",
  "Delivery Executive", "Warehouse Associate", "Sales Executive", "HR Manager",
  "Content Writer", "Customer Support", "Pharmacist", "Lab Technician",
  "Civil Engineer", "Architect",
];

const PROFESSION_CATEGORIES = ["Technology", "Business", "Trades", "Healthcare", "Creative", "Education", "Student", "Other"];

const EDUCATION_LEVELS = ["High School", "Diploma", "Bachelor's", "Master's", "PhD"];

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];

const EXPERIENCE_OPTIONS = ["0-1 year", "1-3 Years", "3-5 Years", "5+ Years"];

const COMMON_SKILLS: Record<string, string[]> = {
  "Technology": ["Python", "JavaScript", "SQL", "React", "Data Analysis", "Cloud Computing", "Git", "Machine Learning"],
  "Business": ["Excel", "Communication", "Project Management", "CRM", "Negotiation", "Analytics", "Marketing", "Sales"],
  "Trades": ["Welding", "Wiring", "Blueprint Reading", "Power Tools", "Safety Standards", "Plumbing", "HVAC", "Carpentry"],
  "Healthcare": ["Patient Care", "Medical Records", "First Aid", "Medication Management", "Lab Analysis", "Counseling"],
  "Creative": ["Photoshop", "Illustrator", "UI Design", "Typography", "Video Editing", "Content Writing", "Copywriting"],
  "Education": ["Curriculum Design", "Classroom Management", "Assessment", "EdTech", "Communication", "Mentoring"],
  "Student": ["Communication", "Teamwork", "Problem Solving", "Microsoft Office", "Research", "Time Management"],
  "Other": ["Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership", "Adaptability"],
};

const LOCATIONS = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Chandigarh", "Indore", "Bhopal", "Nagpur", "Coimbatore",
];

const STEPS = [
  { num: 1, label: "Enter Details" },
  { num: 2, label: "AI Analysis" },
  { num: 3, label: "Career Insights" },
];

const NoResumePage = () => {
  const { t } = useTranslation();
  const { userData, updateUserData, addSkills } = useUserData();
  const navigate = useNavigate();

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

  const filteredProfs = PROFESSIONS.filter((p) =>
    p.toLowerCase().includes(profSearch.toLowerCase())
  );
  const filteredLocations = LOCATIONS.filter((l) =>
    l.toLowerCase().includes(locSearch.toLowerCase())
  );
  const suggestedSkills = COMMON_SKILLS[category] || COMMON_SKILLS["Other"];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const s = skillInput.trim();
    if (s && !selectedSkills.includes(s)) {
      setSelectedSkills((prev) => [...prev, s]);
      setSkillInput("");
    }
  };

  const handleGenerate = () => {
    if (!name.trim()) return;
    updateUserData({
      name: name.trim(),
      targetRole: profession || profSearch,
      location: location || locSearch,
    });
    if (selectedSkills.length > 0) {
      addSkills(
        selectedSkills.map((s) => ({
          name: s,
          level: "Intermediate",
          proficiency: 50,
          verified: false,
          source: "manual" as const,
        }))
      );
    }
    setCurrentStep(2);
    setLoadingMsg(0);
    const msgs = [0, 1, 2];
    msgs.forEach((i) => {
      setTimeout(() => setLoadingMsg(i), i * 1000);
    });
    setTimeout(() => setCurrentStep(3), 3000);
  };

  const loadingMessages = [
    t("Analyzing your profile..."),
    t("Matching jobs..."),
    t("Building roadmap..."),
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: "var(--gradient-primary)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-15"
          style={{ background: "var(--gradient-accent)" }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate("/smart-entry")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("Back")}
      </motion.button>

      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-2 pb-6"
        >
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center gap-1.5 flex-1">
              <div
                className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  currentStep >= step.num
                    ? "text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                style={currentStep >= step.num ? { background: "var(--gradient-primary)" } : undefined}
              >
                {currentStep > step.num ? <Check className="h-3.5 w-3.5" /> : step.num}
              </div>
              <span className={`text-xs font-medium truncate ${currentStep >= step.num ? "text-foreground" : "text-muted-foreground"}`}>
                {t(step.label)}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full mx-1 ${currentStep > step.num ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Enter Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 sm:p-8"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="mb-5">
                <h1 className="font-display text-xl font-bold text-foreground">
                  {t("Create your career profile")}
                </h1>
                <div className="text-sm text-muted-foreground leading-relaxed mt-1.5">
                  {t("Tell us about yourself to get:")}
                  <span className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><Target className="h-3 w-3 text-primary" />{t("job recommendations")}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><TrendingUp className="h-3 w-3 text-accent" />{t("skill gap insights")}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><BookOpen className="h-3 w-3 text-info" />{t("learning roadmap")}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground"><DollarSign className="h-3 w-3 text-success" />{t("salary estimates")}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" /> {t("Full Name")}
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("Enter your name")}
                    className="h-10"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> {t("Profession Category")}
                    <span className="text-xs text-muted-foreground font-normal">({t("optional")})</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-10"><SelectValue placeholder={t("Select category")} /></SelectTrigger>
                    <SelectContent>
                      {PROFESSION_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{t(c)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Role */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> {t("Job Role")}
                  </Label>
                  <Input
                    value={profSearch}
                    onChange={(e) => { setProfSearch(e.target.value); setProfession(""); }}
                    placeholder={t("Search job roles...")}
                    className="h-10"
                  />
                  {profSearch && (
                    <ScrollArea className="h-28 rounded-lg border border-border">
                      {filteredProfs.map((p) => (
                        <button
                          key={p}
                          onClick={() => { setProfession(p); setProfSearch(p); }}
                          className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                            profession === p ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {t(p)}
                        </button>
                      ))}
                    </ScrollArea>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-muted-foreground" /> {t("Skills")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                      placeholder={t("Type a skill and press Enter")}
                      className="h-10 flex-1"
                    />
                  </div>
                  {suggestedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {suggestedSkills.map((s) => (
                        <Badge
                          key={s}
                          variant={selectedSkills.includes(s) ? "default" : "outline"}
                          className={`cursor-pointer text-xs transition-colors ${
                            selectedSkills.includes(s) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                          onClick={() => toggleSkill(s)}
                        >
                          {selectedSkills.includes(s) && <Check className="h-3 w-3 mr-0.5" />}
                          {t(s)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {selectedSkills.filter((s) => !suggestedSkills.includes(s)).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedSkills.filter((s) => !suggestedSkills.includes(s)).map((s) => (
                        <Badge key={s} className="cursor-pointer text-xs bg-primary text-primary-foreground" onClick={() => toggleSkill(s)}>
                          <Check className="h-3 w-3 mr-0.5" /> {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience + Education row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {t("Experience")}
                    </Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger className="h-10"><SelectValue placeholder={t("Select")} /></SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_OPTIONS.map((e) => (
                          <SelectItem key={e} value={e}>{t(e)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" /> {t("Education")}
                    </Label>
                    <Select value={education} onValueChange={setEducation}>
                      <SelectTrigger className="h-10"><SelectValue placeholder={t("Level")} /></SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((e) => (
                          <SelectItem key={e} value={e}>{t(e)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Job Type */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">{t("Preferred Job Type")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map((jt) => (
                      <Badge
                        key={jt}
                        variant={jobType === jt ? "default" : "outline"}
                        className={`cursor-pointer text-xs transition-colors ${
                          jobType === jt ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                        onClick={() => setJobType(jobType === jt ? "" : jt)}
                      >
                        {t(jt)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {t("Location")}
                  </Label>
                  <Input
                    value={locSearch}
                    onChange={(e) => { setLocSearch(e.target.value); setLocation(""); }}
                    placeholder={t("Search location...")}
                    className="h-10"
                  />
                  {locSearch && filteredLocations.length > 0 && (
                    <div className="max-h-24 overflow-y-auto rounded-lg border border-border bg-card">
                      {filteredLocations.map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLocation(l); setLocSearch(l); }}
                          className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                            location === l ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  onClick={handleGenerate}
                  className="w-full h-11 text-sm font-semibold gap-2 transition-all hover:shadow-lg"
                  style={{ background: "var(--gradient-primary)" }}
                  disabled={!name.trim()}
                >
                  <Sparkles className="h-4 w-4" />
                  {t("Generate Career Insights")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Loading */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16 gap-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-16 w-16 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <div className="space-y-3 text-center">
                {loadingMessages.map((msg, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: loadingMsg >= i ? 1 : 0.3, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={`text-sm font-medium ${loadingMsg >= i ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {loadingMsg > i && <Check className="h-3.5 w-3.5 inline mr-1.5 text-success" />}
                    {msg}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Career Snapshot */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 sm:p-8"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                {t("Your Career Snapshot")}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Target, label: t("Target Role"), value: profession || profSearch || userData.targetRole, color: "text-primary" },
                    { icon: Briefcase, label: t("Job Matches"), value: "12+", color: "text-accent" },
                    { icon: TrendingUp, label: t("Missing Skills"), value: `${Math.max(1, 5 - selectedSkills.length)}`, color: "text-warning" },
                    { icon: DollarSign, label: t("Expected Salary"), value: "₹4-8 LPA", color: "text-success" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <Icon className={`h-5 w-5 ${color} mb-2`} />
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="w-full h-11 text-sm font-semibold gap-2"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {t("View Dashboard")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/jobs")}
                      className="h-10 text-sm font-medium"
                    >
                      {t("Explore Jobs")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/skill-gap")}
                      className="h-10 text-sm font-medium"
                    >
                      {t("Start Learning")}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NoResumePage;
