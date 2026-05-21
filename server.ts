import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in the AI Studio Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API for checking API Health
app.get("/api/config", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    hasKey,
    appUrl: process.env.APP_URL || "http://localhost:3000",
  });
});

// REST API Endpoint: Generate Chat Response
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, sliders, userName } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing or invalid messages array" });
      return;
    }

    const client = getGeminiClient();

    // Construct the persona system instruction
    const systemInstruction = `You are a helpful and adaptive AI assistant with a customizable personality:
    
    BASE PERSONALITY PRESET: ${sliders?.basePersona || "Default"}
    USER'S NAME: ${userName || "User"}
    
    COGNITIVE SPECTRUM SLIDERS:
    - Emotion and Empathy: ${sliders?.emotionalRange ?? 50}% (0% = neutral, factual, objective; 100% = extremely warm, highly empathetic, and emotionally supportive).
    - Analytical Depth: ${sliders?.analyticalDepth ?? 50}% (0% = short, direct, simple answers; 100% = detailed, thorough, structured explanations).
    - Humor and Wit: ${sliders?.humorWit ?? 50}% (0% = serious, direct, literal; 100% = highly witty, humorous, loves warm jokes and friendly sarcasm).
    - Tone format: ${(sliders?.energyMode || "casual").toUpperCase()} (CASUAL = friendly, relaxed, conversational. PROFESSIONAL = clear, structures logic neatly, objective language).
    
    RULES:
    1. Adapt your tone to match this layout config naturally.
    2. Address the user as "${userName || "User"}" when appropriate and natural to sound more humanlike.
    3. Do NOT use standard robotic openings like "Certainly!", "Sure thing!", "As an AI..."
    4. Provide engaging, high-quality, and helpful replies.`;

    // Map the messages to Gemini format
    // Gemini roles: 'user' or 'model'
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const reply = response.text || "";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred during chat generation.",
      isKeyMissing: !process.env.GEMINI_API_KEY,
    });
  }
});

// Setup Vite Dev Server / Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.VERCEL) {
    // Under Vercel serverless functions, we don't bind to PORT manually
    return;
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

// Start the server if not running as a Vercel serverless function
if (!process.env.VERCEL) {
  startServer();
}

export default app;
