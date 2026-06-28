import React, { useState } from 'react';
import { api } from '../services/api';
import { X, UserCheck } from 'lucide-react';

export const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: user.nombre || '',
    email: user.email || '',
    id_rol: Number(user.id_rol) || 3
  });
  
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    
    try {
      await api.put('usuarios', user.id_usuario, formData);
      onUserUpdated(); // Refresca la tabla de la pantalla principal
    } catch (err) {
      alert("Error al intentar modificar el registro en MySQL.");
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl w-[400px] space-y-5 shadow-2xl text-left">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-xl text-[#0A2540]">Editar Operario</h3>
            <p className="text-[11px] text-slate-500 font-medium font-mono">ID Registro: #{user.id_usuario}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Nombre Completo *</label>
            <input 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})} 
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-[#007AFF] focus:bg-white rounded-xl text-sm outline-none font-medium text-slate-700" 
              required 
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Correo Electrónico *</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-[#007AFF] focus:bg-white rounded-xl text-sm outline-none font-medium text-slate-700 font-mono" 
              required 
            />
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
            <label className="flex items-center gap-1.5 text-[11px] font-black text-blue-900 mb-2 uppercase">
              <UserCheck size={14} />
              Rol y Permisos en Planta *
            </label>
            <select 
              value={formData.id_rol}
              onChange={e => setFormData({...formData, id_rol: Number(e.target.value)})} 
              className="w-full p-2.5 bg-white border border-blue-200 rounded-lg text-sm font-bold text-[#0A2540] outline-none cursor-pointer"
            >
              <option value={1}>1. Administrador del sistema</option>
              <option value={2}>2. Supervisor de mantenimiento</option>
              <option value={3}>3. Técnico de mantenimiento</option>
              <option value={4}>4. Responsable operativo / planificación</option>
              <option value={5}>5. Personal administrativo</option>
              <option value={6}>6. Contratista externo</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 p-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm cursor-pointer hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={guardando} className="flex-1 p-3 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-500/30 cursor-pointer disabled:opacity-50">
            {guardando ? 'Impactando...' : 'Actualizar Datos'}
          </button>
        </div>
      </form>
    </div>
  );
};