// src/hooks/useDeviceSimulator.ts
import { useEffect, useState } from 'react';

export const useDeviceSimulator = () => {
  const [isSimulator, setIsSimulator] = useState(false);

  useEffect(() => {
    // Cek apakah sedang di mode simulator (device toolbar aktif)
    const checkSimulator = () => {
      // Cek lebar layar vs lebar viewport
      const isMobileView = window.innerWidth < 768;
      
      // Cek apakah ada indikasi device toolbar aktif
      const hasDeviceFrame = document.querySelector('[data-device-frame]') !== null;
      
      // Cek user agent untuk simulator
      const isSimulatorUA = /Chrome/.test(navigator.userAgent) && 
                           (window.navigator.userAgent.includes('Mobile') || 
                            window.innerWidth < 768);
      
      setIsSimulator(isMobileView || hasDeviceFrame || isSimulatorUA);
    };

    checkSimulator();
    window.addEventListener('resize', checkSimulator);
    
    // Observer untuk perubahan DOM (device toolbar)
    const observer = new MutationObserver(checkSimulator);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', checkSimulator);
      observer.disconnect();
    };
  }, []);

  return isSimulator;
};