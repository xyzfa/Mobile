// src/screens/ProfilPenjualScreen.tsx
import { useState } from 'react';
import BottomNav from '../components/preloved/BottomNav';
import ScreenHeader from '../components/preloved/ScreenHeader';
import { products, formatRupiah, chatThreads } from '../data/preloved';
import { 
  Package, 
  ShoppingBag, 
  Heart, 
  ShieldCheck,
  MapPin,
  Star,
  UsersRound,
  Mail,
  Phone,
  Cake,
} from 'lucide-react';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface ProfilPenjualScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
  sellerName: string;
  sellerLocation: string;
  productId: number;
}

// Fungsi untuk mendapatkan chatId berdasarkan nama penjual
const getChatIdBySeller = (sellerName: string): number => {
  // Cari chatThreads dengan nama yang sama
  const chat = chatThreads.find(c => c.name === sellerName);
  if (chat) {
    return chat.id;
  }
  
  // Jika tidak ditemukan, coba tanpa titik
  const chatWithoutDot = chatThreads.find(c => c.name.replace(/\./g, '') === sellerName.replace(/\./g, ''));
  if (chatWithoutDot) {
    return chatWithoutDot.id;
  }
  
  // Jika masih tidak ditemukan, buat chatId baru
  const newId = chatThreads.length > 0 ? Math.max(...chatThreads.map(c => c.id)) + 1 : 1;
  
  // Buat thread chat baru
  const newThread = {
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
  return newId;
};

const quickStats = [
  { label: 'Dijual', value: '12', icon: Package },
  { label: 'Dibeli', value: '5', icon: ShoppingBag },
  { label: 'Favorit', value: '3', icon: Heart },
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function ProfilPenjualScreen({ 
  onNavigate, 
  sellerName, 
  sellerLocation,
  productId 
}: ProfilPenjualScreenProps) {
  // Cari produk lain dari penjual yang sama
  const sellerProducts = products.filter(p => p.seller === sellerName && p.id !== productId);
  const sellerRating = '4.9';
  const totalReviews = '32';

  // Handle chat penjual
  const handleChatPenjual = () => {
    const chatId = getChatIdBySeller(sellerName);
    console.log(`Chat dengan penjual: ${sellerName} (chatId: ${chatId})`);
    onNavigate(61, { chatId });
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Profil Penjual" onBack={() => onNavigate(4, { productId })} />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        {/* Profile Card */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(44, 69, 51, 0.08)',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              padding: '18px 16px',
              background: 'linear-gradient(135deg, #2C4533 0%, #496B4B 62%, #C68B59 100%)',
              color: '#fff',
            }}
          >
            <p
              style={{
                margin: '0 0 9px',
                color: '#EFE6D2',
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: 0,
                textTransform: 'uppercase',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Penjual
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#F7F3EC',
                  color: '#2C4533',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: '0 8px 18px rgba(0, 0, 0, 0.12)',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {getInitials(sellerName)}
              </div>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    margin: 0,
                    color: '#fff',
                    fontSize: 18,
                    lineHeight: 1.2,
                    fontWeight: 700,
                    fontFamily: "'Fraunces', serif",
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sellerName}
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 5,
                    color: '#F7E7D6',
                    fontSize: 11.5,
                    fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <ShieldCheck size={14} strokeWidth={2.2} />
                  Penjual Terverifikasi
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '12px 16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              color: '#8A8475',
              fontSize: 12.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <MapPin size={14} strokeWidth={2} />
              <span>{sellerLocation}</span>
              <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#DED5C3' }}></span>
              <Star size={14} strokeWidth={2} color="#C68B59" fill="#C68B59" />
              <span style={{ fontWeight: 600, color: '#232A22' }}>{sellerRating}</span>
              <span>({totalReviews} ulasan)</span>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: 14,
            padding: '13px 0',
            display: 'flex',
            marginBottom: 14,
          }}
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  borderRight: index < quickStats.length - 1 ? '1px solid #DED5C3' : 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <Icon size={16} color="#C68B59" strokeWidth={2.2} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, color: '#2C4533', marginTop: 3 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: '#8A8475', marginTop: 1 }}>{stat.label}</div>
              </div>
            );
          })}
        </section>

        {/* Profile Details */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: 16,
            padding: 15,
            marginBottom: 14,
          }}
        >
          <h2 style={{ 
            margin: '0 0 12px', 
            color: '#2C4533', 
            fontSize: 16, 
            fontWeight: 700, 
            fontFamily: "'Fraunces', serif" 
          }}>
            Detail Penjual
          </h2>
          
          <div style={{ display: 'grid', gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#232A22', fontSize: 12.3 }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UsersRound size={15} strokeWidth={2.2} />
              </span>
              <span style={{ color: '#8A8475', flex: 1 }}>Jenis kelamin</span>
              <strong style={{ color: '#232A22', fontSize: 12, textAlign: 'right' }}>Laki-laki</strong>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#232A22', fontSize: 12.3 }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Cake size={15} strokeWidth={2.2} />
              </span>
              <span style={{ color: '#8A8475', flex: 1 }}>Tanggal lahir</span>
              <strong style={{ color: '#232A22', fontSize: 12, textAlign: 'right' }}>15 Jan 1990</strong>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#232A22', fontSize: 12.3 }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={15} strokeWidth={2.2} />
              </span>
              <span style={{ color: '#8A8475', flex: 1 }}>No handphone</span>
              <strong style={{ color: '#232A22', fontSize: 12, textAlign: 'right' }}>0812-3456-7890</strong>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#232A22', fontSize: 12.3 }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={15} strokeWidth={2.2} />
              </span>
              <span style={{ color: '#8A8475', flex: 1 }}>Email</span>
              <strong style={{ color: '#232A22', fontSize: 12, textAlign: 'right' }}>penjual@email.com</strong>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#232A22', fontSize: 12.3 }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={15} strokeWidth={2.2} />
              </span>
              <span style={{ color: '#8A8475', flex: 1 }}>Domisili</span>
              <strong style={{ color: '#232A22', fontSize: 12, textAlign: 'right' }}>{sellerLocation}</strong>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#232A22', fontSize: 12.3 }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Star size={15} strokeWidth={2.2} />
              </span>
              <span style={{ color: '#8A8475', flex: 1 }}>Rating</span>
              <strong style={{ color: '#232A22', fontSize: 12, textAlign: 'right' }}>{sellerRating} dari {totalReviews} ulasan</strong>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#232A22', fontSize: 12.3 }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={15} strokeWidth={2.2} />
              </span>
              <span style={{ color: '#8A8475', flex: 1 }}>Status</span>
              <strong style={{ color: '#232A22', fontSize: 12, textAlign: 'right' }}>Member aktif sejak 2026</strong>
            </div>
          </div>
        </section>

        {/* Produk Lain dari Penjual */}
        {sellerProducts.length > 0 && (
          <section
            style={{
              background: '#fff',
              border: '1px solid #DED5C3',
              borderRadius: 16,
              padding: 15,
            }}
          >
            <h2 style={{ 
              margin: '0 0 12px', 
              color: '#2C4533', 
              fontSize: 16, 
              fontWeight: 700, 
              fontFamily: "'Fraunces', serif" 
            }}>
              Produk Lainnya
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {sellerProducts.slice(0, 4).map(p => (
                <div
                  key={p.id}
                  onClick={() => onNavigate(4, { productId: p.id })}
                  style={{ 
                    background: '#F7F3EC', 
                    border: '1px solid #DED5C3', 
                    borderRadius: 10, 
                    overflow: 'hidden', 
                    cursor: 'pointer' 
                  }}
                >
                  <div style={{ 
                    aspectRatio: '1/1', 
                    background: p.bg, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: p.iconColor,
                  }}>
                    <svg style={{ width: '32%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M9 5l3-2 3 2"/><path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
                    </svg>
                  </div>
                  <div style={{ padding: '6px 8px 8px' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: '#232A22', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#C1543C', fontFamily: "'Fraunces', serif" }}>
                      {formatRupiah(p.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tombol Chat Penjual */}
        <button
          onClick={handleChatPenjual}
          style={{
            width: '100%',
            marginTop: 14,
            padding: '14px',
            borderRadius: 999,
            background: '#2C4533',
            color: '#fff',
            border: 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          💬 Chat Penjual
        </button>
      </div>

      <BottomNav active={0} onNavigate={onNavigate} />
    </div>
  );
}