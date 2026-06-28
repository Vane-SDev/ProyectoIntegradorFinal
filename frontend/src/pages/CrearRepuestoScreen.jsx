import React, { useState } from 'react';
import { api } from '../services/api';
import { Save, ArrowLeft } from 'lucide-react';

export const CrearRepuestoScreen = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    codigo: '', nombre: '', descripcion: '', fabricante: '',
    stock_actual: 0, stock_minimo: 0, unidad_medida: 'Unidad'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.crearRepuesto(formData);
      alert("Repuesto registrado con éxito");
      onNavigate('repuestos');
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  // Definimos una clase base reutilizable para todos los inputs
  const inputStyle = "p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-[#0A2540] placeholder-slate-400 focus:outline-none focus:border-[#007AFF] focus:bg-white transition-all shadow-sm";

  return (
    <div className="max-w-xl mx-auto space-y-6 text-left animate-in fade-in duration-200">
      <button onClick={() => onNavigate('repuestos')} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#007AFF] transition-colors cursor-pointer">
        <ArrowLeft size={16} className="stroke-[3]" /> Volver al catálogo
      </button>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
        <div>
          <h2 className="font-black text-[#0A2540] text-xl tracking-tight">Alta de Nuevo Repuesto</h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Ingresá los datos técnicos para el almacen central.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className={inputStyle} placeholder="Código (Ej: ROD-205)" onChange={(e) => setFormData({...formData, codigo: e.target.value})} required />
          <input className={inputStyle} placeholder="Nombre del repuesto" onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
        </div>
        
        <textarea className={`${inputStyle} w-full min-h-[100px]`} placeholder="Descripción técnica opcional..." onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 ml-1">Stock Actual</label>
            <input type="number" className={`${inputStyle} w-full`} placeholder="0" onChange={(e) => setFormData({...formData, stock_actual: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 ml-1">Stock Mínimo</label>
            <input type="number" className={`${inputStyle} w-full`} placeholder="0" onChange={(e) => setFormData({...formData, stock_minimo: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 ml-1">Unidad</label>
            <input className={`${inputStyle} w-full`} placeholder="Unidad, Kg, Lts..." defaultValue="Unidad" onChange={(e) => setFormData({...formData, unidad_medida: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#0A2540] hover:bg-[#007AFF] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95">
          <Save size={18} /> Guardar en almacen
        </button>
      </form>
    </div>
  );
};