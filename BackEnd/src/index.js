const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
// const {searchJobs} = require('./controllers/jobController');
const jobControllerFile = require('./controllers/jobController.js'); 
const searchJobs = jobControllerFile.searchJobs;
const analysisController = require('./controllers/analysisController');
const jobRoutes = require('./routes/jobRoutes');
// Apne User model ka sahi path yahan likhein
const User = require('./models/User'); // Agar aapka model models folder mein hai toh

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // React app ka URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); // Allows your React app to make requests
app.use(express.json()); // Allows parsing of JSON data

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected Successfully! ✅"))
  .catch((err) => console.log("Database Connection Failed! ❌", err));

// Basic Test Route
app.get('/api/status', (req, res) => {
  res.json({ message: "Backend is running smoothly!", timestamp: new Date() });
});

// Auth Routes
app.use('/api/auth', authRoutes);
// 1. Pehle ye Skills Map define karein (Route se upar)
// const SKILLS_BY_ROLE = {
//   "Data Analyst": ["SQL", "Python", "Power BI", "Excel", "Tableau", "Statistics"],
//   "Frontend Developer": ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "TypeScript"],
//   "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "REST API", "Docker"],
//   "Full Stack Developer": ["React", "Node.js", "MongoDB", "JavaScript", "AWS"],
//   "Software Engineer": ["Java", "Data Structures", "Algorithms", "System Design", "SQL"]
// };

// 2. Ab profile route ko update karein
app.get('/api/user/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const targetRole = user.targetRole || "Software Developer";

    // REAL-TIME: Ab mock data nahi, Adzuna se fetch ho raha hai
    const requiredSkills = await getMarketRequiredSkills(targetRole);
    console.log("User Skills from DB:", user.skills);
    console.log("Required Market Skills:", requiredSkills);
    const userSkills = (user.skills || []).map(s => 
      typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase()
    );

    const missingSkills = requiredSkills.filter(
      skill => !userSkills.includes(skill.toLowerCase())
    );

    const matchedCount = requiredSkills.length - missingSkills.length;
    const readinessScore = Math.round((matchedCount / requiredSkills.length) * 100);

    res.json({
      ...user._doc,
      analysisResult: {
        missingSkills: missingSkills.length > 0 ? missingSkills : ["You match the market!"],
        readinessScore,
        lastMarketUpdate: new Date().toISOString() // Batao ki data kab ka hai
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
// Latest Market Skills Fetch karne ka function
const getMarketRequiredSkills = async (role) => {
  try {
    console.log(`Searching live market skills for: ${role}`);
    
    const appId = "3b59f8b2";
    const appKey = "4c5bdd1d6ac22fc4ea23b970aff8849e";
    
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=15&what=${encodeURIComponent(role)}`,
      { timeout: 8000 }
    );

    const results = response.data.results || [];
    const fullText = results.map(j => j.description).join(" ").toLowerCase();
    
    const skillMasterList = [
      "React", "Node.js", "Python", "SQL", "Java", "JavaScript", "Excel", 
      "Tableau", "Power BI", "AWS", "Azure", "Docker", "Kubernetes", 
      "TypeScript", "HTML", "CSS", "Machine Learning", "C++", "Statistics", "Next.js"
    ];

    // FIX: Escape special characters before creating RegExp
    const detected = skillMasterList.filter(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      return regex.test(fullText);
    });

    console.log("Detected Skills from Market:", detected);
    return detected.length > 0 ? detected.slice(0, 5) : ["Analytical Skills", "Communication", "Problem Solving"];

  } catch (error) {
    console.error("Market Skill Fetch Error:", error.message);
    return ["SQL", "Python", "Excel", "Tableau"]; 
  }
};

// Analysis Routes
app.use('/api/analysis', analysisRoutes);
app.use(express.urlencoded({ extended: true }));
app.post('/api/jobs/search', searchJobs);
app.post('/api/analysis/generate-questions', analysisController.generateQuestions);
app.use('/api/jobs', jobRoutes);
app.use('/api/analysis', analysisRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

