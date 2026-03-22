import { useEffect, useRef, useState } from 'react';
import { useGameState } from './useGameState';
import { ACHIEVEMENTS, INCIDENTS } from '../data/gameData';
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
  const { achievements, totalClicks, totalDpEarned, dpPerSecond, buildings, upgrades } = state;

  for (const ach of ACHIEVEMENTS) {
    if (achievements.includes(ach.id)) continue;

    const cond = ach.unlockCondition;
    let met = false;

    switch (cond.type) {
      case 'totalClicks':
        met = totalClicks >= cond.threshold;
        break;
      case 'totalDp':
        met = totalDpEarned >= cond.threshold;
        break;
      case 'buildingCount':
        if (cond.buildingId) {
          met = (buildings[cond.buildingId] ?? 0) >= cond.threshold;
        } else {
          // Total buildings across all types
          const total = Object.values(buildings).reduce((sum, c) => sum + c, 0);
          met = total >= cond.threshold;
        }
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

  const incident = INCIDENTS[Math.floor(Math.random() * INCIDENTS.length)];
  const durationMs = incident.duration * 1000;

  const active: ActiveIncident = {
    id: incident.id,
    endsAt: Date.now() + durationMs,
    effect: { ...incident.effect },
  };

  state.setIncident(active);
}
