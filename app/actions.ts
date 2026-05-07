"use server";

import { cookies } from "next/headers";
import { analyzeGrievance, analyzeBattle } from "@/services/claudeService";
import { AnalysisResult, Mode, HistoryItem, PersonaId, BattleResult, BattleFormData } from "@/types";

const HISTORY_COOKIE_NAME = "pettiness_history";
const MAX_COOKIE_SIZE = 4000; // Safe limit for cookie size

/**
 * Server Action: Analyze a grievance using the Gemini API
 */
export async function analyzeGrievanceAction(
  grievance: string,
  mode: Mode,
  name?: string,
  persona?: PersonaId
): Promise<AnalysisResult> {
  return await analyzeGrievance(grievance, mode, name, persona);
}

export async function analyzeBattleAction(data: BattleFormData): Promise<BattleResult> {
  return await analyzeBattle(data);
}

/**
 * Server Action: Get history from cookies
 */
export async function getHistoryAction(): Promise<HistoryItem[]> {
  const cookieStore = await cookies();
  const historyCookie = cookieStore.get(HISTORY_COOKIE_NAME);

  if (!historyCookie?.value) {
    return [];
  }

  try {
    return JSON.parse(historyCookie.value) as HistoryItem[];
  } catch (e) {
    console.error("Failed to parse history cookie", e);
    return [];
  }
}

/**
 * Server Action: Save history to cookies
 */
export async function saveHistoryAction(history: HistoryItem[]): Promise<void> {
  const cookieStore = await cookies();
  const historyJson = JSON.stringify(history);

  // Check cookie size limit
  if (historyJson.length > MAX_COOKIE_SIZE) {
    // Trim history if it's too large
    const trimmedHistory = history.slice(0, Math.floor(history.length / 2));
    const trimmedJson = JSON.stringify(trimmedHistory);

    cookieStore.set(HISTORY_COOKIE_NAME, trimmedJson, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    });
  } else {
    cookieStore.set(HISTORY_COOKIE_NAME, historyJson, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    });
  }
}
