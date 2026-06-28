import React from 'react';
import { Header } from './Header';
import { Home, Box, FileText, CheckSquare, Clipboard, Users, LogOut, Package } from 'lucide-react';

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
    { id: 'inspecciones', icon: Clipboard, title: 'Inspecciones', bottom: true },
    { id: 'repuestos', icon: Package, title: 'Repuestos', bottom: true }
  ];

  return (
    <div className="flex h-screen bg-[#F4F6F8] text-[#2D3748] font-sans overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-20 bg-[#0A2540] flex-col items-center py-6 justify-between border-r border-[#1B365D] shrink-0 z-20">
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="font-black text-white text-xl tracking-tighter bg-blue-600/30 p-2 rounded">Σ</div>
          <nav className="flex flex-col gap-4 w-full px-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => onNavigate(item.id)} className={`p-3 rounded-xl flex justify-center transition-all ${activeTab === item.id ? 'bg-[#007AFF] text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                <item.icon size={22} />
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <button onClick={() => onNavigate('usuarios')} className="text-slate-400"><Users size={20} /></button>
          <button onClick={() => onNavigate('login')} className="text-red-400"><LogOut size={20} /></button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={getHeaderTitle(activeTab)} onLogout={() => onNavigate('login')} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        
        {/* Navigation Mobile */}
        <nav className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-[#0A2540] text-white flex items-center justify-around z-30">
          {navItems.filter(i => i.bottom).map((btn) => (
            <button key={btn.id} onClick={() => onNavigate(btn.id)} className={`flex flex-col items-center justify-center w-16 h-full ${activeTab === btn.id ? 'text-[#007AFF]' : 'text-slate-400'}`}>
              <btn.icon size={20} />
              <span className="text-[9px] font-bold mt-0.5">{btn.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};