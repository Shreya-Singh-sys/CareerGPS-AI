

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
// Exporting both functions properly
module.exports = { 
  searchJobs, 
  getFeaturedJobs 
};