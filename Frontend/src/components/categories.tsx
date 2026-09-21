// src/data/categories.tsx
import React from 'react';
import { products } from '../data/preloved';

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  bgColor: string;
  iconColor: string;
}

// Ikon untuk setiap kategori
export const categoryIcons: Record<string, React.ReactNode> = {
  Pakaian: (
    <svg width="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l3-2 3 2"/>
      <path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
    </svg>
  ),
  Tas: (
    <svg width="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8V6a4 4 0 018 0v2"/>
      <rect x="4" y="8" width="16" height="12" rx="2"/>
    </svg>
  ),
  Sepatu: (
    <svg width="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16l4-9 3 5 3-7 3 7 3-5 2 9z"/>
    </svg>
  ),
  Aksesoris: (
    <svg width="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Elektronik: (
    <svg width="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="12" rx="2"/>
      <path d="M8 20h8"/>
      <path d="M12 16v4"/>
    </svg>
  ),
  Lainnya: (
    <svg width="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
      <circle cx="5" cy="12" r="1"/>
    </svg>
  ),
};

// Daftar kategori dengan jumlah item
export const getCategories = (): Category[] => {
  const categoryMap: Record<string, number> = {};
  
  // Hitung jumlah produk per kategori
  products.forEach(p => {
    const cat = p.category;
    if (categoryMap[cat]) {
      categoryMap[cat]++;
    } else {
      categoryMap[cat] = 1;
    }
  });

  // Daftar semua kategori
  const allCategories = ['Pakaian', 'Tas', 'Sepatu', 'Aksesoris', 'Elektronik', 'Lainnya'];
  
  return allCategories.map(name => ({
    id: name.toLowerCase(),
    name,
    icon: categoryIcons[name] || categoryIcons['Lainnya'],
    count: categoryMap[name] || 0,
    bgColor: name === 'Pakaian' ? '#F1E2CC' :
             name === 'Tas' ? '#E7EEE3' :
             name === 'Sepatu' ? '#EDE8F5' :
             name === 'Aksesoris' ? '#F5EDDE' :
             name === 'Elektronik' ? '#DDEAF5' :
             '#F0EDE6',
    iconColor: name === 'Pakaian' ? '#C68B59' :
               name === 'Tas' ? '#3F6048' :
               name === 'Sepatu' ? '#7B5EA7' :
               name === 'Aksesoris' ? '#A0522D' :
               name === 'Elektronik' ? '#4A6FA5' :
               '#8A8475',
  }));
};

// Produk per kategori
export const getProductsByCategory = (categoryName: string) => {
  if (categoryName === 'Lainnya') {
    // Untuk "Lainnya", tampilkan produk dengan kategori yang tidak termasuk di atas
    const mainCategories = ['Pakaian', 'Tas', 'Sepatu', 'Aksesoris', 'Elektronik'];
    return products.filter(p => !mainCategories.includes(p.category));
  }
  return products.filter(p => p.category === categoryName);
};