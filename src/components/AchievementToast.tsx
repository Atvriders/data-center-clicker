import React, { useEffect, useState } from 'react';
import { ACHIEVEMENTS } from '../data/gameData';

interface AchievementToastProps {
  achievementId: string;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievementId }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);

  useEffect(() => {
    if (document.getElementById('achievement-toast-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'achievement-toast-keyframes';
    style.textContent = `
      @keyframes at-slideIn {
        0% { transform: translateX(120%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      @keyframes at-slideOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(120%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    setVisible(true);
    setExiting(false);

    const exitTimer = setTimeout(() => setExiting(true), 3500);
    const hideTimer = setTimeout(() => setVisible(false), 4000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [achievementId]);

  if (!visible || !achievement) return null;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,184,0,0.4)',
    background:
      'linear-gradient(135deg, rgba(255,184,0,0.12), rgba(255,140,0,0.06))',
    backdropFilter: 'blur(12px)',
    boxShadow:
      '0 4px 24px rgba(255,184,0,0.2), 0 0 60px rgba(255,184,0,0.08)',
    animation: exiting
      ? 'at-slideOut 0.4s ease-in forwards'
      : 'at-slideIn 0.4s ease-out',
    maxWidth: '360px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '32px',
    flexShrink: 0,
  };

  const textContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const titleLabelStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '10px',
    color: '#ffb800',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: 700,
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '15px',
    fontWeight: 700,
    color: '#ffe0a0',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    color: '#aa9060',
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>{achievement.icon}</div>
      <div style={textContainerStyle}>
        <div style={titleLabelStyle}>Achievement Unlocked</div>
        <div style={nameStyle}>{achievement.name}</div>
        <div style={descStyle}>{achievement.description}</div>
      </div>
    </div>
  );
};

export default AchievementToast;
