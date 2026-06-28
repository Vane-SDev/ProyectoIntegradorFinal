import React, { useState } from 'react';
import { api } from '../services/api';
import { ArrowLeft, Save, Building2, Layers, AlertCircle, RefreshCw } from 'lucide-react';

export const CrearActivoScreen = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    fabricante: '',
    modelo: '',
    numero_serie: '',
    area: '',
    planta: '',
    sector: '',
    criticidad: 'Media'
  });

  // Estado para bloquear el botón y evitar duplicados en hilos paralelos
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true); // Bloqueo preventivo inmediato

    try {
      await api.crearActivo(formData);
      alert("¡Activo industrial registrado en MySQL con éxito!");
      onNavigate('activos'); 
    } catch (err) {
      console.error("Error del Back:", err);
      alert("MySQL rechazó el paquete. Verifique que el CÓDIGO del equipo no esté repetido en el sistema.");
    } finally {
      setGuardando(false); // Liberamos el estado de carga
    }
  };

  return (
    <div className="space-y-6 text-left pb-10 max-w-4xl mx-auto">
      
      {/* CABECERA */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-[#0A2541]">Nuevo Activo de Planta</h2>
          <p className="text-xs text-slate-400 font-medium">Ficha técnica de mantenimiento (CMMS)</p>
        </div>
        <button 
          onClick={() => onNavigate('activos')} 
          className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-[#007AFF] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Volver al listado
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* SECCIÓN 1: IDENTIFICACIÓN */}
        <div className="space-y-3">
          <span className="text-[10px] font-black text-[#007AFF] tracking-widest uppercase flex items-center gap-1.5">
            <Layers size={12} /> 1. Identificación del Equipo
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">CÓDIGO *</label>
              <input 
                type="text"
                placeholder="Ej: B-101" 
                value={formData.codigo}
                onChange={e => setFormData({...formData, codigo: e.target.value.toUpperCase()})} 
                required 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#007AFF] outline-none transition-all uppercase font-mono font-bold" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">NOMBRE DEL EQUIPO *</label>
              <input 
                type="text"
                placeholder="Ej: Bomba de impulsión de agua cruda" 
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})} 
                required 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#007AFF] outline-none transition-all font-bold text-[#0A2540]" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">DESCRIPCIÓN TÉCNICA</label>
            <input 
              type="text"
              placeholder="Función que cumple en el proceso..." 
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})} 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#007AFF] outline-none transition-all text-slate-700" 
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* SECCIÓN 2: UBICACIÓN EN PLANTA */}
        <div className="space-y-3">
          <span className="text-[10px] font-black text-[#007AFF] tracking-widest uppercase flex items-center gap-1.5">
            <Building2 size={12} /> 2. Localización Física
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">PLANTA</label>
              <input 
                type="text"
                placeholder="Ej: Planta Norte" 
                value={formData.planta}
                onChange={e => setFormData({...formData, planta: e.target.value})} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">SECTOR</label>
              <input 
                type="text"
                placeholder="Ej: Nave de Extrusión" 
                value={formData.sector}
                onChange={e => setFormData({...formData, sector: e.target.value})} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">ÁREA</label>
              <input 
                type="text"
                placeholder="Ej: Servicios Auxiliares" 
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" 
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* SECCIÓN 3: ATRIBUTOS DE MANTENIMIENTO */}
        <div className="space-y-3">
          <span className="text-[10px] font-black text-[#007AFF] tracking-widest uppercase flex items-center gap-1.5">
            <AlertCircle size={12} /> 3. Datos de Fabricación y Prioridad
          </span>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">FABRICANTE</label>
              <input 
                type="text"
                placeholder="Ej: KSB" 
                value={formData.fabricante}
                onChange={e => setFormData({...formData, fabricante: e.target.value})} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">MODELO</label>
              <input 
                type="text"
                placeholder="Ej: Etanorm 65-200" 
                value={formData.modelo}
                onChange={e => setFormData({...formData, modelo: e.target.value})} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">N° DE SERIE</label>
              <input 
                type="text"
                placeholder="Ej: SN-88412" 
                value={formData.numero_serie}
                onChange={e => setFormData({...formData, numero_serie: e.target.value})} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-xs font-bold" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">CRITICIDAD</label>
              <select 
                value={formData.criticidad}
                onChange={e => setFormData({...formData, criticidad: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#007AFF] focus:bg-white cursor-pointer" 
              >
                <option value="Baja">🟢 Baja</option>
                <option value="Media">🟡 Media</option>
                <option value="Alta">🔴 Alta (Crítico)</option>
              </select>
            </div>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN CON INDICADOR DE CARGA */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={guardando}
            className="w-full bg-[#007AFF] hover:bg-blue-600 text-white p-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Registrando en almacenamiento...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Impactar Activo en Base de Datos</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};