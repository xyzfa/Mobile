import { useState } from 'react';
import BottomNav from '../components/preloved/BottomNav';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface MetodePembayaranScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string; // Ini akan menjadi path gambar
  type: 'bank' | 'ewallet';
}

// Import gambar dari src/assets
import bcaLogo from '../assets/bca-logo.png';
import mandiriLogo from '../assets/mandiri-logo.png';
import bniLogo from '../assets/bni-logo.jpg';
import briLogo from '../assets/bri-logo.jpg';
import ocbcLogo from '../assets/ocbc-logo.png';
import gopayLogo from '../assets/gopay-logo.jpg';
import danaLogo from '../assets/dana-logo.png';
import shopeepayLogo from '../assets/shopeepay-logo.jpg';
import ovoLogo from '../assets/ovo-logo.jpg';

const bankMethods: PaymentMethod[] = [
  { id: 'bca', name: 'BCA', icon: bcaLogo, type: 'bank' },
  { id: 'mandiri', name: 'Mandiri', icon: mandiriLogo, type: 'bank' },
  { id: 'bni', name: 'BNI', icon: bniLogo, type: 'bank' },
  { id: 'bri', name: 'BRI', icon: briLogo, type: 'bank' },
  { id: 'ocbc', name: 'OCBC', icon: ocbcLogo, type: 'bank' },
];

const ewalletMethods: PaymentMethod[] = [
  { id: 'gopay', name: 'GoPay', icon: gopayLogo, type: 'ewallet' },
  { id: 'dana', name: 'DANA', icon: danaLogo, type: 'ewallet' },
  { id: 'shopeepay', name: 'ShopeePay', icon: shopeepayLogo, type: 'ewallet' },
  { id: 'ovo', name: 'OVO', icon: ovoLogo, type: 'ewallet' },
];

export default function MetodePembayaranScreen({ onNavigate }: MetodePembayaranScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bank' | 'ewallet'>('bank');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleSave = () => {
    if (selectedMethod) {
      const allMethods = [...bankMethods, ...ewalletMethods];
      const selected = allMethods.find(m => m.id === selectedMethod);
      
      console.log('Metode pembayaran dipilih:', selectedMethod);
      
      setNotificationMessage(`Berhasil simpan metode pembayaran ${selected?.name || ''}! ✅`);
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
        onNavigate(8);
      }, 2000);
    }
  };

  const renderMethods = (methods: PaymentMethod[]) => {
    return methods.map((method) => (
      <div
        key={method.id}
        onClick={() => handleMethodSelect(method.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 16px',
          marginBottom: '8px',
          background: selectedMethod === method.id ? '#E7EEE3' : '#fff',
          border: selectedMethod === method.id ? '2px solid #2C4533' : '1px solid #DED5C3',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ 
          width: 54,
          height: 54,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          borderRadius: '10px',
          marginRight: 14,
          padding: '8px',
          border: '1px solid #E8E3DC',
          flexShrink: 0,
        }}>
          <img 
            src={method.icon} 
            alt={method.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxWidth: 44,
              maxHeight: 44,
            }}
          />
        </div>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {method.name}
        </div>
      </div>
    ));
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '14px 18px 12px', 
        background: '#fff', 
        borderBottom: '1px solid #DED5C3', 
        flexShrink: 0,
        position: 'relative',
      }}>
        <button
          onClick={() => onNavigate(8)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            cursor: 'pointer',
            color: '#2C4533',
            padding: '0 8px',
          }}
        >
          ‹
        </button>
        <h2 style={{ 
          fontFamily: "'Fraunces', serif", 
          fontSize: 17, 
          fontWeight: 600, 
          margin: 0, 
          color: '#2C4533', 
          flex: 1, 
          textAlign: 'center' 
        }}>
          Metode Pembayaran
        </h2>
        <div style={{ width: 32, flexShrink: 0 }} />
      </div>

      {/* Notification */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#2C4533',
          color: '#fff',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: 14,
          maxWidth: '90%',
          textAlign: 'center',
          animation: 'slideDown 0.3s ease-out',
        }}>
          {notificationMessage}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '18px' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginBottom: 18,
          background: '#fff',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #DED5C3'
        }}>
          <button
            onClick={() => {
              setActiveTab('bank');
              setSelectedMethod(null);
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'bank' ? '#2C4533' : 'transparent',
              color: activeTab === 'bank' ? '#fff' : '#2C4533',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            Bank
          </button>
          <button
            onClick={() => {
              setActiveTab('ewallet');
              setSelectedMethod(null);
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'ewallet' ? '#2C4533' : 'transparent',
              color: activeTab === 'ewallet' ? '#fff' : '#2C4533',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            E-Wallet
          </button>
        </div>

        {/* Payment Methods */}
        {activeTab === 'bank' ? (
          <>
            <div style={{ 
              fontSize: 12, 
              color: '#8A8475', 
              marginBottom: 12,
              fontFamily: "'Plus Jakarta Sans', sans-serif" 
            }}>
              Pilih bank yang terdaftar
            </div>
            {renderMethods(bankMethods)}
          </>
        ) : (
          <>
            <div style={{ 
              fontSize: 12, 
              color: '#8A8475', 
              marginBottom: 12,
              fontFamily: "'Plus Jakarta Sans', sans-serif" 
            }}>
              Pilih e-wallet favorit Anda
            </div>
            {renderMethods(ewalletMethods)}
          </>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!selectedMethod}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: 24,
            background: selectedMethod ? '#2C4533' : '#DED5C3',
            color: selectedMethod ? '#fff' : '#8A8475',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: 15,
            cursor: selectedMethod ? 'pointer' : 'not-allowed',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s',
          }}
        >
          {selectedMethod ? 'Simpan Metode Pembayaran' : 'Pilih Metode Pembayaran'}
        </button>
      </div>

      <BottomNav active={8} onNavigate={onNavigate} />

      {/* CSS Animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}