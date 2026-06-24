import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Filter, Plus, Eye, CheckCircle, Calendar as CalendarIcon, List, RefreshCw, AlertTriangle, Clock } from 'lucide-react';

export const OrdenesScreen = ({ onNavigate, onSelectOrden }) => {
  const [viewMode, setViewMode] = useState('list');
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Diccionario visual de Tailwind para los estados
  const getBadgeEstado = (estado) => {
    switch (estado) {
      case 'Finalizada': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'En Curso': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pendiente': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelada': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getBadgePrioridad = (pri) => {
    switch (pri) {
      case 'Alta': return 'text-rose-600 font-black';
      case 'Media': return 'text-amber-600 font-bold';
      case 'Baja': return 'text-emerald-600 font-medium';
      default: return 'text-slate-500';
    }
  };

  const traerOrdenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrdenes();
      setOrdenes(data);
    } catch (err) {
      console.error("Error al traer OTs:", err);
      setError("No se pudo establecer conexión con la tabla de Órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    traerOrdenes();
  }, []);

  // ACCIÓN OPERATIVA: Cierre de OT
  const handleCerrarOT = async (idOt, numOt) => {
    if (!window.confirm(`¿Dar por finalizada la orden ${numOt}?`)) return;
    try {
      await api.actualizarEstadoOrden(idOt, 'Finalizada');
      // Actualizamos el DOM al instante sin gastar red
      setOrdenes(prev => prev.map(ot => ot.id_ot === idOt ? { ...ot, estado: 'Finalizada' } : ot));
    } catch (err) {
      alert("Error del servidor al intentar cerrar la orden.");
    }
  };

  const formatearFecha = (isoString) => {
    if (!isoString) return 'S/F';
    const [anio, mes, dia] = isoString.split('T')[0].split('-');
    return `${dia}/${mes}/${anio}`;
  };
  return (
    <div className="space-y-6 text-left pb-12 max-w-6xl mx-auto">

      {/* HEADER DE GESTIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={16} />
              <span>Listado MySQL</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'calendar' ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <CalendarIcon size={16} />
              <span>Planificación Gantt</span>
            </button>
          </div>

          <button
            onClick={traerOrdenes}
            title="Sincronizar base"
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#007AFF]" : ""} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('crear-orden')}
          className="flex items-center justify-center gap-2 bg-[#0A2540] hover:bg-[#007AFF] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all w-full md:w-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Generar Nueva OT</span>
        </button>
      </div>

      {/* TABLA CONECTADA */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 px-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} className="text-[#007AFF]" /> Despacho de Intervenciones
            </span>
            <span className="text-xs font-bold text-[#0A2540]">Total: {ordenes.length} órdenes</span>
          </div>

          {loading && (
            <div className="p-12 text-center space-y-3">
              <RefreshCw size={28} className="animate-spin text-[#007AFF] mx-auto" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leyendo OTs en MySQL...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-8 text-center bg-rose-50/30">
              <AlertTriangle className="text-rose-600 mx-auto mb-2" size={28} />
              <p className="text-xs font-bold text-rose-800">{error}</p>
            </div>
          )}

          {!loading && !error && ordenes.length === 0 && (
            <div className="p-12 text-center text-xs text-slate-400 font-bold">
              No hay Órdenes de Trabajo despachadas en el sistema.
            </div>
          )}

          {!loading && !error && ordenes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold px-6">
                  <tr>
                    <th className="py-3 px-6">Nº OT / Prioridad</th>
                    <th className="py-3 px-6">Activo Objetivo</th>
                    <th className="py-3 px-6">Tipo</th>
                    <th className="py-3 px-6">Asignado a</th>
                    <th className="py-3 px-6">Programación</th>
                    <th className="py-3 px-6">Estado</th>
                    <th className="py-3 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium text-xs">
                  {ordenes.map((row) => (
                    <tr key={row.id_ot} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <span className="font-black text-sm text-[#0A2540] block">{row.numero_ot}</span>
                        <span className={`text-[10px] uppercase tracking-wider ${getBadgePrioridad(row.prioridad)}`}>
                          {row.prioridad || 'Media'}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 font-bold text-slate-800">
                        {row.activo_nombre || <span className="text-slate-400 italic">Equipo Eliminado</span>}
                        <span className="block font-mono font-normal text-[10px] text-slate-400">
                          [{row.activo_codigo || 'S/C'}]
                        </span>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold text-[10px]">
                          {row.tipo_mantenimiento}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 font-semibold text-slate-600">
                        {row.tecnico_nombre || <span className="text-slate-400 italic font-normal">Sin asignar</span>}
                      </td>

                      <td className="py-3.5 px-6 text-slate-500 font-medium font-semibold">
                        {formatearFecha(row.fecha_programada)}
                      </td>

                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getBadgeEstado(row.estado)}`}>
                          {row.estado}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (onSelectOrden) onSelectOrden(row);
                            onNavigate('tareas');
                          }}
                          title="Abrir Ficha Operativa"
                          className="p-1.5 bg-blue-50 text-[#007AFF] hover:bg-blue-100 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye size={14} /> Ver
                        </button>

                        {row.estado !== 'Finalizada' && (
                          <button
                            onClick={() => handleCerrarOT(row.id_ot, row.numero_ot)}
                            title="Dar por Finalizada"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <CheckCircle size={14} /> Fin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* GANTT*/}
      {viewMode === 'calendar' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="inline-flex p-4 bg-blue-50 text-[#007AFF] rounded-2xl">
            <CalendarIcon size={36} />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-[#0A2540]">Gantt de Mantenimiento Preventivo</h3>
            <p className="text-xs text-slate-400 mt-1">
              Visualización de intervenciones programadas por el motor de inteligencia de SIGMA para los próximos 30 días.
            </p>
          </div>
          <div className="space-y-2 pt-4 max-w-xl mx-auto text-left">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Bomba P-101 (Lubricación)</span>
              <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#007AFF] w-3/4 h-full rounded-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Semana 2</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Compresor C-05 (Ajuste de correas)</span>
              <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 w-1/3 h-full rounded-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Semana 4</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};