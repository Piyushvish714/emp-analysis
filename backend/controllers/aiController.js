const Employee = require("../models/Employee");
const fetch = require("node-fetch");

// Helper: Call OpenRouter AI API
const callOpenRouter = async (systemPrompt, userPrompt) => {
  const response = await fetch(`${process.env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
      "X-Title": "Employee Analytics System",
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "AI API request failed");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

// @route   POST /api/ai/recommend
// @desc    Generate AI recommendation for a single employee
// @access  Private
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: "employeeId is required." });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    const systemPrompt = `You are an expert HR consultant specializing in employee performance analysis. 
Analyze employee data and provide concise, actionable recommendations. 
Always structure your response as:
1. ASSESSMENT: Brief performance assessment (1-2 sentences)
2. RECOMMENDATION: Specific recommendation (promotion/training/improvement plan)
3. ACTION ITEMS: 2-3 specific action items
Keep the total response under 250 words.`;

    const userPrompt = `Analyze this employee and provide HR recommendations:
Name: ${employee.name}
Department: ${employee.department}
Performance Score: ${employee.performanceScore}/100
Years of Experience: ${employee.experience}
Skills: ${employee.skills.join(", ")}

Based on the performance score:
- 80-100: Consider for promotion
- 60-79: Good performer, needs skill enhancement
- 40-59: Requires training and improvement plan
- 0-39: Performance improvement plan needed immediately`;

    const recommendation = await callOpenRouter(systemPrompt, userPrompt);

    // Save recommendation to employee record
    employee.aiRecommendation = recommendation;
    employee.lastRecommendationDate = new Date();
    await employee.save();

    res.status(200).json({
      success: true,
      employee: employee.name,
      recommendation,
      generatedAt: employee.lastRecommendationDate,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/ai/rank-all
// @desc    Generate AI rankings and recommendations for all employees
// @access  Private
const rankAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: "No employees found." });
    }

    const employeeList = employees
      .map((emp, i) => `${i + 1}. ${emp.name} | ${emp.department} | Score: ${emp.performanceScore} | Exp: ${emp.experience}yrs | Skills: ${emp.skills.join(", ")}`)
      .join("\n");

    const systemPrompt = `You are a senior HR analytics expert. Analyze a list of employees and provide a team-wide assessment with individual highlights.`;

    const userPrompt = `Here are all employees ranked by performance score. Provide:
1. TOP PERFORMERS (list top 3 with brief reason why they stand out)
2. TEAM INSIGHTS (1-2 sentences about overall team health)
3. DEPARTMENT GAPS (identify any skill gaps or concerns)
4. KEY RECOMMENDATIONS (3 actionable steps for HR)

Employee List:
${employeeList}`;

    const rankingAnalysis = await callOpenRouter(systemPrompt, userPrompt);

    res.status(200).json({
      success: true,
      totalEmployees: employees.length,
      rankingAnalysis,
      rankedEmployees: employees.map((emp, i) => ({
        rank: i + 1,
        name: emp.name,
        department: emp.department,
        performanceScore: emp.performanceScore,
        experience: emp.experience,
        skills: emp.skills,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/ai/training-suggestions
// @desc    Generate training suggestions for an employee
// @access  Private
const getTrainingSuggestions = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    const systemPrompt = `You are a Learning & Development specialist. Suggest specific, practical training programs and resources for employees.`;

    const userPrompt = `Suggest a personalized training plan for this employee:
Name: ${employee.name}
Department: ${employee.department}
Current Skills: ${employee.skills.join(", ")}
Performance Score: ${employee.performanceScore}/100
Experience: ${employee.experience} years

Provide:
1. SKILL GAPS: What skills are missing for their role/department
2. RECOMMENDED COURSES: 3-4 specific courses or certifications (include platform like Coursera, Udemy, etc.)
3. LEARNING TIMELINE: Suggested 3-month learning plan
4. EXPECTED OUTCOME: How this training will improve their performance`;

    const trainingSuggestions = await callOpenRouter(systemPrompt, userPrompt);

    res.status(200).json({
      success: true,
      employee: employee.name,
      trainingSuggestions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation, rankAllEmployees, getTrainingSuggestions };
