export enum Mode {
  SELF = 'self',
  OTHER = 'other',
  BATTLE = 'battle',
}

export interface AnalysisResult {
  score: number;
  category: string;
  analysis: string;
  advice: string;
}

export interface PettinessZone {
  min: number;
  max: number;
  label: string;
  color: string;
  message: string;
}

export type PersonaId = "judge" | "bestie" | "therapist";

export interface FormData {
  grievance: string;
  name: string; // Only used in OTHER mode
}

export interface BattleResult {
  winner: 1 | 2;
  player1Score: number;
  player2Score: number;
  verdict: string;
  player1Analysis: string;
  player2Analysis: string;
}

export interface BattleFormData {
  player1Grievance: string;
  player1Name?: string;
  player2Grievance: string;
  player2Name?: string;
}

export interface BattleHistoryData {
  result: BattleResult;
  player1Name?: string;
  player1Grievance: string;
  player2Name?: string;
  player2Grievance: string;
}

export interface HistoryItem {
  id: string;
  mode: Mode;
  name?: string;
  grievance: string;
  result: AnalysisResult;
  timestamp: number;
  battle?: BattleHistoryData;
}