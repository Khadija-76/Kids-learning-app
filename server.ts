import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client lazily or safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. AI Story Generator Endpoint
app.post("/api/ai/story", async (req, res) => {
  try {
    const { topic = "Friendly Dinosaur", ageGroup = "3-4", theme = "Jungle Adventure" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not configured yet
      return res.json({
        title: `The Mystery of ${topic}`,
        pages: [
          {
            text: `Once upon a time in a magical ${theme}, a little friend named Leo set out on a step-by-step adventure.`,
            illustrationPrompt: "A cute smiling baby animal on a vibrant green path with glowing flowers",
            soundEffect: "birds"
          },
          {
            text: `Along the way, Leo found a shiny golden key hidden behind a rainbow bush! "I wonder what this opens!" Leo gasped.`,
            illustrationPrompt: "Cute character holding a shiny golden key with sparkles",
            soundEffect: "chime"
          },
          {
            text: `With a cheerful hop, Leo unlocked a big chest filled with star badges! "Learning is fun!" everyone cheered!`,
            illustrationPrompt: "Opening a magic gift box with floating colorful stars and balloons",
            soundEffect: "cheer"
          }
        ],
        moral: "Being curious helps us learn and grow every day!"
      });
    }

    const prompt = `Create a short, magical, highly engaging interactive children's story for a child aged ${ageGroup}.
Theme: ${theme}.
Main Topic/Character: ${topic}.
Include 3 simple pages with easy-to-read words suitable for toddlers.
Return valid JSON matching this schema:
{
  "title": "Story Title",
  "moral": "Simple 1-sentence lesson",
  "pages": [
    {
      "text": "Page 1 story text (2 simple sentences max)",
      "illustrationPrompt": "visual description for 3D cartoon image",
      "soundEffect": "one of: birds, chime, cheer, giggles, footprints"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a world-class children's story writer for toddlers aged 2 to 6. Keep stories gentle, uplifting, and educational.",
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (err: any) {
    console.error("Error generating story:", err);
    res.status(500).json({
      error: "Failed to generate story",
      details: err.message,
    });
  }
});

// 2. AI Speech Evaluation Endpoint
app.post("/api/ai/evaluate-speech", async (req, res) => {
  try {
    const { targetWord, spokenText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        stars: 3,
        feedback: `Super job! You pronounced "${targetWord}" so clearly!`,
        phoneticTip: "Keep practicing that happy sound!",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Target word: "${targetWord}". Child said: "${spokenText}".
Give encouraging feedback for a toddler learning phonics.
Return JSON with:
{
  "stars": 3, // integer 1 to 3
  "feedback": "Encouraging praise statement for the child",
  "phoneticTip": "Short tip for parent/child"
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    res.json({
      stars: 3,
      feedback: "Great job trying! You are a superstar!",
      phoneticTip: "Fun practice makes progress!",
    });
  }
});

// 3. AI Doodle Analyzer Endpoint
app.post("/api/ai/analyze-doodle", async (req, res) => {
  try {
    const { imageBase64, prompt = "What did the child draw?" } = req.body;
    const ai = getGeminiClient();

    if (!ai || !imageBase64) {
      return res.json({
        guess: "A Super Sunshine & Happy Shape!",
        confidence: "High",
        praise: "Wow! Look at those vibrant colors and fun lines!",
        funFact: "Did you know yellow is the brightest color in the rainbow?",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this children's drawing. Guess what object or shape it resembles (e.g. sun, flower, house, cat, star, apple, car) with a cheerful tone for a 3-year-old.
Return JSON:
{
  "guess": "Name of drawing or shape",
  "praise": "Enthusiastic child-friendly praise",
  "funFact": "Fun 1-sentence kid fact about it"
}`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    res.json({
      guess: "A Wonderful Magic Creation!",
      praise: "You are such an amazing little artist!",
      funFact: "Drawing helps your imagination grow strong!",
    });
  }
});

// 4. AI Parent Insights Endpoint
app.post("/api/ai/parent-insights", async (req, res) => {
  try {
    const { childName = "Leo", age = 4, streak = 5, learnedWords = ["Apple", "Elephant", "Star", "Rainbow"] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        summary: `${childName} is showing fantastic cognitive curiosity and phonics progress this week!`,
        strengths: ["Phonics & Letter Recognition", "Active Story Engagement", "Visual Memory"],
        suggestedOfflineActivities: [
          "Play a 'find the color' game during your morning walk",
          "Read a story together and ask 'What do you think happens next?'",
          "Trace letter shapes in sand or flour dough"
        ],
        developmentalMilestone: "On track for early vocabulary building and creative expression."
      });
    }

    const prompt = `Child Name: ${childName}, Age: ${age}, Current Learning Streak: ${streak} days, Words Mastered: ${learnedWords.join(", ")}.
Generate a warm, professional, encouraging AI Parent Report for parents.
Return JSON:
{
  "summary": "1-2 sentence overview of child's growth",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "suggestedOfflineActivities": ["Activity 1", "Activity 2", "Activity 3"],
  "developmentalMilestone": "1-sentence expert milestone note"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TinySteps AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
