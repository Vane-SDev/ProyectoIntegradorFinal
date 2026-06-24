import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Wrench, Layers } from 'lucide-react';

export const ReportesScreen = () => {
  return (
    <div className="space-y-5 text-left pb-6">
      
      {/* 4 TARJETAS DE RESUMEN GERENCIAL */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "OTs Abiertas", val: "24", desc: "18% vs mes anterior", color: "text-[#007AFF]", bg: "bg-blue-50" },
          { label: "Preventivos", val: "142", desc: "Plan al 94%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Correctivos", val: "38", desc: "Promedio normal", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Fallas Críticas", val: "5", desc: "Requieren parada", color: "text-red-600", bg: "bg-red-50" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">{kpi.label}</span>
            <h3 className={`text-2xl font-black ${kpi.color}`}>{kpi.val}</h3>
            <span className="text-[9px] font-bold text-slate-400 block">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* GRÁFICO CSS 1: ESTADO DE ÓRDENES */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-black">
          <span className="text-[#0A2540] uppercase tracking-wider">Órdenes por Estado</span>
          <span className="text-slate-400 text-[10px]">Junio 2026</span>
        </div>

        {/* Falsa barra de progreso multi-color */}
        <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-0.5">
          <div className="bg-emerald-500 h-full w-[65%] rounded-l-full" title="65% Finalizadas"></div>
          <div className="bg-blue-500 h-full w-[20%]" title="20% En Proceso"></div>
          <div className="bg-amber-500 h-full w-[15%] rounded-r-full" title="15% Pendientes"></div>
        </div>

        <div className="flex justify-between text-[9px] font-black text-slate-500 pt-1">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 65% Fin</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 20% Proc</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 15% Pend</span>
        </div>
      </div>

      {/* GRÁFICO CSS 2: HISTOGRAMA DE MANTENIMIENTO POR MES */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-[#0A2540] uppercase tracking-wider">
          Mantenimiento Realizado (Semestral)
        </h3>

        {/* Falso gráfico de barras verticales */}
        <div className="h-32 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100">
          {[
            { mes: "Ene", val: 60 }, { mes: "Feb", val: 45 }, { mes: "Mar", val: 80 },
            { mes: "Abr", val: 95, current: true }, { mes: "May", val: 70 }, { mes: "Jun", val: 85 }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[9px] font-black text-slate-400">{bar.val}</span>
              <div 
                style={{ height: `${bar.val}%` }} 
                className={`w-full max-w-[24px] rounded-t-lg transition-all ${bar.current ? 'bg-[#007AFF] shadow-md shadow-blue-500/20' : 'bg-slate-200'}`}
              ></div>
              <span className={`text-[10px] font-black ${bar.current ? 'text-[#007AFF]' : 'text-slate-400'}`}>{bar.mes}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};