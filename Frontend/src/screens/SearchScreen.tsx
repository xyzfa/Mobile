// src/screens/SearchScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { products, formatRupiah } from '../data/preloved';
import { Product } from '../data/preloved';

type NavigateExtra = { productId?: number };

interface SearchScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
  searchQuery?: string;
}

const productIcons: Record<string, React.ReactNode> = {
  Pakaian: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 5l3-2 3 2"/><path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/></svg>,
  Tas: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 8V6a4 4 0 018 0v2"/><rect x="4" y="8" width="16" height="12" rx="2"/></svg>,
  Sepatu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 16l4-9 3 5 3-7 3 7 3-5 2 9z"/></svg>,
  Aksesoris: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>,
};

const relatedKeywords: Record<string, string[]> = {
  'baju': ['kemeja', 'kaos', 'hoodie', 'jaket', 'dress', 'blouse', 't-shirt'],
  'kemeja': ['kemeja', 'baju', 'kaos', 'shirt', 'blouse'],
  'kaos': ['kaos', 't-shirt', 'baju', 'kemeja', 'hoodie'],
  'hoodie': ['hoodie', 'sweater', 'jaket', 'baju', 'kaos'],
  'jaket': ['jaket', 'jacket', 'hoodie', 'baju', 'denim'],
  'sepatu': ['sepatu', 'sneakers', 'shoes', 'boots'],
  'sandal': ['sandal', 'sendal', 'sandals', 'flip-flop', 'selop', 'sandal jepit'],
  'sneakers': ['sneakers', 'sepatu', 'shoes', 'sport', 'casual'],
  'tas': ['tas', 'bag', 'selempang', 'ransel', 'tote'],
  'selempang': ['selempang', 'tas', 'bag', 'sling'],
  'aksesoris': ['aksesoris', 'kacamata', 'jam', 'gelang', 'kalung'],
  'kacamata': ['kacamata', 'glasses', 'aksesoris', 'vintage'],
  'elektronik': ['elektronik', 'gadget', 'hp', 'laptop', 'headphone'],
};

const placeholderKeywords = ['Pakaian', 'Tas', 'Sepatu', 'Sandal', 'Aksesoris', 'Elektronik'];

const getProductsByHistory = (history: string[]): Product[] => {
  if (!history || history.length === 0) return [];
  
  const allKeywords: string[] = [];
  history.forEach(item => {
    const lowerItem = item.toLowerCase();
    let found = false;
    for (const [key, values] of Object.entries(relatedKeywords)) {
      if (lowerItem.includes(key) || values.some(v => lowerItem.includes(v))) {
        allKeywords.push(key, ...values);
        found = true;
      }
    }
    if (!found) {
      allKeywords.push(lowerItem);
    }
  });
  
  const uniqueKeywords = [...new Set(allKeywords)];
  
  const filtered = products.filter(p => {
    const productName = p.name.toLowerCase();
    const productCategory = p.category.toLowerCase();
    const productSeller = p.seller.toLowerCase();
    
    return uniqueKeywords.some(term => 
      productName.includes(term.toLowerCase()) ||
      productCategory.includes(term.toLowerCase()) ||
      productSeller.includes(term.toLowerCase())
    );
  });
  
  return filtered.slice(0, 6);
};

export default function SearchScreen({ onNavigate, searchQuery = '' }: SearchScreenProps) {
  const [search, setSearch] = useState(searchQuery);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    let history: string[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          history = parsed.slice(0, 5);
          setSearchHistory(history);
        }
      } catch (e) {}
    }
    
    if (history.length > 0) {
      setRecommendedProducts(getProductsByHistory(history));
      setShowHistory(true);
    } else {
      setRecommendedProducts([]);
      setShowHistory(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderKeywords.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setShowHistory(true);
      if (searchHistory.length > 0) {
        setRecommendedProducts(getProductsByHistory(searchHistory));
      } else {
        setRecommendedProducts([]);
      }
      return;
    }

    const newHistory = [trimmed, ...searchHistory.filter(h => h !== trimmed)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setShowHistory(false);

    const getRelatedTerms = (term: string): string[] => {
      const lowerTerm = term.toLowerCase();
      const related: string[] = [];
      
      for (const [key, values] of Object.entries(relatedKeywords)) {
        if (lowerTerm.includes(key) || values.some(v => lowerTerm.includes(v))) {
          related.push(key, ...values);
        }
      }
      
      if (related.length === 0) {
        related.push(term);
      }
      
      return [...new Set(related)];
    };

    const searchTerms = getRelatedTerms(trimmed);
    
    const filtered = products.filter(p => {
      const productName = p.name.toLowerCase();
      const productCategory = p.category.toLowerCase();
      const productSeller = p.seller.toLowerCase();
      
      return searchTerms.some(term => 
        productName.includes(term.toLowerCase()) ||
        productCategory.includes(term.toLowerCase()) ||
        productSeller.includes(term.toLowerCase())
      );
    });

    setSearchResults(filtered);
    setRecommendedProducts([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(search);
    }
  };

  const handleBack = () => {
    onNavigate(2);
  };

  const handleHistoryClick = (historyItem: string) => {
    setSearch(historyItem);
    setShowHistory(false);
    handleSearch(historyItem);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    setRecommendedProducts([]);
    setSearchResults([]);
    setShowHistory(false);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchResults([]);
    setShowHistory(true);
    if (searchHistory.length > 0) {
      setRecommendedProducts(getProductsByHistory(searchHistory));
    } else {
      setRecommendedProducts([]);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputFocus = () => {
    if (!search && searchHistory.length > 0) {
      setShowHistory(true);
      if (searchHistory.length > 0) {
        setRecommendedProducts(getProductsByHistory(searchHistory));
      }
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!search) {
        setShowHistory(false);
        if (searchHistory.length > 0) {
          setRecommendedProducts(getProductsByHistory(searchHistory));
        }
      }
    }, 200);
  };

  const isHistoryVisible = showHistory && searchHistory.length > 0;

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '12px 14px 14px' }}>
        {/* Search Bar dengan tombol Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
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

          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: 999,
            padding: '8px 14px',
            color: '#8A8475',
            fontSize: 12,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            height: 40,
          }}>
            <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value) {
                  setSearchResults([]);
                  setShowHistory(true);
                  if (searchHistory.length > 0) {
                    setRecommendedProducts(getProductsByHistory(searchHistory));
                  } else {
                    setRecommendedProducts([]);
                  }
                } else {
                  setShowHistory(false);
                }
              }}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder=""
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 12,
                color: '#1a1a1a',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                position: 'relative',
                zIndex: 2,
              }}
            />
            
            {!search && (
              <div
                style={{
                  position: 'absolute',
                  left: 32,
                  top: '50%',
                  transform: isTransitioning ? 'translateY(-100%)' : 'translateY(-50%)',
                  opacity: isTransitioning ? 0 : 1,
                  transition: 'all 0.3s ease-in-out',
                  fontSize: 12,
                  color: '#B0A99A',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                {placeholderKeywords[placeholderIndex]}
              </div>
            )}

            {search && (
              <button
                onClick={clearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#8A8475',
                  fontSize: 14,
                  padding: '0 4px',
                  zIndex: 2,
                  position: 'relative',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search History - Smooth dengan durasi 0.6s */}
        <div
          style={{
            transform: isHistoryVisible ? 'scaleY(1)' : 'scaleY(0)',
            opacity: isHistoryVisible ? 1 : 0,
            transformOrigin: 'top center',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            marginBottom: isHistoryVisible ? 14 : 0,
            maxHeight: isHistoryVisible ? 500 : 0,
            overflow: 'hidden',
          }}
        >
          {searchHistory.length > 0 && (
            <div style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #DED5C3',
              padding: '8px 0',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 14px 8px',
                borderBottom: '1px solid #F0EDE6',
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#8A8475' }}>Pencarian Terakhir</span>
                <button
                  onClick={clearHistory}
                  style={{
                    fontSize: 10,
                    color: '#C1543C',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Hapus Semua
                </button>
              </div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleHistoryClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 14px',
                    cursor: 'pointer',
                    borderRadius: 6,
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F0EDE6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg width="14" viewBox="0 0 24 24" fill="none" stroke="#8A8475" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span style={{ fontSize: 12, color: '#232A22' }}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pencarian Pilihan - naik/turun smooth dengan durasi 0.6s */}
        <div
          style={{
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {!search && !searchResults.length && recommendedProducts.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 600, margin: 0, color: '#2C4533' }}>
                  Pencarian Pilihan
                </h3>
                <span style={{ fontSize: 10, color: '#C68B59', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {recommendedProducts.length} produk
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                {recommendedProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => onNavigate(4, { productId: p.id })}
                    style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
                  >
                    <div style={{ aspectRatio: '1/1', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', color: p.iconColor }}>
                      <div style={{ width: '32%' }}>{productIcons[p.category] ?? productIcons['Pakaian']}</div>
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
            </div>
          )}
        </div>

        {/* Hasil Pencarian */}
        {searchResults.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 600, margin: 0, color: '#2C4533' }}>
                Hasil Pencarian
              </h3>
              <span style={{ fontSize: 10, color: '#C68B59', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {searchResults.length} produk ditemukan
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {searchResults.map(p => (
                <div
                  key={p.id}
                  onClick={() => onNavigate(4, { productId: p.id })}
                  style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
                >
                  <div style={{ aspectRatio: '1/1', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', color: p.iconColor }}>
                    <div style={{ width: '32%' }}>{productIcons[p.category] ?? productIcons['Pakaian']}</div>
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
          </div>
        )}

        {search && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 14, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Tidak ada produk yang ditemukan untuk "<strong>{search}</strong>"
            </p>
            <p style={{ fontSize: 11, color: '#B0A99A', marginTop: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Coba kata kunci lain seperti: Pakaian, Tas, Sepatu, atau Aksesoris
            </p>
          </div>
        )}

        {!search && !showHistory && searchHistory.length === 0 && searchResults.length === 0 && recommendedProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 14, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Cari barang favoritmu
            </p>
            <p style={{ fontSize: 11, color: '#B0A99A', marginTop: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Ketik kata kunci di atas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}