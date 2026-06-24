import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Shield, UserPlus, Edit, XCircle, CheckCircle2 } from 'lucide-react';
import { CreateUserModal } from '../components/CreateUserModal';

export const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarUsuarios = async () => {
    const data = await api.get('usuarios');
    setUsuarios(data);
  };

  useEffect(() => { cargarUsuarios(); }, []);

  
  const getRolStyle = (rol) => {
    switch (rol) {
      case 'Administrador': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'Técnico Campo': return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 text-left">
      {/* BANNER */}
      <div className="bg-[#0A2540] text-white p-5 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase tracking-widest">
            <Shield size={14} /> Gestión de Acceso
          </div>
          <h2 className="text-base font-black">Control de Credenciales</h2>
        </div>
        <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#007AFF] hover:bg-blue-600 text-white font-black text-xs px-3.5 py-2.5 rounded-xl uppercase flex items-center gap-1.5"
      >
        <UserPlus size={16} /> Crear
      </button>

      {/* Renderizado del Modal */}
      {isModalOpen && (
        <CreateUserModal 
          onClose={() => setIsModalOpen(false)} 
          onUserCreated={() => {
            setIsModalOpen(false);
            cargarUsuarios(); // Refresca la lista tras crear
          }} 
        />
      )}
      </div>

      {/* LISTADO DINÁMICO */}
      <div className="space-y-2.5">
        {usuarios.length > 0 ? (
          usuarios.map((u) => (
            <div key={u.id_usuario} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-xs text-[#0A2540] truncate">{u.nombre}</h4>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${getRolStyle(u.rol)}`}>
                    {u.rol}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block truncate">{u.email}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-black uppercase text-slate-400 hidden sm:inline">
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
                <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors">
                  <Edit size={14} />
                </button>
                <button className={`p-2 rounded-xl border transition-colors ${u.activo ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                  {u.activo ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 font-bold text-xs">Cargando usuarios...</div>
        )}
      </div>
    </div>
  );
};