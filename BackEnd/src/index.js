const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
// Middleware
app.use(cors()); // Allows your React app to make requests
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});