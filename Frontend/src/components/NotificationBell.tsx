// src/components/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { notifications, getUnreadCount, Notification, markNotificationsAsReadByChatId } from '../data/notifications';
import { getNotificationsEnabled, notificationSettingEvent } from '../data/appSettings';

interface NotificationBellProps {
  onNavigate?: (screen: number, extra?: any) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());
  const [notifList, setNotifList] = useState([...notifications]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(getNotificationsEnabled);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update unread count secara periodik
  useEffect(() => {
    const updateUnread = () => {
      setUnreadCount(getUnreadCount());
      setNotifList([...notifications]);
      setNotificationsEnabled(getNotificationsEnabled());
    };
    
    const interval = setInterval(updateUnread, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleSettingChange = () => {
      setNotificationsEnabled(getNotificationsEnabled());
    };

    window.addEventListener(notificationSettingEvent, handleSettingChange);
    window.addEventListener('storage', handleSettingChange);
    return () => {
      window.removeEventListener(notificationSettingEvent, handleSettingChange);
      window.removeEventListener('storage', handleSettingChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification: Notification) => {
    const notif = notifications.find(n => n.id === notification.id);
    if (notif) notif.isRead = true;

    if (notification.orderId) {
      onNavigate(19); // Navigasi ke Pesanan Saya
      return;
    }
    
    setUnreadCount(getUnreadCount());
    setNotifList([...notifications]);
    setIsOpen(false);
    
    if (onNavigate) {
      if (notification.chatId) {
        markNotificationsAsReadByChatId(notification.chatId);
        onNavigate(61, { chatId: notification.chatId });
      } else if (notification.productId) {
        onNavigate(4, { productId: notification.productId });
      } else {
        onNavigate(12);
      }
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(n => { n.isRead = true; });
    setUnreadCount(0);
    setNotifList([...notifications]);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(12);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return '🛍️ Pesanan';
      case 'message': return '💬 Pesan';
      case 'promo': return '🎉 Promo';
      case 'system': return '⚙️ Sistem';
      default: return '';
    }
  };

  // Ambil 3 notifikasi terbaru yang belum dibaca
  const recentNotifs = notifList.filter(n => !n.isRead).slice(0, 3);
  const hasUnread = recentNotifs.length > 0;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Tombol Bell */}
      <button
        onClick={toggleDropdown}
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: '#fff',
          border: '1px solid #DED5C3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#2C4533',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F0EDE6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
        }}
      >
        <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8a6 6 0 0112 0c0 4 1.5 5.5 1.5 6.5H4.5C4.5 13.5 6 12 6 8z"/>
          <path d="M9.5 18a2.5 2.5 0 005 0"/>
        </svg>

        {!notificationsEnabled && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ position: 'absolute', inset: 7, pointerEvents: 'none' }}
          >
            <path d="M19 5L5 19" />
          </svg>
        )}

        {notificationsEnabled && unreadCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#E74C3C',
              color: '#fff',
              fontSize: 9,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown Notifikasi */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 320,
            maxHeight: 380,
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #DED5C3',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #F0EDE6',
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#232A22' }}>
              Notifikasi
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  fontSize: 11,
                  color: '#C68B59',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Tandai semua
              </button>
            )}
          </div>

          {/* Daftar Notifikasi */}
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {!notificationsEnabled ? (
              <div style={{ 
                padding: '30px 16px', 
                textAlign: 'center',
              }}>
                <p style={{ 
                  fontSize: 13, 
                  color: '#8A8475',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  Notifikasi sedang disenyapkan
                </p>
              </div>
            ) : !hasUnread ? (
              // Tampilan saat tidak ada notifikasi
              <div style={{ 
                padding: '30px 16px', 
                textAlign: 'center',
              }}>
                <p style={{ 
                  fontSize: 13, 
                  color: '#8A8475',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  Tidak ada notifikasi
                </p>
              </div>
            ) : (
              recentNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 16px',
                    borderBottom: '1px solid #F5F2EB',
                    cursor: 'pointer',
                    background: '#F5F9F0',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F0EDE6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F5F9F0';
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#E74C3C',
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#232A22' }}>
                        {notif.title}
                      </span>
                      <span style={{ 
                        fontSize: 8, 
                        color: '#2C4533',
                        background: '#E7EEE3',
                        padding: '1px 6px',
                        borderRadius: 999,
                      }}>
                        {getTypeLabel(notif.type)}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: '#6B6B6B', margin: 0, lineHeight: 1.3 }}>
                      {notif.message.length > 50 ? notif.message.substring(0, 50) + '...' : notif.message}
                    </p>
                    <span style={{ fontSize: 9, color: '#B0A99A', display: 'block', marginTop: 2 }}>
                      {notif.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Lihat Semua */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid #F0EDE6',
            textAlign: 'center',
          }}>
            <button
              onClick={handleViewAll}
              style={{
                fontSize: 12,
                color: '#2C4533',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                width: '100%',
              }}
            >
              Lihat semua pesan masuk →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
