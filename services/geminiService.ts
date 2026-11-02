import type { SkillProficiency, CareerPath, SimulationTurn, Internship } from '../types';

export interface ResumeAnalysisResult {
    hardSkills: string[];
    softSkills: string[];
    skillProficiencies: SkillProficiency[];
    recommendedSearchQuery: string;
}

export interface ScoutResult {
    internships: Internship[];
    groundingMetadata?: any;
}

export interface AIGeneratedPath {
    title: string;
    level: string;
    description: string;
    modules: string[];
}

export interface AIGeneratedResource {
    title: string;
    description: string;
}

export interface PersonalizedHub {
    paths: AIGeneratedPath[];
    resources: AIGeneratedResource[];
}

// Session state for AI Coach
let activeCoachSessionId = `coach_${Date.now()}`;

/**
 * Analyze raw resume text via server endpoint
 */
export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysisResult> => {
    try {
        const response = await fetch('/api/gemini/analyze-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Server responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error analyzing resume:", error);
        throw new Error("Could not analyze the resume at this time.");
    }
};

/**
 * Analyze uploaded resume file (PDF/DOC) via server endpoint
 */
export const analyzeResumeWithFile = async (base64Data: string, mimeType: string): Promise<ResumeAnalysisResult> => {
    try {
        const response = await fetch('/api/gemini/analyze-resume-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64Data, mimeType }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Server responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error analyzing resume file:", error);
        throw new Error("Could not analyze the resume file. Please ensure it is a valid document.");
    }
};

/**
 * Generate a personalized learning plan for a missing skill
 */
export const generateLearningPlan = async (skill: string): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/learning-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skill }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate learning plan: ${response.status}`);
        }

        const data = await response.json();
        return data.plan || "Could not generate a learning plan at this time.";
    } catch (error) {
        console.error("Error generating learning plan:", error);
        return "Could not generate a learning plan at this time. Please try again later.";
    }
};

/**
 * Start an AI Coach conversation session
 */
export const startAICoachSession = (studentName: string, internshipTitle: string, studentSkills: string[]) => {
    activeCoachSessionId = `coach_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    fetch('/api/gemini/coach-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: activeCoachSessionId,
            studentName,
            internshipTitle,
            studentSkills,
        }),
    }).catch((err) => {
        console.error("Error starting AI coach session on server:", err);
    });
};

/**
 * Send a message to the active AI Coach session
 */
export const getAICoachResponse = async (message: string): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/coach-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: activeCoachSessionId,
                message,
            }),
        });

        if (!response.ok) {
            throw new Error(`AI Coach error: ${response.status}`);
        }

        const data = await response.json();
        return data.response || "I'm having trouble responding right now. Please try again in a moment.";
    } catch (error) {
        console.error("Error getting AI coach response:", error);
        return "I'm having trouble responding right now. Please try again in a moment.";
    }
};

/**
 * General Career AI Assistant for quick questions
 */
export const getGeneralAIResponse = async (
    message: string, 
    context?: { skills?: string[]; name?: string }
): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/general-assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context }),
        });

        if (!response.ok) {
            throw new Error(`Assistant error: ${response.status}`);
        }

        const data = await response.json();
        return data.response || "I'm sorry, I couldn't process that question right now.";
    } catch (error) {
        console.error("Error getting general AI response:", error);
        return "I'm sorry, I couldn't process that question right now. Could you try rephrasing it?";
    }
};

/**
 * Generate long-term career progression paths
 */
export const generateCareerPaths = async (
    internshipTitle: string, 
    studentInterests: string[]
): Promise<CareerPath[]> => {
    try {
        const response = await fetch('/api/gemini/career-paths', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ internshipTitle, studentInterests }),
        });

        if (!response.ok) {
            throw new Error(`Career paths error: ${response.status}`);
        }

        const data = await response.json();
        return data.paths || [];
    } catch (error) {
        console.error("Error generating career paths:", error);
        throw new Error("Could not generate career paths at this time.");
    }
};

/**
 * Scout live internships across job portals using Google Search grounding
 */
export const scoutLiveInternships = async (query: string): Promise<ScoutResult> => {
    try {
        const response = await fetch('/api/gemini/scout-live', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            return { internships: [] };
        }

        const data = await response.json();
        return {
            internships: data.internships || [],
            groundingMetadata: data.groundingMetadata,
        };
    } catch (error) {
        console.error("Error scouting live internships:", error);
        return { internships: [] };
    }
};

/**
 * Generate a workplace simulation scenario for an internship
 */
export const generateSimulationScenario = async (
    title: string, 
    description: string
): Promise<{ scenario: string }> => {
    try {
        const response = await fetch('/api/gemini/simulation-scenario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
            throw new Error(`Simulation scenario error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error generating simulation scenario:", error);
        throw new Error("Could not generate simulation scenario.");
    }
};

/**
 * Evaluate the candidate's simulation response
 */
export const evaluateSimulationResponse = async (
    scenario: string, 
    userResponse: string
): Promise<SimulationTurn> => {
    try {
        const response = await fetch('/api/gemini/simulation-evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scenario, userResponse }),
        });

        if (!response.ok) {
            throw new Error(`Simulation evaluation error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error evaluating simulation response:", error);
        throw new Error("Could not evaluate simulation response.");
    }
};

/**
 * Generate structured lesson content
 */
export const generateLessonContent = async (courseTitle: string, lessonTitle: string): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/lesson-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseTitle, lessonTitle }),
        });

        if (!response.ok) {
            return "Failed to load lesson content. Please try again.";
        }

        const data = await response.json();
        return data.content || "Failed to load lesson content.";
    } catch (error) {
        console.error("Error generating lesson content:", error);
        return "Failed to load lesson content. Please try again.";
    }
};

/**
 * Generate downloadable resource guide/template content
 */
export const generateResourceContent = async (
    resourceTitle: string, 
    resourceDescription: string
): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/resource-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resourceTitle, resourceDescription }),
        });

        if (!response.ok) {
            return "Failed to generate resource.";
        }

        const data = await response.json();
        return data.content || "Failed to generate resource.";
    } catch (error) {
        console.error("Error generating resource content:", error);
        return "Failed to generate resource.";
    }
};

/**
 * Generate personalized learning hub courses and resources
 */
export const generatePersonalizedLearningHub = async (
    skills: string[], 
    interests: string[], 
    resumeSnippet: string
): Promise<PersonalizedHub> => {
    try {
        const response = await fetch('/api/gemini/personalized-hub', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills, interests, resumeSnippet }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate personalized content");
        }

        return await response.json();
    } catch (error) {
        console.error("Error generating personalized hub:", error);
        throw new Error("Failed to generate personalized content");
    }
};

/**
 * Stream Gemini responses using Server-Sent Events
 */
export async function* streamGeminiContent(prompt: string, systemInstruction?: string): AsyncGenerator<string, void, unknown> {
    const response = await fetch('/api/gemini/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction }),
    });

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') return;
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.text) yield parsed.text;
                } catch {
                    // ignore non-json line
                }
            }
        }
    }
}
