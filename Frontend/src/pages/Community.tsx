


// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { 
//   ImageIcon, Send, ThumbsUp, MessageSquare, 
//   MoreHorizontal, Plus, X, Users, Briefcase, MapPin, Building, Loader2 
// } from "lucide-react";

// // --- API CONFIG (Apni Keys yahan dalo) ---
// const COUNTRY = "in"; // 'in' for India, 'gb' for UK, 'us' for USA
// const MOCK_PEOPLE = [
//   { id: 1, name: "Amit Patel", role: "UI Designer @ Google", avatar: "https://i.pravatar.cc/150?u=11", mutuals: 12 },
//   { id: 2, name: "Sneha Reddy", role: "Full Stack Dev @ Zomato", avatar: "https://i.pravatar.cc/150?u=12", mutuals: 5 },
//   { id: 3, name: "Vikram Singh", role: "Product Manager @ Meta", avatar: "https://i.pravatar.cc/150?u=13", mutuals: 8 },
//   { id: 4, name: "Rahul Verma", role: "Data Scientist @ Amazon", avatar: "https://i.pravatar.cc/150?u=14", mutuals: 21 },
// ];

// const Community = () => {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [newPostContent, setNewPostContent] = useState("");
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [showPeople, setShowPeople] = useState(false);
//   const [showJobs, setShowJobs] = useState(false);
  
//   // Real-time Jobs State
//   const [realJobs, setRealJobs] = useState<any[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // --- FETCH REAL-TIME JOBS ---
//   const fetchJobs = async () => {
//     setLoadingJobs(true);
//     try {
//       // Searching for 'Software' jobs in India
//       const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=${"3b59f8b2"}&app_key=${"bdd0171494c4ca741d51ff0bd806c4e5"}&results_per_page=10&what=software&content-type=application/json`;
      
//       const response = await fetch(url);
//       const data = await response.json();
//       setRealJobs(data.results || []);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setLoadingJobs(false);
//     }
//   };

//   // Fetch jobs when popup opens
//   useEffect(() => {
//     if (showJobs) fetchJobs();
//   }, [showJobs]);

//   const handlePost = () => {
//     if (!newPostContent.trim() && !selectedImage) return;
//     const newPost = {
//       id: Date.now(),
//       user: "You",
//       role: "User",
//       avatar: "https://github.com/shadcn.png",
//       content: newPostContent,
//       image: selectedImage,
//       likes: 0,
//       time: "Just now"
//     };
//     setPosts([newPost, ...posts]);
//     setNewPostContent("");
//     setSelectedImage(null);
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] w-full pb-20">
      
//       {/* HEADER */}
//       <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center px-6">
//         <Button variant="outline" onClick={() => setShowJobs(true)} className="rounded-2xl bg-orange-50 text-orange-600 border-orange-100 gap-2 font-bold">
//           <Briefcase className="h-4 w-4" /> <span>Live Jobs</span>
//         </Button>
//         <h2 className="text-xl font-black text-slate-800">COMMUNITY</h2>
//         <Button variant="outline" onClick={() => setShowPeople(true)} className="rounded-2xl bg-blue-50 text-blue-600 border-blue-100 gap-2 font-bold">
//           <Users className="h-4 w-4" /> <span>Networking</span>
//         </Button>
//       </div>

//       {/* FEED CONTENT (Centered) */}
//       <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
//         {/* Post Input Box - (Same as before) */}
//         <Card className="border-none shadow-sm rounded-[2rem] bg-white p-6">
//             <div className="flex gap-4">
//               <Avatar className="h-12 w-12"><AvatarImage src="https://github.com/shadcn.png" /></Avatar>
//               <textarea 
//                 value={newPostContent}
//                 onChange={(e) => setNewPostContent(e.target.value)}
//                 placeholder="Post a job or update..."
//                 className="flex-1 min-h-[80px] resize-none border-none focus:ring-0"
//               />
//             </div>
//             <div className="flex justify-between mt-4 border-t pt-4">
//                <Button variant="ghost" onClick={() => fileInputRef.current?.click()}><ImageIcon className="h-5 w-5 text-blue-500 mr-2" /> Photo</Button>
//                <Button onClick={handlePost} className="rounded-full bg-primary px-8">Post</Button>
//             </div>
//             <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
//                const reader = new FileReader();
//                reader.onload = () => setSelectedImage(reader.result as string);
//                reader.readAsDataURL(e.target.files![0]);
//             }}/>
//         </Card>

//         {/* FEED DISPLAY */}
//         <div className="space-y-4">
//           {posts.map(p => (
//             <Card key={p.id} className="border-none shadow-sm rounded-3xl bg-white p-5">
//                <div className="flex gap-3 mb-3">
//                   <Avatar><AvatarImage src={p.avatar} /></Avatar>
//                   <div><p className="font-bold text-sm">{p.user}</p><p className="text-[10px] text-slate-400">{p.time}</p></div>
//                </div>
//                <p className="text-sm text-slate-700">{p.content}</p>
//                {p.image && <img src={p.image} className="mt-3 rounded-2xl w-full" />}
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* --- REAL-TIME JOBS POPUP (Large Size) --- */}
//       <AnimatePresence>
//         {showJobs && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJobs(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
//              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh]">
//                 <div className="p-6 border-b flex justify-between items-center bg-orange-500 text-white rounded-t-[2.5rem]">
//                    <h3 className="font-bold text-xl flex items-center gap-2"><Briefcase /> Real-time Job Openings</h3>
//                    <button onClick={() => setShowJobs(false)}><X className="h-6 w-6" /></button>
//                 </div>
                
//                 <div className="p-6 overflow-y-auto flex-1 space-y-4">
//                    {loadingJobs ? (
//                      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
//                         <Loader2 className="h-10 w-10 animate-spin mb-2" />
//                         <p>Fetching latest jobs from Adzuna...</p>
//                      </div>
//                    ) : (
//                      realJobs.map((job: any) => (
//                        <div key={job.id} className="p-5 border border-slate-100 rounded-3xl hover:border-orange-200 bg-slate-50/50 transition-all">
//                           <div className="flex justify-between items-start mb-2">
//                              <h4 className="font-black text-slate-900 text-lg leading-tight">{job.title}</h4>
//                              <span className="text-xs font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full whitespace-nowrap">
//                                 {job.salary_min ? `₹${job.salary_min.toLocaleString()}` : "Best in Industry"}
//                              </span>
//                           </div>
//                           <div className="flex gap-4 text-xs text-slate-500 mb-4">
//                              <span className="flex items-center gap-1 font-bold text-slate-700"><Building className="h-3 w-3" /> {job.company.display_name}</span>
//                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location.display_name}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                              <p className="text-[11px] text-slate-400 italic">Posted {new Date(job.created).toLocaleDateString()}</p>
//                              <Button onClick={() => window.open(job.redirect_url, '_blank')} className="rounded-full bg-orange-600 hover:bg-orange-700 px-6 text-xs h-9">View & Apply</Button>
//                           </div>
//                        </div>
//                      ))
//                    )}
//                 </div>
//              </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//       {/* --- NETWORKING / PEOPLE POPUP --- */}
//       <AnimatePresence>
//         {showPeople && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
//              {/* Background Overlay */}
//              <motion.div 
//                initial={{ opacity: 0 }} 
//                animate={{ opacity: 1 }} 
//                exit={{ opacity: 0 }} 
//                onClick={() => setShowPeople(false)} 
//                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
//              />
             
//              {/* Popup Window */}
//              <motion.div 
//                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
//                animate={{ scale: 1, opacity: 1, y: 0 }} 
//                exit={{ scale: 0.95, opacity: 0, y: 20 }} 
//                className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
//              >
//                 {/* Header */}
//                 <div className="p-8 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//                    <div>
//                       <h3 className="font-black text-2xl flex items-center gap-3">
//                         <Users className="h-7 w-7" /> Networking Hub
//                       </h3>
//                       <p className="text-blue-100 text-sm mt-1">People you might know from your industry</p>
//                    </div>
//                    <button 
//                      onClick={() => setShowPeople(false)} 
//                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
//                    >
//                      <X className="h-7 w-7" />
//                    </button>
//                 </div>

//                 {/* People List */}
//                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
//                    {MOCK_PEOPLE.map((person) => (
//                      <motion.div 
//                        key={person.id} 
//                        whileHover={{ y: -2 }}
//                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:shadow-md transition-all"
//                      >
//                         <div className="flex items-center gap-3">
//                            <div className="relative">
//                               <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
//                                 <AvatarImage src={person.avatar} />
//                                 <AvatarFallback>{person.name[0]}</AvatarFallback>
//                               </Avatar>
//                               <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
//                            </div>
//                            <div>
//                               <p className="font-bold text-slate-900 text-sm leading-tight">{person.name}</p>
//                               <p className="text-[10px] text-slate-500 font-medium mt-0.5">{person.role}</p>
//                               <div className="flex items-center gap-1 mt-1">
//                                  <Users className="h-2.5 w-2.5 text-blue-500" />
//                                  <span className="text-[9px] text-blue-600 font-bold">{person.mutuals} mutuals</span>
//                               </div>
//                            </div>
//                         </div>
//                         <Button 
//                           size="sm" 
//                           variant="outline"
//                           className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-xs px-4"
//                         >
//                           Connect
//                         </Button>
//                      </motion.div>
//                    ))}
//                 </div>

//                 {/* Footer Section inside Popup */}
//                 <div className="p-4 bg-slate-50 border-t text-center">
//                    <button className="text-blue-600 text-xs font-bold hover:underline">See all suggestions</button>
//                 </div>
//              </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Community;

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ImageIcon, Send, ThumbsUp, MessageSquare, 
  MoreHorizontal, Plus, X, Users, Briefcase, MapPin, Building, Loader2, Trash2 
} from "lucide-react";

const COUNTRY = "in"; 
const MOCK_PEOPLE = [
  { id: 1, name: "Amit Patel", role: "UI Designer @ Google", avatar: "https://i.pravatar.cc/150?u=11", mutuals: 12 },
  { id: 2, name: "Sneha Reddy", role: "Full Stack Dev @ Zomato", avatar: "https://i.pravatar.cc/150?u=12", mutuals: 5 },
  { id: 3, name: "Vikram Singh", role: "Product Manager @ Meta", avatar: "https://i.pravatar.cc/150?u=13", mutuals: 8 },
  { id: 4, name: "Rahul Verma", role: "Data Scientist @ Amazon", avatar: "https://i.pravatar.cc/150?u=14", mutuals: 21 },
];

const Community = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPeople, setShowPeople] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [realJobs, setRealJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  
  // States for commenting
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/1?app_id=3b59f8b2&app_key=bdd0171494c4ca741d51ff0bd806c4e5&results_per_page=10&what=software&content-type=application/json`;
      const response = await fetch(url);
      const data = await response.json();
      setRealJobs(data.results || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (showJobs) fetchJobs();
  }, [showJobs]);

  const handlePost = () => {
    if (!newPostContent.trim() && !selectedImage) return;
    const newPost = {
      id: Date.now(),
      user: "You",
      role: "User",
      avatar: "https://github.com/shadcn.png",
      content: newPostContent,
      image: selectedImage,
      likes: 0,
      isLiked: false,
      comments: [],
      time: "Just now"
    };
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setSelectedImage(null);
  };

  // --- Actions ---
  const deletePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const toggleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          likes: p.isLiked ? p.likes - 1 : p.likes + 1, 
          isLiked: !p.isLiked 
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: number) => {
    if (!commentText.trim()) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, commentText] };
      }
      return p;
    }));
    setCommentText("");
    setActiveCommentId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] w-full pb-20 overflow-x-hidden">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center px-6">
        <Button variant="outline" onClick={() => setShowJobs(true)} className="rounded-2xl bg-orange-50 text-orange-600 border-orange-100 gap-2 font-bold">
          <Briefcase className="h-4 w-4" /> <span>Live Jobs</span>
        </Button>
        <h2 className="text-xl font-black text-slate-800">COMMUNITY</h2>
        <Button variant="outline" onClick={() => setShowPeople(true)} className="rounded-2xl bg-blue-50 text-blue-600 border-blue-100 gap-2 font-bold">
          <Users className="h-4 w-4" /> <span>Networking</span>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* POST INPUT BOX */}
        <Card className="border-none shadow-sm rounded-[2rem] bg-white p-6">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12"><AvatarImage src="https://github.com/shadcn.png" /></Avatar>
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 min-h-[80px] resize-none border-none focus:ring-0 text-slate-700"
              />
            </div>
            {selectedImage && (
              <div className="relative mt-3 rounded-2xl overflow-hidden">
                <img src={selectedImage} alt="preview" className="w-full h-40 object-cover" />
                <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"><X className="h-4 w-4" /></button>
              </div>
            )}
            <div className="flex justify-between mt-4 border-t pt-4">
               <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="rounded-xl"><ImageIcon className="h-5 w-5 text-blue-500 mr-2" /> Photo</Button>
               <Button onClick={handlePost} className="rounded-full bg-primary px-8 font-bold">Post</Button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
               if (e.target.files?.[0]) {
                 const reader = new FileReader();
                 reader.onload = () => setSelectedImage(reader.result as string);
                 reader.readAsDataURL(e.target.files[0]);
               }
            }}/>
        </Card>

        {/* FEED DISPLAY */}
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map(p => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                   <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                         <div className="flex gap-3">
                            <Avatar><AvatarImage src={p.avatar} /></Avatar>
                            <div>
                               <p className="font-bold text-sm text-slate-900">{p.user}</p>
                               <p className="text-[10px] text-slate-400">{p.time}</p>
                            </div>
                         </div>
                         <Button variant="ghost" size="icon" onClick={() => deletePost(p.id)} className="text-slate-300 hover:text-red-500 rounded-full transition-colors">
                            <Trash2 className="h-5 w-5" />
                         </Button>
                      </div>
                      <p className="text-sm text-slate-700 mb-3 leading-relaxed">{p.content}</p>
                      {p.image && <img src={p.image} className="rounded-2xl w-full h-auto object-cover border mb-3" />}
                      
                      {/* LIKES & COMMENTS COUNT */}
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 px-1">
                         <span>{p.likes} likes</span>
                         <span>{p.comments.length} comments</span>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex border-t pt-2 gap-2">
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleLike(p.id)}
                            className={`flex-1 rounded-xl transition-all ${p.isLiked ? "text-blue-600 bg-blue-50" : "text-slate-500"}`}
                         >
                            <ThumbsUp className={`h-4 w-4 mr-2 ${p.isLiked ? "fill-current" : ""}`} /> Like
                         </Button>
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveCommentId(activeCommentId === p.id ? null : p.id)}
                            className="flex-1 rounded-xl text-slate-500"
                         >
                            <MessageSquare className="h-4 w-4 mr-2" /> Comment
                         </Button>
                      </div>

                      {/* COMMENT INPUT SECTION */}
                      {activeCommentId === p.id && (
                        <div className="mt-4 flex gap-2 animate-in slide-in-from-top-2 duration-200">
                           <Input 
                              placeholder="Write a comment..." 
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="rounded-full bg-slate-50 border-none"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(p.id)}
                           />
                           <Button size="icon" onClick={() => handleAddComment(p.id)} className="rounded-full shrink-0">
                              <Send className="h-4 w-4" />
                           </Button>
                        </div>
                      )}

                      {/* DISPLAY COMMENTS */}
                      {p.comments.length > 0 && (
                        <div className="mt-4 space-y-2">
                           {p.comments.map((c: string, i: number) => (
                             <div key={i} className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-600 border border-slate-100">
                                {c}
                             </div>
                           ))}
                        </div>
                      )}
                   </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Popups remain same as previous code... */}
      <AnimatePresence>
        {showJobs && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJobs(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-6 border-b flex justify-between items-center bg-orange-500 text-white rounded-t-[2.5rem]">
                   <h3 className="font-bold text-xl flex items-center gap-2"><Briefcase /> Real-time Job Openings</h3>
                   <button onClick={() => setShowJobs(false)}><X className="h-6 w-6" /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                   {loadingJobs ? (
                     <div className="flex flex-col items-center justify-center py-20 text-slate-400"><Loader2 className="h-10 w-10 animate-spin mb-2" /><p>Fetching jobs...</p></div>
                   ) : (
                     realJobs.map((job: any) => (
                       <div key={job.id} className="p-5 border border-slate-100 rounded-3xl hover:border-orange-200 bg-slate-50/50 transition-all flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h4 className="font-black text-slate-900 text-lg">{job.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">{job.company.display_name} • {job.location.display_name}</p>
                          </div>
                          <Button onClick={() => window.open(job.redirect_url, '_blank')} className="rounded-full bg-orange-600 hover:bg-orange-700 text-xs px-6">Apply</Button>
                       </div>
                     ))
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPeople && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPeople(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-8 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                   <h3 className="font-black text-2xl flex items-center gap-3"><Users className="h-7 w-7" /> Networking Hub</h3>
                   <button onClick={() => setShowPeople(false)}><X className="h-7 w-7" /></button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
                   {MOCK_PEOPLE.map((person) => (
                     <div key={person.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                           <Avatar><AvatarImage src={person.avatar} /></Avatar>
                           <div>
                              <p className="font-bold text-slate-900 text-sm">{person.name}</p>
                              <p className="text-[10px] text-slate-500">{person.role}</p>
                           </div>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-full border-blue-200 text-blue-600 text-xs px-4">Connect</Button>
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;

