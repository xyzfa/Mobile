// src/screens/KategoriScreen.tsx
import { useState, useEffect } from 'react';
import BottomNav from '../components/preloved/BottomNav';
import ScreenHeader from '../components/preloved/ScreenHeader';
import { getCategories, getProductsByCategory } from '../components/categories';
import { formatRupiah, products as allProducts } from '../data/preloved';
import sepatuIcon from '../assets/sepatu-icon.png';

type NavigateExtra = { productId?: number; chatId?: number; from?: number; category?: string };

interface KategoriScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
  selectedCategory?: string | null;
  isInCategoryDetail?: boolean;
  onBackFromCategoryProduct?: () => void;
  onLeaveCategory?: () => void;
}

// Filter untuk warna hijau tua (#2C4533)
const GREEN_FILTER = 'brightness(0) saturate(100%) invert(13%) sepia(14%) saturate(1120%) hue-rotate(80deg) brightness(95%) contrast(85%)';
const THICKEN_FILTER = 'drop-shadow(0 0 0.5px #2C4533) drop-shadow(0 0 0.5px #2C4533)';

// Icon untuk kategori (sama dengan di HomeScreen)
const categoryIcons: Record<string, React.ReactNode> = {
  Pakaian: (
    <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l3-2 3 2"/>
      <path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
    </svg>
  ),
  Tas: (
    <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8V6a4 4 0 018 0v2"/>
      <rect x="4" y="8" width="16" height="12" rx="2"/>
    </svg>
  ),
  Sepatu: (
    <img 
      src={sepatuIcon} 
      alt="Sepatu" 
      style={{ 
        width: 18, 
        height: 18, 
        objectFit: 'contain',
        display: 'block',
        filter: `${GREEN_FILTER} ${THICKEN_FILTER}`,
      }} 
    />
  ),
  Aksesoris: (
    <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Elektronik: (
    <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="12" rx="2"/>
      <path d="M8 20h8"/>
      <path d="M12 16v4"/>
    </svg>
  ),
  Lainnya: (
    <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="1.5"/>
      <circle cx="12" cy="12" r="1.5"/>
      <circle cx="18" cy="12" r="1.5"/>
    </svg>
  ),
};

const productIcons: Record<string, React.ReactNode> = {
  Pakaian: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l3-2 3 2"/><path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/></svg>,
  Tas: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8V6a4 4 0 018 0v2"/><rect x="4" y="8" width="16" height="12" rx="2"/></svg>,
  Sepatu: (
    <img 
      src={sepatuIcon} 
      alt="Sepatu" 
      style={{ 
        width: 18, 
        height: 18, 
        objectFit: 'contain',
        display: 'block',
        filter: `${GREEN_FILTER} ${THICKEN_FILTER}`,
      }} 
    />
  ),
  Aksesoris: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>,
  Elektronik: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>,
  Lainnya: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>,
};

export default function KategoriScreen({ 
  onNavigate, 
  selectedCategory: initialCategory,
  isInCategoryDetail = false,
  onBackFromCategoryProduct,
  onLeaveCategory
}: KategoriScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const allCategories = getCategories();

  // Jika ada kategori dari props, langsung tampilkan produknya
  useEffect(() => {
    if (initialCategory) {
      let products;
      if (initialCategory === 'Lainnya') {
        products = allProducts;
      } else {
        products = getProductsByCategory(initialCategory);
      }
      setCategoryProducts(products);
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Reset state ketika komponen unmount
  useEffect(() => {
    return () => {
      if (onLeaveCategory) {
        onLeaveCategory();
      }
    };
  }, [onLeaveCategory]);

  // Filter kategori berdasarkan search
  const filteredCategories = allCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (categoryName: string) => {
    let products;
    if (categoryName === 'Lainnya') {
      products = allProducts;
    } else {
      products = getProductsByCategory(categoryName);
    }
    setSelectedCategory(categoryName);
    setCategoryProducts(products);
    setSelectedProductId(null);
    // Kirim ke Index bahwa kita masuk ke halaman produk kategori
    onNavigate(3, { category: categoryName });
  };

  const handleBack = () => {
    if (selectedProductId !== null) {
      // Jika sedang di detail produk, kembali ke daftar produk kategori
      setSelectedProductId(null);
      // Kembali ke halaman produk kategori (tetap di screen 3)
      onNavigate(3, { category: selectedCategory || undefined });
    } else if (isInCategoryDetail && selectedCategory) {
      // Jika di halaman produk kategori, kembali ke halaman kategori utama
      // Reset state terlebih dahulu
      setSelectedCategory(null);
      setCategoryProducts([]);
      // Panggil callback dari parent untuk reset state di Index
      if (onBackFromCategoryProduct) {
        onBackFromCategoryProduct();
      }
      // Navigasi ke kategori utama (screen 3 tanpa category)
      onNavigate(3);
    } else {
      // Jika di halaman kategori utama, kembali ke home
      onNavigate(2);
    }
  };

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    onNavigate(4, { productId: productId, from: 3, category: selectedCategory || undefined });
  };

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Jika ada productId yang dipilih, tampilkan detail produk
  if (selectedProductId !== null) {
    const product = allProducts.find(p => p.id === selectedProductId);
    if (product) {
      onNavigate(4, { productId: selectedProductId, from: 3, category: selectedCategory || undefined });
      setSelectedProductId(null);
      return null;
    }
  }

  // Jika kategori dipilih, tampilkan daftar produk
  if (selectedCategory) {
    return (
      <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
        <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '12px 14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button
              onClick={handleBack}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid #DED5C3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                color: '#2C4533',
              }}
            >
              <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h2 style={{ 
              fontFamily: "'Fraunces', serif", 
              fontSize: 18, 
              fontWeight: 600, 
              color: '#2C4533', 
              margin: 0 
            }}>
              {selectedCategory === 'Lainnya' ? 'Semua Produk' : selectedCategory}
            </h2>
            <span style={{ 
              marginLeft: 'auto',
              fontSize: 12, 
              color: '#B0A99A', 
              fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {categoryProducts.length} item
            </span>
          </div>

          {/* Daftar Produk dengan icon love */}
          {categoryProducts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #DED5C3',
            }}>
              <p style={{ fontSize: 14, color: '#8A8475' }}>Belum ada produk di kategori ini</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {categoryProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleProductClick(p.id)}
                  style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
                >
                  <div style={{ aspectRatio: '1/1', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', color: p.iconColor }}>
                    <div style={{ width: '32%' }}>{productIcons[p.category] ?? productIcons['Pakaian']}</div>
                    <button
                      onClick={(e) => toggleLike(p.id, e)}
                      style={{ 
                        position: 'absolute', 
                        top: 6, 
                        right: 6, 
                        width: 22, 
                        height: 22, 
                        borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.92)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: liked.has(p.id) ? '#C1543C' : '#8A8475' 
                      }}
                    >
                      <svg width="11" viewBox="0 0 24 24" fill={liked.has(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-7-4.5-9.5-9C.7 8.4 2.4 5 6 5c2 0 3.3 1 4 2.2C10.7 6 12 5 14 5c3.6 0 5.3 3.4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/>
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding: '6px 8px 8px' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: '#232A22', marginBottom: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#C1543C', fontFamily: "'Fraunces', serif", marginBottom: 3 }}>{formatRupiah(p.price)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 9, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.seller}</span>
                      <span style={{ width: 2, height: 2, borderRadius: '50%', background: '#DED5C3', display: 'block' }}></span>
                      <span style={{ fontSize: 8, background: '#E7EEE3', color: '#2C4533', fontWeight: 700, borderRadius: 999, padding: '1px 5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.condition}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <BottomNav active={3} onNavigate={onNavigate} />
      </div>
    );
  }

  // Tampilan daftar kategori
  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Kategori" onBack={() => onNavigate(2)} />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          background: '#fff', 
          border: '1px solid #DED5C3', 
          borderRadius: 999, 
          padding: '11px 16px', 
          color: '#8A8475', 
          fontSize: 13.5, 
          fontFamily: "'Plus Jakarta Sans', sans-serif", 
          marginBottom: 16 
        }}>
          <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kategori"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 13.5,
              color: '#232A22',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#8A8475',
                fontSize: 16,
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredCategories.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #DED5C3',
            }}>
              <p style={{ fontSize: 14, color: '#8A8475' }}>Kategori "{searchQuery}" tidak ditemukan</p>
            </div>
          ) : (
            filteredCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10, 
                  background: '#fff', 
                  border: '1px solid #DED5C3', 
                  borderRadius: 12, 
                  padding: '10px 12px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C68B59';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#DED5C3';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 10, 
                  background: '#FFFFFF',
                  border: `1px solid #DED5C3`,
                  color: '#2C4533',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0 
                }}>
                  <div style={{ 
                    width: 22, 
                    height: 22, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {categoryIcons[cat.name] || categoryIcons['Lainnya']}
                  </div>
                </div>
                <span style={{ 
                  flex: 1, 
                  fontWeight: 600, 
                  fontSize: 13, 
                  fontFamily: "'Plus Jakarta Sans', sans-serif", 
                  color: '#232A22' 
                }}>
                  {cat.name}
                </span>
                <span style={{ 
                  fontSize: 11, 
                  color: '#B0A99A',
                  fontWeight: 600, 
                  fontFamily: "'Plus Jakarta Sans', sans-serif", 
                  marginRight: 4 
                }}>
                  {cat.count > 0 ? `${cat.count} item` : 'Semua'}
                </span>
                <span style={{ color: '#8A8475', fontSize: 16 }}>›</span>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav active={3} onNavigate={onNavigate} />
    </div>
  );
}