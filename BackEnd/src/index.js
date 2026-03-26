const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 FFmpeg setup
ffmpeg.setFfmpegPath(ffmpegPath);

// 🔥 OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 Multer setup
const upload = multer({ dest: "uploads/" });

// Routes import
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const jobControllerFile = require('./controllers/jobController.js'); 
const searchJobs = jobControllerFile.searchJobs;
const analysisController = require('./controllers/analysisController');
const jobRoutes = require('./routes/jobRoutes');
const User = require('./models/User');

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected Successfully! ✅"))
  .catch((err) => console.log("Database Connection Failed! ❌", err));

// 🔥 TEST ROUTE
app.get('/api/status', (req, res) => {
  res.json({ message: "Backend is running smoothly!", timestamp: new Date() });
});

// ==========================
// 🎥 VIDEO + AUDIO FEATURE
// ==========================
app.post("/api/video-upload", upload.single("video"), async (req, res) => {
  try {
    const videoPath = req.file.path;
    const audioPath = `${videoPath}.mp3`;

    // 1. Extract audio
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .noVideo()
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // 2. Transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "gpt-4o-transcribe",
    });

    const text = transcription.text;

    // 3. Extract structured data
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "Extract name, skills, education, experience, role from text. Return valid JSON only.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const extracted = JSON.parse(completion.choices[0].message.content);

    res.json({
      transcript: text,
      extracted,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Video processing failed" });
  }
});

// ==========================
// 🔐 AUTH
// ==========================
app.use('/api/auth', authRoutes);

// ==========================
// 👤 PROFILE ROUTE
// ==========================
app.get('/api/user/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const targetRole = user.targetRole || "Software Developer";
    const requiredSkills = await getMarketRequiredSkills(targetRole);

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
        lastMarketUpdate: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ==========================
// 🔥 MARKET SKILLS FUNCTION
// ==========================
const getMarketRequiredSkills = async (role) => {
  try {
    const appId = "3b59f8b2";
    const appKey = "4c5bdd1d6ac22fc4ea23b970aff8849e";

    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=15&what=${encodeURIComponent(role)}`
    );

    const results = response.data.results || [];
    const fullText = results.map(j => j.description).join(" ").toLowerCase();

    const skillMasterList = [
      "React","Node.js","Python","SQL","Java","JavaScript","Excel",
      "Tableau","Power BI","AWS","Docker","TypeScript","HTML","CSS"
    ];

    const detected = skillMasterList.filter(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(fullText);
    });

    return detected.length > 0 ? detected.slice(0, 5) : ["Problem Solving"];

  } catch {
    return ["SQL","Python","Excel"];
  }
};

// ==========================
// 🔥 NO RESUME FIX (BUG FIXED)
// ==========================
app.post('/api/no-resume', async (req, res) => {
  try {
    const { name, role, skills = [], experience, education, location } = req.body;

    console.log("Incoming Data:", req.body); // ✅ FIXED (pehle data undefined tha)

    const requiredSkills = await getMarketRequiredSkills(role);
    const userSkills = skills.map(s => s.toLowerCase());

    const missingSkills = requiredSkills.filter(
      skill => !userSkills.includes(skill.toLowerCase())
    );

    const readinessScore = Math.round(
      ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
    );

    res.json({
      name,
      role,
      experience,
      education,
      location,
      analysisResult: {
        missingSkills: missingSkills.length > 0 ? missingSkills : ["You match the market!"],
        readinessScore,
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ==========================
// OTHER ROUTES
// ==========================
app.use('/api/analysis', analysisRoutes);
app.post('/api/jobs/search', searchJobs);
app.post('/api/analysis/generate-questions', analysisController.generateQuestions);
app.use('/api/jobs', jobRoutes);

// ==========================
// START SERVER
// ==========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});