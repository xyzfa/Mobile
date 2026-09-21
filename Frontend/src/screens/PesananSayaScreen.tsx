import ScreenHeader from '../components/preloved/ScreenHeader';
import { formatRupiah, products } from '../data/preloved';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface PesananSayaScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

interface StoredOrder {
  id: string;
  productId: number;
  status: string;
  createdAt: string;
}

const getOrders = (): StoredOrder[] => {
  try {
    const raw = localStorage.getItem('preloved-orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export default function PesananSayaScreen({ onNavigate }: PesananSayaScreenProps) {
  const orders = getOrders();

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Pesanan Saya" onBack={() => onNavigate(8)} />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        {orders.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 16, padding: 18, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: '#2C4533', fontWeight: 700, marginBottom: 6 }}>
              Belum ada pesanan
            </div>
            <p style={{ margin: 0, color: '#8A8475', fontSize: 13, lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Pesanan yang berhasil dibuat akan muncul di sini.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const product = products.find((item) => item.id === order.productId) ?? products[0];

            return (
              <button
                key={order.id}
                type="button"
                onClick={() => onNavigate(4, { productId: product.id })}
                style={{
                  width: '100%',
                  background: '#fff',
                  border: '1px solid #DED5C3',
                  borderRadius: 16,
                  padding: 14,
                  marginBottom: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 12, background: product.bg, color: product.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg style={{ width: '48%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5l3-2 3 2"/><path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#232A22', marginBottom: 3 }}>
                      {product.name}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#C1543C', fontFamily: "'Fraunces', serif" }}>
                      {formatRupiah(product.price)}
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #DED5C3', paddingTop: 10 }}>
                  {[
                    ['No. Pesanan', order.id],
                    ['Penjual', product.seller],
                    ['Status', order.status],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <span style={{ color: '#8A8475' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: label === 'Status' ? '#C68B59' : '#232A22', textAlign: 'right' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
