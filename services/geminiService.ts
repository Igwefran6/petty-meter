import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Mode } from "@/types";
import { SYSTEM_INSTRUCTION } from "@/constants";

export const analyzeGrievance = async (
  grievance: string,
  mode: Mode,
  name?: string
): Promise<AnalysisResult> => {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error(
      "API Key is missing. Please set the NEXT_PUBLIC_GEMINI_API_KEY environment variable."
    );
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const prompt = `
    Mode: ${mode}
    Name: ${name || "N/A"}
    Grievance: "${grievance}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description:
                "The pettiness score from 0 to 100, or -1 for invalid inputs.",
            },
            category: {
              type: Type.STRING,
              description: "The category label for the score zone.",
            },
            analysis: {
              type: Type.STRING,
              description: "A witty 2-3 sentence analysis of the situation.",
            },
            advice: {
              type: Type.STRING,
              description: "1-2 sentences of practical or humorous advice.",
            },
          },
          required: ["score", "category", "analysis", "advice"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }

    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback error result
    return {
      score: -1,
      category: "Error",
      analysis:
        "Oops! The council of pettiness is currently out for lunch (or we hit an API error).",
      advice: "Please try again in a moment.",
    };
  }
};
