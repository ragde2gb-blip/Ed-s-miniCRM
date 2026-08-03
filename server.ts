import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI SDK if API key is present
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: AI Follow-up Draft Generator
  app.post('/api/ai/followup', async (req, res) => {
    try {
      const { leadName, business, status, notes, tone = 'friendly and professional', channel = 'email' } = req.body;

      const ai = getAi();
      const prompt = `You are Ed Harrison, a top-performing solo entrepreneur running "Ed's Mini CRM".
Write a ${tone} ${channel} follow-up message to a potential client.

Client Name: ${leadName || 'Client'}
Business Name: ${business || 'Business'}
Current Status: ${status || 'CONTACTED'}
Lead Context/Notes: ${notes || 'No notes provided'}

Requirements:
1. Include a subject line if channel is email.
2. Keep the message concise (150 words max), persuasive, and human.
3. Call to action: propose a brief 10-minute check-in call or ask for feedback on their project.
4. Format output as JSON with fields "subject" and "body".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      let parsed = { subject: 'Follow-up regarding your project', body: text };
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { subject: `Follow-up: ${business}`, body: text };
      }

      res.json({ success: true, draft: parsed });
    } catch (error: any) {
      console.error('Error generating follow-up:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate AI follow-up.',
      });
    }
  });

  // API Route: AI Recommendations & Bulk Analysis for Inactive Leads
  app.post('/api/ai/recommendations', async (req, res) => {
    try {
      const { leads = [] } = req.body;

      const ai = getAi();
      const prompt = `You are Ed Harrison's AI CRM Assistant.
Analyze the following lead pipeline items and identify up to 3 highest priority follow-ups needed today:

Leads JSON:
${JSON.stringify(leads, null, 2)}

For each recommendation:
1. Name the lead and business.
2. Explain WHY action is needed (e.g. overdue proposal, inactive 3 days).
3. Provide a 1-sentence recommended action.
4. Provide a 2-sentence quick draft message Ed can send right away.

Return valid JSON in this structure:
{
  "summary": "Brief 1-sentence pipeline health summary",
  "recommendations": [
    {
      "leadId": "string",
      "leadName": "string",
      "business": "string",
      "reason": "string",
      "action": "string",
      "quickDraft": "string"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      let parsed = { summary: 'Pipeline looks active.', recommendations: [] };
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { summary: 'Pipeline update generated.', recommendations: [] };
      }

      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Error generating AI recommendations:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate recommendations.',
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ed's Mini CRM server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
