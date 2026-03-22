import React, { useState, useEffect, useRef } from 'react';
import ClickArea from './components/ClickArea';
import BuildingShop from './components/BuildingShop';
import UpgradePanel from './components/UpgradePanel';
import StatsPanel from './components/StatsPanel';
import AchievementToast from './components/AchievementToast';
import IncidentBanner from './components/IncidentBanner';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';

const GLOBAL_CSS = `
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 8px rgba(0, 255, 136, 0.3); }
    50% { box-shadow: 0 0 24px rgba(0, 255, 136, 0.6); }
  }
  @keyframes float-up {
    0% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-60px); }
  }
  @keyframes slide-in-right {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slide-in-top {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
`;

type Tab = 'buildings' | 'upgrades';

const App: React.FC = () => {
  useGameLoop();
  const [tab, setTab] = useState<Tab>('buildings');
  const [toastAchId, setToastAchId] = useState<string | null>(null);

  const achievements = useGameState(s => s.achievements);

  // Watch for new achievements
  const prevAchCount = useRef(achievements.length);
  useEffect(() => {
    if (achievements.length > prevAchCount.current) {
      const newestId = achievements[achievements.length - 1];
      setToastAchId(newestId);
      setTimeout(() => setToastAchId(null), 4000);
    }
    prevAchCount.current = achievements.length;
  }, [achievements]);

  return (
    <div style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#0d1117', overflow: 'hidden',
    }}>
      <style>{GLOBAL_CSS}</style>

      <IncidentBanner />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Click Area + Stats */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', minWidth: 0,
        }}>
          <StatsPanel />
          <ClickArea />
        </div>

        {/* Right: Shop Panel */}
        <div style={{
          width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(13, 17, 23, 0.95)',
        }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {(['buildings', 'upgrades'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer',
                  background: tab === t ? 'rgba(0, 255, 136, 0.06)' : 'transparent',
                  borderBottom: tab === t ? '2px solid #00ff88' : '2px solid transparent',
                  color: tab === t ? '#00ff88' : '#6e7681',
                  fontSize: 12, fontWeight: 700, letterSpacing: 1,
                  textTransform: 'uppercase', fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                {t === 'buildings' ? '🏗️ Buildings' : '⬆️ Upgrades'}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {tab === 'buildings' && <BuildingShop />}
            {tab === 'upgrades' && <UpgradePanel />}
          </div>
        </div>
      </div>

      {toastAchId && <AchievementToast achievementId={toastAchId} />}
    </div>
  );
};

export default App;
