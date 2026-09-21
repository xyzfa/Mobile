import ScreenHeader from '../components/preloved/ScreenHeader';
import { formatRupiah, products } from '../data/preloved';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface FavoritScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

const getFavoriteIds = () => {
  try {
    const raw = localStorage.getItem('preloved-favorites');
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
};

export default function FavoritScreen({ onNavigate }: FavoritScreenProps) {
  const favoriteProducts = products.filter((product) => getFavoriteIds().includes(product.id));

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Favorit" onBack={() => onNavigate(8)} />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        {favoriteProducts.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 16, padding: 18, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: '#2C4533', fontWeight: 700, marginBottom: 6 }}>
              Belum ada favorit
            </div>
            <p style={{ margin: 0, color: '#8A8475', fontSize: 13, lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Tekan ikon love di Beranda untuk menyimpan barang favoritmu.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 9 }}>
            {favoriteProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onNavigate(4, { productId: product.id })}
                style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <div style={{ aspectRatio: '1/1', background: product.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', color: product.iconColor }}>
                  <svg style={{ width: '32%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M9 5l3-2 3 2"/><path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
                  </svg>
                  <span style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: '#fff', color: '#C1543C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s-7-4.5-9.5-9C.7 8.4 2.4 5 6 5c2 0 3.3 1 4 2.2C10.7 6 12 5 14 5c3.6 0 5.3 3.4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/>
                    </svg>
                  </span>
                </div>
                <div style={{ padding: '7px 8px 9px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#232A22', marginBottom: 3, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3 }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#C1543C', fontFamily: "'Fraunces', serif" }}>
                    {formatRupiah(product.price)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
