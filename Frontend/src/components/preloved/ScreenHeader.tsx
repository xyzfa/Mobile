import React from 'react';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function ScreenHeader({ title, onBack, rightAction }: ScreenHeaderProps) {
  return (
    <div
      className="flex items-center justify-between shrink-0"
      style={{
        padding: '14px 18px 12px',
        background: '#fff',
        borderBottom: '1px solid #DED5C3',
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center justify-center border-none bg-none cursor-pointer"
          style={{ width: 32, height: 32, background: 'none', border: 'none', color: '#2C4533', flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <div style={{ width: 32, flexShrink: 0 }} />
      )}
      <h2
        className="flex-1 text-center m-0"
        style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: '#2C4533' }}
      >
        {title}
      </h2>
      {rightAction ? (
        rightAction
      ) : (
        <div style={{ width: 32, flexShrink: 0 }} />
      )}
    </div>
  );
}
