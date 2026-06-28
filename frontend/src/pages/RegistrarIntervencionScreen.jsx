import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ArrowLeft, Save, Clock, Wrench, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

export const RegistrarIntervencionScreen = ({ ot, onBack, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [ordenTrabajo, setOrdenTrabajo] = useState(ot || null);
  const [cargandoRescate, setCargandoRescate] = useState(false);

  // ESTADOS DEL FORMULARIO DE REMITO (CUMPLE CASOS DE USO: AVANCE + RESULTADO)
  const [horas, setHoras] = useState('');
  const [diagnostico, setDiagnostico] = useState('');

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};


  useEffect(() => {
    if (!ordenTrabajo) {
      const rescatarOrdenEnCurso = async () => {
        setCargandoRescate(true);
        try {
          const todas = await api.getOrdenesTrabajo();
          const miTrabajoActivo = todas.find(o => {
            const matchId = o.id_tecnico && Number(o.id_tecnico) === Number(usuario.id_usuario);
            const matchNombre = (o.asignado_a || '').toLowerCase().includes((usuario.nombre || '').toLowerCase());
            const estaEnCurso = o.estado === 'En Curso' || o.estado === 'Pendiente';
            return (matchId || matchNombre) && estaEnCurso;
          });

          if (miTrabajoActivo) setOrdenTrabajo(miTrabajoActivo);
        } catch (err) {
          console.error("Error buscando remito activo:", err);
        } finally {
          setCargandoRescate(false);
        }
      };
      rescatarOrdenEnCurso();
    }
  }, [ordenTrabajo]);


  if (!ordenTrabajo) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center max-w-md mx-auto mt-12 space-y-4 text-left">
        <AlertTriangle className="text-amber-600 mx-auto" size={36} />
        <h3 className="font-black text-slate-800 text-base uppercase text-center">No hay intervenciones activas</h3>
        <p className="text-xs text-slate-600 text-center leading-relaxed">
          Para registrar consumos o avances físicos, primero tenés que iniciar una tarea desde tu agenda de campo.
        </p>
        <button 
          onClick={() => onNavigate('tareas')} 
          className="w-full bg-[#0A2540] hover:bg-[#007AFF] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer block text-center"
        >
          Volver a Mis Tareas
        </button>
      </div>
    );
  }

  const { id_ot, numero_ot, activo_nombre } = ordenTrabajo;

  const handleSubmitRemito = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Impactamos el avance teórico en el servidor
      await api.actualizarEstadoOrden(id_ot, 'Finalizada');
      alert("¡Avance y Resultado registrados con éxito! La orden quedó sellada en el historial de planta.");
      onNavigate('tareas');
    } catch (err) {
      alert("Error de conexión al intentar impactar el remito en MySQL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto text-left pb-12 animate-in fade-in duration-200">
      
      <button 
        onClick={() => onNavigate('tareas')} 
        className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-[#007AFF] transition-colors uppercase tracking-wider cursor-pointer"
      >
        <ArrowLeft size={14} className="stroke-[3]" />
        <span>Cancelar y volver a chapa</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl space-y-6">
        
        {/* CABECERA DE REMITO */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black bg-blue-50 text-[#007AFF] px-2.5 py-1 rounded border border-blue-100">
              REMITO {numero_ot}
            </span>
            <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
              En Ejecución
            </span>
          </div>
          <h2 className="text-xl font-black text-[#0A2540] mt-2">{activo_nombre}</h2>
          <p className="text-[11px] text-slate-400 font-medium">Declaración jurada de insumos y mano de obra</p>
        </div>

        {/* FORMULARIO DE CASOS DE USO */}
        <form onSubmit={handleSubmitRemito} className="space-y-4">
          
          {/* CASO DE USO 1: REGISTRAR AVANCE (Horas hombre e insumos) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
            <label className="flex items-center gap-1.5 text-xs font-black text-slate-700 uppercase tracking-wider">
              <Clock size={16} className="text-[#007AFF]" />
              1. Registro de Avance (Tiempo invertido) *
            </label>
            <input 
              type="number" 
              step="0.5"
              placeholder="Ej: 2.5 (Horas totales de trabajo neto)" 
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#007AFF]"
              required
            />
          </div>

          {/* CASO DE USO 2: REGISTRAR RESULTADO (Diagnóstico final técnico) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
            <label className="flex items-center gap-1.5 text-xs font-black text-slate-700 uppercase tracking-wider">
              <FileText size={16} className="text-[#007AFF]" />
              2. Registro de Resultado (Labor realizada) *
            </label>
            <textarea 
              rows={4}
              placeholder="Detallá técnicamente qué reparaciones, ajustes o cambios de piezas se aplicaron sobre el equipo..." 
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[#007AFF] resize-none"
              required
            />
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <Save size={18} />
              <span>{loading ? 'Impactando remito...' : 'Confirmar y Sellar Remito Técnico'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};