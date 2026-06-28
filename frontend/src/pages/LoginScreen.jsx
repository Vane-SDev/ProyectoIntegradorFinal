import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react';
import { api } from '../services/api'; 

export const LoginScreen = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');

  // DESTRUCCIÓN DE CARNETS VIEJOS (Seguridad industrial activa)
  useEffect(() => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.login(email, password);
      
      // Guardamos en 'usuario' y persistimos el Token JWT
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      if (data.token) localStorage.setItem('token', data.token);

      onLogin(); // Dispara el re-render total en App.jsx
    } catch (err) {
      alert("Acceso Denegado: Verificá que el usuario y la contraseña coincidan en MySQL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A2540] flex flex-col justify-between p-6 md:p-12 animate-in fade-in duration-200 text-left">
      <div className="max-w-md mx-auto w-full pt-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#007AFF] text-white text-3xl font-black mb-4 shadow-lg shadow-blue-500/30">Σ</div>
        <h1 className="text-4xl font-black text-white tracking-tight">SIGMA</h1>
        <p className="text-slate-400 text-xs mt-1 uppercase font-bold tracking-widest">Plataforma CMMS</p>
      </div>

      <div className="max-w-sm mx-auto w-full bg-white rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Usuario / Correo</label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="email" 
                placeholder="ejemplo@planta.inti"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#007AFF] focus:bg-white transition-colors text-slate-800" 
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#007AFF] focus:bg-white transition-colors text-slate-800" 
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-[#0A2540] hover:bg-[#007AFF] text-white font-black py-3.5 rounded-xl transition-all text-xs tracking-wider mt-2 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer active:scale-95 disabled:opacity-50 uppercase"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Iniciar Sesión"}
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