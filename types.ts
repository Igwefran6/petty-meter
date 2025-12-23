export enum Mode {
  SELF = 'self',
  OTHER = 'other'
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

export interface FormData {
  grievance: string;
  name: string; // Only used in OTHER mode
}

export interface HistoryItem {
  id: string;
  mode: Mode;
  name?: string;
  grievance: string;
  result: AnalysisResult;
  timestamp: number;
}