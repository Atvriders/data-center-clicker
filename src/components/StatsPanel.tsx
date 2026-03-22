import React from 'react';
import { formatNumber } from '../data/gameData';
import { useGameState } from '../hooks/useGameState';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

const StatsPanel: React.FC = () => {
  const totalDpEarned = useGameState((s) => s.totalDpEarned);
  const totalClicks = useGameState((s) => s.totalClicks);
  const dpPerSecond = useGameState((s) => s.dpPerSecond);
  const dpPerClick = useGameState((s) => s.dpPerClick);
  const clickMultiplier = useGameState((s) => s.clickMultiplier);
  const startTime = useGameState((s) => s.startTime);
  const buildings = useGameState((s) => s.buildings);

  const totalBuildingsOwned = Object.values(buildings).reduce(
    (sum, c) => sum + c,
    0
  );
  const timePlayed = Math.floor((Date.now() - startTime) / 1000);
  const effectiveClickValue = dpPerClick * clickMultiplier;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px 16px',
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexShrink: 0,
  };

  const statStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '11px',
    color: '#556677',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '13px',
    fontWeight: 600,
  };

  const stats = [
    { label: 'Total DP', value: formatNumber(totalDpEarned), color: '#00ff88' },
    { label: 'Clicks', value: formatNumber(totalClicks), color: '#00d4ff' },
    { label: 'DP/s', value: formatNumber(dpPerSecond), color: '#00ff88' },
    { label: 'DP/click', value: formatNumber(effectiveClickValue), color: '#00d4ff' },
    { label: 'Time', value: formatTime(timePlayed), color: '#c9d1d9' },
    { label: 'Buildings', value: totalBuildingsOwned.toString(), color: '#ffb800' },
  ];

  return (
    <div style={containerStyle}>
      {stats.map((s) => (
        <div key={s.label} style={statStyle}>
          <span style={labelStyle}>{s.label}</span>
          <span style={{ ...valueStyle, color: s.color }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
