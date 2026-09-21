// src/pages/Index.tsx
import { useState, useEffect } from 'react';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import KategoriScreen from '../screens/KategoriScreen';
import DetailProdukScreen from '../screens/DetailProdukScreen';
import JualBarangScreen from '../screens/JualBarangScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatConversationScreen from '../screens/ChatConversationScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AkunScreen from '../screens/AkunScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
import Profilsaya from '../screens/Profilsaya';
import PengaturanAkunScreen from '../screens/PengaturanAkunScreen';
import BantuanScreen from '../screens/BantuanScreen';
import MetodePembayaranScreen from '../screens/MetodePembayaranScreen';
import AlamatScreen from '../screens/AlamatScreen';
import FavoritScreen from '../screens/FavoritScreen';
import ProfilPenjualScreen from '../screens/ProfilPenjualScreen';
import PesananScreen from '../screens/PesananScreen';

type NavigateExtra = { 
  productId?: number; 
  chatId?: number; 
  from?: number; 
  searchQuery?: string; 
  category?: string;
  sellerName?: string;
  sellerLocation?: string;
};

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [prevScreen, setPrevScreen] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasBeenToCheckout, setHasBeenToCheckout] = useState(false);
  
  // State untuk extra data Profil Penjual
  const [sellerData, setSellerData] = useState<{ sellerName: string; sellerLocation: string; productId: number }>({
    sellerName: '',
    sellerLocation: '',
    productId: 1
  });

  // State untuk melacak level kategori
  const [categoryLevel, setCategoryLevel] = useState<'main' | 'products' | 'detail'>('main');
  const [lastCategoryScreen, setLastCategoryScreen] = useState<number>(3);
  // State untuk menyimpan kategori yang dipilih saat di halaman produk kategori
  const [savedCategory, setSavedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (currentScreen !== 3 && currentScreen !== 4) {
      if (currentScreen === 3 || currentScreen === 4) {
        setLastCategoryScreen(currentScreen);
      }
    }
  }, [currentScreen]);

  const navigate = (screen: number, extra?: NavigateExtra) => {
    if (screen === 4 && prevScreen === 7) {
      setHasBeenToCheckout(true);
    }
    
    if (screen === 2) {
      setHasBeenToCheckout(false);
    }
    
    setPrevScreen(currentScreen);
    if (extra?.productId !== undefined) setSelectedProductId(extra.productId);
    if (extra?.chatId !== undefined) setSelectedChatId(extra.chatId);
    if (extra?.searchQuery !== undefined) setSearchQuery(extra.searchQuery);
    
    if (extra?.sellerName !== undefined && extra?.sellerLocation !== undefined) {
      setSellerData({
        sellerName: extra.sellerName,
        sellerLocation: extra.sellerLocation,
        productId: extra.productId || selectedProductId
      });
    }

    // Jika navigasi ke kategori dengan category
    if (screen === 3 && extra?.category !== undefined) {
      setSelectedCategory(extra.category);
      setSavedCategory(extra.category);
      setCategoryLevel('products');
      setLastCategoryScreen(3);
    }

    // Jika navigasi ke kategori tanpa category (dari bottom nav)
    if (screen === 3 && extra?.category === undefined) {
      if (categoryLevel === 'detail' && selectedCategory) {
        setLastCategoryScreen(4);
        setCurrentScreen(4);
        return;
      } else if (categoryLevel === 'products' && selectedCategory) {
        setLastCategoryScreen(3);
        setCurrentScreen(3);
        return;
      } else {
        setSelectedCategory(null);
        setSavedCategory(null);
        setCategoryLevel('main');
        setLastCategoryScreen(3);
      }
    }

    if (screen === 4) {
      if (extra?.category) {
        setSelectedCategory(extra.category);
        setSavedCategory(extra.category);
        setCategoryLevel('detail');
        setLastCategoryScreen(4);
      } else if (selectedCategory) {
        setCategoryLevel('detail');
        setLastCategoryScreen(4);
      }
    }

    if (screen !== 3 && screen !== 4) {
      // State tetap dipertahankan
    }

    setCurrentScreen(screen);
  };

  const handleBackFromDetail = () => {
    console.log('handleBackFromDetail - hasBeenToCheckout:', hasBeenToCheckout);
    console.log('handleBackFromDetail - prevScreen:', prevScreen);
    console.log('handleBackFromDetail - selectedCategory:', selectedCategory);
    console.log('handleBackFromDetail - savedCategory:', savedCategory);
    console.log('handleBackFromDetail - categoryLevel:', categoryLevel);
    
    if (hasBeenToCheckout) {
      setHasBeenToCheckout(false);
      setCurrentScreen(2);
      return;
    }
    
    if (prevScreen === 7) {
      setCurrentScreen(2);
      return;
    }
    
    // Jika berasal dari Kategori, kembali ke Kategori dengan kategori yang sama
    if (prevScreen === 3 || savedCategory || selectedCategory) {
      const categoryToUse = savedCategory || selectedCategory;
      if (categoryToUse) {
        setSelectedCategory(categoryToUse);
        setSavedCategory(categoryToUse);
        setCategoryLevel('products');
      } else {
        setCategoryLevel('main');
      }
      setCurrentScreen(3);
      return;
    }
    
    setCurrentScreen(prevScreen);
  };

  const handleBackFromCategoryProduct = () => {
    console.log('handleBackFromCategoryProduct - called');
    setCategoryLevel('main');
    setSelectedCategory(null);
    setSavedCategory(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return <SplashScreen onNavigate={navigate} />;
      case 2:
        return <HomeScreen onNavigate={navigate} />;
      case 3:
        return <KategoriScreen
          onNavigate={navigate}
          selectedCategory={selectedCategory}
          isInCategoryDetail={categoryLevel === 'products' || categoryLevel === 'detail'}
          onBackFromCategoryProduct={handleBackFromCategoryProduct}
          onLeaveCategory={() => {
            if (categoryLevel === 'main') {
              setSelectedCategory(null);
              setSavedCategory(null);
              setCategoryLevel('main');
            }
          }}
        />;
      case 4:
        return <DetailProdukScreen
          onNavigate={navigate}
          productId={selectedProductId}
          prevScreen={prevScreen}
          onBack={handleBackFromDetail}
        />;
      case 5:
        return <JualBarangScreen onNavigate={navigate} />;
      case 6:
        return <ChatScreen onNavigate={navigate} />;
      case 9:
        return <FavoritScreen onNavigate={navigate} />;
      case 61:
        return <ChatConversationScreen onNavigate={navigate} chatId={selectedChatId} />;
      case 7:
        return <CheckoutScreen onNavigate={navigate} productId={selectedProductId} />;
      case 8:
        return <AkunScreen onNavigate={navigate} />;
      case 10:
        return <OrderSuccessScreen onNavigate={navigate} productId={selectedProductId} />;
      case 11:
        return <SearchScreen onNavigate={navigate} searchQuery={searchQuery} />;
      case 12:
        return <NotificationScreen onNavigate={navigate} />;
      case 13:
        return <Profilsaya onNavigate={navigate} />;
      case 14:
        return <PengaturanAkunScreen onNavigate={navigate} />;
      case 15:
        return <BantuanScreen onNavigate={navigate} />;
      case 16:
        return <MetodePembayaranScreen onNavigate={navigate} />;
      case 17:
        return <AlamatScreen onNavigate={navigate} />;
      case 18:
        return <ProfilPenjualScreen 
          onNavigate={navigate} 
          sellerName={sellerData.sellerName}
          sellerLocation={sellerData.sellerLocation}
          productId={sellerData.productId}
        />;
      case 19:
        return <PesananScreen onNavigate={navigate} />;
      default:
        return <SplashScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="preloved-bg" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#F7F3EC'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#F7F3EC',
        overflow: 'hidden'
      }}>
        {renderScreen()}
      </div>
    </div>
  );
}