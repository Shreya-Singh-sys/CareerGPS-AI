import React, { createContext, useContext, useState, useCallback } from "react";

export interface UserSkill {
  name: string;
  level: string;
  proficiency: number;
  verified: boolean;
  source: "resume" | "manual";
}

export interface RoadmapStep {
  step: number;
  title: string;
  duration: string;
  status: "completed" | "current" | "locked";
  description: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  targetRole: string;
  careerReadiness: number;
  atsScore: number;
  skills: UserSkill[];
  roadmapProgress: number;
  roadmapSteps: RoadmapStep[];
  resumeAnalyzed: boolean;
  missingSkills: string[];
}

interface UserDataContextType {
  userData: UserData;
  updateUserData: (partial: Partial<UserData>) => void;
  addSkills: (skills: UserSkill[]) => void;
  setResumeAnalyzed: (analyzed: boolean) => void;
}

const defaultUserData: UserData = {
  name: "Rahul Kumar",
  email: "rahul.k@email.com",
  phone: "+91 98xxx xxxxx",
  location: "Mumbai, Maharashtra",
  targetRole: "Data Analyst",
  careerReadiness: 72,
  atsScore: 74,
  skills: [
    { name: "Python", level: "Advanced", proficiency: 85, verified: true, source: "resume" },
    { name: "SQL", level: "Intermediate", proficiency: 45, verified: true, source: "resume" },
    { name: "Excel", level: "Intermediate", proficiency: 60, verified: true, source: "resume" },
    { name: "Pandas", level: "Intermediate", proficiency: 55, verified: true, source: "resume" },
    { name: "Data Visualization", level: "Intermediate", proficiency: 70, verified: false, source: "resume" },
    { name: "Statistics", level: "Basic", proficiency: 65, verified: false, source: "resume" },
  ],
  roadmapProgress: 30,
  roadmapSteps: [
    { step: 1, title: "Advanced SQL", duration: "4 weeks", status: "completed", description: "Master complex queries, window functions, and optimization" },
    { step: 2, title: "Power BI", duration: "4 weeks", status: "current", description: "Build interactive dashboards and learn DAX" },
    { step: 3, title: "Data Visualization Projects", duration: "4 weeks", status: "locked", description: "Create portfolio-worthy data visualization projects" },
    { step: 4, title: "Portfolio Building", duration: "4 weeks", status: "locked", description: "Compile projects, polish resume, and prepare for interviews" },
  ],
  resumeAnalyzed: false,
  missingSkills: ["Advanced SQL", "Power BI", "Data Warehousing"],
};

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const updateUserData = useCallback((partial: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...partial }));
  }, []);

  const addSkills = useCallback((newSkills: UserSkill[]) => {
    setUserData((prev) => {
      const existingNames = new Set(prev.skills.map((s) => s.name));
      const toAdd = newSkills.filter((s) => !existingNames.has(s.name));
      const updated = prev.skills.map((existing) => {
        const match = newSkills.find((s) => s.name === existing.name);
        return match ? { ...existing, ...match } : existing;
      });
      return { ...prev, skills: [...updated, ...toAdd] };
    });
  }, []);

  const setResumeAnalyzed = useCallback((analyzed: boolean) => {
    setUserData((prev) => ({ ...prev, resumeAnalyzed: analyzed }));
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, updateUserData, addSkills, setResumeAnalyzed }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
};
