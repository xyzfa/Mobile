// src/components/iPhoneFrame.tsx
import React, { ReactNode } from 'react';

interface iPhoneFrameProps {
  children: ReactNode;
}

const iPhoneFrame: React.FC<iPhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[430px] min-h-[780px] bg-white rounded-[40px] shadow-2xl overflow-hidden" style={{ height: '90vh' }}>
        {/* Notch iPhone */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border-2 border-gray-800"></div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-8 pt-3 pb-2 bg-white z-40 relative">
          <span className="text-sm font-semibold text-gray-900">
            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs">📶</span>
            <span className="text-xs">📶</span>
            <span className="text-xs">🔋</span>
          </div>
        </div>

        {/* Konten Aplikasi */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 44px)' }}>
          {children}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-50">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default iPhoneFrame;