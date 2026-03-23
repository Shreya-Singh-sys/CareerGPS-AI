const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  source: { type: String, enum: ['resume', 'form'] }, 
  skills: [{
    name: String,
    proficiency: Number,
    verified: {type: Boolean, default: false}
  }],
  experience: String,
  education: String,
  analysisResult: Object
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);