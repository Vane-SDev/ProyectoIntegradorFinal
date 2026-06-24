import React, { useState } from 'react';
import { api } from '../services/api';

export const CreateUserModal = ({ onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({ nombre: '',apellido: '',email: '', password: '', id_rol: 2 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ajuste: quitamos apellido porque no existe en tu tabla
      await api.post('usuarios', formData); 
      onUserCreated(); // Recarga la lista
      onClose();
    } catch (err) {
      alert("Error al crear usuario: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-96 space-y-4 shadow-xl">
        <h3 className="font-black text-lg text-[#0A2540]">Nuevo Usuario</h3>
        <input placeholder="Nombre" onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full p-3 border rounded-xl" required />
        <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl" required />
        <input type="password" placeholder="Contraseña" onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 border rounded-xl" required />
        <div className="flex gap-2 pt-4">
          <button type="button" onClick={onClose} className="flex-1 p-3 rounded-xl border">Cancelar</button>
          <button type="submit" className="flex-1 p-3 rounded-xl bg-[#007AFF] text-white font-bold">Guardar</button>
        </div>
      </form>
    </div>
  );
};