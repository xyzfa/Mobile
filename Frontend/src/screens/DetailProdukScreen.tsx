// src/screens/DetailProdukScreen.tsx
import React, { useState, useEffect } from 'react';
import { products, formatRupiah, chatThreads, ChatThread } from '../data/preloved';
import BottomNav from '../components/preloved/BottomNav';

type NavigateExtra = { productId?: number; chatId?: number; from?: number; sellerName?: string; sellerLocation?: string };

interface DetailProdukScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
  productId: number;
  prevScreen: number;
  onBack?: () => void;
}

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

// Fungsi untuk cek apakah produk favorit
const isFavorite = (productId: number): boolean => {
  return getFavoriteIds().includes(productId);
};

// Fungsi untuk mendapatkan chatId berdasarkan nama penjual
const getChatIdBySeller = (sellerName: string): number => {
  // Log semua chatThreads untuk debugging
  console.log('=== CHAT DEBUG ===');
  console.log('Mencari chat untuk penjual:', sellerName);
  console.log('Daftar chatThreads yang tersedia:');
  chatThreads.forEach(t => console.log(`  - ${t.name} (ID: ${t.id})`));
  
  // Cari chatThreads dengan nama yang sama persis
  const chat = chatThreads.find(c => c.name === sellerName);
  if (chat) {
    console.log(`✅ Ditemukan chat untuk ${sellerName} dengan ID: ${chat.id}`);
    return chat.id;
  }
  
  // Jika tidak ditemukan, coba cari dengan nama yang mirip (tanpa titik)
  const chatWithoutDot = chatThreads.find(c => c.name.replace(/\./g, '') === sellerName.replace(/\./g, ''));
  if (chatWithoutDot) {
    console.log(`✅ Ditemukan chat (tanpa titik) untuk ${sellerName} dengan ID: ${chatWithoutDot.id}`);
    return chatWithoutDot.id;
  }
  
  // Jika masih tidak ditemukan, buat chatId baru
  const newId = chatThreads.length > 0 ? Math.max(...chatThreads.map(c => c.id)) + 1 : 1;
  
  // Buat thread chat baru
  const newThread: ChatThread = {
    id: newId,
    name: sellerName,
    product: 'Belum ada produk',
    lastMsg: 'Mulai chat dengan penjual',
    time: 'Sekarang',
    unread: 0,
    isMuted: false,
    isArchived: false,
    messages: [],
  };
  
  chatThreads.push(newThread);
  console.log(`🆕 Membuat chat baru untuk ${sellerName} dengan ID: ${newId}`);
  return newId;
};

export default function DetailProdukScreen({ 
  onNavigate, 
  productId, 
  prevScreen, 
  onBack 
}: DetailProdukScreenProps) {
  const [liked, setLiked] = useState(false);
  const [sourceScreen, setSourceScreen] = useState<number>(prevScreen);
  const [hasBeenToCheckout, setHasBeenToCheckout] = useState(false);
  
  const product = products.find(p => p.id === productId);
  
  useEffect(() => {
    setLiked(isFavorite(productId));
  }, [productId]);
  
  useEffect(() => {
    console.log('DetailProduk - prevScreen changed:', prevScreen);
    if (prevScreen === 7) {
      console.log('DetailProduk - User kembali dari Checkout, set hasBeenToCheckout = true');
      setHasBeenToCheckout(true);
    }
    setSourceScreen(prevScreen);
  }, [prevScreen]);
  
  if (!product) {
    return (
      <div className="screen-enter flex flex-col flex-1 items-center justify-center" style={{ background: '#F7F3EC' }}>
        <p style={{ color: '#8A8475' }}>Produk tidak ditemukan</p>
        <button onClick={() => onNavigate(2)} style={{ marginTop: 10, color: '#2C4533' }}>Kembali</button>
      </div>
    );
  }

  const handleBack = () => {
    console.log('DetailProduk - handleBack called');
    console.log('DetailProduk - hasBeenToCheckout:', hasBeenToCheckout);
    console.log('DetailProduk - sourceScreen:', sourceScreen);
    
    if (onBack) {
      console.log('DetailProduk - using onBack from parent');
      onBack();
      return;
    }
    
    if (hasBeenToCheckout) {
      console.log('DetailProduk - hasBeenToCheckout true, going to Home (2)');
      onNavigate(2);
      return;
    }
    
    if (sourceScreen === 7) {
      console.log('DetailProduk - sourceScreen is 7, going to Home (2)');
      onNavigate(2);
      return;
    }
    
    if (sourceScreen === 3) {
      console.log('DetailProduk - sourceScreen is 3, going to Kategori (3)');
      onNavigate(3);
      return;
    }
    
    if (sourceScreen === 2) {
      console.log('DetailProduk - sourceScreen is 2, going to Home (2)');
      onNavigate(2);
      return;
    }
    
    console.log('DetailProduk - default, going to sourceScreen:', sourceScreen);
    onNavigate(sourceScreen);
  };


  const handleBottomNav = (screen: number, extra?: any) => {
    onNavigate(screen, extra);
  };

  const handleLikeToggle = () => {
    const newFavorites = toggleFavorite(productId);
    setLiked(newFavorites.includes(productId));
  };

  const handleChatPenjual = () => {
    const chatId = getChatIdBySeller(product.seller);
    console.log(`📱 Navigasi ke chat dengan ${product.seller} (chatId: ${chatId})`);
    console.log('==================');
    onNavigate(61, { chatId });
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '12px 14px 14px' }}>
        {/* Header dengan tombol Back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            onClick={handleBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#fff',
              border: '1px solid #DED5C3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              color: '#2C4533',
            }}
          >
            <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 style={{ 
            fontFamily: "'Fraunces', serif", 
            fontSize: 18, 
            fontWeight: 600, 
            color: '#2C4533', 
            margin: 0 
          }}>
            Detail Produk
          </h2>
          <div style={{ width: 38 }} />
        </div>

        {/* Product Image */}
        <div style={{ 
          width: '100%', 
          aspectRatio: '1/1', 
          background: product.bg, 
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          position: 'relative',
        }}>
          <div style={{ width: '40%', color: product.iconColor }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 5l3-2 3 2"/>
              <path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
            </svg>
          </div>
          <button
            onClick={handleLikeToggle}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: liked ? '#C1543C' : '#8A8475',
              transition: 'all 0.2s',
              transform: liked ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <svg width="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-4.5-9.5-9C.7 8.4 2.4 5 6 5c2 0 3.3 1 4 2.2C10.7 6 12 5 14 5c3.6 0 5.3 3.4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/>
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <h1 style={{ 
          fontFamily: "'Fraunces', serif", 
          fontSize: 20, 
          fontWeight: 600, 
          color: '#232A22',
          margin: '0 0 4px',
        }}>
          {product.name}
        </h1>
        <p style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: '#C1543C',
          fontFamily: "'Fraunces', serif",
          margin: '0 0 8px',
        }}>
          {formatRupiah(product.price)}
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4, 
          marginBottom: 16,
          fontSize: 12,
          color: '#8A8475',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <span>☉ {product.location}</span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#DED5C3' }}></span>
          <span>{product.timeAgo}</span>
        </div>

        {/* Seller Info */}
        <div style={{
          padding: '12px 16px',
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #DED5C3',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#E7EEE3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2C4533',
            }}>
              <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#232A22' }}>
                {product.seller}
              </div>
              <div style={{ fontSize: 12, color: '#8A8475' }}>
                Penjual · {product.location}
              </div>
            </div>
            <button
              onClick={() => {
                console.log('Navigasi ke Profil Penjual:', product.seller);
                onNavigate(18, { 
                  sellerName: product.seller, 
                  sellerLocation: product.location,
                  productId: product.id 
                });
              }}
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: '#2C4533',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: 8,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F7F3EC'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Lihat profil
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ 
            fontFamily: "'Fraunces', serif", 
            fontSize: 14, 
            fontWeight: 600, 
            color: '#2C4533',
            margin: '0 0 8px',
          }}>
            Deskripsi
          </h3>
          <p style={{ 
            fontSize: 13, 
            color: '#6B6B6B', 
            lineHeight: 1.6,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {product.description}
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {product.tags.map((tag, index) => (
            <span key={index} style={{
              padding: '4px 12px',
              background: '#E7EEE3',
              borderRadius: 999,
              fontSize: 11,
              color: '#2C4533',
              fontWeight: 600,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Tombol Chat Penjual & Beli Sekarang */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            onClick={handleChatPenjual}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 999,
              background: '#fff',
              border: '2px solid #2C4533',
              color: '#2C4533',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Chat Penjual
          </button>
          <button
            onClick={() => {
              console.log('DetailProduk - User klik Beli Sekarang, set hasBeenToCheckout = true');
              setHasBeenToCheckout(true);
              onNavigate(7, { productId: product.id });
            }}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 999,
              background: '#2C4533',
              border: 'none',
              color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Beli Sekarang
          </button>
        </div>
      </div>
      <BottomNav active={0} onNavigate={onNavigate} />
    </div>
  );
}