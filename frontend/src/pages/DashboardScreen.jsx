import React from 'react';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle2, Wrench, FileText, CheckSquare, Clipboard, History } from 'lucide-react';

const MOCK_DATA = {
  dashboard: {
    ordenesAbiertas: 24,
    ordenesVencidas: 3,
    equiposCriticos: 5,
    tareasHoy: 12,
    actividadReciente: [
      { fecha: "15/06", equipo: "Bomba P-101", estado: "Finalizada" },
      { fecha: "15/06", equipo: "Compresor C-05", estado: "Pendiente" },
      { fecha: "14/06", equipo: "Tablero T-02", estado: "En proceso" }
    ]
  }
};

export const DashboardScreen = ({ onNavigate }) => {
  const { dashboard } = MOCK_DATA;

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* GRILLA DE TARJETAS: 2 columnas en Mobile, 4 en Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Abiertas", val: dashboard.ordenesAbiertas, color: "text-[#007AFF]", bg: "bg-blue-50", border: "border-blue-100", icon: Clock },
          { label: "Vencidas", val: dashboard.ordenesVencidas, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", icon: AlertTriangle },
          { label: "Críticos", val: dashboard.equiposCriticos, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", icon: ShieldAlert },
          { label: "Hoy", val: dashboard.tareasHoy, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: CheckCircle2 }
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-4 md:p-6 rounded-2xl border ${kpi.border} flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm`}>
            <div>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-tight">{kpi.label}</p>
              <h3 className={`text-2xl md:text-3xl font-black mt-0.5 ${kpi.color}`}>{kpi.val}</h3>
            </div>
            <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color} self-end sm:self-auto`}>
              <kpi.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* ACCESOS RÁPIDOS: Scroll horizontal en mobile, grilla en desktop */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Accesos de Operación</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { title: "Activos", icon: Wrench, id: "activos" },
            { title: "Órdenes (OT)", icon: FileText, id: "ordenes" },
            { title: "Mis Tareas", icon: CheckSquare, id: "tareas", highlight: true },
            { title: "Inspecciones", icon: Clipboard, id: "inspecciones" },
            { title: "Historial", icon: History, id: "historial" },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={() => onNavigate(btn.id)}
              className={`p-4 md:p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 font-bold text-xs transition-all text-center ${
                btn.highlight 
                  ? 'bg-[#0A2540] text-white border-transparent hover:bg-[#007AFF] shadow-md' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-[#007AFF] hover:text-[#007AFF]'
              }`}
            >
              <btn.icon size={22} />
              <span className="line-clamp-1">{btn.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TABLA RECIENTE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-[#0A2540] text-xs md:text-sm">Actividad Reciente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold px-4">
              <tr>
                <th className="py-3 px-4 md:px-6">Fecha</th>
                <th className="py-3 px-4 md:px-6">Equipo</th>
                <th className="py-3 px-4 md:px-6">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {dashboard.actividadReciente.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 md:px-6 text-xs text-slate-400 whitespace-nowrap">{row.fecha}</td>
                  <td className="py-3 px-4 md:px-6 font-bold text-[#0A2540] whitespace-nowrap">{row.equipo}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      row.estado === 'Finalizada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      row.estado === 'Pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {row.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};