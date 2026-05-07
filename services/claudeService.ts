import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult, Mode, PersonaId } from "@/types";
import { SYSTEM_INSTRUCTION, PERSONA_INSTRUCTIONS } from "@/constants";
import "server-only";

const client = new Anthropic({ apiKey: process.env.CLAUDE_APIKEY });

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const analyzeGrievance = async (
  grievance: string,
  mode: Mode,
  name?: string,
  persona: PersonaId = "judge"
): Promise<AnalysisResult> => {
  if (!process.env.CLAUDE_APIKEY) {
    throw new Error(
      "API Key is missing. Please set the CLAUDE_APIKEY environment variable."
    );
  }

  const prompt = `
    Mode: ${mode}
    Name: ${name || "N/A"}
    Grievance: "${grievance}"
  `;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_INSTRUCTION + PERSONA_INSTRUCTIONS[persona],
        tools: [
          {
            name: "submit_analysis",
            description: "Submit the pettiness analysis result as structured JSON.",
            input_schema: {
              type: "object" as const,
              properties: {
                score: {
                  type: "number",
                  description: "The pettiness score from 0 to 100, or -1 for invalid inputs.",
                },
                category: {
                  type: "string",
                  description: "The category label for the score zone.",
                },
                analysis: {
                  type: "string",
                  description: "A witty 2-3 sentence analysis of the situation.",
                },
                advice: {
                  type: "string",
                  description: "1-2 sentences of practical or humorous advice.",
                },
              },
              required: ["score", "category", "analysis", "advice"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "submit_analysis" },
        messages: [{ role: "user", content: prompt }],
      });

      const toolUse = response.content.find((block) => block.type === "tool_use");
      if (toolUse && toolUse.type === "tool_use") {
        return toolUse.input as AnalysisResult;
      }

      throw new Error("No tool use block in response");
    } catch (error: unknown) {
      const isOverloaded =
        error instanceof Anthropic.APIError && error.status === 529;

      if (isOverloaded && attempt < MAX_RETRIES) {
        console.warn(`Claude overloaded — retrying (${attempt}/${MAX_RETRIES})...`);
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      console.error("Claude API Error:", error);
      return {
        score: -1,
        category: "Error",
        analysis:
          "Oops! The council of pettiness is currently out for lunch (in essence, we hit a snag).",
        advice: "Please try again in a moment.",
      };
    }
  }

  // Unreachable but satisfies TS
  return {
    score: -1,
    category: "Error",
    analysis: "The council is overwhelmed. Try again shortly.",
    advice: "Please try again in a moment.",
  };
};
