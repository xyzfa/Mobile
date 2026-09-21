// src/screens/ChatConversationScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { chatThreads, ChatThread, ChatMessage } from '../data/preloved';
import muteIcon from '../assets/mute-icon.png';
import unmuteIcon from '../assets/unmute-icon.png';
import homeIcon from '../assets/home-icon.png';

interface ChatConversationScreenProps {
  onNavigate: (screen: number, extra?: any) => void;
  chatId: number;
}

// Icon untuk menu dropdown
const MenuIcon = () => (
  <svg width="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="12" cy="19" r="1.5"/>
  </svg>
);

const BackIcon = () => (
  <svg width="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
  </svg>
);

// Icon Home - menggunakan PNG
const HomeIconPNG = () => (
  <img 
    src={homeIcon} 
    alt="Home" 
    style={{ 
      width: 18, 
      height: 18, 
      objectFit: 'contain',
      display: 'block',
      filter: 'brightness(0) saturate(100%) invert(13%) sepia(14%) saturate(1120%) hue-rotate(80deg) brightness(95%) contrast(85%)',
    }} 
  />
);

// Icon Mute - menggunakan PNG
const MuteIconPNG = () => (
  <img 
    src={muteIcon} 
    alt="Mute" 
    style={{ 
      width: 18, 
      height: 18, 
      objectFit: 'contain',
      display: 'block',
      filter: 'brightness(0) saturate(100%) invert(13%) sepia(14%) saturate(1120%) hue-rotate(80deg) brightness(95%) contrast(85%)',
    }} 
  />
);

// Icon Unmute - menggunakan PNG
const UnmuteIconPNG = () => (
  <img 
    src={unmuteIcon} 
    alt="Unmute" 
    style={{ 
      width: 18, 
      height: 18, 
      objectFit: 'contain',
      display: 'block',
      filter: 'brightness(0) saturate(100%) invert(13%) sepia(14%) saturate(1120%) hue-rotate(80deg) brightness(95%) contrast(85%)',
    }} 
  />
);

const ArchiveIcon = () => (
  <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M3 5l4-3h10l4 3"/>
    <path d="M8 10h8"/>
  </svg>
);

export default function ChatConversationScreen({ onNavigate, chatId }: ChatConversationScreenProps) {
  const [thread, setThread] = useState<ChatThread | undefined>(
    chatThreads.find(c => c.id === chatId)
  );
  const [newMessage, setNewMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  // Reset unread saat komponen di-unmount (keluar dari room chat)
  return () => {
    if (thread) {
      const index = chatThreads.findIndex(c => c.id === thread.id);
      if (index !== -1) {
        chatThreads[index].unread = 0;
      }
    }
  };
}, [thread]);

  if (!thread) {
    return (
      <div className="screen-enter flex flex-col flex-1 items-center justify-center" style={{ background: '#F7F3EC' }}>
        <p style={{ color: '#8A8475' }}>Chat tidak ditemukan</p>
        <button onClick={() => onNavigate(6)} style={{ marginTop: 10, color: '#2C4533' }}>Kembali</button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + '.' + now.getMinutes().toString().padStart(2, '0');
    
    const newMsg: ChatMessage = {
      from: 'me',
      text: newMessage.trim(),
      time: timeStr,
    };

    const updatedThread = {
      ...thread,
      messages: [...thread.messages, newMsg],
      lastMsg: newMessage.trim(),
      time: timeStr,
    };

    const index = chatThreads.findIndex(c => c.id === chatId);
    if (index !== -1) {
      chatThreads[index] = updatedThread;
    }

    setThread(updatedThread);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchMode) {
        handleSearch();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results: number[] = [];
    thread.messages.forEach((msg, index) => {
      if (msg.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push(index);
      }
    });
    setSearchResults(results);
  };

  const handleSearchToggle = () => {
    setSearchMode(!searchMode);
    setSearchQuery('');
    setSearchResults([]);
    setShowMenu(false);
  };

  const handleMuteToggle = () => {
    const index = chatThreads.findIndex(c => c.id === chatId);
    if (index !== -1) {
      const newMutedState = !chatThreads[index].isMuted;
      chatThreads[index].isMuted = newMutedState;
      // Update thread state
      setThread({ ...thread, isMuted: newMutedState });
    }
    // Tutup menu setelah toggle
    setShowMenu(false);
  };

  const handleArchiveToggle = () => {
    const index = chatThreads.findIndex(c => c.id === chatId);
    if (index !== -1) {
      const newArchivedState = !chatThreads[index].isArchived;
      chatThreads[index].isArchived = newArchivedState;
      setThread({ ...thread, isArchived: newArchivedState });
    }
    setShowMenu(false);
    if (!thread.isArchived) {
      onNavigate(6);
    }
  };

  const handleBack = () => {
    onNavigate(6);
  };

  const handleGoHome = () => {
    onNavigate(2);
  };

  // Buat menuItems setiap render agar selalu up-to-date
  const getMenuItems = () => [
    { icon: <HomeIconPNG />, label: 'Kembali ke halaman utama', action: handleGoHome },
    { icon: <SearchIcon />, label: 'Cari Pesan', action: handleSearchToggle },
    { 
      icon: thread.isMuted ? <UnmuteIconPNG /> : <MuteIconPNG />, 
      label: thread.isMuted ? 'Nyalakan' : 'Matikan', 
      action: handleMuteToggle 
    },
    { 
      icon: <ArchiveIcon />, 
      label: thread.isArchived ? 'Buka Arsip' : 'Arsipkan', 
      action: handleArchiveToggle 
    },
  ];

  const menuItems = getMenuItems();

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '12px 16px', 
        background: '#fff', 
        borderBottom: '1px solid #DED5C3', 
        flexShrink: 0 
      }}>
        <button
          onClick={handleBack}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#2C4533',
          }}
        >
          <BackIcon />
        </button>
        
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h3 style={{ 
            fontFamily: "'Fraunces', serif", 
            fontSize: 16, 
            fontWeight: 600, 
            margin: 0, 
            color: '#2C4533' 
          }}>
            {thread.name}
          </h3>
          <span style={{ 
            fontSize: 11, 
            color: '#8A8475',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            re: {thread.product}
          </span>
        </div>

        {/* Menu 3 titik */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#2C4533',
            }}
          >
            <MenuIcon />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              width: 220,
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #DED5C3',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              zIndex: 100,
              overflow: 'hidden',
            }}>
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    cursor: 'pointer',
                    borderBottom: index < menuItems.length - 1 ? '1px solid #F0EDE6' : 'none',
                    transition: 'background 0.2s ease',
                    color: '#232A22',
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F0EDE6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ color: '#2C4533', width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {searchMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: '#fff',
          borderBottom: '1px solid #DED5C3',
        }}>
          <SearchIcon />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value) {
                setSearchResults([]);
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Cari pesan..."
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 13,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: '#232A22',
              background: 'transparent',
            }}
          />
          <button
            onClick={() => {
              setSearchMode(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#8A8475',
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 16px 12px' }}>
        {thread.messages.map((msg, index) => {
          const isHighlighted = searchResults.includes(index);
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
                marginBottom: 8,
              }}
            >
              <div style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: 16,
                background: msg.from === 'me' ? '#2C4533' : '#fff',
                color: msg.from === 'me' ? '#fff' : '#232A22',
                border: msg.from === 'me' ? 'none' : '1px solid #DED5C3',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.4,
                ...(isHighlighted && {
                  background: '#F5EDDE',
                  border: '2px solid #C68B59',
                }),
              }}>
                {msg.text}
                <div style={{
                  fontSize: 10,
                  color: msg.from === 'me' ? 'rgba(255,255,255,0.6)' : '#B0A99A',
                  marginTop: 4,
                  textAlign: 'right',
                }}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        {searchResults.length > 0 && (
          <div style={{ textAlign: 'center', fontSize: 11, color: '#8A8475', marginTop: 8 }}>
            {searchResults.length} pesan ditemukan
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        background: '#fff',
        borderTop: '1px solid #DED5C3',
        flexShrink: 0,
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan..."
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 999,
            border: '1px solid #DED5C3',
            outline: 'none',
            fontSize: 13,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: '#F7F3EC',
            color: '#232A22',
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: newMessage.trim() ? '#2C4533' : '#DED5C3',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: newMessage.trim() ? 'pointer' : 'default',
            color: '#fff',
            transition: 'all 0.2s ease',
          }}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}