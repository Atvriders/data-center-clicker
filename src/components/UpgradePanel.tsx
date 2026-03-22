import React, { useEffect, useMemo } from 'react';
import { UPGRADES, formatNumber, isUpgradeAvailable } from '../data/gameData';
import { useGameState } from '../hooks/useGameState';

const UpgradePanel: React.FC = () => {
  const dp = useGameState((s) => s.dp);
  const purchasedList = useGameState((s) => s.upgrades);
  const buyUpgrade = useGameState((s) => s.buyUpgrade);

  const purchased = useMemo(() => new Set(purchasedList), [purchasedList]);

  // Determine which upgrades are available (not purchased + prerequisites met)
  const available = useMemo(() => {
    const set = new Set<string>();
    for (const u of UPGRADES) {
      if (isUpgradeAvailable(u, purchased)) {
        set.add(u.id);
      }
    }
    return set;
  }, [purchased]);

  useEffect(() => {
    if (document.getElementById('upgrade-panel-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'upgrade-panel-keyframes';
    style.textContent = `
      @keyframes up-unlock {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const containerStyle: React.CSSProperties = {
    padding: '12px',
    overflowY: 'auto',
    flex: 1,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '8px',
  };

  const visible = UPGRADES.filter(
    (u) => purchased.has(u.id) || available.has(u.id)
  );

  if (visible.length === 0) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '13px',
            color: '#445566',
            textAlign: 'center',
            padding: '40px 20px',
          }}
        >
          Keep playing to unlock upgrades...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        {visible.map((u) => {
          const isBought = purchased.has(u.id);
          const canAfford = !isBought && dp >= u.cost;

          const cardStyle: React.CSSProperties = {
            padding: '10px 12px',
            borderRadius: '10px',
            border: isBought
              ? '1px solid rgba(0,255,136,0.3)'
              : canAfford
              ? '1px solid rgba(0,212,255,0.4)'
              : '1px solid rgba(255,255,255,0.08)',
            background: isBought
              ? 'rgba(0,255,136,0.06)'
              : canAfford
              ? 'rgba(0,212,255,0.05)'
              : 'rgba(255,255,255,0.02)',
            cursor: isBought ? 'default' : canAfford ? 'pointer' : 'not-allowed',
            opacity: isBought ? 0.7 : canAfford ? 1 : 0.45,
            transition: 'all 0.2s ease',
            animation: 'up-unlock 0.3s ease-out',
          };

          const nameStyle: React.CSSProperties = {
            fontFamily: 'system-ui, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: isBought ? '#00ff88' : '#e6edf3',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          };

          const descStyle: React.CSSProperties = {
            fontFamily: 'system-ui, sans-serif',
            fontSize: '11px',
            color: '#7a8a99',
            marginBottom: '6px',
            lineHeight: '1.4',
          };

          const costStyle: React.CSSProperties = {
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            color: isBought ? '#556677' : canAfford ? '#00ff88' : '#ff4444',
            fontWeight: 600,
          };

          return (
            <div
              key={u.id}
              style={cardStyle}
              onClick={() => !isBought && canAfford && buyUpgrade(u.id)}
            >
              <div style={nameStyle}>
                {isBought && (
                  <span style={{ color: '#00ff88', fontSize: '14px' }}>&#x2713;</span>
                )}
                {u.name}
              </div>
              <div style={descStyle}>{u.description}</div>
              <div style={costStyle}>
                {isBought ? 'Purchased' : `${formatNumber(u.cost)} DP`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradePanel;
