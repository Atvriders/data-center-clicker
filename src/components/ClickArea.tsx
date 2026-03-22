import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber } from '../data/gameData';
import { useGameState } from '../hooks/useGameState';

interface FloatingText {
  id: number;
  value: number;
  x: number;
  y: number;
}

let floatId = 0;

const ClickArea: React.FC = () => {
  const dp = useGameState((s) => s.dp);
  const dpPerSecond = useGameState((s) => s.dpPerSecond);
  const dpPerClick = useGameState((s) => s.dpPerClick);
  const clickMultiplier = useGameState((s) => s.clickMultiplier);
  const activeIncident = useGameState((s) => s.activeIncident);
  const click = useGameState((s) => s.click);

  const [isPressed, setIsPressed] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [glowPulse, setGlowPulse] = useState(false);

  // Effective click value (including incident multiplier)
  const incidentClickMult =
    activeIncident && activeIncident.effect.type === 'clickMultiplier'
      ? activeIncident.effect.value
      : 1;
  const effectiveClickValue = dpPerClick * clickMultiplier * incidentClickMult;

  const handleClick = useCallback(() => {
    click();
    setIsPressed(true);
    setGlowPulse(true);
    setTimeout(() => setIsPressed(false), 120);
    setTimeout(() => setGlowPulse(false), 300);

    const id = ++floatId;
    const offsetX = (Math.random() - 0.5) * 80;
    const offsetY = (Math.random() - 0.5) * 30;
    setFloatingTexts((prev) => [
      ...prev,
      { id, value: effectiveClickValue, x: offsetX, y: offsetY },
    ]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((ft) => ft.id !== id));
    }, 900);
  }, [click, effectiveClickValue]);

  // Spacebar trigger
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClick]);

  // Inject keyframes once
  useEffect(() => {
    if (document.getElementById('click-area-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'click-area-keyframes';
    style.textContent = `
      @keyframes ca-floatUp {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-90px) scale(1.3); }
      }
      @keyframes ca-pulseGlow {
        0% { box-shadow: 0 0 20px rgba(0,255,136,0.3); }
        50% { box-shadow: 0 0 60px rgba(0,255,136,0.8), 0 0 120px rgba(0,255,136,0.3); }
        100% { box-shadow: 0 0 20px rgba(0,255,136,0.3); }
      }
      @keyframes ca-idleBreathe {
        0%, 100% { box-shadow: 0 0 15px rgba(0,212,255,0.2); }
        50% { box-shadow: 0 0 30px rgba(0,212,255,0.4); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    userSelect: 'none',
    position: 'relative',
    flex: 1,
  };

  const dpDisplayStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    fontSize: '48px',
    fontWeight: 700,
    color: '#00ff88',
    textShadow: '0 0 20px rgba(0,255,136,0.5)',
    marginBottom: '4px',
    letterSpacing: '-1px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '13px',
    color: '#7a8a99',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '24px',
  };

  const rateRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    marginBottom: '28px',
  };

  const rateStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '14px',
    color: '#00d4ff',
    background: 'rgba(0,212,255,0.08)',
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(0,212,255,0.15)',
  };

  const buttonStyle: React.CSSProperties = {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    border: '3px solid rgba(0,255,136,0.4)',
    background: 'radial-gradient(circle at 40% 35%, #1a2332, #0d1117)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.12s ease, border-color 0.2s ease',
    transform: isPressed ? 'scale(0.92)' : 'scale(1)',
    animation: glowPulse
      ? 'ca-pulseGlow 0.3s ease-out'
      : 'ca-idleBreathe 3s ease-in-out infinite',
    position: 'relative',
    outline: 'none',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '64px',
    marginBottom: '4px',
    filter: glowPulse ? 'brightness(1.4)' : 'brightness(1)',
    transition: 'filter 0.15s ease',
  };

  const clickLabelStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '11px',
    color: '#556677',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  const hintStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '11px',
    color: '#334455',
    marginTop: '16px',
    letterSpacing: '1px',
  };

  return (
    <div style={containerStyle}>
      {/* DP count */}
      <div style={dpDisplayStyle}>{formatNumber(dp)}</div>
      <div style={labelStyle}>Data Points</div>

      {/* Rate chips */}
      <div style={rateRowStyle}>
        <div style={rateStyle}>{formatNumber(dpPerSecond)} DP/s</div>
        <div style={rateStyle}>{formatNumber(effectiveClickValue)} DP/click</div>
      </div>

      {/* Click target */}
      <div style={{ position: 'relative' }}>
        <div
          role="button"
          tabIndex={0}
          style={buttonStyle}
          onClick={handleClick}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
        >
          <div style={iconStyle}>
            <span role="img" aria-label="server">&#x1F5A5;&#xFE0F;</span>
          </div>
          <div style={clickLabelStyle}>Click!</div>
        </div>

        {/* Floating text */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: `calc(50% + ${ft.x}px)`,
              transform: 'translateX(-50%)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '20px',
              fontWeight: 700,
              color: '#00ff88',
              textShadow: '0 0 10px rgba(0,255,136,0.7)',
              pointerEvents: 'none',
              animation: 'ca-floatUp 0.9s ease-out forwards',
              whiteSpace: 'nowrap',
            }}
          >
            +{formatNumber(ft.value)} DP
          </div>
        ))}
      </div>

      <div style={hintStyle}>[spacebar] to click</div>
    </div>
  );
};

export default ClickArea;
