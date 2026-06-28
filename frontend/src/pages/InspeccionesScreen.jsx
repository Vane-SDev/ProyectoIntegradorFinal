import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Clipboard, AlertOctagon, ShieldAlert, Upload, Loader2, FileImage, X } from 'lucide-react';

export const InspeccionesScreen = () => {
  const [loading, setLoading] = useState(false);
  const [activos, setActivos] = useState([]);
  
  // ELEMENTOS DEL FORMULARIO
  const [area, setArea] = useState('Molienda (Nave 1)');
  const [idActivo, setIdActivo] = useState('');
  const [anomalia, setAnomalia] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [criticidad, setCriticidad] = useState('Media'); 

  // NUEVO ESTADO: Para guardar el archivo adjunto (imagen o foto)
  const [fotoAdjunta, setFotoAdjunta] = useState(null);

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};

  useEffect(() => {
    const cargarActivos = async () => {
      try {
        const data = await api.getActivos();
        setActivos(data);
        if (data.length > 0) setIdActivo(data[0].id_activo);
      } catch (err) {
        console.error("Error trayendo activos para inspección:", err);
      }
    };
    cargarActivos();
  }, []);

  // Captura el archivo seleccionado por el operario
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFotoAdjunta(e.target.files[0]);
    }
  };

  const handleEnviarAlerta = async (e) => {
    e.preventDefault();
    setLoading(true);

    const numeroIncidencia = `INC-${Math.floor(1000 + Math.random() * 9000)}`;

    // metadata del archivo en la descripción física del texto para el Supervisor
    const detalleFoto = fotoAdjunta ? ` [EVIDENCIA ADJUNTA: ${fotoAdjunta.name}]` : '';

    const payloadIncidencia = {
      numero_ot: numeroIncidencia,
      id_activo: Number(idActivo),
      descripcion: `[INSPECCIÓN POR ${usuario.nombre?.toUpperCase()}]: ${anomalia.toUpperCase()}. Detalle: ${descripcion}${detalleFoto}`,
      prioridad: criticidad === 'Peligro Crítico' ? 'Alta' : criticidad === 'Media' ? 'Media' : 'Baja',
      tipo_mantenimiento: 'Correctivo',
      estado: 'Pendiente',
      fecha_programada: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('http://localhost:3000/api/ordenes-trabajo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadIncidencia)
      });

      if (!res.ok) throw new Error("Error en servidor Express");

      alert(`¡Alerta despachada! Ticket ${numeroIncidencia} generado correctamente.`);
      
      // Limpieza del formulario
      setAnomalia('');
      setDescripcion('');
      setCriticidad('Media');
      setFotoAdjunta(null); // Vaciamos el archivo
    } catch (err) {
      alert("No se pudo registrar la alerta en MySQL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-left pb-12 animate-in fade-in zoom-in-95 duration-200">
      
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl space-y-6">
        
        <div className="border-b border-slate-100 pb-4 text-center sm:text-left">
          <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-200 inline-block">
            Acceso Planta Universal
          </span>
          <h2 className="text-xl font-black text-[#0A2540] mt-2 flex items-center justify-center sm:justify-start gap-2">
            <Clipboard size={22} className="text-[#007AFF]" />
            Reporte Rápido de Novedad
          </h2>
        </div>

        <form onSubmit={handleEnviarAlerta} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Área de Planta *</label>
              <select 
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-[#007AFF] cursor-pointer"
              >
                <option>Molienda (Nave 1)</option>
                <option>Embotellado (Nave 2)</option>
                <option>Cámaras / Frío</option>
                <option>Despacho / Logística</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Equipo Objetivo *</label>
              <select 
                value={idActivo}
                onChange={e => setIdActivo(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#007AFF] cursor-pointer"
                required
              >
                {activos.map(a => (
                  <option key={a.id_activo} value={a.id_activo}>{a.nombre} [{a.codigo}]</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Anomalía Detectada *</label>
            <input 
              type="text"
              placeholder="Ej: Fuerte ruido a roce metálico / Pérdida de aceite"
              value={anomalia}
              onChange={e => setAnomalia(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#007AFF]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Descripción del Contexto</label>
            <textarea 
              rows={3}
              placeholder="Detallá exactamente qué observaste en tu recorrida de inspección..."
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#007AFF] resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase">Nivel de Criticidad Declarado *</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setCriticidad('Baja')}
                className={`p-3 rounded-xl border text-xs font-black uppercase transition-all cursor-pointer text-center ${
                  criticidad === 'Baja' ? 'bg-blue-50 border-blue-400 text-blue-700 ring-1 ring-blue-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Baja
              </button>
              <button
                type="button"
                onClick={() => setCriticidad('Media')}
                className={`p-3 rounded-xl border text-xs font-black uppercase transition-all cursor-pointer text-center ${
                  criticidad === 'Media' ? 'bg-amber-50 border-amber-400 text-amber-700 ring-1 ring-amber-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Media / Alerta
              </button>
              <button
                type="button"
                onClick={() => setCriticidad('Peligro Crítico')}
                className={`p-3 rounded-xl border text-xs font-black uppercase transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                  criticidad === 'Peligro Crítico' ? 'bg-rose-50 border-rose-400 text-rose-700 ring-1 ring-rose-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert size={14} /> Crítico
              </button>
            </div>
          </div>

          {/* INTEGRACIÓN ASISTIDA DE ARCHIVO / CÁMARA */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Evidencia Fotográfica (Opcional)</label>
            
            {!fotoAdjunta ? (
              <label className="w-full p-4 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-dashed border-slate-300 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all cursor-pointer">
                <Upload size={16} className="text-[#007AFF]" />
                <span>Adjuntar foto o capturar imagen</span>
                {/* Input invisible que maneja la física del dispositivo */}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            ) : (
              /* Muestra el nombre del documento cargado con opción de remoción */
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800">
                <div className="flex items-center gap-2 min-w-0">
                  <FileImage size={16} className="text-emerald-600 shrink-0" />
                  <span className="truncate font-mono">{fotoAdjunta.name}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFotoAdjunta(null)} 
                  className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007AFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <AlertOctagon size={16} />}
              <span>{loading ? 'Transmitiendo Alerta...' : 'Enviar Alerta a Turno'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};