import React, { useEffect } from 'react';
import { BUILDINGS, formatNumber, getBuildingCost } from '../data/gameData';
import { useGameState } from '../hooks/useGameState';

const BuildingShop: React.FC = () => {
  const dp = useGameState((s) => s.dp);
  const owned = useGameState((s) => s.buildings);
  const buyBuilding = useGameState((s) => s.buyBuilding);

  // Inject keyframes once
  useEffect(() => {
    if (document.getElementById('building-shop-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'building-shop-keyframes';
    style.textContent = `
      @keyframes bs-affordGlow {
        0%, 100% { border-color: rgba(0,255,136,0.25); }
        50% { border-color: rgba(0,255,136,0.5); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    overflowY: 'auto',
    flex: 1,
  };

  return (
    <div style={containerStyle}>
      {BUILDINGS.map((b) => {
        const count = owned[b.id] || 0;
        const cost = getBuildingCost(b, count);
        const canAfford = dp >= cost;

        const cardStyle: React.CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: '10px',
          border: canAfford
            ? '1px solid rgba(0,255,136,0.3)'
            : '1px solid rgba(255,255,255,0.06)',
          background: canAfford
            ? 'rgba(0,255,136,0.04)'
            : 'rgba(255,255,255,0.02)',
          cursor: canAfford ? 'pointer' : 'not-allowed',
          opacity: canAfford ? 1 : 0.5,
          transition: 'all 0.2s ease',
          animation: canAfford ? 'bs-affordGlow 2s ease-in-out infinite' : 'none',
          position: 'relative',
          overflow: 'hidden',
        };

        const emojiStyle: React.CSSProperties = {
          fontSize: '28px',
          width: '36px',
          textAlign: 'center',
          flexShrink: 0,
        };

        const infoStyle: React.CSSProperties = {
          flex: 1,
          minWidth: 0,
        };

        const nameRowStyle: React.CSSProperties = {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2px',
        };

        const nameStyle: React.CSSProperties = {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          color: '#e6edf3',
        };

        const countStyle: React.CSSProperties = {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '13px',
          fontWeight: 700,
          color: '#00d4ff',
          minWidth: '24px',
          textAlign: 'right',
        };

        const descStyle: React.CSSProperties = {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '11px',
          color: '#556677',
          marginBottom: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        };

        const metaRowStyle: React.CSSProperties = {
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        };

        const costStyle: React.CSSProperties = {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '12px',
          color: canAfford ? '#00ff88' : '#ff4444',
          fontWeight: 600,
        };

        const dpsStyle: React.CSSProperties = {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          color: '#7a8a99',
        };

        return (
          <div
            key={b.id}
            style={cardStyle}
            onClick={() => canAfford && buyBuilding(b.id)}
            title={b.description}
          >
            <div style={emojiStyle}>{b.emoji}</div>
            <div style={infoStyle}>
              <div style={nameRowStyle}>
                <span style={nameStyle}>{b.name}</span>
                <span style={countStyle}>{count}</span>
              </div>
              <div style={descStyle}>{b.description}</div>
              <div style={metaRowStyle}>
                <span style={costStyle}>{formatNumber(cost)} DP</span>
                <span style={dpsStyle}>+{formatNumber(b.baseDps)} DP/s each</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BuildingShop;
