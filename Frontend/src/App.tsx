import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TranslationProvider } from "@/hooks/use-translation";
import { NarratorProvider } from "@/hooks/use-narrator";
import { UserDataProvider } from "@/hooks/use-user-data";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SmartEntry from "./pages/SmartEntry";
import NoResumePage from "./pages/NoResumePage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SkillGap from "./pages/SkillGap";
import JobPortal from "./pages/JobPortal";
import Profile from "./pages/Profile";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import CareerSimulator from "./pages/CareerSimulator";
import MockInterview from "./pages/MockInterview";
import AccessibilityToolbar from "./components/AccessibilityToolbar";
import FloatingNarratorBar from "./components/FloatingNarratorBar";
import AICopilot from "./components/AICopilot";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TranslationProvider>
      <UserDataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NarratorProvider>
            <ScrollToTop />
            <AccessibilityToolbar />
            <FloatingNarratorBar />
            <AICopilot />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/smart-entry" element={<SmartEntry />} />
              <Route path="/no-resume" element={<NoResumePage />} />
              <Route element={<DashboardLayout />}>
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/skill-gap" element={<SkillGap />} />
                <Route path="/jobs" element={<JobPortal />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/resume" element={<ResumeAnalysis />} />
                <Route path="/career-simulator" element={<CareerSimulator />} />
                <Route path="/mock-interview" element={<MockInterview />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NarratorProvider>
        </BrowserRouter>
      </TooltipProvider>
      </UserDataProvider>
    </TranslationProvider>
  </QueryClientProvider>
);

export default App;
