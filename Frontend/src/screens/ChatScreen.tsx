// src/screens/ChatScreen.tsx
import { useState, useRef, useEffect } from 'react';
import BottomNav from '../components/preloved/BottomNav';
import { chatThreads, ChatThread } from '../data/preloved';
import muteIcon from '../assets/mute-icon.png';
import { markNotificationsAsReadByChatId } from '../data/notifications';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface ChatScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

const tabs = ['Semua', 'Belum Dibalas', 'Arsip'];

// Icon Mute (senyap) - menggunakan PNG
const MuteIcon = () => (
  <img 
    src={muteIcon} 
    alt="Mute" 
    style={{ 
      width: 14, 
      height: 14, 
      objectFit: 'contain',
      display: 'block',
      filter: 'brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) brightness(100%) contrast(90%)',
    }} 
  />
);

export default function ChatScreen({ onNavigate }: ChatScreenProps) {
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [longPressIndex, setLongPressIndex] = useState<number | null>(null);
  const [showArchiveOption, setShowArchiveOption] = useState(false);
  const [chatList, setChatList] = useState<ChatThread[]>(chatThreads);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Update chat list setiap kali ada perubahan
  useEffect(() => {
    setChatList([...chatThreads]);
  }, []);

  // Cleanup timer pada unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };
  }, []);

  const getFilteredChats = () => {
    let filtered = chatList;
    
    if (activeTab === 'Belum Dibalas') {
      filtered = filtered.filter(c => c.unread > 0);
    } else if (activeTab === 'Arsip') {
      filtered = filtered.filter(c => c.isArchived);
    } else {
      filtered = filtered.filter(c => !c.isArchived);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.product.toLowerCase().includes(query) ||
        c.lastMsg.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const filteredChats = getFilteredChats();

  const handleMouseDown = (index: number) => {
    // Clear existing timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    longPressTimer.current = setTimeout(() => {
      setLongPressIndex(index);
      setShowArchiveOption(true);
    }, 600);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleArchiveChat = (chatId: number) => {
    const index = chatThreads.findIndex(c => c.id === chatId);
    if (index !== -1) {
      chatThreads[index].isArchived = !chatThreads[index].isArchived;
      setChatList([...chatThreads]);
    }
    setShowArchiveOption(false);
    setLongPressIndex(null);
  };

  const handleChatClick = (chatId: number) => {
    if (!showArchiveOption) {
      // Tandai semua notifikasi dengan chatId ini sebagai sudah dibaca
      markNotificationsAsReadByChatId(chatId);
      
      // Reset unread di chatThreads
      const index = chatThreads.findIndex(c => c.id === chatId);
      if (index !== -1) {
        chatThreads[index].unread = 0;
        setChatList([...chatThreads]);
      }
      
      onNavigate(61, { chatId: chatId });
    }
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 12px', background: '#fff', borderBottom: '1px solid #DED5C3', flexShrink: 0 }}>
        <div style={{ width: 32 }} />
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, margin: 0, color: '#2C4533', flex: 1, textAlign: 'center' }}>Chat</h2>
        <div style={{ width: 32 }} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '14px 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #DED5C3', borderRadius: 999, padding: '8px 16px', color: '#8A8475', fontSize: 13.5, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 0 }}>
          <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari percakapan"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 13.5,
              color: '#232A22',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#8A8475',
                fontSize: 16,
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 18, margin: '16px 0 6px', borderBottom: '1px solid #DED5C3' }}>
          {tabs.map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ fontSize: 13, fontWeight: 700, paddingBottom: 10, cursor: 'pointer', position: 'relative', color: activeTab === tab ? '#2C4533' : '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {tab}
              {activeTab === tab && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: '#2C4533', borderRadius: 2 }} />}
            </div>
          ))}
        </div>

        <div>
          {filteredChats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>
              {searchQuery ? 'Tidak ada percakapan yang cocok' : 'Tidak ada percakapan'}
            </div>
          ) : filteredChats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              onMouseDown={() => handleMouseDown(index)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleMouseDown(index)}
              onTouchEnd={handleMouseUp}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '13px 0', 
                borderBottom: '1px solid #DED5C3', 
                cursor: 'pointer',
                position: 'relative',
                background: longPressIndex === index && showArchiveOption ? '#F5F9F0' : 'transparent',
                borderRadius: 8,
                paddingLeft: longPressIndex === index && showArchiveOption ? 12 : 0,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {chat.name}
                </div>
                <div style={{ fontSize: 12, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 2 }}>
                  re: {chat.product}
                </div>
                <div style={{ fontSize: 12.5, color: '#8A8475', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{chat.lastMsg}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 11, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'block' }}>
                    {chat.time}
                  </span>
                  {chat.isMuted && (
                    <span style={{ 
                      color: '#8A8475',
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 2,
                    }}>
                      <MuteIcon />
                    </span>
                  )}
                </div>
                {chat.unread > 0 && (
                  <span style={{ width: 19, height: 19, borderRadius: '50%', background: '#C1543C', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                    {chat.unread}
                  </span>
                )}
              </div>

              {longPressIndex === index && showArchiveOption && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchiveChat(chat.id);
                  }}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: '#2C4533',
                    color: '#fff',
                    border: 'none',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {chat.isArchived ? 'Buka Arsip' : 'Arsip'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav active={6} onNavigate={onNavigate} />
    </div>
  );
}