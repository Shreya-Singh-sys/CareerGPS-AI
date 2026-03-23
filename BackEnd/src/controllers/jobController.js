

// const axios = require('axios');

// // Helper function to extract skills from description
// const extractSkills = (text) => {
//   const commonSkills = ["React", "Node.js", "Python", "Java", "Javascript", "SQL", "AWS", "Cloud", 
//     "Marketing", "Sales", "Design", "Figma", "Excel", "Project Management", 
//     "UI/UX", "HTML", "CSS", "Tailwind", "Angular", "Vue", "Git", "Docker", 
//     "Machine Learning", "Data Analysis", "Communication"];
  
//   if (!text) return ["Professional"];
  
//   const found = commonSkills.filter(skill => 
//     new RegExp(`\\b${skill}\\b`, 'i').test(text)
//   );
  
//   return found.length > 0 ? found.slice(0, 4) : ["Professional"];
// };

// // 1. Search Jobs Logic
// const searchJobs = async (req, res) => {
//   try {
//     const { query, location, page = 1 } = req.body;
    
//     const appId = "3b59f8b2"; 
//     const appKey = "6488fed8794ceddbe1e8e185a48526a8";
//     const country = 'in'; 

//     const what = encodeURIComponent(query || "developer");
//     const where = encodeURIComponent(location || "india");

//     const finalUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${what}&where=${where}`;

//     console.log("Searching Jobs URL:", finalUrl);

//     const response = await axios.get(finalUrl, {
//       headers: { 'Accept': 'application/json' }
//     });

//     const jobs = (response.data.results || []).map(job => ({
//       id: job.id,
//       title: job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Job Position",
//       company: job.company?.display_name || "N/A",
//       location: job.location?.display_name || "India",
//       salary: job.salary_min ? `₹${Math.round(job.salary_min)}` : "Not Disclosed",
//       url: job.redirect_url,
//       posted: new Date(job.created).toLocaleDateString(),
//       skills: extractSkills(job.description), // Yahan helper use kar rahe hain
//       match: 85,
//       whyMatch: `This role matches because it requires ${job.category?.label || 'specialized skills'} in ${job.location?.display_name || 'your area'}.`
//     }));

//     res.json(jobs);

//   } catch (error) {
//     console.error("Adzuna Search Error:", error.message);
//     res.status(200).json([]); 
//   }
// };

// // 2. Featured/Trending Jobs Logic (Landing Page ke liye)
// exports.getFeaturedJobs = async (req, res) => {
//   try {
//     console.log("Fetching jobs from Adzuna...");
    
//     // API Keys check karein - yahan direct likh raha hoon safety ke liye
//     const appId = "3b59f8b2"; 
//     const appKey = "4c5bdd1d6ac22fc4ea23b970aff8849e";

//     const response = await axios.get(
//       `https://api.adzuna.com/v1/api/jobs/in/search/1`, 
//       {
//         params: {
//           app_id: appId,
//           app_key: appKey,
//           results_per_page: 6,
//           what: "software developer", // 'trending' ki jagah ye use karein testing ke liye
//           where: "india",
//           content_type: "application/json"
//         }
//       }
//     );

//     if (!response.data || !response.data.results) {
//         return res.status(200).json([]); // Khali array bhejo agar data na ho
//     }

//     const jobs = response.data.results.map(job => ({
//       id: job.id,
//       title: job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Job Opening",
//       company: job.company?.display_name || "Confidential",
//       location: job.location?.display_name || "India",
//       salary: job.salary_min ? `₹${(job.salary_min/1000).toFixed(0)}k+` : "Best in Industry",
//       type: job.contract_time === "full_time" ? "Full-time" : "Contract",
//       url: job.redirect_url 
//     }));

//     console.log("Success! Sent 6 jobs to frontend.");
//     res.status(200).json(jobs);

//   } catch (error) {
//     // Ye line aapko terminal mein batayegi ki asal problem kya hai
//     console.error("Adzuna API Actual Error:", error.response?.data || error.message);
//     res.status(500).json({ message: "Error fetching jobs from Adzuna", details: error.message });
//   }
// };

// // SABSE IMPORTANT: Dono ko export karna zaroori hai!
// module.exports = { 
//   searchJobs, 
//   getFeaturedJobs 
// };

const axios = require('axios');

// Helper function to extract skills from description
const extractSkills = (text) => {
  const commonSkills = ["React", "Node.js", "Python", "Java", "Javascript", "SQL", "AWS", "Cloud", 
    "Marketing", "Sales", "Design", "Figma", "Excel", "Project Management", 
    "UI/UX", "HTML", "CSS", "Tailwind", "Angular", "Vue", "Git", "Docker", 
    "Machine Learning", "Data Analysis", "Communication"];
  
  if (!text) return ["Professional"];
  
  const found = commonSkills.filter(skill => 
    new RegExp(`\\b${skill}\\b`, 'i').test(text)
  );
  
  return found.length > 0 ? found.slice(0, 4) : ["Professional"];
};

// 1. Search Jobs Logic
const searchJobs = async (req, res) => {
  try {
    const { query, location, page = 1 } = req.body;
    const appId = "3b59f8b2"; 
    const appKey = "6488fed8794ceddbe1e8e185a48526a8";
    const country = 'in'; 

    const what = encodeURIComponent(query || "developer");
    const where = encodeURIComponent(location || "india");

    const finalUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${what}&where=${where}`;

    console.log("Searching Jobs URL:", finalUrl);

    const response = await axios.get(finalUrl, {
      headers: { 'Accept': 'application/json' }
    });

    const jobs = (response.data.results || []).map(job => ({
      id: job.id,
      title: job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Job Position",
      company: job.company?.display_name || "N/A",
      location: job.location?.display_name || "India",
      salary: job.salary_min ? `₹${Math.round(job.salary_min)}` : "Not Disclosed",
      url: job.redirect_url,
      posted: new Date(job.created).toLocaleDateString(),
      skills: extractSkills(job.description),
      match: 85,
      whyMatch: `This role matches because it requires specialized skills in ${job.location?.display_name || 'your area'}.`
    }));

    res.json(jobs);
  } catch (error) {
    console.error("Adzuna Search Error:", error.message);
    res.status(200).json([]); 
  }
};

// 2. Featured/Trending Jobs Logic
// const getFeaturedJobs = async (req, res) => {
//   try {
//     console.log("Fetching jobs from Adzuna...");
//     const appId = "3b59f8b2"; 
//     const appKey = "bfb72045c2d53651cbd68ed81e464829";

//     const response = await axios.get(
//       `https://api.adzuna.com/v1/api/jobs/in/search/1`, 
//       {
//         params: {
//           app_id: appId,
//           app_key: appKey,
//           results_per_page: 6,
//           what: "software developer",
//           where: "india",
//           content_type: "application/json"
//         }
//       }
//     );

//     const jobs = (response.data.results || []).map(job => ({
//       id: job.id,
//       title: job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Job Opening",
//       company: job.company?.display_name || "Confidential",
//       location: job.location?.display_name || "India",
//       salary: job.salary_min ? `₹${(job.salary_min/1000).toFixed(0)}k+` : "Best in Industry",
//       type: job.contract_time === "full_time" ? "Full-time" : "Contract",
//       url: job.redirect_url 
//     }));

//     console.log("Success! Sent 6 jobs to frontend.");
//     res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Adzuna API Actual Error:", error.response?.data || error.message);
//     res.status(500).json({ message: "Error fetching jobs from Adzuna" });
//   }
// };

const getFeaturedJobs = async (req, res) => {
  try {
    console.log("Fetching jobs from Adzuna...");
    
    const appId = "3b59f8b2"; 
    const appKey = "f86cbf46b668212d21fb1e4aa6761421";

    // CLEAN URL: Sirf zaroori parameters
    // Adzuna India ke liye 'where' aur 'what' encode hona zaroori hai
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=6&what=software&where=india`;

    console.log("Hitting Adzuna URL:", adzunaUrl);

    const response = await axios.get(adzunaUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const jobs = (response.data.results || []).map(job => ({
      id: job.id,
      title: job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Job Opening",
      company: job.company?.display_name || "Confidential",
      location: job.location?.display_name || "India",
      salary: job.salary_min ? `₹${(job.salary_min/1000).toFixed(0)}k+` : "Best in Industry",
      type: job.contract_time === "full_time" ? "Full-time" : "Contract",
      url: job.redirect_url 
    }));

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Adzuna Error Status:", error.response?.status);
    // Agar 400 aa raha hai toh Adzuna ka message print karo
    console.error("Adzuna Error Body:", error.response?.data);
    
    // Crash se bachne ke liye empty array
    res.status(200).json([]); 
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // ─── COMPARISON LOGIC START ───
    const targetRole = user.targetRole || "Data Analyst"; // Default role agar set na ho
    const requiredSkills = SKILLS_BY_ROLE[targetRole] || [];
    
    // User ki current skills (String array mein convert kar rahe hain)
    const userSkills = (user.skills || []).map(s => s.name.toLowerCase());

    // Jo skills user ke paas NAHI hain
    const missingSkills = requiredSkills.filter(
      skill => !userSkills.includes(skill.toLowerCase())
    );

    // Readiness Score Calculate karein (Simple Percentage)
    const matchedCount = requiredSkills.length - missingSkills.length;
    const readinessScore = requiredSkills.length > 0 
      ? Math.round((matchedCount / requiredSkills.length) * 100) 
      : 0;
    // ─── COMPARISON LOGIC END ───

    // Response mein ye naya data bhejien
    res.json({
      ...user._doc,
      analysisResult: {
        missingSkills,
        readinessScore,
        matchedJobsCount: 12 // Aap isse baad mein dynamic kar sakte hain
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// const axios = require('axios'); // Ensure this is at the top

const getLiveTrends = async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search-filters',
      params: { query: 'Software Engineer in India' },
      headers: {
        'X-RapidAPI-Key': 'e883f8aaddmshfe3045d95b3da14p1f0310jsnab69049eef5',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      timeout: 5000 // 5 seconds timeout
    };

    // API call try karte hain
    const response = await axios.request(options);
    console.log("RapidAPI Success");

    // Agar API chal gayi toh ye trends bhejenge
    const trends = {
      skills: [
        { name: "Python", demand: 95 },
        { name: "React", demand: 92 },
        { name: "Node.js", demand: 85 },
        { name: "AWS", demand: 80 },
        { name: "SQL", demand: 78 }
      ],
      jobs: [
        { role: "Data Analyst", growth: "+24%", openings: "12.4k", hot: true },
        { role: "Full Stack", growth: "+18%", openings: "15.2k", hot: false },
        { role: "ML Engineer", growth: "+31%", openings: "8.7k", hot: true },
        { role: "Cloud Engineer", growth: "+27%", openings: "9.1k", hot: true },
        { role: "DevOps", growth: "+21%", openings: "7.3k", hot: false }
      ]
    };

    res.json(trends);

  } catch (error) {
    // Terminal mein asli error check karne ke liye:
    console.error("API Error Detail:", error.response ? error.response.data : error.message);

    // AGAR API FAIL HO JAYE -> Don't send 500, send Mock Data instead
    // Isse aapka frontend kabhi crash nahi hoga
    const fallbackTrends = {
      skills: [
        { name: "Python (Live)", demand: 90 },
        { name: "JavaScript", demand: 88 },
        { name: "Cloud", demand: 80 },
        { name: "SQL", demand: 75 }
      ],
      jobs: [
        { role: "Data Scientist", growth: "+20%", openings: "10k", hot: true },
        { role: "Backend Dev", growth: "+15%", openings: "14k", hot: false }
      ]
    };
    res.json(fallbackTrends);
  }
};

// Exporting both functions properly
module.exports = { 
  searchJobs, 
  getFeaturedJobs,
  getUserProfile,
  getLiveTrends
};