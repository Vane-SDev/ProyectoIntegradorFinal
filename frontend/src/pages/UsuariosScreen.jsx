import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Shield, UserPlus, Edit, XCircle, CheckCircle2, UserCog } from 'lucide-react';
import { CreateUserModal } from '../components/CreateUserModal';
import { EditUserModal } from '../components/EditUserModal'; // <-- IMPORTADO

export const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userEditing, setUserEditing] = useState(null); // Guarda el objeto del técnico a editar

  const cargarUsuarios = async () => {
    try {
      const data = await api.getUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargando personal:", err);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  // FUNCIÓN PARA EL BOTÓN ROJO/VERDE 
  const handleAlternarEstado = async (id, estadoActual) => {
    const nuevoEstado = (estadoActual === 1 || estadoActual === true) ? 0 : 1;
    const textoAccion = nuevoEstado === 0 ? "suspender el acceso a" : "restituir las credenciales de";
    
    if (!window.confirm(`¿Confirmás que deseás ${textoAccion} este operario?`)) return;

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/estado/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoEstado })
      });
      
      if (!res.ok) throw new Error("Error en el servidor");
      cargarUsuarios(); // Refresca la grilla para pintar el nuevo color
    } catch (err) {
      alert("No se pudo impactar el cambio de estado en la base de datos.");
    }
  };

  const renderRolBadge = (id_rol, textoRolDB) => {
    const paletaColores = {
      1: "bg-purple-50 text-purple-700 border-purple-200",
      2: "bg-amber-50 text-amber-700 border-amber-200",
      3: "bg-blue-50 text-blue-700 border-blue-200",
      4: "bg-cyan-50 text-cyan-700 border-cyan-200",
      5: "bg-emerald-50 text-emerald-700 border-emerald-200",
      6: "bg-slate-100 text-slate-600 border-slate-300"
    };
    return (
      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border tracking-wider ${paletaColores[id_rol] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
        {textoRolDB || 'Personal de Planta'}
      </span>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
      
      <div className="bg-[#0A2540] text-white p-5 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase tracking-widest">
            <Shield size={14} /> Gestión de Acceso
          </div>
          <h2 className="text-base font-black">Control de Credenciales</h2>
        </div>
        
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#007AFF] hover:bg-blue-600 text-white font-black text-xs px-3.5 py-2.5 rounded-xl uppercase flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
        >
          <UserPlus size={16} /> Crear
        </button>
      </div>

      {/* MODAL CREAR */}
      {isCreateOpen && (
        <CreateUserModal onClose={() => setIsCreateOpen(false)} onUserCreated={() => { setIsCreateOpen(false); cargarUsuarios(); }} />
      )}

      {/* MODAL EDITAR (Se abre únicamente cuando userEditing tiene datos) */}
      {userEditing && (
        <EditUserModal user={userEditing} onClose={() => setUserEditing(null)} onUserUpdated={() => { setUserEditing(null); cargarUsuarios(); }} />
      )}

      {/* GRILLA DINÁMICA */}
      <div className="space-y-2.5">
        {usuarios.length > 0 ? (
          usuarios.map((u) => {
            const estaOperativo = (u.activo === 1 || u.activo === true);

            return (
              <div key={u.id_usuario} className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${estaOperativo ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50/70 border-slate-200 opacity-60'}`}>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-black text-xs truncate ${estaOperativo ? 'text-[#0A2540]' : 'text-slate-500 line-through'}`}>{u.nombre}</h4>
                    {renderRolBadge(u.id_rol, u.rol)}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium block truncate font-mono">{u.email}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border hidden sm:inline mr-1 ${estaOperativo ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200'}`}>
                    {estaOperativo ? '🟢 Operativo' : '🔴 Suspendido'}
                  </span>
                  
                  {/* BOTÓN EDITAR CONECTADO */}
                  <button 
                    onClick={() => setUserEditing(u)}
                    title="Modificar Rol o Email" 
                    className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#007AFF] rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit size={14} />
                  </button>
                  
                  {/* BOTÓN SUSPENDER/RESTITUIR CONECTADO */}
                  <button 
                    onClick={() => handleAlternarEstado(u.id_usuario, u.activo)}
                    title={estaOperativo ? "Suspender Acceso" : "Restituir Acceso"} 
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${estaOperativo ? 'bg-red-50 hover:bg-red-100 border-red-100 text-red-600' : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'}`}
                  >
                    {estaOperativo ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-slate-400 bg-slate-50 border border-dashed rounded-2xl">Cargando nómina...</div>
        )}
      </div>

    </div>
  );
};