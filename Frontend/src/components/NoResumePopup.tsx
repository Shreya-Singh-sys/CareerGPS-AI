import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Search } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useUserData } from "@/hooks/use-user-data";
import { motion } from "framer-motion";

const PROFESSIONS: Record<string, string[]> = {
  "Carpenter": ["Woodworking", "Blueprint Reading", "Measurement", "Power Tools", "Safety Standards"],
  "Electrician": ["Wiring", "Circuit Design", "Troubleshooting", "Safety Compliance", "PLC Programming"],
  "Plumber": ["Pipe Fitting", "Leak Detection", "Blueprint Reading", "Welding", "Water Systems"],
  "Driver": ["Navigation", "Vehicle Maintenance", "Route Planning", "Time Management", "Safety Protocols"],
  "Helper": ["Physical Fitness", "Team Coordination", "Material Handling", "Basic Tools", "Safety Awareness"],
  "Mechanic": ["Engine Repair", "Diagnostics", "Welding", "Electrical Systems", "Brake Systems"],
  "Chef": ["Cooking Techniques", "Menu Planning", "Food Safety", "Inventory Management", "Team Leadership"],
  "Security Guard": ["Surveillance", "Emergency Response", "Access Control", "First Aid", "Report Writing"],
  "Delivery Executive": ["Navigation", "Time Management", "Customer Service", "Vehicle Maintenance", "Route Optimization"],
  "Warehouse Associate": ["Inventory Management", "Forklift Operation", "Order Picking", "Safety Protocols", "Data Entry"],
  "Data Analyst": ["Python", "SQL", "Excel", "Data Visualization", "Statistics"],
  "Software Engineer": ["JavaScript", "React", "Python", "Git", "System Design"],
  "Web Developer": ["HTML/CSS", "JavaScript", "React", "Node.js", "Responsive Design"],
  "Graphic Designer": ["Photoshop", "Illustrator", "Typography", "Color Theory", "UI Design"],
  "Marketing Manager": ["SEO", "Content Strategy", "Analytics", "Social Media", "Campaign Management"],
  "Sales Executive": ["Negotiation", "CRM Tools", "Lead Generation", "Communication", "Market Research"],
  "Teacher": ["Curriculum Design", "Classroom Management", "Assessment", "Communication", "EdTech"],
  "Nurse": ["Patient Care", "Medical Records", "First Aid", "Medication Management", "Communication"],
  "Accountant": ["Bookkeeping", "Taxation", "Tally", "Financial Reporting", "Auditing"],
  "HR Manager": ["Recruitment", "Payroll", "Employee Relations", "Compliance", "Training"],
  "Content Writer": ["SEO Writing", "Research", "Grammar", "CMS Tools", "Copywriting"],
  "Customer Support": ["Communication", "Ticketing Systems", "Problem Solving", "Empathy", "Product Knowledge"],
  "Pharmacist": ["Drug Knowledge", "Prescription Handling", "Inventory", "Patient Counseling", "Regulatory Compliance"],
  "Lab Technician": ["Sample Analysis", "Equipment Handling", "Data Recording", "Safety Protocols", "Quality Control"],
  "Civil Engineer": ["AutoCAD", "Structural Analysis", "Project Management", "Site Supervision", "Cost Estimation"],
  "Architect": ["AutoCAD", "3D Modeling", "Building Codes", "Design Thinking", "Project Planning"],
};

const LOCATIONS = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Chandigarh", "Indore", "Bhopal", "Nagpur", "Coimbatore",
];

interface NoResumePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: () => void;
}

const NoResumePopup = ({ open, onOpenChange, onGenerate }: NoResumePopupProps) => {
  const { t } = useTranslation();
  const { updateUserData, addSkills } = useUserData();
  const [profSearch, setProfSearch] = useState("");
  const [selectedProf, setSelectedProf] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [locSearch, setLocSearch] = useState("");
  const [generating, setGenerating] = useState(false);

  const professions = Object.keys(PROFESSIONS);
  const filteredProfs = professions.filter((p) =>
    p.toLowerCase().includes(profSearch.toLowerCase())
  );
  const availableSkills = selectedProf ? (PROFESSIONS[selectedProf] || []) : [];
  const filteredLocations = LOCATIONS.filter((l) =>
    l.toLowerCase().includes(locSearch.toLowerCase())
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleGenerate = () => {
    if (!selectedProf || selectedSkills.length === 0) return;
    setGenerating(true);
    setTimeout(() => {
      updateUserData({
        targetRole: selectedProf,
        location: location || locSearch,
      });
      addSkills(
        selectedSkills.map((s) => ({
          name: s,
          level: "Intermediate",
          proficiency: 50,
          verified: false,
          source: "manual" as const,
        }))
      );
      setGenerating(false);
      onOpenChange(false);
      onGenerate();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {t("Build Your")} <span className="text-gradient-primary">{t("Profile")}</span>
          </DialogTitle>
          <DialogDescription>
            {t("Tell us about your profession and skills to generate your career profile.")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          {/* Profession */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("Profession")}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={profSearch}
                onChange={(e) => { setProfSearch(e.target.value); setSelectedProf(""); setSelectedSkills([]); }}
                placeholder={t("Search professions...")}
                className="pl-10 h-11"
              />
            </div>
            <ScrollArea className="h-32 rounded-lg border border-border">
              {filteredProfs.map((p) => (
                <button
                  key={p}
                  onClick={() => { setSelectedProf(p); setProfSearch(p); setSelectedSkills([]); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedProf === p ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t(p)}
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Skills */}
          {availableSkills.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("Skills")} ({selectedSkills.length} {t("selected")})</Label>
              <ScrollArea className="h-36 rounded-lg border border-border p-3">
                <div className="space-y-2">
                  {availableSkills.map((skill) => (
                    <label key={skill} className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded-lg px-2 py-1.5 transition-colors">
                      <Checkbox
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => toggleSkill(skill)}
                      />
                      <span className="text-sm text-foreground">{t(skill)}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Experience */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("Experience (years)")}</Label>
            <Input
              type="number"
              min="0"
              max="50"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 3"
              className="h-11"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("Location")}</Label>
            <Input
              value={locSearch}
              onChange={(e) => { setLocSearch(e.target.value); setLocation(""); }}
              placeholder={t("Search location...")}
              className="h-11"
            />
            {locSearch && (
              <div className="max-h-28 overflow-y-auto rounded-lg border border-border bg-card">
                {filteredLocations.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLocation(l); setLocSearch(l); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      location === l ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11"
            disabled={!selectedProf || selectedSkills.length === 0 || generating}
          >
            {generating ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                {t("Generating...")}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {t("Generate Profile")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoResumePopup;
