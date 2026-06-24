import React, { useState } from 'react';
import { api } from '../services/api';
import { ArrowLeft, Camera, Wrench, Clock, AlertTriangle } from 'lucide-react';

export const RegistrarIntervencionScreen = ({ ot, onBack, onNavigate }) => {
  if (!ot) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center max-w-md mx-auto mt-12 space-y-3 shadow-sm">
        <AlertTriangle className="text-amber-600 mx-auto animate-bounce" size={32} />
        <h3 className="font-black text-slate-800 text-sm uppercase">Orden Desconectada</h3>
        <p className="text-xs text-slate-600 font-medium">Se perdió la memoria de la sesión. Volvé al listado de despacho y entrá de nuevo.</p>
        <button 
          onClick={() => onNavigate('ordenes')} 
          className="mt-2 bg-[#0A2540] hover:bg-[#007AFF] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
        >
          ← Ir al Despacho
        </button>
      </div>
    );
  }

  // 2. Estados locales 
  const [trabajo, setTrabajo] = useState("Se desmontó la carcasa frontal y se reemplazó el juego de sellos mecánicos.");
  const [observaciones, setObservaciones] = useState("");
  const [horas, setHoras] = useState("2.5");
  const [estadoUI, setEstadoUI] = useState("Completada");
  
  const [repuestos, setRepuestos] = useState(['Juntas de teflón 3/4 (x2)']);
  const [nuevoRepuesto, setNuevoRepuesto] = useState('');
  const [loading, setLoading] = useState(false);

  const agregarRepuesto = () => {
    if (nuevoRepuesto.trim()) {
      setRepuestos([...repuestos, nuevoRepuesto.trim()]);
      setNuevoRepuesto('');
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // A) Mapeo del select visual
    const mapaEstadoSQL = {
      'Completada': 'Finalizada',
      'Requiere seguimiento': 'En Curso',
      'Pendiente de repuesto': 'Pendiente'
    }[estadoUI] || 'Finalizada';

    // B) Concatenamos el trabajo principal y la observación en la columna 'observaciones'
    const textoObservacion = observaciones.trim() 
      ? `${trabajo}\n\n[Nota del Técnico]: ${observaciones.trim()}`
      : trabajo;

    const payload = {
      tipo_mantenimiento: ot.tipo_mantenimiento,
      id_activo: ot.id_activo,
      id_tecnico: ot.id_tecnico,
      prioridad: ot.prioridad,
      estado: mapaEstadoSQL,
      descripcion: ot.descripcion,
      observaciones: textoObservacion,
      horas_hombre: parseFloat(horas) || 0.00, // <--- DECIMAL ATÓMICO
      repuestos: repuestos,                    // <--- ARRAY PURIFICADO
      fecha_programada: ot.fecha_programada ? ot.fecha_programada.split('T')[0] : null,
      fecha_finalizacion: new Date().toISOString().split('T')[0] // Fecha de hoy
    };

    try {
      await api.actualizarOrden(ot.id_ot, payload);
      alert("¡Transacción ACID exitosa! Base de datos y stock actualizados.");
      onNavigate('ordenes'); // Lo devolvemos a la tabla central
    } catch (err) {
      console.error("Error en Transacción ACID:", err);
      alert("El servidor detectó un fallo y ejecutó un ROLLBACK automático.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden text-left pb-6">
      
      <div className="p-4 bg-[#0A2540] text-white flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Volver
        </button>
        <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-400">
          {ot.numero_ot} • Cierre
        </span>
        <div className="w-12"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
        
        <div>
          <label className="block font-black text-slate-700 uppercase mb-1">Trabajo Realizado *</label>
          <textarea 
            rows={3} 
            value={trabajo}
            onChange={e => setTrabajo(e.target.value)}
            required
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:bg-white focus:border-[#007AFF] text-slate-800 transition-all" 
          />
        </div>

        <div>
          <label className="block font-black text-slate-700 uppercase mb-1">Observaciones Operativas</label>
          <textarea 
            rows={2} 
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            placeholder="Indique si nota anomalías de pintura, ruidos, excesos de temperatura..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:bg-white focus:border-[#007AFF] text-slate-800 transition-all" 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-black text-slate-700 uppercase mb-1">Horas Hombre *</label>
            <div className="relative flex items-center">
              <Clock size={16} className="absolute left-3 text-slate-400" />
              <input 
                type="number" 
                step="0.5" 
                value={horas} 
                onChange={e => setHoras(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-[#0A2540] focus:bg-white focus:border-[#007AFF] outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block font-black text-slate-700 uppercase mb-1">Estado Final *</label>
            <select 
              value={estadoUI}
              onChange={e => setEstadoUI(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-[#007AFF] outline-none"
            >
              <option value="Completada">🟢 Completada (Cerrar)</option>
              <option value="Requiere seguimiento">🟡 Req. Seguimiento</option>
              <option value="Pendiente de repuesto">🔴 Falta Repuesto</option>
            </select>
          </div>
        </div>

        {/* GESTIÓN DE REPUESTOS CONECTADA */}
        <div className="space-y-2 pt-1">
          <label className="block font-black text-slate-700 uppercase">Repuestos a descontar de Stock</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ej: Rodamiento SKF 6203..." 
              value={nuevoRepuesto}
              onChange={(e) => setNuevoRepuesto(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregarRepuesto(); } }}
              className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#007AFF]"
            />
            <button 
              type="button" 
              onClick={agregarRepuesto} 
              className="px-3 bg-[#007AFF] hover:bg-blue-600 font-black rounded-xl text-white transition-all shadow-md cursor-pointer active:scale-95"
            >
              + Agregar
            </button>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 min-h-[48px] space-y-1 max-h-32 overflow-y-auto">
            {repuestos.length === 0 && (
              <span className="text-[11px] text-slate-400 italic block text-center py-2">No se declararon repuestos</span>
            )}
            {repuestos.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                <span className="flex items-center gap-2 truncate pr-2"><Wrench size={13} className="text-[#007AFF] shrink-0" /> <span className="truncate">{r}</span></span>
                <button 
                  type="button" 
                  onClick={() => setRepuestos(repuestos.filter((_, idx) => idx !== i))} 
                  className="text-slate-300 hover:text-rose-600 font-black text-base leading-none px-1 cursor-pointer transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="button" className="w-full py-3.5 bg-slate-50 hover:bg-blue-50/50 border-2 border-dashed border-slate-300 hover:border-[#007AFF] rounded-xl font-bold text-slate-500 hover:text-[#007AFF] flex items-center justify-center gap-2 transition-all cursor-pointer">
            <Camera size={18} className="text-[#007AFF]" />
            <span>Adjuntar Foto de Evidencia (Opcional)</span>
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 bg-[#0A2540] hover:bg-[#007AFF] text-white font-black py-4 rounded-2xl transition-all uppercase tracking-wider text-xs shadow-xl shadow-slate-900/15 cursor-pointer active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Procesando Transacción ACID...' : 'Guardar Intervención en Base'}
        </button>

      </form>
    </div>
  );
};