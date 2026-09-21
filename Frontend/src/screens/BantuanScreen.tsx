// src/screens/BantuanScreen.tsx
import { useState } from 'react';
import { Bot, ChevronRight, Copyright, MessageCircle, Send, Sparkles } from 'lucide-react';
import BottomNav from '../components/preloved/BottomNav';
import ScreenHeader from '../components/preloved/ScreenHeader';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };
type HelpView = 'menu' | 'assistant' | 'priority' | 'copyright';

interface BantuanScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

const helpItems = [
  {
    view: 'assistant' as const,
    title: 'Tanya Asisten AI',
    description: 'Dapatkan jawaban cepat seputar transaksi, akun, dan penggunaan Preloved.',
    icon: Bot,
    color: '#2C4533',
    bg: '#E7EEE3',
  },
  {
    view: 'priority' as const,
    title: 'Chat Prioritas',
    description: 'Hubungi admin lebih cepat melalui WhatsApp dengan scan QR code.',
    icon: MessageCircle,
    color: '#1F8F54',
    bg: '#E4F5EA',
  },
  {
    view: 'copyright' as const,
    title: 'Hak Cipta',
    description: 'Baca penjelasan kepemilikan konten dan perlindungan web Preloved.',
    icon: Copyright,
    color: '#C68B59',
    bg: '#FFF0D9',
  },
];

const assistantReplies: Record<string, string> = {
  transaksi: 'Untuk transaksi, pastikan detail produk, alamat, dan metode pembayaran sudah benar sebelum checkout.',
  akun: 'Untuk akun, kamu bisa mengubah profil, cek status akun, dan mengatur notifikasi melalui halaman Akun.',
  produk: 'Untuk produk preloved, cek foto, kondisi, ukuran, dan deskripsi sebelum membeli agar pilihanmu lebih tepat.',
};

export default function BantuanScreen({ onNavigate }: BantuanScreenProps) {
  const [view, setView] = useState<HelpView>('menu');
  const [question, setQuestion] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('Halo, saya siap membantu pertanyaan seputar Preloved.');

  const goBack = () => {
    if (view === 'menu') {
      onNavigate(8);
      return;
    }

    setView('menu');
  };

  const askAssistant = (topic?: string) => {
    const normalized = (topic || question).toLowerCase();
    const matchedKey = Object.keys(assistantReplies).find((key) => normalized.includes(key));
    setAssistantAnswer(
      matchedKey
        ? assistantReplies[matchedKey]
        : 'Saya bisa bantu soal transaksi, akun, produk, pengiriman, dan keamanan. Tulis pertanyaanmu dengan singkat ya.'
    );
    if (!topic) setQuestion('');
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title={view === 'menu' ? 'Bantuan' : helpItems.find((item) => item.view === view)?.title || 'Bantuan'} onBack={goBack} />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        {view === 'menu' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {helpItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setView(item.view)}
                  style={{
                    width: '100%',
                    border: '1px solid #DED5C3',
                    background: '#fff',
                    borderRadius: 16,
                    padding: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    boxShadow: '0 10px 22px rgba(44, 69, 51, 0.06)',
                  }}
                >
                  <span style={{ width: 42, height: 42, borderRadius: 12, background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', color: '#2C4533', fontSize: 14.5, fontWeight: 800, marginBottom: 3 }}>{item.title}</span>
                    <span style={{ display: 'block', color: '#6F756B', fontSize: 11.8, lineHeight: 1.45 }}>{item.description}</span>
                  </span>
                  <ChevronRight size={17} color="#8A8475" strokeWidth={2.4} />
                </button>
              );
            })}
          </div>
        )}

        {view === 'assistant' && (
          <section style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 16, padding: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
              <span style={{ width: 38, height: 38, borderRadius: 12, background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={20} strokeWidth={2.2} />
              </span>
              <div style={{ background: '#F7F3EC', borderRadius: 14, padding: '10px 12px', color: '#2C4533', fontSize: 12.5, lineHeight: 1.55 }}>
                {assistantAnswer}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {['Transaksi', 'Akun', 'Produk'].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => askAssistant(topic)}
                  style={{ border: '1px solid #DED5C3', background: '#fff', color: '#2C4533', borderRadius: 999, padding: '7px 10px', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Tulis pertanyaan..."
                style={{ flex: 1, border: '1px solid #DED5C3', borderRadius: 999, padding: '10px 12px', fontSize: 12.5, outlineColor: '#2C4533' }}
              />
              <button
                type="button"
                onClick={() => askAssistant()}
                style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#2C4533', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <Send size={17} strokeWidth={2.3} />
              </button>
            </div>
          </section>
        )}

        {view === 'priority' && (
          <section style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 16, padding: 16, textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <h2 style={{ margin: '0 0 6px', color: '#2C4533', fontSize: 17, fontWeight: 800, fontFamily: "'Fraunces', serif" }}>Chat Prioritas WhatsApp</h2>
            <p style={{ margin: '0 auto 14px', color: '#6F756B', fontSize: 12.2, lineHeight: 1.55, maxWidth: 260 }}>
              Scan QR code ini untuk langsung terhubung dengan admin prioritas Preloved.
            </p>
            <div style={{ 
              width: 228, 
              height: 228, 
              margin: '0 auto 12px', 
              border: '1px solid #DED5C3', 
              borderRadius: 14, 
              background: '#fff', 
              padding: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img 
                src="/web.jpeg" 
                alt="Web Preloved" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  borderRadius: 8,
                }} 
              />
            </div>
            <p style={{ margin: 0, color: '#8A8475', fontSize: 11.5, lineHeight: 1.45 }}>
              Pastikan kamera dapat membaca QR dengan jelas sebelum membuka WhatsApp.
            </p>
          </section>
        )}

        {view === 'copyright' && (
          <section style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 16, padding: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <h2 style={{ margin: '0 0 10px', color: '#2C4533', fontSize: 17, fontWeight: 800, fontFamily: "'Fraunces', serif" }}>Hak Cipta Web Preloved</h2>
            <p style={{ margin: '0 0 10px', color: '#5F665C', fontSize: 12.5, lineHeight: 1.6 }}>
              Seluruh tampilan, alur, nama fitur, teks, ikon, dan materi visual pada web Preloved dibuat untuk mendukung pengalaman jual beli barang preloved yang aman dan nyaman.
            </p>
            <p style={{ margin: '0 0 10px', color: '#5F665C', fontSize: 12.5, lineHeight: 1.6 }}>
              Konten produk yang diunggah pengguna tetap menjadi tanggung jawab pengguna masing-masing. Preloved berhak meninjau, menyembunyikan, atau menghapus konten yang melanggar aturan platform.
            </p>
            <p style={{ margin: 0, color: '#5F665C', fontSize: 12.5, lineHeight: 1.6 }}>
              Dilarang menyalin, menggunakan ulang, atau mendistribusikan bagian dari web ini untuk tujuan komersial tanpa izin dari pemilik Preloved.
            </p>
          </section>
        )}
      </div>

      <BottomNav active={8} onNavigate={onNavigate} />
    </div>
  );
}