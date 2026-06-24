import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react';
import { api } from '../services/api'; 

export const LoginScreen = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('vsoria@planta.inti'); 
  const [password, setPassword] = useState('1234');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Intentando loguear con:", email, password);

    try {
      
      const data = await api.login(email, password);
      console.log("Login exitoso:", data);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      onLogin(); 
    } catch (err) {
      alert("Error de acceso: Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A2540] flex flex-col justify-between p-6 md:p-12">
      <div className="max-w-md mx-auto w-full pt-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#007AFF] text-white text-3xl font-black mb-4 shadow-lg shadow-blue-500/30">Σ</div>
        <h1 className="text-4xl font-black text-white tracking-tight">SIGMA</h1>
      </div>

      <div className="max-w-sm mx-auto w-full bg-white rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Usuario / Correo</label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#007AFF]" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#007AFF]" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-[#0A2540] hover:bg-[#007AFF] text-white font-bold py-3 rounded-xl transition-colors text-sm tracking-wide mt-2 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "INICIAR SESIÓN"}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-slate-500 space-y-1 pb-4">
        <div>Versión 1.0</div>
        <div>Empresa desarrolladora: <span className="text-slate-300 font-semibold">Inti Code</span></div>
      </div>
    </div>
  );
};