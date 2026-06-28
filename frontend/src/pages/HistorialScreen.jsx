import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { History, ShieldCheck, RefreshCw, Calendar, UserCheck, CheckCircle2, Wrench } from 'lucide-react';

export const HistorialScreen = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const data = await api.getOrdenesTrabajo();
      // Filtrado de ordenes cerradas
      const selladas = data.filter(ot => ot.estado === 'Finalizada');
      setRegistros(selladas);
    } catch (err) {
      console.error("Error leyendo archivo histórico:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarHistorial(); }, []);

  const formatearFecha = (isoString) => {
    if (!isoString) return 'S/F';
    const [anio, mes, dia] = isoString.split('T')[0].split('-');
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left pb-16 animate-in fade-in duration-200">
      
      {/* HEADER*/}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
            <ShieldCheck size={16} /> Registro Oficial de Planta
          </div>
          <h2 className="text-2xl font-black tracking-tight">Historial de Intervenciones</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Listado definitivo de mantenimientos completados, verificados y sellados. Los datos expuestos no admiten modificaciones transaccionales.
          </p>
        </div>

        <button
          onClick={cargarHistorial}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-emerald-400" : ""} />
          <span>Actualizar Archivo</span>
        </button>
      </div>

      {/* GRILLA DE DATOS SELLADOS */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 px-6 flex justify-between items-center">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <History size={16} className="text-slate-700" /> Nómina de Órdenes Selladas
          </span>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Total archivado: {registros.length}
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw size={32} className="animate-spin text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auditando tablas de MySQL...</p>
          </div>
        ) : registros.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <CheckCircle2 size={40} className="mx-auto text-slate-300" />
            <h4 className="font-black text-slate-700 text-sm">Archivo histórico vacío</h4>
            <p className="text-xs text-slate-400">Aún no se han despachado órdenes que hayan alcanzado el estado "Finalizada".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Identificador</th>
                  <th className="py-4 px-6">Equipo / Activo</th>
                  <th className="py-4 px-6">Labor Realizada</th>
                  <th className="py-4 px-6">Técnico Responsable</th>
                  <th className="py-4 px-6 text-right">Fecha de Cierre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                {registros.map((row) => (
                  <tr key={row.id_ot} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-mono font-black text-sm text-[#0A2540] block">{row.numero_ot}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{row.tipo_mantenimiento}</span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Wrench size={14} className="text-slate-400 shrink-0" />
                        <div>
                          <span className="font-black text-slate-800 block">{row.activo_nombre || 'Activo s/d'}</span>
                          <span className="font-mono text-[10px] text-slate-400">[{row.activo_codigo || 'REF-00'}]</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 font-normal leading-relaxed" title={row.descripcion}>
                        {row.descripcion || 'Mantenimiento completado según protocolo estándar.'}
                      </p>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold">
                        <UserCheck size={13} className="text-emerald-600" />
                        <span>{row.tecnico_nombre || row.asignado_a || 'Personal de Planta'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-500 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{formatearFecha(row.fecha_programada)}</span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};