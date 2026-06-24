import React from 'react';
import { Search, Filter, History, Calendar, User, Wrench } from 'lucide-react';

const MOCK_HISTORIAL = [
  { fecha: "15/06/2026", equipo: "Bomba P-101", tipo: "Correctivo", trabajo: "Reemplazo de sello mecánico lateral", tec: "J. Pérez", horas: "3.5h" },
  { fecha: "10/06/2026", equipo: "Compresor C-05", tipo: "Preventivo", trabajo: "Cambio de aceite y filtros según plan", tec: "M. López", horas: "2.0h" },
  { fecha: "02/06/2026", equipo: "Bomba P-101", tipo: "Inspección", trabajo: "Medición de ruidos y ajuste de bancada", tec: "E. Dangelo", horas: "1.0h" },
  { fecha: "28/05/2026", equipo: "Tablero T-02", tipo: "Correctivo", trabajo: "Reemplazo de contactor térmico de línea", tec: "J. Pérez", horas: "1.5h" },
];

export const HistorialEquipoScreen = () => {
  return (
    <div className="space-y-4 md:space-y-6 text-left">
      
      {/* CABECERA CON FILTROS DE AUDITORÍA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Módulo de Auditoría</span>
          <span className="text-[11px] font-bold text-[#007AFF]">Filtrado: Últimos 30 días</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <select className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#0A2540] focus:outline-none">
            <option>Todos los Equipos</option>
            <option>Bomba P-101</option>
            <option>Compresor C-05</option>
          </select>
          <input type="date" defaultValue="2026-06-01" className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 focus:outline-none text-[11px]" />
          <select className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 focus:outline-none">
            <option>Tipo: Todos</option>
            <option>Preventivo</option>
            <option>Correctivo</option>
          </select>
        </div>
      </div>

      {/* TIMELINE DE INTERVENCIONES */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">
          Registro Histórico de Planta
        </h3>

        <div className="space-y-2.5">
          {MOCK_HISTORIAL.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-[#0A2540]">{item.equipo}</span>
                <span className="text-[#007AFF] bg-blue-50 px-2 py-0.5 rounded">{item.fecha}</span>
              </div>

              <p className="text-xs font-bold text-slate-700">{item.trabajo}</p>

              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-50">
                <span className="flex items-center gap-1 font-semibold">
                  <User size={13} className="text-slate-400" /> {item.tec}
                </span>
                <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {item.horas}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};