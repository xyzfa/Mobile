import { products, formatRupiah } from '../data/preloved';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface OrderSuccessScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
  productId: number;
}

export default function OrderSuccessScreen({ onNavigate, productId }: OrderSuccessScreenProps) {
  const product = products.find(p => p.id === productId) ?? products[0];
  const orderId = 'PLV' + Math.floor(Math.random() * 90000 + 10000);

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0 items-center justify-center text-center" style={{ background: '#F7F3EC', padding: '0 28px' }}>
      {/* Success icon */}
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E7EEE3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#2C4533' }}>
        <svg width="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="9"/>
          <path d="M8 12l3 3 5-5"/>
        </svg>
      </div>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: '#2C4533', margin: '0 0 8px' }}>
        Pesanan Dibuat!
      </h2>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#8A8475', lineHeight: 1.6, margin: '0 0 28px' }}>
        Pesananmu sedang diproses.<br />Penjual akan segera mengkonfirmasi.
      </p>

      {/* Order card */}
      <div style={{ width: '100%', background: '#fff', border: '1px solid #DED5C3', borderRadius: 16, padding: 16, marginBottom: 24, textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 10, background: product.bg, color: product.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg style={{ width: '48%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5l3-2 3 2"/><path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#232A22', marginBottom: 3 }}>{product.name}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#C1543C', fontFamily: "'Fraunces', serif" }}>{formatRupiah(product.price)}</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #DED5C3', paddingTop: 12 }}>
          {[
            ['No. Pesanan', orderId],
            ['Penjual', product.seller],
            ['Status', 'Menunggu Konfirmasi'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span style={{ color: '#8A8475' }}>{label}</span>
              <span style={{ fontWeight: 600, color: label === 'Status' ? '#C68B59' : '#232A22' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onNavigate(8)}
        style={{ width: '100%', background: '#2C4533', color: '#fff', border: 'none', borderRadius: 999, padding: 15, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14.5, cursor: 'pointer', marginBottom: 12 }}
      >
        Lihat Pesanan Saya
      </button>
      <button
        onClick={() => onNavigate(2)}
        style={{ width: '100%', background: 'transparent', color: '#2C4533', border: '1.5px solid #2C4533', borderRadius: 999, padding: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}
      >
        Belanja Lagi
      </button>
    </div>
  );
}
