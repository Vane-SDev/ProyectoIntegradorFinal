import React, { useState } from 'react';
import { Camera, Send, Check } from 'lucide-react';

export const InspeccionesScreen = () => {
  const [enviado, setEnviado] = useState(false);

  if (enviado) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} />
        </div>
        <h3 className="font-black text-xl text-[#0A2540]">¡Novedad Registrada!</h3>
        <p className="text-xs text-slate-500 leading-relaxed">El reporte fue capturado por el sistema y derivado al panel del supervisor de turno.</p>
        <button onClick={() => setEnviado(false)} className="w-full py-3.5 bg-[#0A2540] text-white text-xs font-black rounded-xl uppercase tracking-wider">
          Registrar otra anomalía
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-5 text-left space-y-4">
      
      <div className="border-b border-slate-100 pb-3">
        <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider bg-amber-50 px-2 py-0.5 rounded">
          Acceso Planta Universal
        </span>
        <h2 className="text-lg font-black text-[#0A2540] mt-1">Reporte Rápido de Novedad</h2>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setEnviado(true); }} className="space-y-4 text-xs">
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-black text-slate-700 uppercase mb-1">Área de Planta *</label>
            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#0A2540]">
              <option>Molienda (Nave 1)</option>
              <option>Separación (Nave 2)</option>
              <option>Almacenamiento</option>
            </select>
          </div>

          <div>
            <label className="block font-black text-slate-700 uppercase mb-1">Equipo (Opcional)</label>
            <input type="text" placeholder="Ej: Cinta transportadora..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block font-black text-slate-700 uppercase mb-1">Anomalía Detectada *</label>
          <input type="text" placeholder="Ej: Fuerte ruido a roce metálico / Pérdida de aceite" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-[#007AFF] focus:outline-none" required />
        </div>

        <div>
          <label className="block font-black text-slate-700 uppercase mb-1">Descripción del contexto</label>
          <textarea rows={3} placeholder="Detalle exactamente qué observó en su recorrida..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-[#007AFF] focus:outline-none text-slate-700" />
        </div>

        <div>
          <label className="block font-black text-slate-700 uppercase mb-1.5">Nivel de Criticidad</label>
          <div className="grid grid-cols-3 gap-2">
            {['Baja', 'Media / Alerta', 'Peligro Crítico'].map((p, i) => (
              <label key={i} className={`p-2.5 rounded-xl border font-black text-center cursor-pointer transition-all ${i === 1 ? 'bg-amber-500 text-white border-amber-600 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                <input type="radio" name="prio" className="hidden" defaultChecked={i === 1} />
                <span className="text-[10px] uppercase tracking-tight block">{p}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <button type="button" className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl font-bold text-slate-600 flex items-center justify-center gap-2 transition-colors">
            <Camera size={18} className="text-[#007AFF]" />
            <span>Capturar Foto con la Cámara</span>
          </button>
        </div>

        <button type="submit" className="w-full mt-2 bg-[#007AFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-wider text-xs shadow-lg shadow-blue-500/20">
          Enviar Alerta a Turno
        </button>

      </form>
    </div>
  );
};