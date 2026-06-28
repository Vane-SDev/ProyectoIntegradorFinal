import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle2, Wrench, FileText, CheckSquare, Clipboard, History, Package } from 'lucide-react';

export const DashboardScreen = ({ onNavigate }) => {
  
  const [metricas, setMetricas] = useState({
    ordenesAbiertas: 0,
    ordenesVencidas: 0,
    equiposCriticos: 0,
    tareasHoy: 0,
    actividadReciente: []
  });
  const [cargando, setCargando] = useState(true);

 useEffect(() => {
    const refreshDashboard = async () => {
      try {
        // Obtenemos los resultados directamente
        const res = await Promise.all([
          api.getOrdenesTrabajo(),
          api.getActivos()
        ]);

        // Asignamos usando los índices del array
        const ordenes = Array.isArray(res[0]) ? res[0] : [];
        const activos = Array.isArray(res[1]) ? res[1] : [];

        const hoy = new Date().toISOString().split('T')[0];

        // Cálculos
        const abiertas = ordenes.filter(o => o.estado !== 'Finalizada');
        const vencidas = abiertas.filter(o => o.fecha_programada && o.fecha_programada < hoy);
        const criticos = activos.filter(a => a.estado === 'Crítico' || a.estado === 'Alerta');
        const hoyList = ordenes.filter(o => (o.fecha_programada || '').split('T')[0] === hoy);

        const ultimasTres = [...ordenes].reverse().slice(0, 3).map(o => ({
          fecha: o.fecha_programada ? new Date(o.fecha_programada).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) : 'Hoy',
          equipo: o.activo_nombre || `OT #${o.numero_ot}`,
          estado: o.estado || 'Pendiente'
        }));

        setMetricas({
          ordenesAbiertas: abiertas.length,
          ordenesVencidas: vencidas.length,
          equiposCriticos: criticos.length,
          tareasHoy: hoyList.length,
          actividadReciente: ultimasTres
        });
        
        setCargando(false);
      } catch (err) {
        console.error("Error al traer datos:", err);
      }
    };

    refreshDashboard();
    const interval = setInterval(refreshDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 text-left animate-in fade-in duration-200">
      
      {/* GRILLA DE TARJETAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "OT Abiertas", val: metricas.ordenesAbiertas, color: "text-[#007AFF]", bg: "bg-blue-50", border: "border-blue-100", icon: Clock },
          { label: "OT Vencidas", val: metricas.ordenesVencidas, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", icon: AlertTriangle },
          { label: "OT Críticas", val: metricas.equiposCriticos, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", icon: ShieldAlert },
          { label: "OT finalizadas en el día", val: metricas.tareasHoy, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: CheckCircle2 }
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-4 md:p-6 rounded-2xl border ${kpi.border} flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm`}>
            <div>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-tight">{kpi.label}</p>
              <h3 className={`text-2xl md:text-3xl font-black mt-0.5 ${kpi.color}`}>
                {cargando ? '...' : kpi.val}
              </h3>
            </div>
            <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color} self-end sm:self-auto`}>
              <kpi.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* ACCESOS DE OPERACIÓN CONECTADOS */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Accesos de Operación</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { title: "Activos", icon: Wrench, action: () => onNavigate('activos') },
            { title: "Órdenes (OT)", icon: FileText, action: () => onNavigate('ordenes') },
            { title: "Mis Tareas (OT)", icon: CheckSquare, action: () => onNavigate('tareas'), highlight: true },
            { title: "Inspecciones", icon: Clipboard, action: () => onNavigate('inspecciones') },
            { title: "Repuestos", icon: Package, action: () => onNavigate('repuestos') },
            /* TRUCO DE HISTORIAL: Mandamos a la pantalla de órdenes pero indicando que abra en modo historial */
            { title: "Historial", icon: History, action: () => onNavigate('historial') },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`p-4 md:p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 font-bold text-xs transition-all text-center cursor-pointer active:scale-95 ${
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

      {/* TABLA DINÁMICA DE RECIENTES */}
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
              {cargando ? (
                <tr><td colSpan={3} className="p-8 text-center text-slate-400">Leyendo base de datos...</td></tr>
              ) : metricas.actividadReciente.length > 0 ? (
                metricas.actividadReciente.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 md:px-6 text-xs text-slate-400 whitespace-nowrap font-mono">{row.fecha}</td>
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
                ))
              ) : (
                <tr><td colSpan={3} className="p-8 text-center text-slate-400">Sin movimientos registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};