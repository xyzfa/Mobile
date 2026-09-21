import { useState } from 'react';
import { Bell, BellOff, CheckCircle2, ChevronRight, ClipboardCheck, ShieldAlert, Banknote, CreditCard } from 'lucide-react';
import BottomNav from '../components/preloved/BottomNav';
import ScreenHeader from '../components/preloved/ScreenHeader';
import { getNotificationsEnabled, setNotificationsEnabled } from '../data/appSettings';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface PengaturanAkunScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

export default function PengaturanAkunScreen({ onNavigate }: PengaturanAkunScreenProps) {
  const [notificationsOn, setNotificationsOn] = useState(getNotificationsEnabled);
  const [checkStatus, setCheckStatus] = useState<'idle' | 'checking' | 'done'>('idle');

  const runAccountCheck = () => {
    setCheckStatus('checking');
    window.setTimeout(() => setCheckStatus('done'), 700);
  };

  const toggleNotifications = () => {
    const nextValue = !notificationsOn;
    setNotificationsOn(nextValue);
    setNotificationsEnabled(nextValue);
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Pengaturan" onBack={() => onNavigate(8)} />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        <button
          type="button"
          onClick={runAccountCheck}
          style={{
            width: '100%',
            border: '1px solid #DED5C3',
            background: '#fff',
            borderRadius: 16,
            padding: 15,
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: '0 10px 24px rgba(44, 69, 51, 0.07)',
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: checkStatus === 'done' ? '#E7EEE3' : '#FFF0D9',
              color: checkStatus === 'done' ? '#2C4533' : '#C68B59',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {checkStatus === 'done' ? <CheckCircle2 size={22} strokeWidth={2.2} /> : <ClipboardCheck size={22} strokeWidth={2.2} />}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', color: '#2C4533', fontSize: 15, fontWeight: 800, marginBottom: 3 }}>
              Pemeriksaan Akun
            </span>
            <span style={{ display: 'block', color: '#6F756B', fontSize: 12, lineHeight: 1.45 }}>
              {checkStatus === 'checking'
                ? 'Sedang memeriksa status akun...'
                : checkStatus === 'done'
                  ? 'Tidak ada masalah yang belum terselesaikan di akun ini.'
                  : 'Ketuk untuk memeriksa apakah ada masalah akun yang belum selesai.'}
            </span>
          </span>
          {checkStatus === 'idle' && <ShieldAlert size={18} color="#C68B59" strokeWidth={2.2} />}
        </button>

        <button
          type="button"
          onClick={() => onNavigate(16)}
          style={{
            width: '100%',
            border: '1px solid #DED5C3',
            background: '#fff',
            borderRadius: 16,
            padding: 15,
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: '0 10px 24px rgba(44, 69, 51, 0.07)',
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: '#FFF0D9',
              color: '#C68B59',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Banknote size={22} strokeWidth={2.2} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', color: '#2C4533', fontSize: 15, fontWeight: 800, marginBottom: 3 }}>
              Metode Pembayaran
            </span>
            <span style={{ display: 'block', color: '#6F756B', fontSize: 12, lineHeight: 1.45 }}>
              Kelola BCA, Mandiri, BNI, BRI, OCBC, GoPay, Dana, Shopeepay, OVO
            </span>
          </span>
          <ChevronRight size={16} color="#C68B59" strokeWidth={2.2} />
        </button>

        <section
          style={{
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: 16,
            padding: 15,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: notificationsOn ? '#E7EEE3' : '#F0EDE6',
                color: '#2C4533',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {notificationsOn ? <Bell size={21} strokeWidth={2.2} /> : <BellOff size={21} strokeWidth={2.2} />}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: '0 0 3px', color: '#2C4533', fontSize: 15, fontWeight: 800 }}>
                Notifikasi Beranda
              </h2>
              <p style={{ margin: 0, color: '#6F756B', fontSize: 12, lineHeight: 1.45 }}>
                {notificationsOn ? 'Notifikasi aktif dan ikon di Beranda tampil normal.' : 'Notifikasi disenyapkan dan ikon di Beranda diberi garis miring.'}
              </p>
            </div>
            <button
              type="button"
              aria-pressed={notificationsOn}
              onClick={toggleNotifications}
              style={{
                width: 54,
                height: 30,
                borderRadius: 999,
                border: 'none',
                padding: 3,
                background: notificationsOn ? '#2C4533' : '#D8D2C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: notificationsOn ? 'flex-end' : 'flex-start',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 2px 7px rgba(0, 0, 0, 0.18)',
                  display: 'block',
                }}
              />
            </button>
          </div>
        </section>
      </div>

      <BottomNav active={8} onNavigate={onNavigate} />
    </div>
  );
}
