const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/search', jobController.searchJobs);
router.get('/featured', jobController.getFeaturedJobs);

module.exports = router;