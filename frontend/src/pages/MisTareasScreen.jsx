import React, { useState } from 'react';
import { api } from '../services/api';
import { Play, CheckCircle2, FileEdit, AlertOctagon, Clock, ArrowLeft, AlertTriangle } from 'lucide-react';

export const MisTareasScreen = ({ ot, onNavigate }) => {
  const [loading, setLoading] = useState(false);

  if (!ot) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center max-w-md mx-auto mt-12 space-y-3 shadow-sm">
        <AlertTriangle className="text-amber-600 mx-auto animate-bounce" size={32} />
        <h3 className="font-black text-slate-800 text-sm uppercase">Orden no seleccionada</h3>
        <p className="text-xs text-slate-600 font-medium">La sesión de trabajo se liberó de la memoria. Volvé al listado de despacho y volvé a tocar "Ver".</p>
        <button 
          onClick={() => onNavigate('ordenes')} 
          className="mt-2 bg-[#0A2540] hover:bg-[#007AFF] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
        >
          ← Volver al Despacho
        </button>
      </div>
    );
  }

  const { id_ot, numero_ot, activo_nombre, activo_codigo, prioridad, descripcion, estado } = ot;

  // 2. El estado visual ahora nace estrictamente de lo que diga MySQL
  const [estadoLocal, setEstadoLocal] = useState(estado || 'Pendiente');

  // ACCIÓN DE CAMPO A: El operario declara el inicio físico de la labor
  const handleIniciarTrabajo = async () => {
    setLoading(true);
    try {
      await api.actualizarEstadoOrden(id_ot, 'En Curso');
      setEstadoLocal('En Curso');
    } catch (err) {
      alert("Error de conexión: No se pudo notificar el inicio a la base central.");
    } finally {
      setLoading(false);
    }
  };

  // ACCIÓN DE CAMPO B: Cierre total de la OT por parte del mecánico
  const handleFinalizarOT = async () => {
    if (!window.confirm(`¿Confirmás la finalización exitosa de la orden ${numero_ot}?`)) return;
    setLoading(true);
    try {
      await api.actualizarEstadoOrden(id_ot, 'Finalizada');
      alert("¡Trabajo tildado! La central ya recibió la confirmación de cierre.");
      onNavigate('ordenes');
    } catch (err) {
      alert("Error al intentar registrar el cierre en MySQL.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto text-left pb-12">
      
      {/* RETORNO */}
      <button 
        onClick={() => onNavigate('ordenes')} 
        className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-[#007AFF] transition-colors uppercase tracking-wider cursor-pointer"
      >
        <ArrowLeft size={14} className="stroke-[3]" />
        <span>Volver al listado de OTs</span>
      </button>

      <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-blue-700 font-medium">
        <Clock className="shrink-0 text-[#007AFF]" size={18} />
        <span>Modo Operador: Los botones impactan en MySQL en tiempo real.</span>
      </div>

      {/* TARJETA DE TAREA ASIGNADA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono font-black text-[#007AFF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              {numero_ot}
            </span>
            <h3 className="text-xl font-black text-[#0A2540] mt-1.5">{activo_nombre || 'Equipo Objetivo'}</h3>
            <span className="text-[11px] font-mono font-normal text-slate-400">[{activo_codigo || 'S/C'}]</span>
          </div>

          <div className={`border px-3 py-1 rounded-full text-[11px] font-black uppercase flex items-center gap-1 shrink-0 ${
            prioridad === 'Alta' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <AlertOctagon size={13} />
            {prioridad || 'Media'}
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Labor requerida en chapa:</span>
          <p className="font-bold text-slate-800 text-sm">{descripcion || 'Sin descripción técnica declarada en el despacho.'}</p>
        </div>

        {/* INTERACTIVIDAD BI-ESTADO BASADA EN SERVIDOR */}
        {estadoLocal === 'Pendiente' ? (
          <button
            onClick={handleIniciarTrabajo}
            disabled={loading}
            className="w-full bg-[#0A2540] hover:bg-[#007AFF] text-white font-black py-4 rounded-2xl shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            <Play size={16} className="fill-white" />
            <span>{loading ? 'Impactando base...' : 'Iniciar Trabajo Ahora'}</span>
          </button>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-xs font-black text-amber-800">
              <span className="uppercase tracking-wider">Estado en Planta: {estadoLocal}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('registrar-intervencion')}
                className="bg-[#007AFF] hover:bg-blue-600 text-white font-black py-3.5 px-2 rounded-2xl text-[11px] uppercase flex flex-col items-center gap-1 transition-all shadow-md cursor-pointer active:scale-[0.98]"
              >
                <FileEdit size={18} />
                <span className="text-center leading-tight">Cargar Consumos<br/>/ Repuestos</span>
              </button>

              <button
                onClick={handleFinalizarOT}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-2 rounded-2xl text-[11px] uppercase flex flex-col items-center gap-1 transition-all shadow-md cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                <span className="text-center leading-tight">Dar por<br/>Terminada</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};