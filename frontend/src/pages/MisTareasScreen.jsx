import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Play, ArrowLeft, Wrench, Calendar, ChevronRight, UserCheck, Loader2 } from 'lucide-react';

export const MisTareasScreen = ({ ot, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [ordenActiva, setOrdenActiva] = useState(ot || null);
  const [misOrdenesAsignadas, setMisOrdenesAsignadas] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(false);
  const [estadoLocal, setEstadoLocal] = useState(ot?.estado || 'Pendiente');
  
  const [tecnicosDisponibles, setTecnicosDisponibles] = useState([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState('');

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const esJefe = [1, 2, 4].includes(Number(usuario.id_rol));

  // Carga de técnicos para jefes
  useEffect(() => {
    if (ordenActiva && esJefe) {
      const cargarPersonalCampo = async () => {
        try {
          const personal = await api.getUsuarios();
          const operarios = personal.filter(u => [3, 6].includes(Number(u.id_rol)));
          setTecnicosDisponibles(operarios);
          if (operarios.length > 0) setTecnicoSeleccionado(operarios[0].nombre);
        } catch (err) {
          console.error("Error cargando técnicos:", err);
        }
      };
      cargarPersonalCampo();
    }
  }, [ordenActiva, esJefe]);

  // Carga de tareas profesional (usando el endpoint del backend)
  useEffect(() => {
    if (!ordenActiva) {
      const buscarMisTrabajos = async () => {
        setCargandoLista(true);
        try {
          const res = await api.get(`ordenes-trabajo/tecnico/${usuario.id_usuario}`);
          setMisOrdenesAsignadas(Array.isArray(res) ? res : []);
        } catch (err) {
          console.error("Error al obtener tareas:", err);
          setMisOrdenesAsignadas([]);
        } finally {
          setCargandoLista(false);
        }
      };
      buscarMisTrabajos();
    }
  }, [ordenActiva, usuario.id_usuario]);

  const limpiarFecha = (fecha) => (typeof fecha === 'string' ? fecha.split('T')[0] : fecha);

  const handleAsignarTecnico = async () => {
    if (!tecnicoSeleccionado) return;
    setLoading(true);
    try {
      const operarioObj = tecnicosDisponibles.find(t => t.nombre === tecnicoSeleccionado);
      const payload = { 
        ...ordenActiva,
        fecha_programada: limpiarFecha(ordenActiva.fecha_programada),
        fecha_finalizacion: limpiarFecha(ordenActiva.fecha_finalizacion),
        id_tecnico: operarioObj?.id_usuario || null,
        asignado_a: operarioObj?.nombre || tecnicoSeleccionado
      };

      delete payload.activo_nombre;
      delete payload.activo_codigo;
      delete payload.tecnico_nombre;

      await api.actualizarOrden(ordenActiva.id_ot, payload);
      alert(`Despacho exitoso a ${tecnicoSeleccionado}.`);
      onNavigate('ordenes');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarOT = async () => {
    if (!window.confirm("¿Confirmás el cierre de la orden?")) return;
    setLoading(true);
    try {
      await api.actualizarEstadoOrden(ordenActiva.id_ot, 'Finalizada');
      alert("Orden finalizada correctamente.");
      setOrdenActiva(null); 
      onNavigate('tareas');
    } catch (err) {
      alert("No se pudo finalizar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarTrabajo = async () => {
    setLoading(true);
    try {
      await api.actualizarEstadoOrden(ordenActiva.id_ot, 'En Curso');
      setEstadoLocal('En Curso');
    } catch (err) { 
      // Ahora usamos 'err' para mostrar el mensaje real del servidor
      alert("Error: " + err.message); 
      console.error(err);
    } 
    finally { setLoading(false); }
  };



  // ================= RENDER A: AGENDA DE TRABAJO DIARIO =================
  if (!ordenActiva) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto text-left pb-12 animate-in fade-in duration-200">
        <div className="bg-[#0A2540] text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest block">Despacho Operativo</span>
            <h2 className="text-xl font-black mt-0.5">Mis Tareas Asignadas</h2>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl"><Wrench size={24} className="text-amber-400" /></div>
        </div>

        {cargandoLista ? (
          <div className="p-12 text-center text-slate-400 font-bold text-xs uppercase">Consultando órdenes pendientes...</div>
        ) : misOrdenesAsignadas.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase px-2">Nómina para hoy ({misOrdenesAsignadas.length}):</p>
            {misOrdenesAsignadas.map((item) => (
              <div key={item.id_ot} onClick={() => setOrdenActiva(item)} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#007AFF] transition-all shadow-sm flex items-center justify-between gap-4 cursor-pointer group">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black bg-blue-50 text-[#007AFF] px-2 py-0.5 rounded border border-blue-100">{item.numero_ot}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">{item.prioridad || 'Normal'}</span>
                  </div>
                  <h4 className="font-black text-sm text-[#0A2540] truncate group-hover:text-[#007AFF]">{item.activo_nombre}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.descripcion}</p>
                </div>
                <div className="p-3 bg-slate-50 group-hover:bg-[#007AFF] text-slate-400 group-hover:text-white rounded-xl"><ChevronRight size={18} /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 p-12 rounded-3xl text-center space-y-3">
            <Calendar size={36} className="mx-auto text-slate-300" />
            <h4 className="font-black text-slate-700 text-sm">Planta limpia por hoy</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">No tenés tareas despachadas a tu nombre en este turno.</p>
          </div>
        )}
      </div>
    );
  }

  // ================= RENDER B: FICHA OPERATIVA BIFURCADA =================
  const { numero_ot, activo_nombre, activo_codigo, prioridad, descripcion } = ordenActiva;

  return (
    <div className="space-y-4 max-w-md mx-auto text-left pb-12 animate-in fade-in zoom-in-95 duration-200">
      
      <button onClick={() => { if(ot) onNavigate('ordenes'); else setOrdenActiva(null); }} className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-[#007AFF] uppercase cursor-pointer">
        <ArrowLeft size={14} className="stroke-[3]" /><span>Volver al listado anterior</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5 relative overflow-hidden">
        
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono font-black text-[#007AFF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">{numero_ot}</span>
            <h3 className="text-xl font-black text-[#0A2540] mt-1.5">{activo_nombre || 'Equipo Objetivo'}</h3>
            <span className="text-[11px] font-mono text-slate-400">[{activo_codigo || 'S/C'}]</span>
          </div>
          <div className="border px-3 py-1 rounded-full text-[11px] font-black uppercase bg-rose-50 text-rose-700 border-rose-200 shrink-0">{prioridad || 'Media'}</div>
        </div>

        <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase block">Reporte técnico:</span>
          <p className="font-bold text-slate-800 text-sm">{descripcion || 'Sin descripción técnica declarada.'}</p>
        </div>

        {/* BIFURCACIÓN DE CONTROLES: JEFES ADJUDICAN, TÉCNICOS REPARAN */}
        <div className="pt-2">
          
          {/* CASO 1: ES UN JEFE MIRANDO LA ORDEN PENDIENTE */}
          {esJefe ? (
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
              <label className="flex items-center gap-1.5 text-[11px] font-black text-[#0A2540] uppercase">
                <UserCheck size={16} className="text-[#007AFF]" /> Triaje directivo: Adjudicar a Técnico *
              </label>
              
              <select 
                value={tecnicoSeleccionado}
                onChange={(e) => setTecnicoSeleccionado(e.target.value)}
                className="w-full p-3 bg-white border border-blue-200 rounded-xl text-sm font-bold text-slate-800 outline-none cursor-pointer shadow-sm"
              >
                {tecnicosDisponibles.map(t => (
                  <option key={t.id_usuario} value={t.nombre}>{t.nombre} ({t.rol || 'Técnico de Campo'})</option>
                ))}
              </select>

              <button 
                onClick={handleAsignarTecnico}
                disabled={loading || !tecnicoSeleccionado}
                className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-black py-3.5 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                <span>Confirmar Adjudicación a Turno</span>
              </button>
            </div>
          ) : (
            /* CASO 2: ES UN OPERARIO FRENTE A LA MÁQUINA */
            <>
              {estadoLocal === 'Pendiente' && (
                <button onClick={handleIniciarTrabajo} disabled={loading} className="w-full bg-[#0A2540] hover:bg-[#007AFF] text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs uppercase cursor-pointer disabled:opacity-50">
                  <Play size={16} className="fill-white" /><span>Iniciar Trabajo Ahora</span>
                </button>
              )}

              {estadoLocal === 'En Curso' && (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-xs font-black text-amber-800">
                    <span>Estado: {estadoLocal}</span><span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => onNavigate('registrar-intervencion')} className="bg-[#007AFF] text-white font-black py-3.5 px-2 rounded-2xl text-[11px] uppercase cursor-pointer">Cargar Consumos</button>
                    <button onClick={handleFinalizarOT} disabled={loading} className="bg-emerald-600 text-white font-black py-3.5 px-2 rounded-2xl text-[11px] uppercase cursor-pointer">Terminar</button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};