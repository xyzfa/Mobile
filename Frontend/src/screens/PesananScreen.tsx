// src/screens/PesananScreen.tsx
import { useState } from 'react';
import BottomNav from '../components/preloved/BottomNav';
import ScreenHeader from '../components/preloved/ScreenHeader';
import { orders, formatRupiah } from '../data/preloved';
import { getSavedProfile } from '../data/profile';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface PesananScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

const statusLabels: { [key: string]: { label: string; color: string; bg: string } } = {
  pending: { label: 'Menunggu', color: '#C68B59', bg: '#FDF3E8' },
  paid: { label: 'Dibayar', color: '#2C4533', bg: '#E7EEE3' },
  shipped: { label: 'Dikirim', color: '#3F6048', bg: '#E7EEE3' },
  completed: { label: 'Selesai', color: '#2C4533', bg: '#E7EEE3' },
  cancelled: { label: 'Dibatalkan', color: '#E74C3C', bg: '#FDE8E8' },
};

const tabs = ['Semua', 'Menunggu', 'Dikirim', 'Selesai'];

export default function PesananScreen({ onNavigate }: PesananScreenProps) {
  const [activeTab, setActiveTab] = useState('Semua');
  const profile = getSavedProfile();
  const userOrders = orders.filter(o => o.buyerName === profile.name);

  const getFilteredOrders = () => {
    if (activeTab === 'Semua') return userOrders;
    if (activeTab === 'Menunggu') return userOrders.filter(o => o.status === 'pending' || o.status === 'paid');
    if (activeTab === 'Dikirim') return userOrders.filter(o => o.status === 'shipped');
    if (activeTab === 'Selesai') return userOrders.filter(o => o.status === 'completed');
    return userOrders;
  };

  const filteredOrders = getFilteredOrders();

  const getStatusInfo = (status: string) => {
    return statusLabels[status] || { label: status, color: '#8A8475', bg: '#F7F3EC' };
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Pesanan Saya" onBack={() => onNavigate(8)} />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 16, borderBottom: '1px solid #DED5C3' }}>
          {tabs.map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: 13,
                fontWeight: 700,
                paddingBottom: 10,
                cursor: 'pointer',
                position: 'relative',
                color: activeTab === tab ? '#2C4533' : '#8A8475',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: '#2C4533',
                  borderRadius: 2,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #DED5C3',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <p style={{ fontSize: 14, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {activeTab === 'Semua' ? 'Belum ada pesanan' : `Tidak ada pesanan ${activeTab.toLowerCase()}`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div
                key={order.id}
                style={{
                  background: '#fff',
                  border: '1px solid #DED5C3',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 13.5,
                      color: '#232A22',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                      {order.productName}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: '#8A8475',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      marginTop: 2,
                    }}>
                      {order.orderDate}
                    </div>
                  </div>
                  <div style={{
                    padding: '2px 10px',
                    borderRadius: 999,
                    background: statusInfo.bg,
                    color: statusInfo.color,
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    {statusInfo.label}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 8,
                  borderTop: '1px solid #F0EDE6',
                }}>
                  <div>
                    <div style={{
                      fontSize: 11,
                      color: '#8A8475',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                      {order.quantity} item · {formatRupiah(order.totalPrice)}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: '#8A8475',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                      Penjual: {order.sellerName}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate(61, { chatId: order.chatId })}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: '#2C4533',
                      color: '#fff',
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    💬 Chat
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav active={8} onNavigate={onNavigate} />
    </div>
  );
}