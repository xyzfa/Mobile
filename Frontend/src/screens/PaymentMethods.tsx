import { useState } from 'react';
import {
  Banknote,
  CreditCard,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import BottomNav from '../components/preloved/BottomNav';
import ScreenHeader from '../components/preloved/ScreenHeader';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface PaymentMethodsProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

const bankOptions = [
  { id: 1, name: 'BCA', icon: 'bank' },
  { id: 2, name: 'Mandiri', icon: 'bank' },
  { id: 3, name: 'BNI', icon: 'bank' },
  { id: 4, name: 'BRI', icon: 'bank' },
  { id: 5, name: 'OCBC', icon: 'bank' },
];

const ewalletOptions = [
  { id: 1, name: 'GoPay', icon: 'wallet' },
  { id: 2, name: 'Dana', icon: 'wallet' },
  { id: 3, name: 'Shopeepay', icon: 'wallet' },
  { id: 4, name: 'OVO', icon: 'wallet' },
];

export default function PaymentMethods({ onNavigate }: PaymentMethodsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'bank' | 'ewallet' | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleSelectCategory = (category: 'bank' | 'ewallet') => {
    setSelectedCategory(category);
    setSelectedItem('');
  };

  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
    // In a real app, you would save this selection here
    alert(`Anda telah memilih ${item} sebagai metode pembayaran default`);
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
      setSelectedItem('');
    } else {
      onNavigate(14); // Back to PengaturanAkunScreen
    }
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader
        title="Metode Pembayaran"
        onBack={handleBack}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        {/* Back Button Section */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <button
            type="button"
            onClick={handleBack}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={20} strokeWidth={2} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#2C4533' }}>
              Kembali ke Pengaturan
            </span>
          </button>
        </div>

        {/* Category Selection */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#2C4533',
            marginBottom: 16,
            textAlign: 'center'
          }}>
            Pilih Jenis Pembayaran
          </h2>

          <div style={{ display: 'flex', gap: 12 }}>
            {/* Bank Option */}
            <button
              onClick={() => handleSelectCategory('bank')}
              style={{
                flex: 1,
                padding: '16px 12px',
                border: `2px ${selectedCategory === 'bank' ? 'solid #2C4533' : 'dashed #DED5C3'}`,
                borderRadius: 12,
                background: selectedCategory === 'bank' ? '#F0F7F0' : 'white',
                color: selectedCategory === 'bank' ? '#2C4533' : '#6F756B',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Banknote size={24} strokeWidth={2.2}
                style={{ color: selectedCategory === 'bank' ? '#2C4533' : '#6F756B' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Bank Transfer
                </div>
                <div style={{ fontSize: 12, color: '#8A8475' }}>
                  BCA, Mandiri, BNI, BRI, OCBC
                </div>
              </div>
            </button>

            {/* E-Wallet Option */}
            <button
              onClick={() => handleSelectCategory('ewallet')}
              style={{
                flex: 1,
                padding: '16px 12px',
                border: `2px ${selectedCategory === 'ewallet' ? 'solid #2C4533' : 'dashed #DED5C3'}`,
                borderRadius: 12,
                background: selectedCategory === 'ewallet' ? '#F0F7F0' : 'white',
                color: selectedCategory === 'ewallet' ? '#2C4533' : '#6F756B',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <CreditCard size={24} strokeWidth={2.2}
                style={{ color: selectedCategory === 'ewallet' ? '#2C4533' : '#6F756B' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Dompet Digital
                </div>
                <div style={{ fontSize: 12, color: '#8A8475' }}>
                  GoPay, Dana, Shopeepay, OVO
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Selected Category Items */}
        {selectedCategory && (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#2C4533',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              {selectedCategory === 'bank' ? 'Pilih Bank' : 'Pilih Dompet Digital'}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 16
            }}>
              {(selectedCategory === 'bank' ? bankOptions : ewalletOptions).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.name)}
                  style={{
                    padding: '16px 12px',
                    border: `2px ${selectedItem === item.name ? 'solid #2C4533' : 'dashed #DED5C3'}`,
                    borderRadius: 12,
                    background: selectedItem === item.name ? '#F0F7F0' : 'white',
                    color: selectedItem === item.name ? '#2C4533' : '#6F756B',
                    fontWeight: selectedItem === item.name ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {item.icon === 'bank' ? (
                    <Banknote size={20} strokeWidth={2}
                      style={{ color: selectedItem === item.name ? '#2C4533' : '#6F756B' }} />
                  ) : (
                    <CreditCard size={20} strokeWidth={2}
                      style={{ color: selectedItem === item.name ? '#2C4533' : '#6F756B' }} />
                  )}
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'center',
                    minHeight: 20
                  }}>
                    {item.name}
                  </div>
                </button>
              ))}
            </div>

            {selectedItem && (
              <div style={{
                marginTop: 24,
                padding: 16,
                background: '#F0F7F0',
                borderRadius: 12,
                borderLeft: '4px solid #2C4533'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8
                }}>
                  {selectedCategory === 'bank' ? (
                    <Banknote size={18} strokeWidth={2} />
                  ) : (
                    <CreditCard size={18} strokeWidth={2} />
                  )}
                  <div>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#2C4533'
                    }}>
                      {selectedItem} dipilih sebagai metode pembayaran
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: '#6F756B'
                    }}>
                      Tap to change
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav active={14} onNavigate={onNavigate} />
    </div>
  );
}