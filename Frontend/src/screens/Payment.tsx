import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '../components/preloved/ScreenHeader';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface PaymentProps {
  onNavigate?: (screen: number, extra?: NavigateExtra) => void;
}

const paymentOptions = [
  { label: 'GoPay', image: '/payment-gopay.svg' },
  { label: 'SPay', image: '/payment-spay.svg' },
  { label: 'Kartu', image: '/payment-card.svg' },
];

const styles = {
  modal: {
    width: '100%',
    background: '#FFFFFF',
    boxShadow:
      '0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)',
    borderRadius: 26,
    maxWidth: 450,
  },
  input: {
    width: '100%',
    height: 40,
    padding: '0 12px 0 16px',
    borderRadius: 9,
    outline: 'none',
    backgroundColor: '#F2F2F2',
    border: '1px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    color: '#232A22',
    boxSizing: 'border-box' as const,
  },
};

export default function Payment({ onNavigate }: PaymentProps) {
  const routerNavigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(paymentOptions[0].label);
  const [form, setForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [savedMessage, setSavedMessage] = useState('');

  const handleBack = () => {
    if (onNavigate) {
      onNavigate(8);
      return;
    }

    routerNavigate('/');
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (savedMessage) setSavedMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedMessage('Metode pembayaran berhasil disimpan.');
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Metode Pembayaran" onBack={handleBack} />

      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          padding: '18px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: '#232A22',
        }}
      >
        <div style={styles.modal}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              padding: 20,
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                padding: 0,
              }}
            >
              {paymentOptions.map((option) => {
                const isSelected = selectedOption === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    aria-label={option.label}
                    title={option.label}
                    onClick={() => setSelectedOption(option.label)}
                    style={{
                      height: 55,
                      background: '#F2F2F2',
                      borderRadius: 11,
                      padding: 0,
                      border: isSelected ? '2px solid #242424' : '0',
                      outline: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={option.image}
                      alt=""
                      style={{
                        width: option.label === 'GoPay' ? 58 : option.label === 'SPay' ? 54 : 42,
                        height: 30,
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: 10,
                color: '#8B8E98',
              }}
            >
              <span style={{ width: '100%', height: 1, backgroundColor: '#e8e8e8', margin: 'auto' }} />
              <p style={{ textAlign: 'center', fontWeight: 600, fontSize: 11, margin: 'auto' }}>
                atau isi kartu
              </p>
              <span style={{ width: '100%', height: 1, backgroundColor: '#e8e8e8', margin: 'auto' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <label style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 10, color: '#8B8E98', fontWeight: 600 }}>
                  Nama pemilik kartu
                </span>
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  style={styles.input}
                  onFocus={(event) => {
                    event.currentTarget.style.boxShadow = '0px 0px 0px 2px #242424';
                    event.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.boxShadow = 'none';
                    event.currentTarget.style.backgroundColor = '#F2F2F2';
                  }}
                  placeholder="Nama lengkap"
                  autoComplete="cc-name"
                />
              </label>

              <label style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 10, color: '#8B8E98', fontWeight: 600 }}>
                  Nomor kartu
                </span>
                <input
                  value={form.cardNumber}
                  onChange={(event) => updateField('cardNumber', event.target.value.replace(/[^\d\s]/g, ''))}
                  style={styles.input}
                  onFocus={(event) => {
                    event.currentTarget.style.boxShadow = '0px 0px 0px 2px #242424';
                    event.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.boxShadow = 'none';
                    event.currentTarget.style.backgroundColor = '#F2F2F2';
                  }}
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  autoComplete="cc-number"
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 2fr)', gap: 15 }}>
                <label style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                  <span style={{ fontSize: 10, color: '#8B8E98', fontWeight: 600 }}>
                    Kedaluwarsa
                  </span>
                  <input
                    value={form.expiry}
                    onChange={(event) => updateField('expiry', event.target.value)}
                    style={styles.input}
                    onFocus={(event) => {
                      event.currentTarget.style.boxShadow = '0px 0px 0px 2px #242424';
                      event.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.boxShadow = 'none';
                      event.currentTarget.style.backgroundColor = '#F2F2F2';
                    }}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                  />
                </label>

                <label style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                  <span style={{ fontSize: 10, color: '#8B8E98', fontWeight: 600 }}>
                    CVV
                  </span>
                  <input
                    value={form.cvv}
                    onChange={(event) => updateField('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))}
                    style={styles.input}
                    onFocus={(event) => {
                      event.currentTarget.style.boxShadow = '0px 0px 0px 2px #242424';
                      event.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.boxShadow = 'none';
                      event.currentTarget.style.backgroundColor = '#F2F2F2';
                    }}
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                </label>
              </div>
            </div>

            {savedMessage && (
              <p style={{ margin: 0, color: '#2C4533', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                {savedMessage}
              </p>
            )}

            <button
              type="submit"
              style={{
                height: 55,
                borderRadius: 11,
                border: 0,
                outline: 'none',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                background: 'linear-gradient(180deg, #363636 0%, #1B1B1B 50%, #000000 100%)',
                boxShadow: '0px 0px 0px 0px #FFFFFF, 0px 0px 0px 0px #000000',
                transition: 'all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1)',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Simpan Metode Pembayaran
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
