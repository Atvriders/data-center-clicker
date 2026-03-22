import { useEffect, useRef, useState } from 'react';
import { useGameState } from './useGameState';
import { ACHIEVEMENTS, INCIDENTS, BUILDINGS } from '../data/gameData';
import type { ActiveIncident } from '../types';

/** Minimum ms between incident triggers (30 s) */
const INCIDENT_MIN_INTERVAL = 30_000;
/** Maximum ms between incident triggers (120 s) */
const INCIDENT_MAX_INTERVAL = 120_000;
/** Auto-save interval (30 s) */
const SAVE_INTERVAL = 30_000;
/** Achievement check interval (1 s) */
const ACHIEVEMENT_CHECK_INTERVAL = 1_000;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Core game loop hook.
 * - Runs a rAF-based loop calling tick() every frame with accurate delta time.
 * - Checks achievement unlocks every ~1 second.
 * - Triggers random incidents every 30-120 seconds.
 * - Auto-saves every 30 seconds.
 * - Loads saved game on mount.
 */
export function useGameLoop(): { isRunning: boolean } {
  const [isRunning, setIsRunning] = useState(false);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Accumulator refs for throttled checks
  const achievementAccum = useRef(0);
  const saveAccum = useRef(0);
  const nextIncidentAt = useRef(Date.now() + randomBetween(INCIDENT_MIN_INTERVAL, INCIDENT_MAX_INTERVAL));

  useEffect(() => {
    // Load saved game on mount
    useGameState.getState().load();
    setIsRunning(true);

    const loop = (now: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = now;
      }

      const delta = Math.min(now - lastTimeRef.current, 200); // cap delta to 200ms to avoid huge jumps
      lastTimeRef.current = now;

      const state = useGameState.getState();

      // ── Tick: passive production ──
      if (delta > 0) {
        state.tick(delta);
      }

      // ── Check for incident expiry ──
      if (state.activeIncident && Date.now() >= state.activeIncident.endsAt) {
        state.clearIncident();
      }

      // ── Achievement checks (~1s) ──
      achievementAccum.current += delta;
      if (achievementAccum.current >= ACHIEVEMENT_CHECK_INTERVAL) {
        achievementAccum.current = 0;
        checkAchievements(state);
      }

      // ── Auto-save (~30s) ──
      saveAccum.current += delta;
      if (saveAccum.current >= SAVE_INTERVAL) {
        saveAccum.current = 0;
        state.save();
      }

      // ── Random incidents ──
      if (!state.activeIncident && Date.now() >= nextIncidentAt.current) {
        triggerRandomIncident(state);
        nextIncidentAt.current = Date.now() + randomBetween(INCIDENT_MIN_INTERVAL, INCIDENT_MAX_INTERVAL);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      // Save on unmount
      useGameState.getState().save();
      setIsRunning(false);
    };
  }, []);

  return { isRunning };
}

// ── Achievement checker ──

function checkAchievements(state: ReturnType<typeof useGameState.getState>) {
  const { achievements, totalClicks, totalDpEarned, dpPerSecond, dpPerClick, buildings, upgrades } = state;

  for (const ach of ACHIEVEMENTS) {
    if (achievements.includes(ach.id)) continue;

    const cond = ach.condition;
    let met = false;

    switch (cond.type) {
      case 'total_clicks':
        met = totalClicks >= cond.value;
        break;
      case 'total_dp_earned':
        met = totalDpEarned >= cond.value;
        break;
      case 'dp_per_second':
        met = dpPerSecond >= cond.value;
        break;
      case 'dp_per_click':
        met = dpPerClick >= cond.value;
        break;
      case 'building_owned':
        met = (buildings[cond.buildingId] ?? 0) >= cond.count;
        break;
      case 'buildings_of_type':
        met = (buildings[cond.buildingId] ?? 0) >= cond.count;
        break;
      case 'total_buildings': {
        const total = Object.values(buildings).reduce((sum, c) => sum + c, 0);
        met = total >= cond.value;
        break;
      }
      case 'time_played_seconds': {
        const elapsed = (Date.now() - state.startTime) / 1000;
        met = elapsed >= cond.value;
        break;
      }
      case 'own_all_building_types': {
        met = BUILDINGS.every((b) => (buildings[b.id] ?? 0) > 0);
        break;
      }
      case 'upgrade_purchased':
        met = upgrades.includes(cond.upgradeId);
        break;
      default:
        break;
    }

    if (met) {
      state.unlockAchievement(ach.id);
    }
  }
}

// ── Incident trigger ──

function triggerRandomIncident(state: ReturnType<typeof useGameState.getState>) {
  // Only trigger if there's some production (no incidents before first building)
  if (state.dpPerSecond <= 0 && state.totalClicks < 10) return;

  // Filter eligible incidents based on minDps and required buildings
  const eligible = INCIDENTS.filter((inc) => {
    if (state.dpPerSecond < inc.minDps) return false;
    if (inc.requiresBuildingId && !(state.buildings[inc.requiresBuildingId] > 0)) return false;
    return true;
  });

  if (eligible.length === 0) return;

  // Weighted random selection
  const totalWeight = eligible.reduce((sum, inc) => sum + inc.weight, 0);
  let roll = Math.random() * totalWeight;
  let incident = eligible[0];
  for (const inc of eligible) {
    roll -= inc.weight;
    if (roll <= 0) {
      incident = inc;
      break;
    }
  }

  const durationMs = incident.duration * 1000;

  const active: ActiveIncident = {
    id: incident.id,
    endsAt: Date.now() + durationMs,
    effect: incident.effect,
  };

  state.setIncident(active);
}
