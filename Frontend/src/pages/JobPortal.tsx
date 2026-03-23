// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import {
//   MapPin, Search, Filter, Globe, Mic, Briefcase,IndianRupee,
//   ArrowRight, Star, Clock, CheckCircle2, Sparkles,
//   Map, List, ChevronDown, Languages, TrendingUp, BarChart3, Zap,
//   RotateCcw
// } from "lucide-react";
// import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "@/hooks/use-translation";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, LineChart, Line, Legend
// } from "recharts";

// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.5, delay },
// });

// const radiusOptions = ["5 km", "10 km", "25 km", "50 km"];

// const marketDemandData = [
//   { month: "Jan", "AI/ML": 65, "Data Analysis": 55, "Cloud": 45 },
//   { month: "Feb", "AI/ML": 68, "Data Analysis": 58, "Cloud": 48 },
//   { month: "Mar", "AI/ML": 72, "Data Analysis": 62, "Cloud": 52 },
//   { month: "Apr", "AI/ML": 78, "Data Analysis": 65, "Cloud": 55 },
//   { month: "May", "AI/ML": 85, "Data Analysis": 72, "Cloud": 60 },
//   { month: "Jun", "AI/ML": 92, "Data Analysis": 78, "Cloud": 65 },
// ];

// const JobPortal = () => {
//   const [viewMode, setViewMode] = useState<"list" | "map">("list");
//   const [expandedJob, setExpandedJob] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [location, setLocation] = useState("");
//   const [radius, setRadius] = useState("50"); 
//   const [jobs, setJobs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const handleSearch = async () => {
//     fetchJobs();
//     setLoading(true);
    
//     // User ki location lena radius search ke liye
//     const performFetch = async (lat?: number, lng?: number) => {
//       try {
//         const response = await fetch("http://localhost:5000/api/jobs/search", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ 
//             query: searchQuery, 
//             location: location, 
//             radius: parseInt(radius),
//             userLat: lat,
//             userLng: lng
//           }),
//         });
//         const data = await response.json();
//         setJobs(data.jobs || data); // Adjust based on your backend structure
//       } catch (err) {
//         console.error("Search failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => performFetch(pos.coords.latitude, pos.coords.longitude),
//         () => performFetch() // Fallback if location denied
//       );
//     } else {
//       performFetch();
//     }
//   };

//   // const jobs = [
//   //   {
//   //     id: 1, title: t("Data Analyst"), company: "Flipkart",
//   //     location: t("Bangalore"), salary: "₹9 LPA", match: 82,
//   //     posted: t("2 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Your Python and data visualization skills are a strong match. Improving Advanced SQL could raise your fit to 92%."),
//   //     skills: ["Python", "SQL", t("Data Visualization"), "Excel"],
//   //   },
//   //   {
//   //     id: 2, title: t("Business Intelligence Analyst"), company: "Amazon",
//   //     location: t("Bangalore"), salary: "₹11 LPA", match: 76,
//   //     posted: t("5 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Your analytical foundation is solid. Adding Power BI expertise would significantly boost your match score."),
//   //     skills: ["Power BI", "SQL", t("Data Modeling"), t("Statistics")],
//   //   },
//   //   {
//   //     id: 3, title: t("Junior Data Scientist"), company: "Zomato",
//   //     location: t("Bangalore"), salary: "₹12 LPA", match: 71,
//   //     posted: t("1 day ago"), type: t("Full-time"),
//   //     whyMatch: t("Your Python and statistics skills transfer well. Machine learning experience would make you a top candidate."),
//   //     skills: ["Python", t("Machine Learning"), t("Statistics"), "Pandas"],
//   //   },
//   //   {
//   //     id: 4, title: t("Product Data Analyst"), company: "Swiggy",
//   //     location: t("Bangalore"), salary: "₹10 LPA", match: 78,
//   //     posted: t("3 days ago"), type: t("Full-time"),
//   //     whyMatch: t("Strong data analysis foundation. A/B testing and product metrics experience would complete your profile."),
//   //     skills: ["SQL", "Python", t("A/B Testing"), t("Product Analytics")],
//   //   },
//   //   {
//   //     id: 5, title: t("Electrician"), company: "UrbanClap",
//   //     location: t("Mumbai"), salary: "₹4.5 LPA", match: 85,
//   //     posted: t("1 hour ago"), type: t("Full-time"),
//   //     whyMatch: t("Your wiring and troubleshooting skills match well. Getting certified in PLC would boost opportunities."),
//   //     skills: [t("Wiring"), t("Circuit Design"), t("Troubleshooting")],
//   //   },
//   //   {
//   //     id: 6, title: t("Carpenter"), company: "Livspace",
//   //     location: t("Delhi"), salary: "₹4 LPA", match: 80,
//   //     posted: t("4 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Your woodworking and measurement skills are strong. Blueprint reading would make you more competitive."),
//   //     skills: [t("Woodworking"), t("Measurement"), t("Power Tools")],
//   //   },
//   //   {
//   //     id: 7, title: t("Plumber"), company: "HomePro Services",
//   //     location: t("Pune"), salary: "₹3.8 LPA", match: 78,
//   //     posted: t("6 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Good pipe fitting skills. Welding certification would increase your value significantly."),
//   //     skills: [t("Pipe Fitting"), t("Leak Detection"), t("Water Systems")],
//   //   },
//   //   {
//   //     id: 8, title: t("Delivery Executive"), company: "Dunzo",
//   //     location: t("Chennai"), salary: "₹3.5 LPA", match: 88,
//   //     posted: t("30 mins ago"), type: t("Full-time"),
//   //     whyMatch: t("Great navigation and time management skills. Route optimization knowledge would help."),
//   //     skills: [t("Navigation"), t("Time Management"), t("Customer Service")],
//   //   },
//   //   {
//   //     id: 9, title: t("Chef"), company: "Taj Hotels",
//   //     location: t("Mumbai"), salary: "₹6 LPA", match: 74,
//   //     posted: t("2 days ago"), type: t("Full-time"),
//   //     whyMatch: t("Your cooking techniques are solid. Menu planning and food safety certifications would strengthen your profile."),
//   //     skills: [t("Cooking Techniques"), t("Food Safety"), t("Team Leadership")],
//   //   },
//   //   {
//   //     id: 10, title: t("Security Guard"), company: "G4S Security",
//   //     location: t("Hyderabad"), salary: "₹3 LPA", match: 82,
//   //     posted: t("1 day ago"), type: t("Full-time"),
//   //     whyMatch: t("Good surveillance and emergency response skills. First aid certification would be a strong addition."),
//   //     skills: [t("Surveillance"), t("Emergency Response"), t("First Aid")],
//   //   },
//   //   {
//   //     id: 11, title: t("Web Developer"), company: "TCS",
//   //     location: t("Bangalore"), salary: "₹8 LPA", match: 73,
//   //     posted: t("5 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Your JavaScript and React skills are a good fit. Node.js experience would make you a stronger candidate."),
//   //     skills: ["JavaScript", "React", "HTML/CSS", "Node.js"],
//   //   },
//   //   {
//   //     id: 12, title: t("Warehouse Associate"), company: "Amazon Logistics",
//   //     location: t("Hyderabad"), salary: "₹3.2 LPA", match: 86,
//   //     posted: t("3 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Strong inventory and safety protocol skills. Forklift certification would open more opportunities."),
//   //     skills: [t("Inventory Management"), t("Order Picking"), t("Safety Protocols")],
//   //   },
//   //   {
//   //     id: 13, title: t("Graphic Designer"), company: "Canva India",
//   //     location: t("Mumbai"), salary: "₹7 LPA", match: 72,
//   //     posted: t("1 day ago"), type: t("Full-time"),
//   //     whyMatch: t("Your design fundamentals are solid. Proficiency in Figma and motion design would boost your profile."  ),
//   //     skills: ["Photoshop", "Illustrator", t("Typography"), t("UI Design")],
//   //   },
//   //   {
//   //     id: 14, title: t("Nurse"), company: "Apollo Hospitals",
//   //     location: t("Chennai"), salary: "₹5 LPA", match: 84,
//   //     posted: t("2 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Strong patient care and first aid skills. ICU certification would open senior positions."  ),
//   //     skills: [t("Patient Care"), t("First Aid"), t("Medication Management")],
//   //   },
//   //   {
//   //     id: 15, title: t("Teacher"), company: "BYJU'S",
//   //     location: t("Delhi"), salary: "₹5.5 LPA", match: 77,
//   //     posted: t("3 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Good communication and curriculum skills. EdTech experience would make you a stronger fit."  ),
//   //     skills: [t("Curriculum Design"), t("Classroom Management"), t("EdTech")],
//   //   },
//   //   {
//   //     id: 16, title: t("Accountant"), company: "Deloitte India",
//   //     location: t("Pune"), salary: "₹8.5 LPA", match: 74,
//   //     posted: t("6 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Solid bookkeeping foundation. Tally ERP and GST filing expertise would raise your match significantly."  ),
//   //     skills: [t("Bookkeeping"), t("Taxation"), "Tally", t("Financial Reporting")],
//   //   },
//   //   {
//   //     id: 17, title: t("HR Manager"), company: "Wipro",
//   //     location: t("Bangalore"), salary: "₹9 LPA", match: 71,
//   //     posted: t("1 day ago"), type: t("Full-time"),
//   //     whyMatch: t("Your recruitment and employee relations skills are relevant. Payroll software knowledge would help."  ),
//   //     skills: [t("Recruitment"), t("Payroll"), t("Employee Relations"), t("Compliance")],
//   //   },
//   //   {
//   //     id: 18, title: t("Mechanic"), company: "Maruti Suzuki",
//   //     location: t("Delhi"), salary: "₹4.2 LPA", match: 83,
//   //     posted: t("4 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Your engine repair and diagnostics skills match well. EV maintenance training would future-proof your career."  ),
//   //     skills: [t("Engine Repair"), t("Diagnostics"), t("Electrical Systems")],
//   //   },
//   //   {
//   //     id: 19, title: t("Content Writer"), company: "Times Internet",
//   //     location: t("Mumbai"), salary: "₹5.5 LPA", match: 76,
//   //     posted: t("5 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Good writing and research skills. SEO writing expertise would make you a top candidate."  ),
//   //     skills: [t("SEO Writing"), t("Research"), t("CMS Tools"), t("Copywriting")],
//   //   },
//   //   {
//   //     id: 20, title: t("Customer Support"), company: "Freshworks",
//   //     location: t("Chennai"), salary: "₹4 LPA", match: 87,
//   //     posted: t("1 hour ago"), type: t("Full-time"),
//   //     whyMatch: t("Excellent communication skills. Experience with ticketing systems like Zendesk would be valuable."  ),
//   //     skills: [t("Communication"), t("Ticketing Systems"), t("Problem Solving")],
//   //   },
//   //   {
//   //     id: 21, title: t("Pharmacist"), company: "Apollo Pharmacy",
//   //     location: t("Hyderabad"), salary: "₹5.5 LPA", match: 79,
//   //     posted: t("2 days ago"), type: t("Full-time"),
//   //     whyMatch: t("Strong drug knowledge and prescription handling. Regulatory compliance expertise would strengthen your profile."  ),
//   //     skills: [t("Drug Knowledge"), t("Prescription Handling"), t("Patient Counseling")],
//   //   },
//   //   {
//   //     id: 22, title: t("Lab Technician"), company: "SRL Diagnostics",
//   //     location: t("Pune"), salary: "₹3.8 LPA", match: 81,
//   //     posted: t("8 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Good sample analysis skills. Equipment calibration certification would increase opportunities."  ),
//   //     skills: [t("Sample Analysis"), t("Equipment Handling"), t("Quality Control")],
//   //   },
//   //   {
//   //     id: 23, title: t("Civil Engineer"), company: "L&T Construction",
//   //     location: t("Mumbai"), salary: "₹10 LPA", match: 70,
//   //     posted: t("1 day ago"), type: t("Full-time"),
//   //     whyMatch: t("AutoCAD and structural analysis skills are a good fit. Project management certification would elevate your candidacy."  ),
//   //     skills: ["AutoCAD", t("Structural Analysis"), t("Project Management")],
//   //   },
//   //   {
//   //     id: 24, title: t("Architect"), company: "Godrej Properties",
//   //     location: t("Bangalore"), salary: "₹11 LPA", match: 69,
//   //     posted: t("3 days ago"), type: t("Full-time"),
//   //     whyMatch: t("Strong 3D modeling and design thinking skills. Building code expertise would complete your profile."  ),
//   //     skills: ["AutoCAD", t("3D Modeling"), t("Building Codes"), t("Design Thinking")],
//   //   },
//   //   {
//   //     id: 25, title: t("Sales Executive"), company: "HDFC Bank",
//   //     location: t("Jaipur"), salary: "₹5 LPA", match: 80,
//   //     posted: t("2 hours ago"), type: t("Full-time"),
//   //     whyMatch: t("Your negotiation and lead generation skills are strong. CRM tool proficiency would boost your match."  ),
//   //     skills: [t("Negotiation"), t("CRM Tools"), t("Lead Generation"), t("Communication")],
//   //   },
//   //   {
//   //     id: 26, title: t("Marketing Manager"), company: "Nykaa",
//   //     location: t("Mumbai"), salary: "₹12 LPA", match: 73,
//   //     posted: t("1 day ago"), type: t("Full-time"),
//   //     whyMatch: t("Good analytics and content strategy skills. Campaign management experience at scale would help."  ),
//   //     skills: ["SEO", t("Content Strategy"), t("Analytics"), t("Social Media")],
//   //   },
//   // ];


// //   const fetchJobs = async () => {
// //   // Browser API se user ki current location lena
// //   navigator.geolocation.getCurrentPosition(async (pos) => {
// //     const { latitude, longitude } = pos.coords;

// //     const response = await fetch("http://localhost:5000/api/jobs/search", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         query: searchParams.query,
// //         userLat: latitude,
// //         userLng: longitude,
// //         radius: searchParams.radius
// //       }),
// //     });
// //     const data = await response.json();
// //     setJobs(data);
// //   });
// // };


//   // const filteredJobs = useMemo(() => {
//   //   if (!searchQuery.trim()) return jobs;
//   //   const q = searchQuery.toLowerCase();
//   //   return jobs.filter((job) =>
//   //     job.title.toLowerCase().includes(q) ||
//   //     job.company.toLowerCase().includes(q) ||
//   //     job.location.toLowerCase().includes(q) ||
//   //     job.type.toLowerCase().includes(q) ||
//   //     job.skills.some((s) => s.toLowerCase().includes(q))
//   //   );
//   // }, [searchQuery, jobs]);


//   const fetchJobs = async () => {
//   setLoading(true);

//   const getJobs = async (lat?: number, lng?: number) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/jobs/search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: searchQuery,
//           location: location, // Location input field ki value
//           userLat: lat,
//           userLng: lng,
//           radius: parseInt(radius)
//         }),
//       });
//       const data = await response.json();
//       setJobs(data.jobs || data);
//     } catch (err) {
//       console.error("Fetch failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => getJobs(pos.coords.latitude, pos.coords.longitude),
//       () => getJobs() // Agar user location deny kare toh bina lat/lng ke call karein
//     );
//   } else {
//     getJobs();
//   }
// };
  
//   const filteredJobs = useMemo(() => {
//   // Agar jobs array hi khali hai toh empty array return karein
//   if (!jobs || !Array.isArray(jobs)) return [];
//   if (!searchQuery.trim()) return jobs;

//   const q = searchQuery.toLowerCase();
//   return jobs.filter((job) => {
//     // Har field ko check karein ki wo exist karta hai ya nahi (Optional Chaining ?. ka use)
//     const titleMatch = job.title?.toLowerCase().includes(q);
//     const companyMatch = job.company?.toLowerCase().includes(q);
    
//     // Skills check: Pehle dekhein ki skills exist karta hai aur array hai
//     const skillsMatch = Array.isArray(job.skills) && job.skills.some((s: string) => 
//       s.toLowerCase().includes(q)
//     );

//     return titleMatch || companyMatch || skillsMatch;
//   });
// }, [searchQuery, jobs]);


//   const trendingSkills = [
//     { name: "Python", demand: 95 },
//     { name: t("Machine Learning"), demand: 88 },
//     { name: t("Cloud Computing"), demand: 82 },
//     { name: "SQL", demand: 80 },
//     { name: t("Data Engineering"), demand: 76 },
//     { name: t("Cybersecurity"), demand: 72 },
//   ];

//   const trendingRoles = [
//     { role: t("Data Analyst"), growth: "+24%", openings: "12.4K", hot: true },
//     { role: t("ML Engineer"), growth: "+31%", openings: "8.7K", hot: true },
//     { role: t("Backend Developer"), growth: "+18%", openings: "15.2K", hot: false },
//     { role: t("Cloud Engineer"), growth: "+27%", openings: "9.1K", hot: true },
//     { role: t("DevOps Engineer"), growth: "+21%", openings: "7.3K", hot: false },
//   ];

//   return (
//     <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
//       <motion.div {...fadeUp()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//         <div>
//           <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
//             {t("Jobs & Market")} <span className="text-gradient-primary">{t("Intelligence")}</span>
//           </h1>
//           <p className="text-muted-foreground mt-1">{t("Hyper-local jobs matched to your skills + live market insights")}</p>
//         </div>
//         <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
//           <button
//             onClick={() => setViewMode("list")}
//             className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
//               viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
//             }`}
//           >
//             <List className="h-4 w-4 inline mr-1" /> {t("List")}
//           </button>
//           <button
//             onClick={() => setViewMode("map")}
//             className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
//               viewMode === "map" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
//             }`}
//           >
//             <Map className="h-4 w-4 inline mr-1" /> {t("Map")}
//           </button>
//         </div>
//       </motion.div>

//       <motion.div {...fadeUp(0.1)}>
//         <Card className="border-0 shadow-lg bg-gradient-card">
//           <CardContent className="p-4">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder={t("Job Title (e.g., Developer)....")}
//                   className="pl-10 h-11"
//                 />
//               </div>
//               <div className="relative flex-1">
//                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   placeholder={t("City or Location...")}
//                   className="pl-10 h-11"
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <div className="flex items-center gap-1 px-3 py-1 rounded-lg border border-border bg-card">
//                   <MapPin className="h-4 w-4 text-primary" />
//                   <select
//                     value={radius}
//                     onChange={(e) => setRadius(e.target.value)}
//                     className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
//                   >
//                     {radiusOptions.map(r => <option key={r} value={r.split(' ')[0]}>{r}</option>)}
//                   </select>
//                 </div>
//                 <Button variant="outline" size="icon" className="h-11 w-11"
//                   onClick={handleSearch} disabled={loading}>
//                     {loading ? <RotateCcw className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4 mr-2" />}
//                   {t("Find Jobs")}
//                   <Filter className="h-4 w-4" />
//                 </Button>
//                 <Button variant="outline" className="h-11 gap-2">
//                   <Languages className="h-4 w-4" />
//                   <span className="hidden sm:inline text-sm">{t("Translate")}</span>
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       <AnimatePresence mode="wait">
//         {viewMode === "map" && (
//           <motion.div
//             key="map"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 300 }}
//             exit={{ opacity: 0, height: 0 }}
//             className="rounded-xl overflow-hidden border border-border"
//           >
//             <div className="w-full h-[300px] bg-muted flex items-center justify-center relative">
//               <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
//               {[
//                 { x: "30%", y: "40%" }, { x: "55%", y: "25%" },
//                 { x: "70%", y: "55%" }, { x: "45%", y: "65%" },
//               ].map((pos, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
//                   className="absolute"
//                   style={{ left: pos.x, top: pos.y }}
//                 >
//                   <div className="relative">
//                     <MapPin className="h-8 w-8 text-primary fill-primary/20" />
//                     <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success text-success-foreground text-[8px] font-bold flex items-center justify-center">
//                       {jobs[i]?.match}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//               <div className="z-10 text-center">
//                 <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
//                 <p className="text-sm font-medium text-foreground">{t("Interactive Map View")}</p>
//                 <p className="text-xs text-muted-foreground">{t("Showing jobs within")} {radius}</p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="space-y-4">
//         <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
//           <Briefcase className="h-5 w-5 text-primary" />
//           {t("Job Matches")}
//         </h2>
//         {filteredJobs.map((job, i) => (
//           <motion.div key={job.id} {...fadeUp(0.2 + i * 0.08)}>
//             <Card className="border-0 shadow-lg bg-gradient-card hover:shadow-xl transition-all duration-300 overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="p-5">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h3 className="text-lg font-semibold font-display text-foreground">{job.title}</h3>
//                         <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
//                           job.match >= 90
//                             ? "bg-success/10 text-success"
//                             : job.match >= 80
//                             ? "bg-primary/10 text-primary"
//                             : "bg-warning/10 text-warning"
//                         }`}>
//                           {job.match}% {t("Match")}
//                         </span>
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
//                       <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
//                         <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
//                         <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.type}</span>
//                         <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.posted}</span>
//                       </div>
//                       <div className="flex flex-wrap gap-1.5 mt-3">
//                         {Array.isArray(job.skills) && job.skills.map(s => (
//                           <span key={s} className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">{s}</span>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="text-right shrink-0">
//                       <p className="text-sm font-semibold text-foreground">{job.salary}</p>
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap items-center gap-2 mt-4">
//                     <Button size="sm" className="bg-gradient-primary text-primary-foreground">
//                       {t("Quick Apply")}
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
//                       className="gap-1"
//                     >
//                       <Sparkles className="h-3 w-3" />
//                       {t("Why I'm a Match")}
//                       <ChevronDown className={`h-3 w-3 transition-transform ${expandedJob === job.id ? "rotate-180" : ""}`} />
//                     </Button>
//                     <Button size="sm" variant="outline" className="gap-1"
//                       onClick={() => navigate(`/mock-interview?role=${encodeURIComponent(job.title)}`)}>
//                       <Mic className="h-3 w-3" />
//                       {t("Practice Interview")}
//                     </Button>
//                   </div>
//                 </div>
//                 <AnimatePresence>
//                   {expandedJob === job.id && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="px-5 py-4 bg-primary/5 border-t border-primary/10">
//                         <div className="flex items-start gap-3">
//                           <div className="p-2 rounded-lg bg-primary/10 shrink-0">
//                             <Sparkles className="h-4 w-4 text-primary" />
//                           </div>
//                           <div>
//                             <h4 className="text-sm font-semibold text-foreground mb-1">{t("AI Match Analysis")}</h4>
//                             <p className="text-sm text-muted-foreground">{job.whyMatch}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       <motion.div {...fadeUp(0.5)} className="space-y-6 pt-4">
//         <div className="flex items-center gap-2">
//           <div className="p-2 rounded-lg bg-primary/10">
//             <BarChart3 className="h-5 w-5 text-primary" />
//           </div>
//           <h2 className="text-2xl font-display font-bold text-foreground">
//             {t("Live Market")} <span className="text-gradient-primary">{t("Insights")}</span>
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <motion.div {...fadeUp(0.55)}>
//             <Card className="border-0 shadow-lg bg-gradient-card h-full">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-display flex items-center gap-2">
//                   <Zap className="h-4 w-4 text-primary" />
//                   {t("Live Skills in Demand")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {trendingSkills.map((skill, i) => (
//                   <div key={skill.name} className="space-y-1">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="font-medium text-foreground">{skill.name}</span>
//                       <span className="text-muted-foreground text-xs">{skill.demand}%</span>
//                     </div>
//                     <div className="h-2 rounded-full bg-muted overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${skill.demand}%` }}
//                         transition={{ duration: 0.8, delay: 0.6 + i * 0.08 }}
//                         className="h-full rounded-full bg-gradient-primary"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </motion.div>

//           <motion.div {...fadeUp(0.6)}>
//             <Card className="border-0 shadow-lg bg-gradient-card h-full">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-base font-display flex items-center gap-2">
//                   <TrendingUp className="h-4 w-4 text-primary" />
//                   {t("Live Job Trends")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 {trendingRoles.map((item, i) => (
//                   <motion.div
//                     key={item.role}
//                     {...fadeUp(0.65 + i * 0.06)}
//                     className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`w-2 h-2 rounded-full ${item.hot ? "bg-success" : "bg-muted-foreground"}`} />
//                       <span className="text-sm font-medium text-foreground">{item.role}</span>
//                       {item.hot && (
//                         <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success">
//                           HOT
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <span className="text-success font-medium">{item.growth}</span>
//                       <span>{item.openings} {t("openings")}</span>
//                     </div>
//                   </motion.div>
//                 ))}
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>

//         <motion.div {...fadeUp(0.7)}>
//           <Card className="border-0 shadow-lg bg-gradient-card">
//             <CardHeader className="pb-2">
//                <CardTitle className="text-base font-display flex items-center gap-2">
//                 <BarChart3 className="h-4 w-4 text-primary" />
//                 {t("Job Market Demand Trends")}
//               </CardTitle>
//               <p className="text-xs text-muted-foreground">{t("Demand index over the last 6 months")}</p>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[280px] w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={marketDemandData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis
//                       dataKey="month"
//                       tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
//                       axisLine={{ stroke: "hsl(var(--border))" }}
//                     />
//                     <YAxis
//                       tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
//                       axisLine={{ stroke: "hsl(var(--border))" }}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "hsl(var(--card))",
//                         border: "1px solid hsl(var(--border))",
//                         borderRadius: "8px",
//                         fontSize: "12px",
//                       }}
//                     />
//                     <Legend wrapperStyle={{ fontSize: "12px" }} />
//                     <Line type="monotone" dataKey="AI/ML" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
//                     <Line type="monotone" dataKey="Data Analysis" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
//                     <Line type="monotone" dataKey="Cloud" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 3 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default JobPortal;

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  MapPin, Search, Filter, Globe, Mic, Briefcase, IndianRupee,
  ArrowRight, Star, Clock, CheckCircle2, Sparkles,
  Map, List, ChevronDown, Languages, TrendingUp, BarChart3, Zap,
  RotateCcw
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge"; // Add this line
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const radiusOptions = ["5 km", "10 km", "25 km", "50 km"];

const marketDemandData = [
  { month: "Jan", "AI/ML": 65, "Data Analysis": 55, "Cloud": 45 },
  { month: "Feb", "AI/ML": 68, "Data Analysis": 58, "Cloud": 48 },
  { month: "Mar", "AI/ML": 72, "Data Analysis": 62, "Cloud": 52 },
  { month: "Apr", "AI/ML": 78, "Data Analysis": 65, "Cloud": 55 },
  { month: "May", "AI/ML": 85, "Data Analysis": 72, "Cloud": 60 },
  { month: "Jun", "AI/ML": 92, "Data Analysis": 78, "Cloud": 65 },
];

const JobPortal = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("50"); 
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]); // Recent jobs ke liye state
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true); 

  const { t } = useTranslation();
  const navigate = useNavigate();

  // Optimized Fetch Logic
  const fetchJobs = async () => {
    setLoading(true);

    const getJobsFromAPI = async (lat?: number, lng?: number) => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            location: location,
            userLat: lat,
            userLng: lng,
            radius: parseInt(radius) || 50
          }),
        });
        const data = await response.json();
        // Backend data handling
        const jobList = Array.isArray(data) ? data : (data.jobs || []);
        setJobs(jobList);
      } catch (err) {
        console.error("Fetch failed:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => getJobsFromAPI(pos.coords.latitude, pos.coords.longitude),
        () => getJobsFromAPI() 
      );
    } else {
      getJobsFromAPI();
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  // SUPER SAFE FILTER LOGIC
  const filteredJobs = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return [];
    if (!searchQuery.trim()) return jobs;

    const q = searchQuery.toLowerCase();
    return jobs.filter((job) => {
      if (!job) return false;
      
      const titleMatch = job.title?.toString().toLowerCase().includes(q);
      const companyMatch = job.company?.toString().toLowerCase().includes(q);
      
      // Skills Safe Check (Handles null, string, and array)
      let skillsMatch = false;
      if (Array.isArray(job.skills)) {
        skillsMatch = job.skills.some((s: any) => s?.toString().toLowerCase().includes(q));
      } else if (typeof job.skills === 'string') {
        skillsMatch = job.skills.toLowerCase().includes(q);
      }

      return titleMatch || companyMatch || skillsMatch;
    });
  }, [searchQuery, jobs]);

  const trendingSkills = [
    { name: "Python", demand: 95 },
    { name: t("Machine Learning"), demand: 88 },
    { name: t("Cloud Computing"), demand: 82 },
    { name: "SQL", demand: 80 },
    { name: t("Data Engineering"), demand: 76 },
    { name: t("Cybersecurity"), demand: 72 },
  ];

  const trendingRoles = [
    { role: t("Data Analyst"), growth: "+24%", openings: "12.4K", hot: true },
    { role: t("ML Engineer"), growth: "+31%", openings: "8.7K", hot: true },
    { role: t("Backend Developer"), growth: "+18%", openings: "15.2K", hot: false },
    { role: t("Cloud Engineer"), growth: "+27%", openings: "9.1K", hot: true },
    { role: t("DevOps Engineer"), growth: "+21%", openings: "7.3K", hot: false },
  ];
  useEffect(() => {
  const loadRecentJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs/featured");
      const data = await response.json();
      setFeaturedJobs(data);
    } catch (error) {
      console.error("Recent jobs nahi aa payi");
    } finally {
      setIsFeaturedLoading(false);
    }
  };
  loadRecentJobs();
}, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div {...fadeUp()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
            {t("Jobs & Market")} <span className="text-gradient-primary">{t("Intelligence")}</span>
          </h1>
          <p className="text-muted-foreground mt-1">{t("Hyper-local jobs matched to your skills + live market insights")}</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            <List className="h-4 w-4 inline mr-1" /> {t("List")}
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === "map" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            <Map className="h-4 w-4 inline mr-1" /> {t("Map")}
          </button>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <Card className="border-0 shadow-lg bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Job Title (e.g., Developer)....")}
                  className="pl-10 h-11"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("City or Location...")}
                  className="pl-10 h-11"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg border border-border bg-card">
                  <MapPin className="h-4 w-4 text-primary" />
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
                  >
                    {radiusOptions.map(r => <option key={r} value={r.split(' ')[0]}>{r}</option>)}
                  </select>
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11"
                  onClick={handleSearch} disabled={loading}>
                    {loading ? <RotateCcw className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
                </Button>
                <Button variant="outline" className="h-11 gap-2">
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{t("Translate")}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 300 }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl overflow-hidden border border-border"
          >
            <div className="w-full h-[300px] bg-muted flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
              {[
                { x: "30%", y: "40%" }, { x: "55%", y: "25%" },
                { x: "70%", y: "55%" }, { x: "45%", y: "65%" },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                  className="absolute"
                  style={{ left: pos.x, top: pos.y }}
                >
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-primary fill-primary/20" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success text-success-foreground text-[8px] font-bold flex items-center justify-center">
                      {jobs && jobs[i] ? jobs[i].match : 0}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="z-10 text-center">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{t("Interactive Map View")}</p>
                <p className="text-xs text-muted-foreground">{t("Showing jobs within")} {radius} km</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Agar user ne search nahi kiya aur humare paas trending jobs hain */}
  {!searchQuery && featuredJobs && featuredJobs.length > 0 && (
    <div className="mb-8">
      <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        {t("Recent Job Openings")} 
        <Badge variant="outline" className="ml-2 bg-primary/5">Live from Adzuna</Badge>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredJobs?.map((job: any) => (
          <Card key={job.id} className="border-0 shadow-md bg-gradient-card hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="secondary" className="text-[10px]">{job.type}</Badge>
                <span className="text-xs font-bold text-success">{job.salary}</span>
              </div>
              <h3 className="font-bold text-sm truncate text-foreground">{job.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{job.company} • {job.location}</p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={() => job.url ? window.open(job.url, '_blank') : alert("Link not anailable")}
              >
                View Opening
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )}
        <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          {t("Job Matches")}
        </h2>
        {filteredJobs.length === 0 && !loading && (
           <p className="text-center py-10 text-muted-foreground">No jobs found. Try a different search.</p>
        )}
        {filteredJobs.map((job, i) => (
          <motion.div key={job.id || i} {...fadeUp(0.2 + i * 0.08)}>
            <Card className="border-0 shadow-lg bg-gradient-card hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold font-display text-foreground">{job.title || "Untitled Job"}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          (job.match || 0) >= 90
                            ? "bg-success/10 text-success"
                            : (job.match || 0) >= 80
                            ? "bg-primary/10 text-primary"
                            : "bg-warning/10 text-warning"
                        }`}>
                          {job.match || 0}% {t("Match")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{job.company || "Unknown Company"}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location || "Remote"}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.type || "Full-time"}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.posted || "Just now"}</span>
                      </div>
                      
                      {/* SAFE SKILLS RENDER */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {Array.isArray(job?.skills) ? (
                          job.skills.map((s: any, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">{s?.toString}</span>
                          ))
                        ) : typeof job?.skills === 'string' && job.skills.trim() !== "" ? (
                          job.skills.split(',').map((s: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">{s.trim()}</span>
                          ))
                        ) : null}
                      </div>

                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">{job.salary || "Not disclosed"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground"
                    onClick={() => window.open(job.url, '_blank')}>
                      {t("Quick Apply")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      className={`h-8 gap-1 ${expandedJob === job.id ? "bg-primary/10 border-primary" : ""}`}
                    >
                      <Sparkles className="h-3 w-3" />
                      {t("Why I'm a Match")}
                      <ChevronDown className={`h-3 w-3 transition-transform ${expandedJob === job.id ? "rotate-180" : ""}`} />
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1"
                      onClick={() => navigate(`/mock-interview?role=${job.title}`)}>
                      <Mic className="h-3 w-3" />
                      {t("Practice Interview")}
                    </Button>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-4 bg-primary/5 border-t border-primary/10">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">{t("AI Match Analysis")}</h4>
                            <p className="text-sm text-muted-foreground">{job.whyMatch || "Based on your search, this role in " + job.location + " matches your profile. It requires skills like " + job.skills.join(", ") + "."}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* INSIGHTS SECTION - NO CHANGES MADE */}
      <motion.div {...fadeUp(0.5)} className="space-y-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            {t("Live Market")} <span className="text-gradient-primary">{t("Insights")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...fadeUp(0.55)}>
            <Card className="border-0 shadow-lg bg-gradient-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  {t("Live Skills in Demand")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingSkills.map((skill, i) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-muted-foreground text-xs">{skill.demand}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.demand}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.08 }}
                        className="h-full rounded-full bg-gradient-primary"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeUp(0.6)}>
            <Card className="border-0 shadow-lg bg-gradient-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {t("Live Job Trends")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trendingRoles.map((item, i) => (
                  <motion.div
                    key={item.role}
                    {...fadeUp(0.65 + i * 0.06)}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.hot ? "bg-success" : "bg-muted-foreground"}`} />
                      <span className="text-sm font-medium text-foreground">{item.role}</span>
                      {item.hot && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success">
                          HOT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="text-success font-medium">{item.growth}</span>
                      <span>{item.openings} {t("openings")}</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.7)}>
          <Card className="border-0 shadow-lg bg-gradient-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-base font-display flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                {t("Job Market Demand Trends")}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{t("Demand index over the last 6 months")}</p>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketDemandData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line type="monotone" dataKey="AI/ML" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Data Analysis" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Cloud" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JobPortal;