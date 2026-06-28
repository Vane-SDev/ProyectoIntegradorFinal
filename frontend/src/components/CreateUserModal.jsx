import React, { useState } from 'react';
import { api } from '../services/api';
import { X, ShieldAlert } from 'lucide-react';

export const CreateUserModal = ({ onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({ 
    nombre: '', 
    email: '', 
    password: '', 
    id_rol: 3 // Por defecto Técnico (el rol de menor privilegio por seguridad)
  });
  
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    
    try {
      await api.crearUsuario(formData); 
      onUserCreated(); // Recarga la lista en la pantalla principal
    } catch (err) {
      alert("Error al crear usuario. Verificá que el email no esté repetido en MySQL.");
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl w-[400px] space-y-5 shadow-2xl scale-in-center text-left">
        
        {/* CABECERA */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-xl text-[#0A2540]">Nuevo Usuario</h3>
            <p className="text-[11px] text-slate-500 font-medium">Asignación de credenciales y rol</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* CAMPOS DE TEXTO */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Nombre Completo *</label>
            <input 
              placeholder="Ej: Jorge Luis Carrizo" 
              onChange={e => setFormData({...formData, nombre: e.target.value})} 
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-[#007AFF] focus:bg-white rounded-xl text-sm outline-none transition-colors font-medium text-slate-700" 
              required 
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Correo Electrónico *</label>
            <input 
              type="email" 
              placeholder="ejemplo@planta.inti" 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-[#007AFF] focus:bg-white rounded-xl text-sm outline-none transition-colors font-medium text-slate-700" 
              required 
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Contraseña Provisional *</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-[#007AFF] focus:bg-white rounded-xl text-sm outline-none transition-colors font-medium text-slate-700" 
              required 
            />
          </div>

          {/* SELECTOR DE ROLES*/}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <label className="flex items-center gap-1.5 text-[11px] font-black text-amber-800 mb-2 uppercase">
              <ShieldAlert size={14} />
              Nivel de Autorización en SIGMA *
            </label>
            <select 
              value={formData.id_rol}
              onChange={e => setFormData({...formData, id_rol: Number(e.target.value)})} 
              className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-sm font-bold text-[#0A2540] outline-none cursor-pointer hover:border-amber-400 transition-colors"
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

        {/* BOTONERA */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 p-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={guardando}
            className="flex-1 p-3 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-black text-sm shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {guardando ? 'Procesando...' : 'Guardar y Encriptar'}
          </button>
        </div>
      </form>
    </div>
  );
};