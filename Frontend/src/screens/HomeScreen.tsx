// src/screens/HomeScreen.tsx
import { useState, useEffect } from 'react';
import BottomNav from '../components/preloved/BottomNav';
import { products, formatRupiah } from '../data/preloved';
import NotificationBell from '../components/NotificationBell';
import sepatuIcon from '../assets/sepatu-icon.png';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface HomeScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

// Filter untuk warna hijau tua (#2C4533)
const GREEN_FILTER = 'brightness(0) saturate(100%) invert(13%) sepia(14%) saturate(1120%) hue-rotate(80deg) brightness(95%) contrast(85%)';
// Filter untuk warna putih (#FFFFFF)
const WHITE_FILTER = 'brightness(0) saturate(100%) invert(100%)';

// Fungsi untuk mendapatkan daftar favorit dari localStorage
const getFavoriteIds = (): number[] => {
  try {
    const raw = localStorage.getItem('preloved-favorites');
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
};

// Fungsi untuk menyimpan daftar favorit ke localStorage
const saveFavoriteIds = (ids: number[]) => {
  try {
    localStorage.setItem('preloved-favorites', JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

// Fungsi untuk toggle favorit
const toggleFavorite = (productId: number): number[] => {
  const currentFavorites = getFavoriteIds();
  const index = currentFavorites.indexOf(productId);
  
  if (index === -1) {
    const newFavorites = [...currentFavorites, productId];
    saveFavoriteIds(newFavorites);
    return newFavorites;
  } else {
    const newFavorites = currentFavorites.filter(id => id !== productId);
    saveFavoriteIds(newFavorites);
    return newFavorites;
  }
};

const categoryIcons: Record<string, React.ReactNode> = {
  Pakaian: (
    <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l3-2 3 2"/>
      <path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
    </svg>
  ),
  Tas: (
    <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8V6a4 4 0 018 0v2"/>
      <rect x="4" y="8" width="16" height="12" rx="2"/>
    </svg>
  ),
  Sepatu: (
    <img 
      src={sepatuIcon} 
      alt="Sepatu" 
      style={{ 
        width: 18, 
        height: 18, 
        objectFit: 'contain',
        display: 'block',
        filter: `${GREEN_FILTER} drop-shadow(0 0 0.3px #2C4533) drop-shadow(0 0 0.3px #2C4533)`,
      }} 
    />
  ),
  Aksesoris: (
    <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
};

const productIcons: Record<string, React.ReactNode> = {
  Pakaian: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l3-2 3 2"/><path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/></svg>,
  Tas: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8V6a4 4 0 018 0v2"/><rect x="4" y="8" width="16" height="12" rx="2"/></svg>,
  Sepatu: (
    <img 
      src={sepatuIcon} 
      alt="Sepatu" 
      style={{ 
        width: 18, 
        height: 18, 
        objectFit: 'contain',
        display: 'block',
        filter: `${GREEN_FILTER} drop-shadow(0 0 0.3px #2C4533) drop-shadow(0 0 0.3px #2C4533)`,
      }} 
    />
  ),
  Aksesoris: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>,
};

const cats = ['Semua', 'Pakaian', 'Tas', 'Sepatu', 'Aksesoris'];

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [liked, setLiked] = useState<Set<number>>(new Set());

  // Load favorit dari localStorage saat komponen mount
  useEffect(() => {
    const favorites = getFavoriteIds();
    setLiked(new Set(favorites));
  }, []);

  // Filter produk berdasarkan kategori
  const filteredProducts = activeCategory === 'Semua'
    ? products
    : products.filter(p => p.category === activeCategory);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Toggle favorit di localStorage
    const newFavorites = toggleFavorite(id);
    // Update state
    setLiked(new Set(newFavorites));
  };

  // Fungsi untuk mendapatkan icon sepatu dengan warna yang sesuai dan garis lebih tebal
  const getSepatuIcon = (isActive: boolean) => {
    const color = isActive ? '#FFFFFF' : '#2C4533';
    const filter = isActive ? WHITE_FILTER : GREEN_FILTER;
    return (
      <img 
        src={sepatuIcon} 
        alt="Sepatu" 
        style={{ 
          width: 18, 
          height: 18, 
          objectFit: 'contain',
          display: 'block',
          filter: `${filter} drop-shadow(0 0 0.3px ${color}) drop-shadow(0 0 0.3px ${color})`,
        }} 
      />
    );
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '12px 14px 14px' }}>
        {/* Search + Bell */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div 
            onClick={() => onNavigate(11)}
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              background: '#fff', 
              border: '1px solid #DED5C3', 
              borderRadius: 999, 
              padding: '8px 14px', 
              color: '#8A8475', 
              fontSize: 12, 
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
            }}
          >
            <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            Cari barang preloved
          </div>
          
          {/* Notification Bell */}
          <NotificationBell onNavigate={onNavigate} />
        </div>

        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #2C4533, #3F6048)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 500, margin: '0 0 4px', lineHeight: 1.3 }}>
              Temukan barang<br />favoritmu di sini!
            </p>
            <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '3px 8px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
              600+ produk preloved
            </span>
          </div>
          <svg width="44" viewBox="0 0 60 70" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 10c0-6 8-6 8 0s-8 6-8 0z"/>
            <path d="M30 10 L30 22"/>
            <path d="M30 22 C30 22 8 30 6 46 C4 56 14 58 24 54 L30 50 L36 54 C46 58 56 56 54 46 C52 30 30 22 30 22 Z"/>
          </svg>
        </div>

        {/* Categories - Bisa diklik */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4, marginBottom: 16 }}>
          {cats.map(cat => (
            <div 
              key={cat} 
              onClick={() => {
                if (cat === 'Semua') {
                  setActiveCategory('Semua');
                } else {
                  setActiveCategory(cat);
                }
              }} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 4, 
                cursor: 'pointer' 
              }}
            >
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 12, 
                background: activeCategory === cat ? '#2C4533' : '#fff', 
                border: `1px solid ${activeCategory === cat ? '#2C4533' : '#DED5C3'}`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: activeCategory === cat ? '#fff' : '#2C4533', 
                transition: 'all .15s' 
              }}>
                {cat === 'Semua'
                  ? <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>
                  : cat === 'Sepatu' 
                    ? getSepatuIcon(activeCategory === 'Sepatu')
                    : categoryIcons[cat]
                }
              </div>
              <span style={{ 
                fontSize: 9, 
                fontWeight: 600, 
                color: activeCategory === cat ? '#2C4533' : '#232A22', 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                textAlign: 'center' 
              }}>
                {cat}
              </span>
            </div>
          ))}
        </div>

        {/* Products */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 600, margin: 0, color: '#2C4533' }}>
            {activeCategory === 'Semua' ? 'Rekomendasi untukmu' : activeCategory}
          </h3>
          <span style={{ fontSize: 10, color: '#C68B59', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {filteredProducts.length} produk
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => onNavigate(4, { productId: p.id })}
              style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
            >
              <div style={{ aspectRatio: '1/1', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', color: p.iconColor }}>
                <div style={{ width: '32%' }}>
                  {p.category === 'Sepatu' 
                    ? <img 
                        src={sepatuIcon} 
                        alt="Sepatu" 
                        style={{ 
                          width: 18, 
                          height: 18, 
                          objectFit: 'contain',
                          display: 'block',
                          filter: `${GREEN_FILTER} drop-shadow(0 0 0.3px #2C4533) drop-shadow(0 0 0.3px #2C4533)`,
                        }} 
                      />
                    : (productIcons[p.category] ?? productIcons['Pakaian'])
                  }
                </div>
                <button
                  onClick={(e) => toggleLike(p.id, e)}
                  style={{ 
                    position: 'absolute', 
                    top: 6, 
                    right: 6, 
                    width: 22, 
                    height: 22, 
                    borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.92)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: liked.has(p.id) ? '#C1543C' : '#8A8475',
                    transition: 'all 0.2s',
                    transform: liked.has(p.id) ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <svg width="11" viewBox="0 0 24 24" fill={liked.has(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s-7-4.5-9.5-9C.7 8.4 2.4 5 6 5c2 0 3.3 1 4 2.2C10.7 6 12 5 14 5c3.6 0 5.3 3.4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/>
                  </svg>
                </button>
              </div>
              <div style={{ padding: '6px 8px 8px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: '#232A22', marginBottom: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#C1543C', fontFamily: "'Fraunces', serif", marginBottom: 3 }}>{formatRupiah(p.price)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.seller}</span>
                  <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#DED5C3', display: 'block' }}></span>
                  <span style={{ fontSize: 8, background: '#E7EEE3', color: '#2C4533', fontWeight: 700, borderRadius: 999, padding: '1px 5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.condition}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active={2} onNavigate={onNavigate} />
    </div>
  );
}