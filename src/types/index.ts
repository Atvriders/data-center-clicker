// Re-export types from gameData for convenience
export type {
  Building,
  Upgrade,
  Achievement,
  AchievementCondition,
  AchievementReward,
  Incident,
  IncidentEffect,
  GameStats,
  GameConfig,
} from '../data/gameData';

import type { IncidentEffect } from '../data/gameData';

export interface ActiveIncident {
  id: string;
  endsAt: number;
  /** Effect copied from the Incident definition */
  effect: IncidentEffect;
}

export interface GameState {
  dp: number;
  totalDpEarned: number;
  totalClicks: number;
  dpPerClick: number;
  dpPerSecond: number;
  clickMultiplier: number;
  buildings: Record<string, number>;
  upgrades: string[];
  achievements: string[];
  activeIncident: ActiveIncident | null;
  startTime: number;
}
