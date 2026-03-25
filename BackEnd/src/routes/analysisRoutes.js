const express = require('express');
const router = express.Router();
const multer = require('multer');
const analysisController = require('../controllers/analysisController');

const upload = multer({ storage: multer.memoryStorage() });
console.log("Controller Check:", analysisController.analyzeResume);

router.post('/upload-resume', upload.single('resume'), analysisController.analyzeResume);
// router.post('/submit-form', analyzeForm);
router.post('/optimize', analysisController.optimizeResume);
router.post('/simulate', analysisController.simulateCareer);
router.post('/generate-questions', analysisController.generateInterviewQuestions);
router.post('/analyze-answer', analysisController.analyzeInterviewAnswer);
router.post('/skill-gap', analysisController.getSkillGapAnalysis);
router.post("/manual-profile", analysisController.analyzeManualProfile);
module.exports = router;