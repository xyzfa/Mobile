// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routers } from "./router";
import React from 'react';
import './index.css';

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(routers);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* iPhone Frame Container */}
        <div className="iphone-container">
          <div className="iphone-frame">
            {/* Notch iPhone */}
            <div className="iphone-notch">
              <div className="iphone-notch-camera"></div>
            </div>

            {/* Status Bar - Dengan Icon SVG Realistis */}
            <div className="iphone-status-bar">
              <span className="status-time">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="status-icons">
                {/* Icon Sinyal */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <rect x="0" y="8" width="2" height="4" rx="0.5" fill="#1a1a1a"/>
                  <rect x="3.5" y="5.5" width="2" height="6.5" rx="0.5" fill="#1a1a1a"/>
                  <rect x="7" y="3" width="2" height="9" rx="0.5" fill="#1a1a1a"/>
                  <rect x="10.5" y="0.5" width="2" height="11.5" rx="0.5" fill="#1a1a1a"/>
                </svg>

                {/* Icon WiFi */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M8 10.5C7.17 10.5 6.5 9.83 6.5 9C6.5 8.17 7.17 7.5 8 7.5C8.83 7.5 9.5 8.17 9.5 9C9.5 9.83 8.83 10.5 8 10.5Z" fill="#1a1a1a"/>
                  <path d="M5.5 7.5C6.5 6.5 7.5 6 8 6C8.5 6 9.5 6.5 10.5 7.5" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M3 5C4.5 3.5 6 3 8 3C10 3 11.5 3.5 13 5" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>

                {/* Icon Baterai */}
                <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                  <rect x="0.5" y="0.5" width="19" height="11" rx="2" stroke="#1a1a1a" strokeWidth="1.2"/>
                  <rect x="21" y="3.5" width="2" height="5" rx="1" fill="#1a1a1a"/>
                  <rect x="2.5" y="2.5" width="15" height="7" rx="1" fill="#1a1a1a" opacity="0.8"/>
                </svg>
              </div>
            </div>

            {/* Konten Aplikasi */}
            <div className="iphone-content">
              <RouterProvider router={router} />
            </div>

            {/* Home Indicator */}
            <div className="iphone-home-indicator">
              <div className="home-indicator-bar"></div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;