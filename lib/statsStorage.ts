const STATS_KEY = "petty_meter_stats";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export interface MomentRecord {
  score: number;
  grievance: string;
  date: number;
  analysis?: string;
  advice?: string;
  category?: string;
  mode?: "self" | "other";
  name?: string;
}

export interface StatsRecord {
  totalAnalyses: number;
  scoreSum: number;
  pettiest: MomentRecord | null;
  mostValid: MomentRecord | null;
  achievements: string[];
  selfModeCount: number;
  otherModeCount: number;
  hasEverScored80Plus: boolean;
  validUnder20Count: number;
  redemptionArc: boolean;
}

const DEFAULT_STATS: StatsRecord = {
  totalAnalyses: 0,
  scoreSum: 0,
  pettiest: null,
  mostValid: null,
  achievements: [],
  selfModeCount: 0,
  otherModeCount: 0,
  hasEverScored80Plus: false,
  validUnder20Count: 0,
  redemptionArc: false,
};

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=;path=/;max-age=0`;
}

export const getStats = (): StatsRecord => {
  if (typeof window === "undefined") return { ...DEFAULT_STATS };
  try {
    const raw = readCookie(STATS_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : { ...DEFAULT_STATS };
  } catch {
    return { ...DEFAULT_STATS };
  }
};

export const saveStats = (stats: StatsRecord): void => {
  if (typeof window === "undefined") return;
  writeCookie(STATS_KEY, JSON.stringify(stats));
};

export const resetStats = (): void => {
  if (typeof window === "undefined") return;
  deleteCookie(STATS_KEY);
};

export const updateStats = (
  score: number,
  grievance: string,
  mode: "self" | "other",
  extra?: { analysis?: string; advice?: string; category?: string; name?: string }
): { prev: StatsRecord; next: StatsRecord } => {
  const prev = getStats();
  const now = Date.now();

  const isRedemptionArc =
    prev.hasEverScored80Plus && score < 10 && !prev.redemptionArc;

  const moment: MomentRecord = {
    score,
    grievance,
    date: now,
    mode,
    ...(extra ?? {}),
  };

  const next: StatsRecord = {
    ...prev,
    totalAnalyses: prev.totalAnalyses + 1,
    scoreSum: prev.scoreSum + score,
    selfModeCount:
      mode === "self" ? prev.selfModeCount + 1 : prev.selfModeCount,
    otherModeCount:
      mode === "other" ? prev.otherModeCount + 1 : prev.otherModeCount,
    hasEverScored80Plus: prev.hasEverScored80Plus || score >= 80,
    validUnder20Count:
      score < 20 && score >= 0
        ? prev.validUnder20Count + 1
        : prev.validUnder20Count,
    redemptionArc: prev.redemptionArc || isRedemptionArc,
    pettiest:
      !prev.pettiest || score > prev.pettiest.score ? moment : prev.pettiest,
    mostValid:
      !prev.mostValid || score < prev.mostValid.score ? moment : prev.mostValid,
    achievements: prev.achievements,
  };

  saveStats(next);
  return { prev, next };
};

export const unlockAchievement = (id: string): void => {
  const stats = getStats();
  if (!stats.achievements.includes(id)) {
    saveStats({ ...stats, achievements: [...stats.achievements, id] });
  }
};
