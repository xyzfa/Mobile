import ScreenHeader from '../components/preloved/ScreenHeader';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface HelpMeScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

export default function HelpMeScreen({ onNavigate }: HelpMeScreenProps) {
  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Bantuan" onBack={() => onNavigate(8)} />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', background: '#fff', border: '1px solid #DED5C3', borderRadius: 18, padding: 18, textAlign: 'center' }}>
          <img
            src="/whatsapp-qr.svg"
            alt="QR Whatsapp customer service"
            style={{ width: '100%', maxWidth: 235, aspectRatio: '1/1', objectFit: 'contain', display: 'block', margin: '0 auto 16px' }}
          />
          <p style={{ margin: 0, color: '#2C4533', fontSize: 13.5, lineHeight: 1.6, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Untuk pengaduan dapat menghubungi cs kami pada QR Whatsapp diatas.
          </p>
        </div>
      </div>
    </div>
  );
}
