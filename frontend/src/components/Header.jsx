import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, LogOut } from 'lucide-react';

export const Header = ({ title, onLogout }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 z-10">
      <h1 className="text-xs md:text-sm font-black text-[#0A2540] tracking-wider uppercase">
        {title}
      </h1>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Indicador de red dinámico */}
        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
          isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {isOnline ? <Wifi size={12} className="text-emerald-500" /> : <WifiOff size={12} />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-xs">VS</div>
          <button onClick={onLogout} className="md:hidden p-2 text-slate-400 hover:text-red-500">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};