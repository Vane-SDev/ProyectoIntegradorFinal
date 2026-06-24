import React, { useState } from 'react';
import { api } from '../services/api';
import { ArrowLeft, Save, Building2, Layers, AlertCircle } from 'lucide-react';

export const CrearActivoScreen = ({ onNavigate }) => {
  // Estado alineado estrictamente con las columnas de MySQL / Estefanía
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',         // Reemplaza a 'equipo'
    descripcion: '',
    fabricante: '',
    modelo: '',
    numero_serie: '',   // Reemplaza a 'serie'
    area: '',
    planta: '',
    sector: '',
    criticidad: 'Media' // Por defecto
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.crearActivo(formData);
      alert("¡Activo industrial registrado en MySQL con éxito!");
      onNavigate('activos'); 
    } catch (err) {
      console.error("Error del Back:", err);
      alert("Error 500: MySQL rechazó el paquete. Mirá la terminal de Node.");
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
                placeholder="Ej: B-101" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#007AFF] outline-none transition-all uppercase" 
                onChange={e => setFormData({...formData, codigo: e.target.value})} 
                required 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">NOMBRE DEL EQUIPO *</label>
              <input 
                placeholder="Ej: Bomba de impulsión de agua cruda" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#007AFF] outline-none transition-all" 
                onChange={e => setFormData({...formData, nombre: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">DESCRIPCIÓN TÉCNICA</label>
            <input 
              placeholder="Función que cumple en el proceso..." 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#007AFF] outline-none transition-all" 
              onChange={e => setFormData({...formData, descripcion: e.target.value})} 
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
                placeholder="Ej: Planta Norte" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" 
                onChange={e => setFormData({...formData, planta: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">SECTOR</label>
              <input 
                placeholder="Ej: Nave de Extrusión" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" 
                onChange={e => setFormData({...formData, sector: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">ÁREA</label>
              <input 
                placeholder="Ej: Servicios Auxiliares" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" 
                onChange={e => setFormData({...formData, area: e.target.value})} 
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
                placeholder="Ej: KSB" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" 
                onChange={e => setFormData({...formData, fabricante: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">MODELO</label>
              <input 
                placeholder="Ej: Etanorm 65-200" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" 
                onChange={e => setFormData({...formData, modelo: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">N° DE SERIE</label>
              <input 
                placeholder="Ej: SN-88412" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-xs" 
                onChange={e => setFormData({...formData, numero_serie: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">CRITICIDAD</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#007AFF]" 
                onChange={e => setFormData({...formData, criticidad: e.target.value})}
                defaultValue="Media"
              >
                <option value="Baja">🟢 Baja</option>
                <option value="Media">🟡 Media</option>
                <option value="Alta">🔴 Alta (Crítico)</option>
              </select>
            </div>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <div className="pt-2">
          <button 
            type="submit" 
            className="w-full bg-[#007AFF] hover:bg-blue-600 text-white p-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Save size={18} /> Impactar Activo en Base de Datos MySQL
          </button>
        </div>

      </form>
    </div>
  );
};