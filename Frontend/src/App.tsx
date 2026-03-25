// import React, { useState } from 'react';
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { 
//   Users, 
//   Search, 
//   Plus, 
//   SlidersHorizontal,
//   Home,
//   Star
// } from "lucide-react";

// // ─── MOCK DATA (As seen in screenshots) ───
// const SAMPLE_USERS = [
//   { id: "1", name: "Rahul Sharma", role: "Electrician", location: "Delhi", skills: ["Wiring", "Safety", "Excel"] },
//   { id: "2", name: "Priya Singh", role: "Data Analyst", location: "Bangalore", skills: ["Python", "SQL", "Pandas"] },
//   { id: "3", name: "Amit Verma", role: "Driver", location: "Mumbai", skills: ["Navigation", "Excel"] },
//   { id: "4", name: "Sneha Patel", role: "Web Developer", location: "Pune", skills: ["Python", "Data Visualization", "Statistics"] },
// ];

// const SAMPLE_JOBS = [
//   { id: "j1", title: "Data Analyst", company: "TCS", location: "Mumbai", salaryMin: 6, salaryMax: 9, matchScore: 90, tags: ["Python", "SQL", "Excel"] },
//   { id: "j2", title: "Data Engineer", company: "Flipkart", location: "Hyderabad", salaryMin: 10, salaryMax: 15, matchScore: 90, tags: ["Python", "SQL", "Pandas", "Statistics"] },
//   { id: "j3", title: "Junior Data Scientist", company: "Infosys", location: "Bangalore", salaryMin: 8, salaryMax: 12, matchScore: 88, tags: ["Python", "Pandas", "Statistics"] },
//   { id: "j4", title: "Business Analyst", company: "Wipro", location: "Pune", salaryMin: 5.5, salaryMax: 8, matchScore: 78, tags: ["Excel", "SQL", "Data Visualization"] },
// ];

// // ─── FRAMER MOTION VARIANTS ───
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
//   hover: { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }
// };

// // ─── USER CONNECTION CARD ───
// const ConnectionCard = ({ user }: { user: any }) => (
//   <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
//     <Card className="border-none shadow-sm flex items-center p-4 gap-4 hover:bg-slate-50 transition-colors">
//       <Avatar className="h-12 w-12 bg-slate-100 text-primary font-medium flex items-center justify-center">
//         <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
//       </Avatar>
//       <div className="flex-1">
//         <h4 className="font-semibold text-sm">{user.name}</h4>
//         <p className="text-xs text-muted-foreground">{user.role}</p>
//         <p className="text-xs text-muted-foreground">{user.location}</p>
//         <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
//           <Star className="h-3 w-3 text-warning" /> 1 mutual skill
//         </p>
//       </div>
//       <Button variant="outline" size="sm" className="h-8">Connect</Button>
//     </Card>
//   </motion.div>
// );

// // ─── JOB POSTING CARD ───
// const CommunityJobCard = ({ job }: { job: any }) => (
//   <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
//     <Card className="border-none shadow-sm p-5 hover:bg-slate-50 transition-colors">
//       <div className="flex items-center justify-between gap-4">
//         <div>
//           <h3 className="font-semibold text-base">{job.title}</h3>
//           <p className="text-xs text-muted-foreground flex items-center gap-1">
//             <Home className="h-3 w-3" /> {job.company}
//           </p>
//           <p className="text-xs text-muted-foreground mt-0.5">
//             {job.location} · ₹ {job.salaryMin.toFixed(2)} Lakh - ₹ {job.salaryMax.toFixed(2)} Lakh
//           </p>
//           <div className="flex items-center gap-1.5 mt-2.5">
//             {job.tags.map((tag: string) => (
//               <Badge key={tag} variant="secondary" className="text-[11px] h-5">{tag}</Badge>
//             ))}
//           </div>
//         </div>
        
//         <div className="text-right">
//           <div className={`flex items-center gap-1.5 font-bold text-base ${job.matchScore >= 80 ? 'text-success' : 'text-warning'}`}>
//             <Star className="h-4 w-4" /> {job.matchScore}% Match
//           </div>
//           <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Based on Skills</p>
//           <Button size="sm" className="h-8">Apply</Button>
//         </div>
//       </div>
//     </Card>
//   </motion.div>
// );

// // ─── MAIN COMMUNITY PAGE ───
// const Community = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState<string>("All");
//   const [postJobOpen, setPostJobOpen] = useState(false);

//   // Simple Filtering logic
//   const filteredJobs = SAMPLE_JOBS.filter(job => 
//     (roleFilter === "All" || job.title.includes(roleFilter)) &&
//     job.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="min-h-screen bg-slate-50/50 p-6 md:p-10"
//     >
//       <div className="max-w-7xl mx-auto space-y-10">
        
//         {/* HEADER SECTION (As seen in image 9/10) */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
//           <div>
//             <h1 className="text-2xl font-bold font-display flex items-center gap-3">
//               <Users className="h-6 w-6 text-primary" /> Community
//             </h1>
//             <p className="text-sm text-muted-foreground mt-1">Connect with professionals and discover job opportunities</p>
//           </div>

//           <Dialog open={postJobOpen} onOpenChange={setPostJobOpen}>
//             <DialogTrigger asChild>
//               <Button className="flex items-center gap-2 hover:shadow-glow transition-all">
//                 <Plus className="h-4 w-4" /> Post Job
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Post a New Job</DialogTitle>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="title" className="text-right">Job Title</Label>
//                   <Input id="title" className="col-span-3" />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="company" className="text-right">Company</Label>
//                   <Input id="company" className="col-span-3" />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit" onClick={() => setPostJobOpen(false)}>Publish Job</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* MAIN CONTENT AREA */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
//           {/* LEFT SIDEBAR: "People You May Know" */}
//           <Card className="lg:col-span-4 border-none shadow-lg">
//             <CardContent className="p-6 space-y-5">
//               <h3 className="font-semibold text-base mb-4">People You May Know</h3>
//               <AnimatePresence>
//                 {SAMPLE_USERS.map((user) => (
//                   <ConnectionCard key={user.id} user={user} />
//                 ))}
//               </AnimatePresence>
//             </CardContent>
//           </Card>

//           {/* RIGHT MAIN AREA: "Job Postings" */}
//           <div className="lg:col-span-8 space-y-6">
            
//             {/* SEARCH & FILTERS BAR (Image 9/10) */}
//             <Card className="border-none shadow-sm">
//               <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
//                 <div className="relative flex-1 w-full">
//                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search jobs..." 
//                     className="pl-10 h-10 border-slate-100" 
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
                
//                 <Select value={roleFilter} onValueChange={setRoleFilter}>
//                   <SelectTrigger className="w-full sm:w-[150px] h-10 border-slate-100">
//                     <SelectValue placeholder="Role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="All">All Roles</SelectItem>
//                     <SelectItem value="Analyst">Data Analyst</SelectItem>
//                     <SelectItem value="Scientist">Data Scientist</SelectItem>
//                     <SelectItem value="Developer">Web Developer</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <div className="flex gap-1.5">
//                   <Input placeholder="Min ₹L" className="w-[80px] h-10 border-slate-100 text-center" />
//                   <span className="text-muted-foreground mt-2">-</span>
//                   <Input placeholder="Max ₹L" className="w-[80px] h-10 border-slate-100 text-center" />
//                 </div>
                
//                 <Button variant="outline" size="sm" className="h-10 gap-2 border-slate-100">
//                   <SlidersHorizontal className="h-4 w-4" /> Match Score
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* JOB LISTINGS with Framer Motion Stagger */}
//             <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
//               <AnimatePresence>
//                 {filteredJobs.map((job) => (
//                   <CommunityJobCard key={job.id} job={job} />
//                 ))}
//               </AnimatePresence>
//             </motion.div>
//           </div>

//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Community;/

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
import Community from "./pages/Community"; // Check kar lena path sahi ho

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
                <Route path="/community" element={<Community />} />
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