import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Image as ImageIcon, 
  Send, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  Plus,
  X,
  MapPin,
  Briefcase
} from "lucide-react";

// Mock Feed Data
const MOCK_POSTS = [
  {
    id: 1,
    user: "Rahul Sharma",
    role: "Senior Developer @ Google",
    avatar: "https://i.pravatar.cc/150?u=1",
    content: "Just finished a great project using React and Supabase! The real-time capabilities are truly game-changing. 🚀 #webdev #coding",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
    likes: 24,
    comments: 5,
    time: "2h ago"
  },
  {
    id: 2,
    user: "Priya Patel",
    role: "Product Designer @ Zomato",
    avatar: "https://i.pravatar.cc/150?u=2",
    content: "Hiring for UI/UX Interns! If you have a passion for creating beautiful user experiences, DM me your portfolio. 🎨",
    image: null,
    likes: 45,
    comments: 12,
    time: "5h ago"
  }
];

const Community = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState("");

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* 1. CREATE POST BOX (Exactly like Screenshot) */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
          <CardContent className="p-4">
            <div className="flex gap-3 items-center">
              <Avatar className="h-12 w-12 border border-slate-100">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <button 
                onClick={() => {}} // Yahan modal khul sakta hai
                className="flex-1 text-left px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 font-medium transition-colors"
              >
                Start a post...
              </button>
            </div>
            
            <div className="flex justify-between mt-4 pt-2 border-t border-slate-50">
              <Button variant="ghost" className="text-blue-600 gap-2 hover:bg-blue-50">
                <ImageIcon className="h-5 w-5" /> <span>Photo</span>
              </Button>
              <Button variant="ghost" className="text-orange-600 gap-2 hover:bg-orange-50">
                <Plus className="h-5 w-5 font-bold" /> <span>Job</span>
              </Button>
              <Button className="bg-primary rounded-full px-6">
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. FEED SECTION */}
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-none shadow-sm rounded-xl bg-white overflow-hidden">
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-none">{post.user}</h4>
                        <p className="text-xs text-slate-500 mt-1">{post.role}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{post.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <MoreHorizontal className="h-5 w-5 text-slate-400" />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-slate-800 text-sm leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Image (Optional) */}
                  {post.image && (
                    <div className="bg-slate-100 border-y border-slate-50">
                      <img src={post.image} alt="Post content" className="w-full h-auto max-h-[400px] object-cover" />
                    </div>
                  )}

                  {/* Interaction Stats */}
                  <div className="px-4 py-2 flex justify-between items-center text-xs text-slate-500 border-b border-slate-50">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="bg-blue-500 rounded-full p-0.5 border border-white">
                          <ThumbsUp className="h-2 w-2 text-white fill-white" />
                        </div>
                      </div>
                      <span>{post.likes} likes</span>
                    </div>
                    <span>{post.comments} comments</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-1 flex justify-around">
                    <Button variant="ghost" className="flex-1 gap-2 text-slate-600 hover:text-primary rounded-lg py-5">
                      <ThumbsUp className="h-5 w-5" /> Like
                    </Button>
                    <Button variant="ghost" className="flex-1 gap-2 text-slate-600 hover:text-primary rounded-lg py-5">
                      <MessageSquare className="h-5 w-5" /> Comment
                    </Button>
                    <Button variant="ghost" className="flex-1 gap-2 text-slate-600 hover:text-primary rounded-lg py-5">
                      <Share2 className="h-5 w-5" /> Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
