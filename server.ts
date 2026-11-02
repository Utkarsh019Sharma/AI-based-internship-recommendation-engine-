import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ai,
  serverAnalyzeResume,
  serverAnalyzeResumeWithFile,
  serverGenerateLearningPlan,
  serverStartAICoachSession,
  serverGetAICoachResponse,
  serverGetGeneralAIResponse,
  serverGenerateCareerPaths,
  serverScoutLiveInternships,
  serverGenerateSimulationScenario,
  serverEvaluateSimulationResponse,
  serverGenerateLessonContent,
  serverGenerateResourceContent,
  serverGeneratePersonalizedLearningHub
} from './server/gemini';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Healthcheck endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Gemini API Routes
  app.post('/api/gemini/analyze-resume', async (req: Request, res: Response) => {
    try {
      const { resumeText } = req.body;
      if (!resumeText) {
        return res.status(400).json({ error: 'Missing resumeText in request body.' });
      }
      const result = await serverAnalyzeResume(resumeText);
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/gemini/analyze-resume:', error);
      res.status(500).json({ error: error?.message || 'Could not analyze resume.' });
    }
  });

  app.post('/api/gemini/analyze-resume-file', async (req: Request, res: Response) => {
    try {
      const { base64Data, mimeType } = req.body;
      if (!base64Data || !mimeType) {
        return res.status(400).json({ error: 'Missing base64Data or mimeType in request body.' });
      }
      const result = await serverAnalyzeResumeWithFile(base64Data, mimeType);
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/gemini/analyze-resume-file:', error);
      res.status(500).json({ error: error?.message || 'Could not analyze resume file.' });
    }
  });

  app.post('/api/gemini/learning-plan', async (req: Request, res: Response) => {
    try {
      const { skill } = req.body;
      if (!skill) {
        return res.status(400).json({ error: 'Missing skill in request body.' });
      }
      const result = await serverGenerateLearningPlan(skill);
      res.json({ plan: result });
    } catch (error: any) {
      console.error('Error in /api/gemini/learning-plan:', error);
      res.status(500).json({ error: error?.message || 'Could not generate learning plan.' });
    }
  });

  app.post('/api/gemini/coach-start', (req: Request, res: Response) => {
    try {
      const { sessionId, studentName, internshipTitle, studentSkills } = req.body;
      const result = serverStartAICoachSession(
        sessionId || 'default',
        studentName || 'Student',
        internshipTitle || 'Internship',
        studentSkills || []
      );
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/gemini/coach-start:', error);
      res.status(500).json({ error: error?.message || 'Could not start AI Coach session.' });
    }
  });

  app.post('/api/gemini/coach-message', async (req: Request, res: Response) => {
    try {
      const { sessionId, message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Missing message in request body.' });
      }
      const response = await serverGetAICoachResponse(sessionId || 'default', message);
      res.json({ response });
    } catch (error: any) {
      console.error('Error in /api/gemini/coach-message:', error);
      res.status(500).json({ error: error?.message || 'Could not get AI Coach response.' });
    }
  });

  app.post('/api/gemini/general-assistant', async (req: Request, res: Response) => {
    try {
      const { message, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Missing message in request body.' });
      }
      const response = await serverGetGeneralAIResponse(message, context);
      res.json({ response });
    } catch (error: any) {
      console.error('Error in /api/gemini/general-assistant:', error);
      res.status(500).json({ error: error?.message || 'Could not get AI response.' });
    }
  });

  app.post('/api/gemini/career-paths', async (req: Request, res: Response) => {
    try {
      const { internshipTitle, studentInterests } = req.body;
      if (!internshipTitle) {
        return res.status(400).json({ error: 'Missing internshipTitle in request body.' });
      }
      const paths = await serverGenerateCareerPaths(internshipTitle, studentInterests || []);
      res.json({ paths });
    } catch (error: any) {
      console.error('Error in /api/gemini/career-paths:', error);
      res.status(500).json({ error: error?.message || 'Could not generate career paths.' });
    }
  });

  app.post('/api/gemini/scout-live', async (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Missing query in request body.' });
      }
      const result = await serverScoutLiveInternships(query);
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/gemini/scout-live:', error);
      res.json({ internships: [] });
    }
  });

  app.post('/api/gemini/simulation-scenario', async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      const result = await serverGenerateSimulationScenario(title || '', description || '');
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/gemini/simulation-scenario:', error);
      res.status(500).json({ error: error?.message || 'Could not generate simulation scenario.' });
    }
  });

  app.post('/api/gemini/simulation-evaluate', async (req: Request, res: Response) => {
    try {
      const { scenario, userResponse } = req.body;
      const result = await serverEvaluateSimulationResponse(scenario || '', userResponse || '');
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/gemini/simulation-evaluate:', error);
      res.status(500).json({ error: error?.message || 'Could not evaluate response.' });
    }
  });

  app.post('/api/gemini/lesson-content', async (req: Request, res: Response) => {
    try {
      const { courseTitle, lessonTitle } = req.body;
      const content = await serverGenerateLessonContent(courseTitle || '', lessonTitle || '');
      res.json({ content });
    } catch (error: any) {
      console.error('Error in /api/gemini/lesson-content:', error);
      res.status(500).json({ error: error?.message || 'Could not generate lesson content.' });
    }
  });

  app.post('/api/gemini/resource-content', async (req: Request, res: Response) => {
    try {
      const { resourceTitle, resourceDescription } = req.body;
      const content = await serverGenerateResourceContent(resourceTitle || '', resourceDescription || '');
      res.json({ content });
    } catch (error: any) {
      console.error('Error in /api/gemini/resource-content:', error);
      res.status(500).json({ error: error?.message || 'Could not generate resource content.' });
    }
  });

  app.post('/api/gemini/personalized-hub', async (req: Request, res: Response) => {
    try {
      const { skills, interests, resumeSnippet } = req.body;
      const hub = await serverGeneratePersonalizedLearningHub(
        skills || [],
        interests || [],
        resumeSnippet || ''
      );
      res.json(hub);
    } catch (error: any) {
      console.error('Error in /api/gemini/personalized-hub:', error);
      res.status(500).json({ error: error?.message || 'Could not generate personalized hub.' });
    }
  });

  // Streaming endpoint for any streaming tasks (using Server-Sent Events)
  app.post('/api/gemini/stream', async (req: Request, res: Response) => {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      for await (const chunk of stream) {
        const text = chunk.text || '';
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('Error in /api/gemini/stream:', error);
      res.write(`data: ${JSON.stringify({ error: error?.message || 'Streaming error' })}\n\n`);
      res.end();
    }
  });

  // Frontend Serving (Vite in dev, static files in production)
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
