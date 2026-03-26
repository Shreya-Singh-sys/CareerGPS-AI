// const Groq = require("groq-sdk");
// const PDFParser = require("pdf2json"); // Nayi library
// const User = require('../models/User');

// const groq = new Groq({ apiKey: "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" });
// exports.analyzeResume = async (req, res) => {
//     try {
//         const { email } = req.body;
//         if (!email || !req.file) {
//             return res.status(400).json({ message: "Email or File missing" });
//         }

//         console.log("AI Analysis Request for:", email);

//         // 1. PDF Text Extraction (Using pdf2json)
//         const pdfParser = new PDFParser(null, 1); // 1 means text-only mode

//         const resumeText = await new Promise((resolve, reject) => {
//             pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
//             pdfParser.on("pdfParser_dataReady", (pdfData) => {
//                 resolve(pdfParser.getRawTextContent());
//             });
//             pdfParser.parseBuffer(req.file.buffer);
//         });

//         console.log("PDF Text Extracted (Length):", resumeText.length);

//         // 2. Gemini AI Prompt (Corrected to gemini-1.5-flash)
        
        
//         const prompt = `
//             Analyze this resume text and provide a professional career analysis in STRICT JSON format.
//             Do not include any markdown like \`\`\`json. Return ONLY the JSON object.
//             IMPORTANT: In the "skills" array, identify and list ALL relevant technical skills found, 
//             but rank them by importance/relevance to the person's profile.

//             Structure:
//             {
//                 "readinessScore": number,
//                 "atsScore": number,
//                 "skills": [{"name": string, "level": "Advanced" | "Intermediate" | "Basic", "verified": boolean}],
//                 "insights": [string],
//                 "improvements": [{"tip": string, "impact": "High" | "Medium", "icon": "emoji_icon"}]
//             }

//             Resume Text:
//             ${resumeText}
//         `;
//         const chatCompletion = await groq.chat.completions.create({
//             messages: [{ role: "user", content: prompt }],
//             model: "llama-3.3-70b-versatile", // Ya "llama3-8b-8192" fast speed ke liye
//             response_format: { type: "json_object" } // Groq automatically JSON enforce karta hai
//         });

//         // 3. AI Processing
//         const result = await model.generateContent(prompt);
//         const responseText = result.response.text();
        
//         // JSON Cleaning
//         const cleanJsonString = responseText.replace(/```json|```/g, "").trim();
//         const analysisResult = JSON.parse(cleanJsonString);

//         // 4. Update Database
//         const user = await User.findOneAndUpdate(
//             { email: email.trim() },
//             { analysisResult, source: 'resume', lastAnalyzed: new Date() },
//             { new: true }
//         );

//         if (!user) return res.status(404).json({ message: "User not found" });

//         return res.status(200).json({ 
//             message: "AI Analysis Complete", 
//             analysis: analysisResult,
//             resumeText: resumeText // Naya field for raw resume text 
//         });

//     } catch (err) {
//         console.error("DETAILED ERROR:", err);
//         res.status(500).json({ message: "Error: " + err.message });
//     }
// };

// // analysisController.js mein ye naya function add karein
// // 
// exports.optimizeResume = async (req, res) => {
//     try {
//         const { resumeText, jobDescription } = req.body;
//         console.log("Optimizing for text length:", resumeText?.length);

//         const prompt = `
//             You are a professional resume writer. Rewrite the following resume text to be more professional and ATS-friendly.
//             Original Text: ${resumeText}
//             Job Description: ${jobDescription || "Standard Professional Role"}

//             Return ONLY a valid JSON object:
//             {
//                 "optimizedText": "The entire rewritten resume content",
//                 "changesMade": ["Point 1", "Point 2"]
//             }
//         `;

//         const chatCompletion = await groq.chat.completions.create({
//             messages: [{ role: "user", content: prompt }],
//             model: "llama-3.3-70b-versatile",
//             response_format: { type: "json_object" }
//         });

//         const result = await model.generateContent(prompt);
//         const responseText = result.response.text();
        
//         // JSON clean karne ka sabse sahi tarika
//         const cleanJson = responseText.replace(/```json|```/g, "").trim();
//         const optimizedData = JSON.parse(cleanJson);

//         res.status(200).json(optimizedData);
//     } catch (err) {
//         console.error("Optimization Error:", err);
//         res.status(500).json({ message: "AI failed to optimize: " + err.message });
//     }
// };

// // analysisController.js mein ye naya function add karein
// exports.simulateCareer = async (req, res) => {
//     try {
//         const { goal, currentSkills, targetSkills, months } = req.body;
        
//         // Debugging ke liye
//         console.log("Simulating for:", goal, "Months:", months);

        
//         const prompt = `
//             You are a professional career coach. Generate a step-by-step career roadmap.
//             Target Goal: ${goal}
//             Current Skills: ${currentSkills}
//             Additional Skills to learn: ${targetSkills}
//             Duration: ${months} months.

//             Return ONLY a valid JSON array of objects with this structure:
//             [
//               {
//                 "month": "Month 1",
//                 "title": "Topic Name",
//                 "description": "Short explanation",
//                 "type": "learn", 
//                 "skills": ["skill1", "skill2"]
//               }
//             ]
//             Types allowed: "learn", "build", "apply", "milestone".
//             Important: Do not include any text before or after the JSON array.
//         `;
//         const chatCompletion = await groq.chat.completions.create({
//             messages: [{ role: "user", content: prompt }],
//             model: "llama-3.3-70b-versatile",
//             response_format: { type: "json_object" }
//         });

//         const result = await model.generateContent(prompt);
//         const responseText = result.response.text();
        
//         // JSON ko clean karne ka robust tareeka
//         const cleanJsonString = responseText.replace(/```json|```/g, "").trim();
        
//         let timelineData;
//         try {
//             timelineData = JSON.parse(cleanJsonString);
//         } catch (parseErr) {
//             console.error("Gemini Raw Response:", responseText);
//             return res.status(500).json({ message: "AI response was not valid JSON" });
//         }

//         res.status(200).json(timelineData);

//     } catch (err) {
//         console.error("SIMULATION ERROR:", err);
//         res.status(500).json({ message: "Server Error: " + err.message });
//     }
// };

const Groq = require("groq-sdk");
const PDFParser = require("pdf2json");
const User = require('../models/User');

// Groq Setup (Apni API Key yahan dalein)
const groq = new Groq({ apiKey: "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" });

exports.analyzeResume = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !req.file) {
            return res.status(400).json({ message: "Email or File missing" });
        }

        console.log("AI Analysis Request for:", email);

        // 1. PDF Text Extraction
        const pdfParser = new PDFParser(null, 1);
        const resumeText = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", () => {
                resolve(pdfParser.getRawTextContent());
            });
            pdfParser.parseBuffer(req.file.buffer);
        });

        console.log("PDF Text Extracted (Length):", resumeText.length);

        // 2. Groq AI Prompt
        const prompt = `
            Analyze this resume text and provide a professional career analysis in STRICT JSON format.
            Do not include any introductory text or markdown code blocks. Return ONLY the JSON object.
            
            Structure:
            {
                "readinessScore": number,
                "atsScore": number,
                "skills": [{"name": string, "level": "Advanced" | "Intermediate" | "Basic", "verified": true}],
                "insights": [string],
                "improvements": [{"tip": string, "impact": "High" | "Medium", "icon": "emoji_icon"}]
            }

            Resume Text:
            ${resumeText}
        `;

        // 3. Groq API Call
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile", // Ya "llama3-8b-8192" fast speed ke liye
            response_format: { type: "json_object" } // Groq automatically JSON enforce karta hai
        });

        const analysisResult = JSON.parse(chatCompletion.choices[0].message.content);
        const extractedSkills = (analysisResult.skills || []).map(s => ({
    name: s.name,
    proficiency: s.level === "Advanced" ? 90 : s.level === "Intermediate" ? 70 : 50,
    verified: true
}));

// 4. Update Database
// const user = await User.findOneAndUpdate(
//     { email: email.trim() },
//     { 
//         // analysisResult,             // AI ka poora result (scores etc)
//         // skills: extractedSkills,    // YE ZAROORI HAI: Dashboard isi ko read karta hai
//         // source: 'resume', 
//         // lastAnalyzed: new Date() 
//         analysisResult: {
//             ...analysisResult,
//             atsScore: analysisResult.atsScore || analysisResult.resumeScore || 0 // Backup keys
//     },
//         skills: extractedSkills, // Isse dashboard pe graph banega
//         source: 'resume', 
//         lastAnalyzed: new Date()},
//     { new: true }
// );

// if (!user) return res.status(404).json({ message: "User not found" });

// console.log(`Success: Updated ${extractedSkills.length} skills for ${email}`);

// return res.status(200).json({ 
//     success:true,
//     message: "AI Analysis Complete", 
//     analysisResult: analysisResult,
//     skillaUpdated: extractedSkills.length,
// });

    // 4. Update Database
// const user = await User.findOneAndUpdate(
//     { email: email.trim() },
//     { 
//         analysisResult: {
//             ...analysisResult,
//             atsScore: analysisResult.atsScore || analysisResult.resumeScore || 75 
//         },
//         skills: extractedSkills, // <--- ISSE DASHBOARD CHALEGA
//         source: 'resume', 
//         lastAnalyzed: new Date() 
//     },
//     { new: true }
// );

const user = await User.findOneAndUpdate(
    { email: email.trim() },
    { 
        $set: { // $set use karne se purana data disturb nahi hota
            "analysisResult.readinessScore": analysisResult.readinessScore || 0,
            "analysisResult.atsScore": analysisResult.atsScore || analysisResult.resumeScore || 82, // Default value agar AI fail ho jaye
            "analysisResult.atsSuggestions": analysisResult.atsSuggestions || analysisResult.improvements?.map(i => i.tip) || [],
            skills: extractedSkills,
            source: 'resume', 
            lastAnalyzed: new Date() 
        }
    },
    { new: true, upsert: true } // Agar user nahi hai toh create kar dega
);

console.log("DB Update Success - ATS Score Saved:", user.analysisResult.atsScore);

if (!user) return res.status(404).json({ message: "User not found" });

// Console mein check karne ke liye
console.log("Database Updated for:", email, "Skills Count:", extractedSkills.length);

return res.status(200).json({  
    message: "AI Analysis Complete", 
    analysisResult: analysisResult, // Dashboard isi key ko dhund raha hai
    resumeText: resumeText // Naya field for raw resume text
});

        // 4. Update Database
        // const user = await User.findOneAndUpdate(
        //     { email: email.trim() },
        //     { analysisResult, source: 'resume', lastAnalyzed: new Date() },
        //     { new: true }
        // );

        // if (!user) return res.status(404).json({ message: "User not found" });

        // return res.status(200).json({ 
        //     message: "AI Analysis Complete", 
        //     analysis: analysisResult,
        //     resumeText: resumeText 
        // });

    } catch (err) {
        console.error("GROQ ANALYSIS ERROR:", err);
        res.status(500).json({ message: "Error: " + err.message });
    }
};

exports.optimizeResume = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        const prompt = `
            You are a professional resume writer. Rewrite the following resume text to be more professional and ATS-friendly.
            Original Text: ${resumeText}
            Job Description: ${jobDescription || "Standard Professional Role"}

            Return ONLY a valid JSON object:
            {
                "optimizedText": "The entire rewritten resume content",
                "changesMade": ["Point 1", "Point 2"]
            }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const optimizedData = JSON.parse(chatCompletion.choices[0].message.content);
        res.status(200).json(optimizedData);

    } catch (err) {
        console.error("GROQ OPTIMIZE ERROR:", err);
        res.status(500).json({ message: "AI failed to optimize: " + err.message });
    }
};

exports.simulateCareer = async (req, res) => {
    try {
        const { goal, currentSkills, targetSkills, months } = req.body;

        const prompt = `
            You are a career coach. Generate a JSON array for a career roadmap.
            Target Goal: ${goal}, Current Skills: ${currentSkills}, Target: ${targetSkills}, Duration: ${months} months.
            
            Format: [{ "month": "Month 1", "title": "...", "description": "...", "type": "learn", "skills": [] }]
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        // Kuch models array ko ek object key ke andar wrap kar dete hain
        const rawData = JSON.parse(chatCompletion.choices[0].message.content);
        const timelineData = Array.isArray(rawData) ? rawData : rawData.roadmap || rawData.timeline || Object.values(rawData)[0];

        res.status(200).json(timelineData);

    } catch (err) {
        console.error("GROQ SIMULATION ERROR:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};

exports.generateInterviewQuestions = async (req, res) => {

    try {

        const { role } = req.body;

        const prompt = `

            Generate exactly 10 professional interview questions for the role: ${role}.

            Return ONLY a JSON object with a key named "questions".

           

            Format:

            {

              "questions": [

                {

                  "question": "string",

                  "sampleFeedback": { "correctness": 80, "confidence": 70, "clarity": 85, "improvements": "string" }

                }

              ]

            }

        `;

        const chatCompletion = await groq.chat.completions.create({

            messages: [{ role: "user", content: prompt }],

            model: "llama-3.3-70b-versatile",

            response_format: { type: "json_object" }

        });

        const rawData = JSON.parse(chatCompletion.choices[0].message.content);

       

        // Safety check: Agar questions key nahi hai toh direct array check karo

        const questions = rawData.questions || (Array.isArray(rawData) ? rawData : []);



        res.status(200).json(questions);

    } catch (err) {

        console.error("MOCK ERROR:", err);

        res.status(500).json({ message: "Failed to generate: " + err.message });

    }
};


exports.analyzeInterviewAnswer = async (req, res) => {
    try {
        const { question, answer, role } = req.body;

        const prompt = `
            Act as an expert interviewer for the role of ${role}.
            Question: ${question}
            User's Answer: ${answer}

            Analyze the answer and provide scores (0-100) and feedback in STRICT JSON format.
            {
                "correctness": number,
                "confidence": number,
                "clarity": number,
                "improvements": "Detailed 1-2 line feedback on what was missing or how to improve."
            }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const feedback = JSON.parse(chatCompletion.choices[0].message.content);
        res.status(200).json(feedback);
    } catch (err) {
        console.error("ANALYSIS ERROR:", err);
        res.status(500).json({ message: "Failed to analyze answer" });
    }
};

exports.getSkillGapAnalysis = async (req, res) => {
    try {
        const { targetRole, userSkills } = req.body;

        const prompt = `
            Compare the user's current skills with the requirements for the role of ${targetRole}.
            User's Current Skills: ${userSkills}
            "Return exactly 4 resources. For each, specify 'type' as either 'Course', 'Video', or 'Book'. The 'platform' must be 'Udemy' for courses, 'YouTube' for videos, and 'Amazon' for books."

            Return ONLY a JSON object with:
            1. "requiredSkills": Array of objects { name, level (target %), userLevel (current %), has (boolean), priority ("critical"|"moderate"|"optional") }
            2. "roadmapSteps": Array of objects { title, description, duration, status ("completed"|"current"|"locked") }
            3. "resources": [
            {"title":["Name of course","book","video"],
            "Platform": The most relevant platform (e.g., 'Udemy', 'Amazon', 'YouTube', 'Medium'),
            "Type": ["Course","Book","Video","Article"],
            "query': A specific search string for that resource.
Example: If it's a book, platform should be 'Amazon' and type 'Book'. If it's a course, platform 'Coursera' and type 'Course'."}]
        `;
        //3. "resources": Array of objects { title, platform, type }
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        res.status(200).json(JSON.parse(chatCompletion.choices[0].message.content));
    } catch (err) {
        res.status(500).json({ message: "Gap analysis failed" });
    }
};


// exports.generateQuestions = async (req, res) => {
//   const { role } = req.body;
  
//   // Example Static Response (Baad mein Gemini AI yahan add kar sakte hain)
//   const questions = [
//     { 
//       question: `What are the most important skills for a ${role}?`,
//       sampleFeedback: { correctness: 80, confidence: 70, clarity: 90, improvements: "Be specific." }
//     },
//     { 
//       question: `Describe a time you failed as a ${role} and how you handled it.`,
//       sampleFeedback: { correctness: 75, confidence: 80, clarity: 85, improvements: "Focus on the learning." }
//     }
//   ];

//   res.json(questions);
// };
exports.generateQuestions = async (req, res) => {
  try {
    const { role, difficulty = "Mid-Level", language = "English" } = req.body;

    // Check if API Key is loaded
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing Gemini API Key in .env");
      return res.status(500).json({ error: "API Key not configured" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate exactly 10 interview questions for a ${role} position. 
    Level: ${difficulty}. Language: ${language}.
    For each question, provide an 'idealAnswer' (max 3 sentences).
    Return ONLY a valid JSON array: [{"question": "...", "idealAnswer": "..."}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean formatting
    text = text.replace(/```json|```/g, "").trim();

    const questionsArray = JSON.parse(text);
    console.log(`Successfully generated ${questionsArray.length} questions`);
    
    res.status(200).json(questionsArray);
  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    res.status(500).json({ error: "AI failed to generate: " + error.message });
  }
};
exports.analyzeManualProfile = async (req, res) => {
  try {
    const { name, jobRole, skills, experience, education, location } = req.body;

    const prompt = `
      Analyze this user profile for career insights:
      Name: ${name}
      Target Role: ${jobRole}
      Skills: ${skills.join(", ")}
      Experience: ${experience}
      Education: ${education}
      Location: ${location}

      Return a STRICT JSON response with these keys:
      {
        "targetRole": "The formal job title",
        "jobMatches": "A realistic number of jobs available in ${location} (e.g., '25+')",
        "missingSkillsCount": "Number of key skills they need to learn (e.g., 4)",
        "expectedSalary": "A realistic salary range in LPA for ${location} (e.g., '₹6-10 LPA')",
        "marketInsights": ["Point 1", "Point 2"],
        "summary": "One line professional summary"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const insights = JSON.parse(chatCompletion.choices[0].message.content);
    res.json(insights);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ message: "Failed to analyze profile" });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate real questions
exports.generateQuestions = async (req, res) => {
  try {
    const { role, difficulty, language } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 10 interview questions for a ${role} position. 
    Level: ${difficulty}. Language: ${language}.
    For each question, provide an 'idealAnswer' (max 3 sentences).
    Return ONLY a JSON array: [{"question": "...", "idealAnswer": "..."}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, ""); // Clean formatting
    res.json(JSON.parse(text));
  } catch (error) {
    res.status(500).json({ error: "AI Generation failed" });
  }
};

// Function to analyze user answer
exports.analyzeAnswer = async (req, res) => {
  try {
    const { question, answer, role } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Role: ${role}. Question: ${question}. User Answer: ${answer}.
    Evaluate this answer. Return ONLY JSON: 
    {"correctness": 0-100, "confidence": 0-100, "clarity": 0-100, "improvements": "short feedback"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "");
    res.json(JSON.parse(text));
  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
};
