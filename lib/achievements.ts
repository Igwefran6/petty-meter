import { StatsRecord } from "./statsStorage";

export interface Achievement {
  id: string;
  emoji: string;
  name: string;
  description: string;
  isUnlocked: (stats: StatsRecord) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "certified-petty",
    emoji: "👑",
    name: "Certified Petty",
    description: "Scored 80+ on a single analysis",
    isUnlocked: (s) => s.hasEverScored80Plus,
  },
  {
    id: "surprisingly-valid",
    emoji: "😇",
    name: "Surprisingly Valid",
    description: "Scored under 20 three times",
    isUnlocked: (s) => s.validUnder20Count >= 3,
  },
  {
    id: "drama-addict",
    emoji: "🎭",
    name: "Drama Addict",
    description: "Completed 10 analyses",
    isUnlocked: (s) => s.totalAnalyses >= 10,
  },
  {
    id: "serial-exposer",
    emoji: "🔍",
    name: "Serial Exposer",
    description: "Used 'Are They Petty?' mode 5 times",
    isUnlocked: (s) => s.otherModeCount >= 5,
  },
  {
    id: "self-aware",
    emoji: "🪞",
    name: "Self Aware",
    description: "Used 'Am I Petty?' mode 5 times",
    isUnlocked: (s) => s.selfModeCount >= 5,
  },
  {
    id: "perfect-score",
    emoji: "💯",
    name: "100% That Problem",
    description: "Scored exactly 100",
    isUnlocked: (s) => s.pettiest?.score === 100,
  },
  {
    id: "redemption-arc",
    emoji: "✨",
    name: "Redemption Arc",
    description: "Scored under 10 after previously scoring over 80",
    isUnlocked: (s) => s.redemptionArc,
  },
];

/**
 * Returns IDs of achievements newly unlocked between prev and next stats.
 */
export const checkNewAchievements = (
  prev: StatsRecord,
  next: StatsRecord
): Achievement[] => {
  const prevUnlocked = new Set(prev.achievements);
  return ACHIEVEMENTS.filter(
    (a) => !prevUnlocked.has(a.id) && a.isUnlocked(next)
  );
};
