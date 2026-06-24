import React from 'react';
import { Home, Box, FileText, CheckSquare, Clipboard, Users, LogOut, Bell, WifiOff } from 'lucide-react';

export const MainLayout = ({ children, activeTab, onNavigate }) => {
  const getHeaderTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return 'DASHBOARD TÉCNICO';
      case 'activos': return 'GESTIÓN DE ACTIVOS';
      case 'detalle-activo': return 'FICHA DE ACTIVO';
      default: return tab.toUpperCase();
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, title: 'Dashboard', bottom: true },
    { id: 'activos', icon: Box, title: 'Activos', bottom: true },
    { id: 'ordenes', icon: FileText, title: 'Órdenes', bottom: false },
    { id: 'tareas', icon: CheckSquare, title: 'Mis Tareas', bottom: true },
    { id: 'inspecciones', icon: Clipboard, title: 'Inspecciones', bottom: true }
  ];

  return (
    <div className="flex h-screen bg-[#F4F6F8] text-[#2D3748] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR (DESKTOP / TABLET) ================= */}
      {/* Oculto en mobile (hidden), visible a partir de 768px (md:flex) */}
      <aside className="hidden md:flex w-20 bg-[#0A2540] flex-col items-center py-6 justify-between border-r border-[#1B365D] shrink-0 z-20">
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="font-black text-white text-xl tracking-tighter bg-blue-600/30 p-2 rounded">Σ</div>
          <nav className="flex flex-col gap-4 w-full px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.title}
                className={`p-3 rounded-xl flex justify-center transition-all ${
                  activeTab === item.id ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <item.icon size={22} />
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <button onClick={() => onNavigate('usuarios')} className="text-slate-400 hover:text-white" title="Usuarios"><Users size={20} /></button>
          <button onClick={() => onNavigate('login')} className="text-red-400 hover:text-red-300" title="Cerrar Sesión"><LogOut size={20} /></button>
        </div>
      </aside>

      {/* ================= CONTENEDOR PRINCIPAL ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* HEADER UNIVERSAL */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="md:hidden font-black text-xl text-[#0A2540]">Σ</span>
            <h1 className="text-xs md:text-sm font-black text-[#0A2540] tracking-wider uppercase">
              {getHeaderTitle(activeTab)}
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              <WifiOff size={12} className="text-slate-400" />
              <span className="text-[10px] uppercase">Offline</span>
            </div>

            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-xs">VS</div>
              {/* Botón de salida explícito para pantallas móviles */}
              <button 
                onClick={() => onNavigate('login')} 
                title="Salir al Login"
                className="md:hidden p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* ÁREA DE SCROLL (Con padding inferior extra en mobile para no pisar la barra) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* ================= BOTTOM NAVIGATION BAR (MOBILE) ================= */}
        {/* Visible por defecto, se oculta a partir de 768px (md:hidden) */}
        <nav className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-[#0A2540] text-white flex items-center justify-around px-2 z-30 shadow-2xl border-t border-slate-800">
          {navItems.filter(i => i.bottom).map((btn) => (
            <button
              key={btn.id}
              onClick={() => onNavigate(btn.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all relative ${
                activeTab === btn.id ? 'text-[#007AFF]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <btn.icon size={20} className={activeTab === btn.id ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className="text-[9px] font-bold mt-0.5 tracking-tight">{btn.title}</span>
              {activeTab === btn.id && (
                <span className="absolute top-1 w-1 h-1 bg-[#007AFF] rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

      </div>
    </div>
  );
};