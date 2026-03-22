import { create } from 'zustand';
import {
  BUILDINGS,
  UPGRADES,
  getBuildingCost,
} from '../data/gameData';
import type { ActiveIncident, GameState } from '../types';

const SAVE_KEY = 'data-center-clicker-save';

// ── Recalculation helpers ──

function recalcDpPerSecond(
  buildings: Record<string, number>,
  upgrades: string[],
): number {
  let total = 0;
  // Global DPS multiplier from upgrades
  let globalMult = 1;
  for (const uid of upgrades) {
    const upg = UPGRADES.find((u) => u.id === uid);
    if (upg && upg.effect.type === 'dpsMultiplier') {
      globalMult *= upg.effect.value;
    }
  }

  for (const b of BUILDINGS) {
    const count = buildings[b.id] ?? 0;
    if (count === 0) continue;

    // Per-building multiplier from upgrades
    let bMult = 1;
    for (const uid of upgrades) {
      const upg = UPGRADES.find((u) => u.id === uid);
      if (
        upg &&
        upg.effect.type === 'buildingMultiplier' &&
        upg.effect.targetBuildingId === b.id
      ) {
        bMult *= upg.effect.value;
      }
    }
    total += b.baseDps * count * bMult;
  }

  // Flat DPS bonuses from upgrades (non-incident)
  for (const uid of upgrades) {
    const upg = UPGRADES.find((u) => u.id === uid);
    if (upg && upg.effect.type === 'flatDps') {
      total += upg.effect.value;
    }
  }

  return total * globalMult;
}

function recalcClick(upgrades: string[]): { dpPerClick: number; clickMultiplier: number } {
  let dpPerClick = 1;
  let clickMultiplier = 1;

  for (const uid of upgrades) {
    const upg = UPGRADES.find((u) => u.id === uid);
    if (!upg) continue;
    if (upg.effect.type === 'clickMultiplier') {
      clickMultiplier *= upg.effect.value;
    }
    if (upg.effect.type === 'flatClick') {
      dpPerClick += upg.effect.value;
    }
  }

  return { dpPerClick, clickMultiplier };
}

// ── Store type ──

interface GameActions {
  click: () => void;
  buyBuilding: (id: string) => void;
  buyUpgrade: (id: string) => void;
  tick: (deltaMs: number) => void;
  unlockAchievement: (id: string) => void;
  setIncident: (incident: ActiveIncident) => void;
  clearIncident: () => void;
  save: () => void;
  load: () => void;
  reset: () => void;
}

type GameStore = GameState & GameActions;

function defaultState(): GameState {
  return {
    dp: 0,
    totalDpEarned: 0,
    totalClicks: 0,
    dpPerClick: 1,
    dpPerSecond: 0,
    clickMultiplier: 1,
    buildings: {},
    upgrades: [],
    achievements: [],
    activeIncident: null,
    startTime: Date.now(),
  };
}

// ── Zustand store ──

export const useGameState = create<GameStore>((set, get) => ({
  ...defaultState(),

  // ── Click ──
  click: () =>
    set((s) => {
      // Incident click multiplier
      let incidentClickMult = 1;
      if (s.activeIncident && s.activeIncident.effect.type === 'clickMultiplier') {
        incidentClickMult = s.activeIncident.effect.value;
      }
      const earned = s.dpPerClick * s.clickMultiplier * incidentClickMult;
      return {
        dp: s.dp + earned,
        totalDpEarned: s.totalDpEarned + earned,
        totalClicks: s.totalClicks + 1,
      };
    }),

  // ── Buy Building ──
  buyBuilding: (id: string) =>
    set((s) => {
      const building = BUILDINGS.find((b) => b.id === id);
      if (!building) return s;

      const owned = s.buildings[id] ?? 0;
      const cost = getBuildingCost(building, owned);
      if (s.dp < cost) return s;

      const newBuildings = { ...s.buildings, [id]: owned + 1 };
      const newDpPerSecond = recalcDpPerSecond(newBuildings, s.upgrades);

      return {
        dp: s.dp - cost,
        buildings: newBuildings,
        dpPerSecond: newDpPerSecond,
      };
    }),

  // ── Buy Upgrade ──
  buyUpgrade: (id: string) =>
    set((s) => {
      if (s.upgrades.includes(id)) return s;

      const upgrade = UPGRADES.find((u) => u.id === id);
      if (!upgrade) return s;
      if (s.dp < upgrade.cost) return s;

      const newUpgrades = [...s.upgrades, id];
      const newDpPerSecond = recalcDpPerSecond(s.buildings, newUpgrades);
      const { dpPerClick, clickMultiplier } = recalcClick(newUpgrades);

      return {
        dp: s.dp - upgrade.cost,
        upgrades: newUpgrades,
        dpPerSecond: newDpPerSecond,
        dpPerClick,
        clickMultiplier,
      };
    }),

  // ── Tick (called every rAF frame) ──
  tick: (deltaMs: number) =>
    set((s) => {
      if (s.dpPerSecond === 0 && !s.activeIncident) return s;

      const deltaSec = deltaMs / 1000;
      let production = s.dpPerSecond * deltaSec;

      // Apply incident effects to production
      if (s.activeIncident) {
        const { effect } = s.activeIncident;
        if (effect.type === 'dpsHalt') {
          production = 0;
        } else if (effect.type === 'dpsMultiplier') {
          production *= effect.value;
        } else if (effect.type === 'dpsFlatBonus') {
          production += effect.value * deltaSec;
        }
        // clickMultiplier incidents are handled in click()
      }

      if (production === 0) return s;

      return {
        dp: s.dp + production,
        totalDpEarned: s.totalDpEarned + production,
      };
    }),

  // ── Achievements ──
  unlockAchievement: (id: string) =>
    set((s) => {
      if (s.achievements.includes(id)) return s;
      return { achievements: [...s.achievements, id] };
    }),

  // ── Incidents ──
  setIncident: (incident: ActiveIncident) =>
    set({ activeIncident: incident }),

  clearIncident: () =>
    set({ activeIncident: null }),

  // ── Save / Load ──
  save: () => {
    const s = get();
    const payload: GameState = {
      dp: s.dp,
      totalDpEarned: s.totalDpEarned,
      totalClicks: s.totalClicks,
      dpPerClick: s.dpPerClick,
      dpPerSecond: s.dpPerSecond,
      clickMultiplier: s.clickMultiplier,
      buildings: s.buildings,
      upgrades: s.upgrades,
      achievements: s.achievements,
      activeIncident: s.activeIncident,
      startTime: s.startTime,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch {
      // localStorage may be full or unavailable
    }
  },

  load: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Partial<GameState>;

      // Recalculate derived values from saved state
      const buildings = data.buildings ?? {};
      const upgrades = data.upgrades ?? [];
      const dpPerSecond = recalcDpPerSecond(buildings, upgrades);
      const { dpPerClick, clickMultiplier } = recalcClick(upgrades);

      // Clear expired incidents
      let activeIncident = data.activeIncident ?? null;
      if (activeIncident && Date.now() >= activeIncident.endsAt) {
        activeIncident = null;
      }

      set({
        dp: data.dp ?? 0,
        totalDpEarned: data.totalDpEarned ?? 0,
        totalClicks: data.totalClicks ?? 0,
        dpPerClick,
        dpPerSecond,
        clickMultiplier,
        buildings,
        upgrades,
        achievements: data.achievements ?? [],
        activeIncident,
        startTime: data.startTime ?? Date.now(),
      });
    } catch {
      // Corrupt save — ignore
    }
  },

  // ── Reset ──
  reset: () => {
    localStorage.removeItem(SAVE_KEY);
    set(defaultState());
  },
}));
