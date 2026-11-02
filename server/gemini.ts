import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

if (!apiKey) {
  console.warn("Server WARNING: Neither GEMINI_API_KEY nor API_KEY is set in environment.");
}

export const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const MODEL_NAME = "gemini-3.8-flash";

// In-memory sessions for Coach chat
const coachSessions = new Map<string, any>();

// 1. Resume Schema
const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    hardSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Technical or hard skills mentioned, like 'Python', 'React', 'SQL'.",
    },
    softSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Inferred soft skills based on experience, like 'Leadership', 'Teamwork'.",
    },
    skillProficiencies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          level: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
        },
        required: ["skill", "level"],
      },
      description: "Estimated proficiency for each hard skill.",
    },
    recommendedSearchQuery: {
      type: Type.STRING,
      description: "A concise, 5-8 word search query for finding relevant internships on job boards. Example: 'Full Stack Developer Internship React Node.js Mumbai'",
    },
  },
  required: ["hardSkills", "softSkills", "skillProficiencies", "recommendedSearchQuery"],
};

export async function serverAnalyzeResume(resumeText: string) {
  const prompt = `You are an expert HR tech analyst. Analyze the following resume text and extract key information.
Resume:
---
${resumeText}
---
Based on the text, provide:
1. A list of technical/hard skills.
2. A list of inferred soft skills (e.g., 'Leadership', 'Communication', 'Teamwork').
3. An estimated proficiency level ('Beginner', 'Intermediate', 'Advanced') for each technical skill.
4. A 'recommendedSearchQuery': Create a powerful 5-8 word search string to find internships matching this candidate. Include 2-3 top skills and a role title.

Return the result as a JSON object matching the provided schema.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema,
    },
  });

  const jsonText = (response.text ?? "").trim();
  return JSON.parse(jsonText);
}

export async function serverAnalyzeResumeWithFile(base64Data: string, mimeType: string) {
  const prompt = `You are an expert HR tech analyst. Analyze the uploaded resume document and extract key information.

Based on the document content, provide:
1. A list of technical/hard skills.
2. A list of inferred soft skills (e.g., 'Leadership', 'Communication', 'Teamwork').
3. An estimated proficiency level ('Beginner', 'Intermediate', 'Advanced') for each technical skill.
4. A 'recommendedSearchQuery': Create a powerful 5-8 word search string to find internships matching this candidate. Include 2-3 top skills and a role title.

Return the result as a JSON object matching the provided schema.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema,
    },
  });

  const jsonText = (response.text ?? "").trim();
  return JSON.parse(jsonText);
}

export async function serverGenerateLearningPlan(skill: string) {
  const prompt = `Create a concise, 2-step learning plan for a beginner to learn "${skill}". Suggest one free, high-quality online resource for each step. Format the output as a simple list.`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });
  return response.text ?? "";
}

export function serverStartAICoachSession(sessionId: string, studentName: string, internshipTitle: string, studentSkills: string[]) {
  const systemInstruction = `You are an expert career coach for students. Your name is 'Coach Gemini'. You are speaking with a student named ${studentName}.
They are interested in the '${internshipTitle}' internship.
Their current skills are: ${studentSkills.join(", ")}.
Be friendly, encouraging, and provide specific, actionable advice. Keep your responses concise and easy to understand.`;

  const chat = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction,
    },
  });

  coachSessions.set(sessionId, chat);
  return { success: true };
}

export async function serverGetAICoachResponse(sessionId: string, message: string) {
  let chat = coachSessions.get(sessionId);
  if (!chat) {
    // Create a fallback session if none existed
    chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: "You are an expert career coach named 'Coach Gemini'. Provide friendly, actionable internship advice.",
      },
    });
    coachSessions.set(sessionId, chat);
  }

  const response = await chat.sendMessage({ message });
  return response.text ?? "";
}

export async function serverGetGeneralAIResponse(message: string, context?: { skills?: string[]; name?: string }) {
  const contextStr = context
    ? `User Name: ${context.name || "Student"}\nSkills: ${context.skills?.join(", ") || "Not provided"}`
    : "";

  const prompt = `You are an expert career and internship advisor for the PM Internship Scheme and global opportunities.
${contextStr}

Answer the following question about internships, resume building, career growth, or interview preparation.
Question: ${message}

Keep your answer helpful, encouraging, and under 150 words. Format with Markdown if needed.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  return response.text ?? "";
}

const careerPathSchema = {
  type: Type.OBJECT,
  properties: {
    paths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "steps"],
      },
      description: "An array of 2-3 potential career paths.",
    },
  },
  required: ["paths"],
};

export async function serverGenerateCareerPaths(internshipTitle: string, studentInterests: string[]) {
  const prompt = `A student with interests in [${studentInterests.join(", ")}] is considering an internship titled "${internshipTitle}".
Based on this, generate 2-3 distinct, long-term career paths this internship could lead to, particularly within the public sector or related fields.
For each path, provide a clear title and a list of 3-4 sequential steps or roles, starting with the current internship.
Example step: "1. Succeed in the ${internshipTitle} role to build foundational skills."
Return the result as a JSON object matching the provided schema.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: careerPathSchema,
    },
  });

  const jsonText = (response.text ?? "").trim();
  const result = JSON.parse(jsonText);
  return result.paths || [];
}

export async function serverScoutLiveInternships(query: string) {
  const prompt = `Search for currently active, real-world internships matching: "${query}".
Search across major platforms like LinkedIn, Unstop, Internshala, Google Careers, and other job boards in India.

Find 6-8 distinct, active internships.

For each internship, extract:
- Job Title
- Company Name
- Location
- Stipend (if available, else 'Not disclosed')
- Required Skills (infer 2-3 if not explicitly stated)
- A brief description (max 20 words)
- The Source Name (e.g., 'LinkedIn', 'Unstop')
- The Apply Link (URL)

Format the output as a JSON array of objects. 
Each object must have these keys: "title", "company", "location", "stipend", "required_skills" (array of strings), "description", "source", "externalLink".
Do not use markdown code blocks. Just return the raw JSON.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  let text = (response.text ?? "").trim();
  if (text.startsWith("```json")) {
    text = text.replace(/```json/g, "").replace(/```/g, "");
  } else if (text.startsWith("```")) {
    text = text.replace(/```/g, "");
  }

  // Find array in text in case of surrounding commentary
  const startIdx = text.indexOf("[");
  const endIdx = text.lastIndexOf("]");
  if (startIdx !== -1 && endIdx !== -1) {
    text = text.slice(startIdx, endIdx + 1);
  }

  const rawResults = JSON.parse(text);

  const internships = rawResults.map((item: any, index: number) => ({
    internship_id: -1 * (Date.now() + index),
    title: item.title,
    company: item.company,
    location: item.location,
    stipend: item.stipend || "Not Disclosed",
    logoColor: "bg-indigo-600",
    description: item.description,
    required_skills: item.required_skills || [],
    domain: item.title,
    postedDate: new Date().toISOString(),
    externalLink: item.externalLink,
    source: item.source || "Web Search",
  }));

  return {
    internships,
    groundingMetadata: response.candidates?.[0]?.groundingMetadata,
  };
}

const simulationScenarioSchema = {
  type: Type.OBJECT,
  properties: {
    scenario: {
      type: Type.STRING,
      description: "A realistic workplace scenario or challenge related to the internship.",
    },
  },
  required: ["scenario"],
};

export async function serverGenerateSimulationScenario(title: string, description: string) {
  const prompt = `Create a realistic, specific, and challenging "Day 1" workplace scenario for an intern in the role of "${title}".
Job Description: ${description}

The scenario should require the intern to make a decision or explain their approach to a problem. It should not be a multiple choice question.

Return the result as a JSON object with a single key "scenario".`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: simulationScenarioSchema,
    },
  });

  const jsonText = (response.text ?? "").trim();
  return JSON.parse(jsonText);
}

const simulationEvaluationSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A score from 1 to 10 based on the quality of the response.",
    },
    feedback: {
      type: Type.STRING,
      description: "Detailed feedback explaining why the score was given and how to improve.",
    },
  },
  required: ["score", "feedback"],
};

export async function serverEvaluateSimulationResponse(scenario: string, userResponse: string) {
  const prompt = `You are a senior mentor.
Scenario: "${scenario}"
Intern's Response: "${userResponse}"

Evaluate the intern's response.
1. Give a score from 1 to 10.
2. Provide constructive feedback.

Return the result as a JSON object with keys "score" (number) and "feedback" (string).`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: simulationEvaluationSchema,
    },
  });

  const jsonText = (response.text ?? "").trim();
  return JSON.parse(jsonText);
}

export async function serverGenerateLessonContent(courseTitle: string, lessonTitle: string) {
  const prompt = `You are an expert instructor for the course: "${courseTitle}".
Write a comprehensive, engaging, and educational lesson content for the topic: "${lessonTitle}".

Structure the content with:
1. Introduction to the concept.
2. Key Principles or Steps.
3. A real-world example.
4. A quick summary.

Use Markdown formatting (headings, bullet points, bold text). Keep it concise (approx 300 words).`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  return response.text ?? "";
}

export async function serverGenerateResourceContent(resourceTitle: string, resourceDescription: string) {
  const prompt = `Create a high-quality, professional downloadable resource document.
Title: "${resourceTitle}"
Context: ${resourceDescription}

This should be a practical guide, template, or checklist that a student can actually use.
Format it clearly using Markdown. Make it detailed and valuable.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  return response.text ?? "";
}

const personalizedHubSchema = {
  type: Type.OBJECT,
  properties: {
    paths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          level: { type: Type.STRING },
          description: { type: Type.STRING },
          modules: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "level", "description", "modules"],
      },
      description: "6 highly relevant learning paths (courses) for the student.",
    },
    resources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["title", "description"],
      },
      description: "4 downloadable resource titles.",
    },
  },
  required: ["paths", "resources"],
};

export async function serverGeneratePersonalizedLearningHub(
  skills: string[],
  interests: string[],
  resumeSnippet: string
) {
  const prompt = `Analyze this student profile:
Skills: ${skills.join(", ")}
Interests: ${interests.join(", ")}
Resume Snippet: "${resumeSnippet.substring(0, 500)}..."

1. Identify 6 distinct learning paths (Courses). These should range from strengthening existing skills to learning new ones relevant to their interests.
2. Identify 4 useful downloadable resources (Cheat Sheets, Templates, Guides) relevant to them.

For each Learning Path, provide:
- Title
- Level (Beginner/Intermediate/Advanced)
- Short Description
- A list of 5-7 short module/lesson titles.

Return JSON matching the schema.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: personalizedHubSchema,
    },
  });

  const jsonText = (response.text ?? "").trim();
  return JSON.parse(jsonText);
}
