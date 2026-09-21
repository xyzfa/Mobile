type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface SplashScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

export default function SplashScreen({ onNavigate }: SplashScreenProps) {
  return (
    <div className="screen-enter flex flex-col flex-1 items-center justify-center text-center" style={{ padding: '0 30px', background: '#F7F3EC' }}>
      <svg width="96" height="96" viewBox="0 0 100 100" fill="none" stroke="#2C4533" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 30 }}>
        <circle cx="50" cy="14" r="6"/>
        <path d="M50 20 L50 30"/>
        <path d="M50 30 C50 30 12 45 8 62 C6 70 14 72 22 68 L50 56 L78 68 C86 72 94 70 92 62 C88 45 50 30 50 30 Z"/>
        <path d="M74 60 a6 6 0 1 0 0.1 0"/>
      </svg>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 600, color: '#2C4533', margin: '0 0 6px' }}>
        Preloved,
      </h2>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15.5, color: '#8A8475', lineHeight: 1.5, margin: 0 }}>
        <strong style={{ color: '#232A22', fontWeight: 600 }}>good for you,</strong>
        <br />good for earth.
      </p>
      <div style={{ display: 'flex', gap: 6, margin: '34px 0 26px' }}>
        <span style={{ width: 18, height: 6, borderRadius: 4, background: '#2C4533', display: 'block' }}></span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DED5C3', display: 'block' }}></span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DED5C3', display: 'block' }}></span>
      </div>
      <button
        onClick={() => onNavigate(2)}
        style={{
          width: 220, background: '#2C4533', color: '#fff', border: 'none', borderRadius: 999,
          padding: '15px 0', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
          fontSize: 14.5, cursor: 'pointer', letterSpacing: '0.01em'
        }}
      >
        Mulai
      </button>
    </div>
  );
}
