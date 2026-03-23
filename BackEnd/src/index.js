const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
// const {searchJobs} = require('./controllers/jobController');
const jobControllerFile = require('./controllers/jobController.js'); 
const searchJobs = jobControllerFile.searchJobs;
const analysisController = require('./controllers/analysisController');
const jobRoutes = require('./routes/jobRoutes');

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // React app ka URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
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

// Analysis Routes
app.use('/api/analysis', analysisRoutes);
app.use(express.urlencoded({ extended: true }));
app.post('/api/jobs/search', searchJobs);
app.post('/api/analysis/generate-questions', analysisController.generateQuestions);
app.use('/api/jobs', jobRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

