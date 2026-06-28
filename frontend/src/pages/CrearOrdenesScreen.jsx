import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, RefreshCw, AlertCircle } from 'lucide-react';

export const CrearOrdenScreen = ({ onBack }) => {
  // Generador de código único (Ej: OT-4821)
  const generarNumeroOT = () => `OT-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. ESTADOS DE DATOS TRAÍDOS DE MYSQL
  const [activosDB, setActivosDB] = useState([]);
  const [tecnicosDB, setTecnicosDB] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // 2. ESTADOS DEL FORMULARIO
  const [numeroOT, setNumeroOT] = useState(generarNumeroOT());
  const [idActivo, setIdActivo] = useState('');
  const [tipoMantenimiento, setTipoMantenimiento] = useState('Preventivo');
  const [prioridad, setPrioridad] = useState('Media');
  const [idTecnico, setIdTecnico] = useState('');
  const [fechaProgramada, setFechaProgramada] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState("Revisión de presión de salida y ajuste de pre-estopada según protocolo de mantenimiento mensual.");

  // 3. CAPTURA DE CATÁLOGOS AL CARGAR LA PANTALLA
  useEffect(() => {
    const obtenerCatalogosSQL = async () => {
      setLoadingCatalogos(true);
      try {
        // A) Pedimos los equipos
        const resAct = await fetch('http://localhost:3000/api/activos');
        const dataAct = resAct.ok ? await resAct.json() : [];

        // B) Pedimos los usuarios
        const resUsu = await fetch('http://localhost:3000/api/usuarios');
        const dataUsu = resUsu.ok ? await resUsu.json() : [];

        setActivosDB(dataAct);
        setTecnicosDB(dataUsu);

        // Dejamos pre-seleccionado el primer elemento de la base
        if (dataAct.length > 0) setIdActivo(dataAct[0].id_activo);
        if (dataUsu.length > 0) setIdTecnico(dataUsu[0].id_usuario);

      } catch (error) {
        console.error("Fallo de red al buscar catálogos:", error);
      } finally {
        setLoadingCatalogos(false);
      }
    };

    obtenerCatalogosSQL();
  }, []);

  // 4. DESPACHO DE LA ORDEN HACIA EXPRESS
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!idActivo) {
      alert("Error: No hay un equipo objetivo seleccionado.");
      return;
    }

    setGuardando(true);

    // Formateamos el objeto 
    const payload = {
      numero_ot: numeroOT,
      tipo_mantenimiento: tipoMantenimiento,
      id_activo: parseInt(idActivo),
      id_tecnico: idTecnico ? parseInt(idTecnico) : null,
      prioridad: prioridad,
      estado: 'Pendiente', // Toda orden nace con estado inicial 'Pendiente'
      descripcion: descripcion.trim(),
      observaciones: 'Orden despachada desde central. Pendiente de toma de lectura en campo.',
      fecha_programada: fechaProgramada
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/ordenes-trabajo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!respuesta.ok) {
        const txt = await respuesta.text();
        throw new Error(txt);
      }

      alert(`¡Éxito! La orden ${numeroOT} fue emitida e ingresada al flujo de trabajo de la planta.`);
      onBack(); // Cierra el modal y vuelve a la tabla principal

    } catch (err) {
      console.error("Rechazo al guardar OT:", err);
      alert("El servidor rechazó la orden. Verifique que el número de OT no esté repetido.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      <div className="p-6 bg-[#0A2540] text-white flex items-center justify-between text-left">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Despacho Transaccional</span>
          <h2 className="text-lg font-black">Emisión de Orden de Trabajo</h2>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
        
        {/* FILA 1: OT / EQUIPO / TIPO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">N° de Orden *</label>
            <input 
              type="text" 
              value={numeroOT} 
              onChange={e => setNumeroOT(e.target.value)}
              required
              className="w-full p-2.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs font-mono font-black text-blue-800 focus:outline-none focus:border-blue-600" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Equipo Objetivo *</label>
            <select 
              value={idActivo}
              onChange={e => setIdActivo(e.target.value)}
              disabled={loadingCatalogos}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#0A2540] focus:outline-none focus:bg-white focus:border-[#007AFF]"
            >
              {loadingCatalogos ? (
                <option>Buscando en planta...</option>
              ) : activosDB.length === 0 ? (
                <option value="">Sin equipos en DB</option>
              ) : (
                activosDB.map(act => (
                  <option key={act.id_activo} value={act.id_activo}>
                    {act.nombre} [{act.codigo}]
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tipo de Labor</label>
            <select 
              value={tipoMantenimiento}
              onChange={e => setTipoMantenimiento(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-[#007AFF]"
            >
              <option value="Preventivo">Preventivo Programado</option>
              <option value="Correctivo">Correctivo de Emergencia</option>
              <option value="Inspeccion">Inspección de Rutina</option>
              <option value="Predictivo">Análisis Predictivo</option>
            </select>
          </div>
        </div>

        {/* FILA 2: PRIORIDAD / TÉCNICO / FECHA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Prioridad</label>
            <select 
              value={prioridad}
              onChange={e => setPrioridad(e.target.value)}
              className="w-full p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-black focus:outline-none"
            >
              <option value="Crítica">🔴 CRÍTICA (0hs - Parada)</option>
              <option value="Alta">🟠 ALTA (24hs)</option>
              <option value="Media">🟡 MEDIA (72hs)</option>
              <option value="Baja">🟢 BAJA (Planificada)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Técnico Asignado</label>
            <select 
              value={idTecnico}
              onChange={e => setIdTecnico(e.target.value)}
              disabled={loadingCatalogos}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-[#007AFF]"
            >
              {loadingCatalogos ? (
                <option>Buscando personal...</option>
              ) : tecnicosDB.length === 0 ? (
                <option value="">Sin técnicos en DB</option>
              ) : (
                tecnicosDB.map(tec => (
                  <option key={tec.id_usuario} value={tec.id_usuario}>
                    {tec.nombre} ({tec.id_rol === 1 ? 'Admin' : 'Técnico'})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Fecha Programada *</label>
            <input 
              type="date" 
              value={fechaProgramada}
              onChange={e => setFechaProgramada(e.target.value)}
              required
              className="w-full p-2bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-[#007AFF]" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Instrucción de Trabajo *</label>
          <textarea 
            rows={4} 
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
            placeholder="Describa el protocolo de labor, herramientas especiales requeridas o el fallo reportado..." 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#007AFF] text-slate-800 font-medium transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onBack}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={guardando}
            className="px-6 py-2.5 bg-[#007AFF] hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save size={16} /> 
            <span>{guardando ? 'Transmitiendo...' : 'Guardar y Despachar OT'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};