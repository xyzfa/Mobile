// src/screens/NotificationScreen.tsx
import React, { useState } from 'react';
import { notifications, Notification, markNotificationsAsReadByChatId, markNotificationsAsReadByProductId } from '../data/notifications';

interface NotificationScreenProps {
  onNavigate: (screen: number, extra?: any) => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onNavigate }) => {
  const [notifList, setNotifList] = useState([...notifications]);

  const markAllAsRead = () => {
    const updatedList = notifList.map(n => ({ ...n, isRead: true }));
    setNotifList(updatedList);
    // Update data global
    notifications.forEach(n => { n.isRead = true; });
  };

  const markAsRead = (id: number) => {
    const updatedList = notifList.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifList(updatedList);
    // Update data global
    const notif = notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Jika notifikasi memiliki chatId, navigasi ke chat dan tandai semua notifikasi dengan chatId yang sama
    if (notification.chatId) {
      markNotificationsAsReadByChatId(notification.chatId);
      // Update list
      const updatedList = notifications.map(n => ({ ...n }));
      setNotifList(updatedList);
      onNavigate(61, { chatId: notification.chatId });
    } else if (notification.productId) {
      markNotificationsAsReadByProductId(notification.productId);
      const updatedList = notifications.map(n => ({ ...n }));
      setNotifList(updatedList);
      onNavigate(4, { productId: notification.productId });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return '#2C4533';
      case 'message': return '#3F6048';
      case 'promo': return '#C68B59';
      case 'system': return '#8A8475';
      default: return '#2C4533';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return '🛍️';
      case 'message': return '💬';
      case 'promo': return '🎉';
      case 'system': return '⚙️';
      default: return '📌';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return 'Pesanan';
      case 'message': return 'Pesan';
      case 'promo': return 'Promo';
      case 'system': return 'Sistem';
      default: return '';
    }
  };

  // Hitung ulang unread count
  const unreadCount = notifList.filter(n => !n.isRead).length;

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => onNavigate(2)}
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
            Pesan Masuk
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                marginLeft: 'auto',
                fontSize: 11,
                color: '#C68B59',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Tandai semua
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifList.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #DED5C3',
            }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>🔔</span>
              <p style={{ fontSize: 14, color: '#8A8475' }}>Tidak ada notifikasi</p>
            </div>
          ) : (
            notifList.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 14px',
                  background: notif.isRead ? '#fff' : '#F5F9F0',
                  borderRadius: 10,
                  border: '1px solid #DED5C3',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C68B59';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#DED5C3';
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: `${getTypeColor(notif.type)}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 16,
                }}>
                  {getTypeIcon(notif.type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#232A22' }}>
                        {notif.title}
                      </span>
                      {!notif.isRead && (
                        <div style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#E74C3C',
                          flexShrink: 0,
                        }} />
                      )}
                    </div>
                    <span style={{ 
                      fontSize: 9, 
                      color: getTypeColor(notif.type),
                      background: `${getTypeColor(notif.type)}15`,
                      padding: '1px 8px',
                      borderRadius: 999,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                      {getTypeLabel(notif.type)}
                    </span>
                  </div>
                  <p style={{ 
                    fontSize: 12, 
                    color: '#6B6B6B', 
                    margin: 0, 
                    lineHeight: 1.4,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    {notif.message}
                  </p>
                  <span style={{ 
                    fontSize: 10, 
                    color: '#B0A99A', 
                    display: 'block', 
                    marginTop: 4,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    {notif.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationScreen;