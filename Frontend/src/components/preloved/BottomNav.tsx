type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface BottomNavProps {
  active: number;
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  const navItem = (screen: number, label: string, icon: React.ReactNode, isCenter = false) => {
    const isActive = active === screen;
    if (isCenter) {
      return (
        <button
          key={screen}
          onClick={() => onNavigate(screen)}
          className="flex flex-1 flex-col items-center gap-[3px] border-none bg-transparent font-[600] text-[10.5px] cursor-pointer"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: isActive ? '#C1543C' : '#8A8475' }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-[1px]"
            style={{
              width: 38, height: 38,
              background: isActive ? '#C1543C' : '#2C4533',
              color: '#fff'
            }}
          >
            <svg width="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          {label}
        </button>
      );
    }
    return (
      <button
        key={screen}
        onClick={() => onNavigate(screen)}
        className="flex flex-1 flex-col items-center gap-[3px] border-none bg-transparent font-[600] text-[10.5px] cursor-pointer"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: isActive ? '#2C4533' : '#8A8475' }}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <nav
      className="flex shrink-0"
      style={{ background: '#fff', borderTop: '1px solid #DED5C3', padding: '9px 6px 12px' }}
    >
      {navItem(2, 'Beranda',
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" />
        </svg>
      )}
      {navItem(3, 'Kategori',
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      )}
      {navItem(5, 'Jual', null, true)}
      {navItem(6, 'Chat',
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.5 8.5 0 11-3.7-7" /><path d="M21 11.5L4 19l3-7.5" />
        </svg>
      )}
      {navItem(8, 'Akun',
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
        </svg>
      )}
    </nav>
  );
}
