import React, { useEffect, useState, useRef } from 'react';
import { INCIDENTS } from '../data/gameData';
import { useGameState } from '../hooks/useGameState';

const IncidentBanner: React.FC = () => {
  const activeIncident = useGameState((s) => s.activeIncident);

  const [entering, setEntering] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const prevIncidentId = useRef<string | null>(null);

  // Find the incident definition for display info
  const incidentDef = activeIncident
    ? INCIDENTS.find((i) => i.id === activeIncident.id)
    : null;

  useEffect(() => {
    if (document.getElementById('incident-banner-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'incident-banner-keyframes';
    style.textContent = `
      @keyframes ib-slideDown {
        0% { transform: translateY(-100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes ib-slideUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100%); opacity: 0; }
      }
      @keyframes ib-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.85; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Handle entrance/exit transitions
  useEffect(() => {
    if (activeIncident && activeIncident.id !== prevIncidentId.current) {
      prevIncidentId.current = activeIncident.id;
      setShowBanner(true);
      setEntering(true);
      setExiting(false);
      setTimeout(() => setEntering(false), 400);
    } else if (!activeIncident && prevIncidentId.current) {
      setExiting(true);
      setTimeout(() => {
        setShowBanner(false);
        setExiting(false);
        prevIncidentId.current = null;
      }, 400);
    }
  }, [activeIncident]);

  // Countdown timer
  useEffect(() => {
    if (!activeIncident) return;
    const update = () => {
      const remaining = Math.max(0, (activeIncident.endsAt - Date.now()) / 1000);
      setRemainingSeconds(remaining);
    };
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [activeIncident]);

  if (!showBanner || !incidentDef) return null;

  const isPositive = incidentDef.type === 'positive';
  const accentColor = isPositive ? '#00ff88' : '#ff4444';
  const bgColor = isPositive
    ? 'rgba(0,255,136,0.08)'
    : 'rgba(255,68,68,0.08)';
  const borderColor = isPositive
    ? 'rgba(0,255,136,0.3)'
    : 'rgba(255,68,68,0.3)';
  const glowColor = isPositive
    ? 'rgba(0,255,136,0.15)'
    : 'rgba(255,68,68,0.15)';

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    padding: '12px 20px',
    background: bgColor,
    borderBottom: `2px solid ${borderColor}`,
    boxShadow: `0 4px 20px ${glowColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    animation: entering
      ? 'ib-slideDown 0.4s ease-out'
      : exiting
      ? 'ib-slideUp 0.4s ease-in forwards'
      : 'ib-pulse 2s ease-in-out infinite',
    overflow: 'hidden',
    flexShrink: 0,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '20px',
    flexShrink: 0,
  };

  const textStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px',
    color: '#e6edf3',
    fontWeight: 600,
  };

  const descStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    color: isPositive ? '#80ffbb' : '#ff8888',
    marginLeft: '8px',
  };

  const timerStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '14px',
    fontWeight: 700,
    color: accentColor,
    minWidth: '36px',
    textAlign: 'center',
    flexShrink: 0,
  };

  const progressBarContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'rgba(255,255,255,0.05)',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    background: accentColor,
    width: `${(remainingSeconds / incidentDef.duration) * 100}%`,
    transition: 'width 0.2s linear',
    borderRadius: '0 2px 2px 0',
    boxShadow: `0 0 8px ${accentColor}`,
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>{isPositive ? '\u26A1' : '\u26A0\uFE0F'}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
        }}
      >
        <span style={textStyle}>{incidentDef.name}</span>
        <span style={descStyle}>{incidentDef.description}</span>
      </div>
      <div style={timerStyle}>{Math.ceil(remainingSeconds)}s</div>
      <div style={progressBarContainerStyle}>
        <div style={progressFillStyle} />
      </div>
    </div>
  );
};

export default IncidentBanner;
